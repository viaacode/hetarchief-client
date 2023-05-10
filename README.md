# Het Archief - client app

## General

This repository contains the `Het Archief` Next.js app for the end user.

It is built with:

-   node: `v16.x.x` ( ~ `lts/gallium`)
-   npm: `v8.x.x`
-   Next: `v12.0.4`

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

| command   | runs                               |
| --------- | ---------------------------------- |
| dev       | Run the development server.        |
| start     | Run the server in production mode. |
| storybook | Run Storybook in development mode. |

<br>

The available commands for building the project are:

| command         | runs                                                |
| --------------- | --------------------------------------------------- |
| build           | Build a production ready app to the `/dist` folder. |
| build:storybook | Build Storybook to the `/storybook-static` folder.  |

<br>

The available commands for testing the project are:

| command    | runs                                            |
| ---------- | ----------------------------------------------- | --- |
| test       | Run all the unit tests.                         |
| test:ci    | Run all the unit tests for CI environment.      |
| test:watch | Run all the unit tests in watch mode.           |
| test:cov   | Run all the unit tests with coverage collected. |     |

<br>

Other available commands are:

| command      | runs                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------- |
| prepare      | Lifecycle script which installs husky.                                                      |
| lint         | Lint all scripts and styling.                                                               |
| lint:ts      | Lint all script files.                                                                      |
| lint:scss    | Lint all style related files.                                                               |
| type-check   | Perform a type check with TypeScript without emitting files.                                |
| i18n:extract | Extract and replace translation strings to separate json file located in `/public/locales`. |
| gql:extract  | Whitelist GraphQL queries and copy them over to the proxy repo.                             |

## Deploy

Follow Slite doc: https://studiohyperdrive.slite.com/app/docs/L0Alk6HWq5w7il

### Branching model

Important in the deployment flow is the branching model. Ours differs a bit from the official docs but it changes
nothing to the deploy flow.  
Below you can find an explanation and example of each branch:

**Feature**:

Used for creating new features or refactoring. Usually associated with a Task issue in Jira.  
If this is the case don't forget to include the correct ticket number in the branch.

_example_: `feature/ARC-1-button-component`, `feature/update-readme`

**Bugfix**:

Used for fixing bugs that arise during development or after testing. Usually associated with a bug issue in Jira.  
If this is the case don't forget to include the correct ticket number in the branch.

_example_: `bugfix/ARC-1-button-component`, `bugfix/typo-in-readme`

**Release**:

Used during development to mark the next release we will be deploying to QAS and PRD.  
Release branches should be merged periodically to develop.

_example_: `release/v1.0.0`

**Develop**:

Used for deploying to the TST environment.  
Opening PR's to develop will also perform several checks to make sure code is passing all tests and the build doesn't
fail.

_branch name_: `develop`

**Master**:

Used for deploying to the QAS environment.  
Opening PR's to master will also perform several checks to make sure code is passing all tests and the build doesn't
fail.  
Pushing a tag to master will deploy to PRD.

_branch name_: `master`

## Environment variables

This project uses environemnt variables. For local development, these can be found in the
`.env.template` file in the root of the project.  
Create your own `.env.local` file here with the correct values to get started. Contact one of the active developers
listed below for access to these values.

They are provided through the `env_file` property in the `docker-compose.yml` file.

## Team

This project has been created by:

-   Andry Charlier: andry.charlier@studiohyperdrive.be
-   Bart Naessens: bart.naessens@studiohyperdrive.be
-   Ian Emsens: ian.emsens@studiohyperdrive.be

It is currently maintained by:

-   Andry Charlier: andry.charlier@studiohyperdrive.be
-   Bavo Vanderghote: bavo.vanderghote@studiohyperdrive.be
-   Bert Verhelst: bert.verhelst@studiohyperdrive.be
-   Silke Derudder: silke.derudder@studiohyperdrive.be
-   Ward Vercruyssen: ward.vercruyssen@studiohyperdrive.be

## Deployment

To deploy, you can follow [this checklist](https://studiohyperdrive.slite.com/app/docs/L0Alk6HWq5w7il)
