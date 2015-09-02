#!/bin/sh

install_target=`pwd`/workspace

set -e

# create lighttpd.conf
INSTALL_ROOT_DIR=`echo ${install_target} | sed -e "s/\//\\\\\\\\\\//g"`
sed -e "s/_INSTALL_ROOT_DIR_/${INSTALL_ROOT_DIR}/" ${install_target}/etc/lighttpd.conf.in > ${install_target}/etc/lighttpd.conf

cd deps/mod_websocket

# install mod_websocket to lighttpd
mkdir -p ./workspace
rm -fr ./workspace/lighttpd1.4
cp -r ./contrib/lighttpd1.4 ./workspace/
./bootstrap
./configure --with-lighttpd=./workspace/lighttpd1.4 --without-test --enable-silent-rules
make clean all
echo y | make install

# install lighttpd to sample dir
(cd ./workspace/lighttpd1.4; \
 sh ./autogen.sh; \
 ./configure  --enable-silent-rules --with-websocket --prefix=${install_target}; \
 make clean install)
