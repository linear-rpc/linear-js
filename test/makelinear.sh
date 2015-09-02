#!/bin/sh

install_target=`pwd`/workspace

set -e

# install linear-cpp
cd deps/linear-cpp
./bootstrap
./configure --without-test --prefix=${install_target} --enable-silent-rules
make clean all install
