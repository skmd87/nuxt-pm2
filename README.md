<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: Nuxt PM2
- Package name: nuxt-pm2
- Description: My new Nuxt module
-->

# Nuxt PM2

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Nuxt PM2 is a highly efficient and practical module that simplifies the deployment process of your Nuxt applications using PM2. This module is designed to build your Nuxt app and mount it to PM2 without any downtime, ensuring a seamless user experience.

<!-- - [✨ &nbsp;Release Notes](/CHANGELOG.md) -->
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/nuxt-pm2?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- **Zero Downtime Deployment:** The module ensures your application remains available during deployment, eliminating downtime.
- **Build Retention:** It keeps the build after deployment for easy rollback/switching.


## Quick Setup

1. Add `nuxt-pm2` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-pm2

# Using yarn
yarn add --dev nuxt-pm2

# Using npm
npm install --save-dev nuxt-pm2
```

2. Add `nuxt-pm2` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    'nuxt-pm2'
  ]
})
```

Now you can run
```bash
npx nuxt-pm2 release
```

## Options

The following are the default configurations for the application:

```json
{
  "releasesToKeep": 3, // Number of releases to keep. (Defaults to 3)
  "releasesDir": "releases",//The directory where releases are stored. (Defaults to 'releases')
  "runOnBuild": false,//Whether or not to run with npm run build || nuxt build command.
  "pm2Config": { // any pm2 config that is available in pm2 ecosystem file
    "port": 3000,
    "instances": "max",
    "exec_mode": "cluster"
  }  
}
```
## Commands

To build the nuxt app using nuxt-pm2 module, use the `release` command.
```bash
npx nuxt-pm2 release
```
To list releases, use the releases command.
```bash
npx nuxt-pm2 releases
```
To rollback the nuxt app using nuxt-pm2 module, use the rollback command. You can optionally specify a target.
```bash
npx nuxt-pm2 rollback || npx nuxt-pm2 rollback [releaseName]
```

## Development


# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-pm2/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-pm2

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-pm2.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-pm2

[license-src]: https://img.shields.io/npm/l/nuxt-pm2.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-pm2

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
