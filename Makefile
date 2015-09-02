SUBDIRS=src test

.PHONY: all \
	check check-all \
	start-servers run-tests stop-servers \
	clean

%.subdirs:
	@for subdir in ${SUBDIRS}; do \
		(cd $$subdir && ${MAKE} $(basename $@)); \
	done

all:
	(cd src; ${MAKE} all)

check: all
	(cd test; ${MAKE} check)

check-all: all
	(cd test; ${MAKE} check-all)

start-servers: all
	(cd test; ${MAKE} start)

run-tests:
	(cd test; ${MAKE} test)

stop-servers:
	(cd test; ${MAKE} stop)

clean: clean.subdirs
	@rm -f *~
