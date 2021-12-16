.ONESHELL:
SHELL = /bin/bash

.PHONY: all test

test:
	whoami; \
	pwd; \
	ls -ltrha; \ 
	env; \
	sleep 240
	mkdir $(pwd)/cypress/.cypress_cache
	export CYPRESS_CACHE_FOLDER=$(pwd)/cypress/.cypress_cache
	npm ci
	npm test
