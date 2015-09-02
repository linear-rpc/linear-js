#!/bin/sh

CWD=`pwd`
PLATFORM=`uname -s`
JAVA=`which java`
COMMAND="$1"
RESULT=0

# set -x

# browser definitions
# for MACOS
if [ ${PLATFORM} = 'Darwin' ]; then
    BROWSER="Safari"

# for linux
elif [ ${PLATFORM} = 'Linux' ]; then
    BROWSER="firefox"
fi

JSTESTDRIVER_DIR=${CWD}/../tools/JsTestDriver
JSTESTDRIVER_JAR=${JSTESTDRIVER_DIR}/JsTestDriver-1.3.4.b.jar
JSTESTDRIVER_CONF=${JSTESTDRIVER_DIR}/JsTestDriver.conf
JSTESTDRIVER_PORT=`cat ${JSTESTDRIVER_CONF} | grep 'server:' | cut -d ':' -f 4`
JSTESTDRIVER_BASEPATH=${CWD}/../
JSTESTDRIVER_PID_FILE=${CWD}/workspace/var/run/jstestdriver.pid

start_servers() {
    (
        cd workspace
        ./sbin/lighttpd -f ./etc/lighttpd.conf -m ./lib
        if [ -f ./var/run/testserver.pid ]; then
            kill `cat ./var/run/testserver.pid`
            rm -f ./var/run/testserver.pid
        fi
        export LD_LIBRARY_PATH=./lib
        export DYLD_LIBRARY_PATH=./lib
        ./bin/testserver &
        PID=$!
        echo ${PID} > ./var/run/testserver.pid
    )
}

stop_servers() {
    (
        cd workspace
        if [ -f ./var/run/lighttpd.pid ]; then
            kill `cat ./var/run/lighttpd.pid`
            rm -f ./var/run/lighttpd.pid
        fi
        if [ -f ./var/run/testserver.pid ]; then
            kill `cat ./var/run/testserver.pid`
            rm -f ./var/run/testserver.pid
        fi
    )
}

start_jstestdriver() {
    ${JAVA} -jar ${JSTESTDRIVER_JAR} \
        --port ${JSTESTDRIVER_PORT} \
        --config ${JSTESTDRIVER_CONF} \
        --basePath ${JSTESTDRIVER_BASEPATH} &
    echo $! > ${JSTESTDRIVER_PID_FILE}
    echo "test servers are started"
    echo "plz access http://ipaddr:${JSTESTDRIVER_PORT}/ with your target browsers and do make test"
}

run_jstestdriver() {
    ${JAVA} -jar ${JSTESTDRIVER_JAR} \
        --config ${JSTESTDRIVER_CONF} \
        --basePath ${JSTESTDRIVER_BASEPATH} \
        --tests all --reset --raiseOnFailure true
    RESULT=$?
}

stop_jstestdriver() {
    if [ -f "${JSTESTDRIVER_PID_FILE}" ]; then
        kill `cat ${JSTESTDRIVER_PID_FILE}`
        rm -f ${JSTESTDRIVER_PID_FILE}
    fi
}

check_jstestdriver() {
    ${JAVA} -jar ${JSTESTDRIVER_JAR} \
        --port ${JSTESTDRIVER_PORT} \
        --config ${JSTESTDRIVER_CONF} \
        --basePath ${JSTESTDRIVER_BASEPATH} \
        --browser ${BROWSER} --tests all --reset --raiseOnFailure true
    RESULT=$?
}

if [ -z "${JAVA}" ]; then
    echo 'need java runtime to test'
    exit 1
fi

if [ "${COMMAND}" = "start" ]; then
    start_servers
    start_jstestdriver
elif [ "${COMMAND}" = "test" ]; then
    run_jstestdriver
elif [ "${COMMAND}" = "stop" ]; then
    stop_jstestdriver
    stop_servers
elif [ "${COMMAND}" = "check" ]; then
    start_servers
    check_jstestdriver
    stop_servers
fi

exit ${RESULT}
