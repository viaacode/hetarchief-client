.ONESHELL:
SHELL = /bin/bash

.PHONY: all test

test:
	chown node:node $${WORKSPACE} -R
	npm i --force
	npm test
