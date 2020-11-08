### fastminer

Ensure you have a recent C++17-capable compiler and `cmake`. The below assumes `cmake` generates Makefiles, however you can use any generator such as `Ninja`, etc, so long as you place the compiled binary in the `fastmine/` subfolder of this project when done.

    $ cd fastmine
    $ cmake . && make
    $ cd ..

Then set in `.env`

`USE_FASTMINE="yes"`

**Note:** In order for fast mining to work, the expectation is that the `fastmine` executable will be present in the `fastmine/` subdirectory.
