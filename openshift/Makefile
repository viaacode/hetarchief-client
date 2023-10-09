.ONESHELL:
SHELL = /bin/bash

.PHONY: all test

test:
	chown node:node $${WORKSPACE} -R
	node -v
	npm i
	ls -l /home/jenkins/agent/workspace
	ls -l /home/jenkins/agent/workspace/hetarchief_client_develop
	ls -l /home/jenkins/agent/workspace/hetarchief_client_develop/node_modules
	ls -l /home/jenkins/agent/workspace/hetarchief_client_develop/node_modules/@meemoo
	ls -l /home/jenkins/agent/workspace/hetarchief_client_develop/node_modules/@meemoo/react-components
	ls -l /home/jenkins/agent/workspace/hetarchief_client_develop/node_modules/@meemoo/react-components/dist
