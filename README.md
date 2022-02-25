# Het Archief - client app

## General

This repository contains the `Het Archief` Next.js app for the end user.

It is built with:

- node: `v16.x.x` ( ~ `lts/gallium`)
- npm: `v8.x.x`
- Next: `v12.0.4`

For a complete list of packages and versions check out the `package.json` file.

## Setup

### Clone and install dependencies

To setup this project, clone the repo and run `npm i` to install the dependencies.

This will also setup [husky](https://github.com/typicode/husky) via the `npm run prepare` script, this lifecycle script
will run automatically after the install.

### Docker

This project runs with Docker for local development and production images.

To start working, simply run `docker-compose up`, the project will be available on port `3000`.

### NPM

The available commands for development are:

| command      | runs                                                                                                 |
|--------------|------------------------------------------------------------------------------------------------------|
| dev          | Run the development server.                                                                          |
| start        | Run the server in production mode.                                                                   |
| storybook    | Run Storybook in development mode.                                                                   |

<br>

The available commands for building the project are:

| command          | runs                                                                                             |
|------------------|--------------------------------------------------------------------------------------------------|
| build            | Build a production ready app to the `/dist` folder.                                              |
| build:storybook  | Build Storybook to the `/storybook-static` folder.                                               |

<br>

The available commands for testing the project are:

| command      | runs                                                                                                 |
|--------------|------------------------------------------------------------------------------------------------------|
| test         | Run all the unit tests.                                                                              |
| test:ci      | Run all the unit tests for CI environment.                                                           |
| test:watch   | Run all the unit tests in watch mode.                                                                |
| test:cov     | Run all the unit tests with coverage collected.                                                      |
| cy:open      | Open Cypress test runnner.                                                                           |
| cy:run       | Run all the E2E tests in Cypress.                                                                    |

<br>

Other available commands are:

| command      | runs                                                                                                 |
|--------------|------------------------------------------------------------------------------------------------------|
| prepare      | Lifecycle script which installs husky.                                                               |
| lint         | Lint all scripts and styling.                                                                        |
| lint:ts      | Lint all script files.                                                                               |
| lint:scss    | Lint all style related files.                                                                        |
| type-check   | Perform a type check with TypeScript without emitting files.                                         |
| i18n:extract | Extract and replace translation strings to separate json file located in `/public/locales`.          |
| gql:extract  | Whitelist GraphQL queries and copy them over to the proxy repo.                                      |

## Deploy

For our deployment flow take a look at the
official [meemoo docs for CI/CD](https://github.com/viaacode/ci-cd-docs/tree/main).

### Branching model

Important in the deployment flow is the branching model. Ours differs a bit from the official docs but it changes
nothing to the deploy flow.  
Below you can find an explanation and example of each branch:

**Feature**:

Used for creating new features or refactoring. Usually associated with a Task issue in Jira.  
If this is the case don't forget to include the correct ticket number in the branch.

*example*: `feature/ARC-1-button-component`, `feature/update-readme`

**Bugfix**:

Used for fixing bugs that arise during development or after testing. Usually associated with a bug issue in Jira.  
If this is the case don't forget to include the correct ticket number in the branch.

*example*: `bugfix/ARC-1-button-component`, `bugfix/typo-in-readme`

**Release**:

Used during development to mark the next release we will be deploying to QAS and PRD.  
Release branches should be merged periodically to develop.

*example*: `release/v1.0.0`

**Develop**:

Used for deploying to the TST environment.  
Opening PR's to develop will also perform several checks to make sure code is passing all tests and the build doesn't
fail.

*branch name*: `develop`

**Master**:

Used for deploying to the QAS environment.  
Opening PR's to master will also perform several checks to make sure code is passing all tests and the build doesn't
fail.  
Pushing a tag to master will deploy to PRD.

*branch name*: `master`

## Environment variables

This project uses environemnt variables. For local development, these can be found in the
`.env.template` file in the root of the project.  
Create your own `.env.local` file here with the correct values to get started. Contact one of the active developers
listed below for access to these values.

They are provided through the `env_file` property in the `docker-compose.yml` file.

## Team

This project has been created by:

- Andry Charlier: andry.charlier@studiohyperdrive.be

It is currently maintained by:

- Andry Charlier: andry.charlier@studiohyperdrive.be
- Ian Emsens: ian.emsens@studiohyperdrive.be
- Bart Naessens: bart.naessens@studiohyperdrive.be
- Bavo Vanderghote: bavo.vanderghote@studiohyperdrive.be

## Deployment

The client is build automatically when

* you merge changes into the dev branch => this deploys to TST
* you merge changes into the master branch => this deploys to QAS
* you tag a commit on the master branch with a version => this deploys to PRD

For the storybook you can trigger the build in openshift:

* Builds => BuildConfigs => hetarchief => storybook-tst =>
  actions => Start Build
* https://console-openshift-console.meemoo2-2bc857e5f10eb63ab790a3a1d19a696c-i000.eu-de.containers.appdomain.cloud/k8s/ns/hetarchief/buildconfigs/storybook-tst/builds
