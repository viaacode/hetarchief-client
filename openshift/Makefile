.ONESHELL:
SHELL = /bin/bash

.PHONY: all test

test:
	sleep 3600
	mkdir $(pwd)/cypress/.cypress_cache
	export CYPRESS_CACHE_FOLDER=$(pwd)/cypress/.cypress_cache
	npm ci
	npm test