# Het Archief - client app

This repository contains the Het Archief Next.js app for the end user.

## Setup

When setting up the project for the first time be sure to install all dependencies:

```bash
npm i
# or
yarn install
```

This will also setup [husky](https://github.com/typicode/husky) via the `npm run prepare` script,
this lifecycle script will be run automatically after the install.

> ⚠️ _If you're using Yarn 2 this won't work because the `prepare` lifecycle isn't supported so
> you'll have to run `yarn run prepare` manually. Yarn 1 doesn't have this issue._
