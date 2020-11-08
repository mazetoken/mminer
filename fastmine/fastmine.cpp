#include <algorithm>
#include <array>
#include <atomic>
#include <chrono>
#include <cmath>
#include <cstdint>
#include <cstdlib>
#include <cstring>
#include <future>
#include <iostream>
#include <limits>
#include <optional>
#include <random>
#include <stdexcept>
#include <string>
#include <string_view>
#include <thread>
#include <type_traits>
#include <utility>
#include <vector>

#include "crypto/sha256.h"

#if defined(__clang__) || defined(__GNUC__)
#define EXPECT(expr, constant) __builtin_expect(expr, constant)
#else
#define EXPECT(expr, constant) (expr)
#endif

#define LIKELY(bool_expr)   EXPECT(int(bool(bool_expr)), 1)
#define UNLIKELY(bool_expr) EXPECT(int(bool(bool_expr)), 0)

template <typename Container,
          typename = std::enable_if_t<sizeof(typename Container::value_type) == 1>>
std::vector<uint8_t> unhex(const Container& v)
{
    const auto retSize = unsigned(v.size() / 2);
    std::vector<uint8_t> ret(retSize);

    for (unsigned i = 0; i < retSize; ++i) {
        const uint8_t p1 = uint8_t(v[i*2 + 0]);
        const uint8_t p2 = uint8_t(v[i*2 + 1]);
        ret[i] =   uint8_t(( (p1 <= '9' ? p1 - '0' : p1 - 'a' + 10) << 4) & 0xf0)
                 | uint8_t((  p2 <= '9' ? p2 - '0' : p2 - 'a' + 10)       & 0x0f);
    }

    return ret;
}

template <typename Container,
          typename = std::enable_if_t<sizeof(typename Container::value_type) == 1>>
std::string hex(const Container& v)
{
    constexpr std::array<char, 16> chars = {
        '0', '1', '2', '3', '4', '5', '6', '7',                                                    
        '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' 
    };  
    const auto vSize = unsigned(v.size());
    std::string ret(vSize*2, '\0');
    for (unsigned i=0; i<vSize; ++i) {
        ret[i*2 + 0] = chars[(uint8_t(v[i]) >> 4) & 0xf];
        ret[i*2 + 1] = chars[uint8_t(v[i]) & 0x0F];
    }   
 
    return ret;
}

class Miner final
{
public:
    struct Solution {
        std::vector<uint8_t> suffix, solHash, preHash;
    };

    /// Spawns nthreads threads, each iterating up to iters iterations, mining against `prehash` for `difficulty`.
    /// Returns a valid optional if a solution was found, otherwise the returned optional will be invalid.
    static std::optional<Solution> mine(unsigned iters, unsigned difficulty, std::vector<uint8_t> prehash,
                                        unsigned nthreads = 0);
private:
    // data
    std::atomic_bool found = false; ///< flag used to signal threads should stop
    const unsigned iters;
    const unsigned difficulty;
    using Promise = std::promise<Solution>;
    using Future = std::future<Solution>;
    Promise promise;
    Future future = promise.get_future();

    Miner(unsigned i, unsigned d) : iters(i), difficulty(d) {}
    Miner() = delete;
    Miner(const Miner &) = delete;

    class Nonce {
        uint32_t val;
    public:
        explicit constexpr Nonce(uint32_t initVal) noexcept : val(initVal) {}
        Nonce() = delete;

        constexpr static size_t nBytes() noexcept { return sizeof(val); }

        constexpr void shift() noexcept {
            val ^= val << 13;
            val ^= val >> 17;
            val ^= val << 5;
        }

        void reset(uint32_t newVal) noexcept { val = newVal; }

        template <typename T, typename = std::enable_if_t<sizeof(T) == 1>>
        void write(T *dest) const noexcept {
            std::memcpy(reinterpret_cast<uint8_t *>(dest), reinterpret_cast<const uint8_t *>(&val), nBytes());
        }
    };

    void miningThread(std::random_device::result_type seed, std::vector<uint8_t> prehash);
};

auto Miner::mine(unsigned iters, unsigned difficulty, std::vector<uint8_t> prehash, unsigned nthreads) -> std::optional<Solution>
{
    std::optional<Solution> ret;
    if (!iters) throw std::runtime_error("iters must be >0");
    std::random_device rd;
    Miner m(iters, difficulty);
    if (!nthreads) nthreads = std::max(std::thread::hardware_concurrency(), 1U); // default to num virtual cores
    prehash.resize(prehash.size() + Nonce::nBytes()); // make room for nonce bytes (4)
    std::vector<std::thread> threads;
    threads.reserve(nthreads);
    // spawn threads
    for (unsigned i = 0; i < nthreads; ++i)
        threads.emplace_back(&Miner::miningThread, &m, rd(), prehash);
    // wait for them
    for (auto &thread : threads)
        thread.join();
    // if there was a solution found -- grab result from the future
    if (m.found)
        ret = m.future.get();
    return ret;
}

void Miner::miningThread(std::random_device::result_type seed, std::vector<uint8_t> prehash)
{
    constexpr auto kSha256Len = CSHA256::OUTPUT_SIZE; // 32 bytes
    const auto difficulty = std::min(this->difficulty, unsigned(kSha256Len)); // ensure difficulty won't exceed solution size!
    const auto prehashLen = prehash.size();
    if (UNLIKELY(prehashLen < Nonce::nBytes()))
        throw std::runtime_error("Prehash must have space for nonce at the end (4 bytes)");

    std::default_random_engine gen(seed);
    std::uniform_int_distribution<uint32_t> dist(1, std::numeric_limits<uint32_t>::max());
    std::vector<std::uint8_t> solhash(kSha256Len);
    Nonce nonce(dist(gen));
    CSHA256 sha256;

    auto * const prehashTail = prehash.data() + (prehashLen - Nonce::nBytes());

    constexpr auto IsSolved = [](const unsigned difficulty, const auto & solhash) {
        for (unsigned d = 0; d < difficulty; ++d)
            if (solhash[d] != 0x00)
                return false;
        return true;
    };

    for (unsigned i = 0; LIKELY(i < iters); ++i, nonce.shift()) {

        if (const auto fff = i & 0xfff; UNLIKELY((fff&0xff) == 0xff)) {
            // check found flag every 256 iters, and return if it's set
            if (UNLIKELY(found.load(std::memory_order::memory_order_relaxed)))
                return;
            // get a new random nonce every 4096 iters
            if (UNLIKELY(fff == 0xfff))
                nonce.reset(dist(gen));
        }

        // copy nonce bytes to prehashTail
        nonce.write(prehashTail);

        // double hash the preimage + nonce
        sha256.Reset().Write(prehash.data(), prehashLen).Finalize(solhash.data());
        sha256.Reset().Write(solhash.data(), kSha256Len).Finalize(solhash.data());

        // check for solution
        if (IsSolved(difficulty, solhash)) {
            // solution found, set promise value, then return from function
            if (found.exchange(true)) {
                // guard to prevent more than 1 thread from setting the promise value
                return;
            }
            promise.set_value({ {prehashTail, prehashTail + Nonce::nBytes()}, std::move(solhash), std::move(prehash) });
            return;
        }
    }
}

int main(int argc, char * argv[]) {
    if (argc < 2 || !argv[1][0]) {
        std::cerr << "need preimage (hex string)\n";
        return EXIT_FAILURE;
    }
    int difficulty;
    if (argc < 3 || (difficulty = std::atoi(argv[2])) <= 0) {
        std::cerr << "need difficulty (positive integer)\n";
        return EXIT_FAILURE;
    }

    // auto-detect best sha256 impl.
    constexpr bool printDetected = false;
    const std::string detectedsha256 = SHA256AutoDetect();
    if constexpr (printDetected)
        std::cerr << "Using sha256: " << detectedsha256 << '\n';

    constexpr unsigned MAX_RUNS = 10'000'000; // TODO: Have this configured from CLI or env
    const auto optSolution = Miner::mine(MAX_RUNS, unsigned(difficulty), unhex(std::string_view(argv[1])));
    if (optSolution) {
        const auto & [suffix, solHash, prehash] = *optSolution;
        std::cout << "FOUND " << hex(suffix) << '\n';
        std::cout << "SOLHASH " << hex(solHash) << '\n';
        std::cout << "PREHASH " << hex(prehash) << '\n';
    }
    return EXIT_SUCCESS;
}
