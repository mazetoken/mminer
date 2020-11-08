#! /bin/bash
echo "sha256 of 0x$1:";
echo -n $1 | xxd -r -p | sha256sum -b | awk '{print $1}';