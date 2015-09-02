.PHONY: all testserver start test stop check clean

all:
	@sh makelighttpd.sh
	@sh makecgi.sh
	@sh makelinear.sh
	@(cd workspace/bin; ${MAKE} clean all)

testserver:
	@(cd workspace/bin; ${MAKE} clean all)

start: testserver
	@sh test.sh start

test:
	@sh test.sh test

stop:
	@sh test.sh stop

check: testserver
	@sh test.sh check

check-all: all
	@sh test.sh check

clean:
	@rm -f *~
