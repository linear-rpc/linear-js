#!/bin/sh

CWD=`pwd`
JAVA_RUNTIME=`which java`

JSDOC_TOOLKIT_DIR=${CWD}/../tools/jsdoc-toolkit
JSRUN_JAR=${JSDOC_TOOLKIT_DIR}/jsrun.jar
RUN_JS=${JSDOC_TOOLKIT_DIR}/app/run.js
TEMPLATES_DIR=${JSDOC_TOOLKIT_DIR}/templates/jsdoc
DOC_DIR=html
SOURCE_DIR=${CWD}/../src
SOURCES=${SOURCE_DIR}/linear.js

if [ -z ${JAVA_RUNTIME} ]; then
    echo 'need java runtime to make document'
    exit 1
fi

echo "creating api document"
${JAVA_RUNTIME} -jar ${JSRUN_JAR} ${RUN_JS} -q \
                -t=${TEMPLATES_DIR} ${SOURCES} \
                -d=${DOC_DIR}
echo "created at ${CWD}/${DOC_DIR}"
