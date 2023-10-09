.ONESHELL:
SHELL = /bin/bash

.PHONY: all test

test:
	chown node:node $${WORKSPACE} -R
	node -v
	npm i
	pwd
	ls -l
	npm run test:ci
