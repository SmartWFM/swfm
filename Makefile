.PHONY: archive

ARCHIVE_VERSION=master
ARCHIVE_PREFIX=swfm-${ARCHIVE_VERSION}
ARCHIVE_NAME=swfm-${ARCHIVE_VERSION}
ARCHIVE_PATH=./dist/

archive:
	mkdir -p ${ARCHIVE_PATH}
	git archive --prefix=${ARCHIVE_PREFIX}/ ${ARCHIVE_VERSION} -o ${ARCHIVE_PATH}${ARCHIVE_NAME}.tar.gz
	git archive --prefix=${ARCHIVE_PREFIX}/ ${ARCHIVE_VERSION} -o ${ARCHIVE_PATH}${ARCHIVE_NAME}.tar.bz2
	git archive --prefix=${ARCHIVE_PREFIX}/ ${ARCHIVE_VERSION} -o ${ARCHIVE_PATH}${ARCHIVE_NAME}.zip

clean:
	rm -rf ${ARCHIVE_PATH}