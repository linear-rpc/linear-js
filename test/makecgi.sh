#!/bin/sh

install_target=`pwd`/workspace

set -e

# install linear-cgi
cd deps/linear-fcgi
./bootstrap
./configure --prefix=${install_target} --enable-silent-rules
make clean all install
