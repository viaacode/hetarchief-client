.ONESHELL:
SHELL = /bin/bash

.PHONY: all test

test:
	mkdir $${WORKSPACE}/cypress/.cypress_cache
	export CYPRESS_CACHE_FOLDER=$WORKSPACE/cypress/.cypress_cache
	chown node:node $${WORKSPACE} -R
	ls -ltrha $${WORKSPACE}
	npm ci
	npm test
