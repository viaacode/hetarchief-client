.ONESHELL:
SHELL = /bin/bash

.PHONY: all test

test:
	mkdir $WORKSPACE/cypress/.cypress_cache
	export CYPRESS_CACHE_FOLDER=$WORKSPACE/cypress/.cypress_cache
	chown node:node $WORKSPACE -R
	ls -ltrha $WORKSPACE
	su node -c set-script prepare ""
	su node -c set-script cy:run  ""
	su node -c set-script cy:open  ""
	su node -c npm ci
	su node -c npm test
