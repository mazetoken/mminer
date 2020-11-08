cmake_minimum_required(VERSION 3.12.4)

project(fastmine LANGUAGES CXX C)

message(STATUS "Operating system is ${CMAKE_SYSTEM_NAME} ${CMAKE_SYSTEM_VERSION}")
message(STATUS "The host processor is ${CMAKE_HOST_SYSTEM_PROCESSOR}")

if (MSVC)
    message(FATAL_ERROR "Building for MSVC is not supported. Please use MinGW Makefiles and GCC on Windows.")
endif()

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Release)
endif()

if (MSVC)
    # warning level 4
    set(CMAKE_CXX_FLAGS "/W4")
    set(CMAKE_C_FLAGS_RELEASE "/O2")
    set(CMAKE_CXX_FLAGS_RELEASE "/O2")
else()
    # lots of warnings
    set(CMAKE_CXX_FLAGS "-Wall -Wextra")
    set(CMAKE_C_FLAGS "-Wall -Wextra")
    set(CMAKE_CXX_FLAGS_RELEASE "-O3 -fomit-frame-pointer")
    set(CMAKE_C_FLAGS_RELEASE "-O3 -fomit-frame-pointer")
    set(CMAKE_CXX_FLAGS_DEBUG "-g")
    set(CMAKE_C_FLAGS_DEBUG "-g")
endif()

add_executable(fastmine fastmine.cpp)
add_subdirectory(config)
add_subdirectory(crypto)

target_link_libraries(fastmine PRIVATE crypto)

# Require pthread
set(THREADS_PREFER_PTHREAD_FLAG ON)
find_package(Threads REQUIRED)
target_link_libraries(fastmine PRIVATE Threads::Threads)

# On Windows we static link to get a stand-alone .exe
if (WIN32)
    target_link_options(fastmine PUBLIC -static)
endif()

