# Het Archief - client app

## General

This repository contains the `Het Archief` Next.js app for the end user.

It is built with:
- node: `v16.x.x` ( ~ `lts/gallium`)
- yarn: `v1.x.x`
- npm: `v8.x.x`
- Next: `v12.0.4`

For a complete list of packages and version check out the `package.json` file.

## Setup

### Clone and install dependencies
To setup this project, clone the repo and run `npm i` to install the dependencies.

This will also setup [husky](https://github.com/typicode/husky) via the `npm run prepare` script and install sub-dependencies where needed,
this lifecycle script will run automatically after the install.

> ⚠️ _Due to the sub-dependencies mentioned above, installing will take a long time. See the `postinstall` script in `package.json` for more information_

> ⚠️ _If you're using Yarn 2 this won't work because the `prepare` lifecycle isn't supported so
> you'll have to run `yarn run prepare` manually.  
> Yarn 1 doesn't have this issue._

### Docker
This project runs with Docker for local development and production images.

To start working, simply run `docker-compose up`, the project will be available on port `3000`.

### NPM

The available commands for development are:

| command      | runs                                                                                                 |
|--------------|------------------------------------------------------------------------------------------------------|
| dev          | Run the development server.                                                                          |
| start        | Run the server in production mode.                                                                   |
<br>

The available commands for building the project are:

| command      | runs                                                                                                 |
|--------------|------------------------------------------------------------------------------------------------------|
| build        | Build a production ready app to the `/dist` folder.                                                  |
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
| lint         | Lint all scripts and styling.                                                                        |
| lint:ts      | Lint all script files.                                                                               |
| lint:scss    | Lint all style related files.                                                                        |

## Deploy

TODO: Link to the Confluence page describing the entire flow of the project.

## Environment variables

This project uses environemnt variables. For local development, these can be found in the
`.env.template` file in the root of the project.  
Create your own `.env.local` file here with the correct values to get started. Contact one of the
active developers listed below for access to these values.

They are provided through the `env_file` property in the `docker-compose.yml` file.

## Team

This project has been created by:
- Andry Charlier: andry.charlier@studiohyperdrive.be

It is currently maintained by:
- Andry Charlier: andry.charlier@studiohyperdrive.be
- Ian Emsens: ian.emsens@studiohyperdrive.be
- Bart Naessens: bart.naessens@studiohyperdrive.be
- Bavo Vanderghote: bavo.vanderghote@studiohyperdrive.be
