#!/bin/sh

CWD=`pwd`
PLATFORM=`uname -s`
JAVA_RUNTIME=`which java`

CLOSURE_COMPILER_DIR=${CWD}/../tools/closure-compiler
COMPILER_JAR=${CLOSURE_COMPILER_DIR}/compiler.jar
MSGPACK_DIR=${CWD}/../deps/msgpack.js
CODEC_JS=msgpack.codec.js
LINEAR_JS_IN=linear.js.in
LINEAR_JS=linear.js
PACK_JS=linear.min.js
DEBUG_JS=linear.debug.js

if [ -z ${JAVA_RUNTIME} ]; then
    echo 'need java runtime to test'
    exit 1
fi

# fill commit id
commit_id=`git log --pretty=format:"%H" -1`
cat ${LINEAR_JS_IN} | sed -e "s/CommitId/$commit_id/g" > ${LINEAR_JS}

# pack sources
set -e
echo "pack ${LINEAR_JS} and ${CODEC_JS} into ${PACK_JS}"
${JAVA_RUNTIME} -jar ${COMPILER_JAR} \
                --js ${MSGPACK_DIR}/${CODEC_JS} --js ${LINEAR_JS} \
                --js_output_file ${PACK_JS}
echo "pack ${LINEAR_JS} and ${CODEC_JS} into ${DEBUG_JS}"
cat ${MSGPACK_DIR}/${CODEC_JS} ${LINEAR_JS} > ${DEBUG_JS}
