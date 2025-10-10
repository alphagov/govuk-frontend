# Running locally

You'll need [Git](https://help.github.com/articles/set-up-git/) and [Node.js](https://nodejs.org/en/) installed to get this project running.

Note: You will need the Node.js version specified in the [.nvmrc](/../../.nvmrc) file.
This should reflect the most current [active LTS (Long-term support)](https://github.com/nodejs/Release#release-schedule).

## 1. Fork repository (optional)

If you're an external contributor make sure to [fork this project first](https://help.github.com/articles/fork-a-repo/)

## 2. Clone repository

```shell
git clone git@github.com:alphagov/govuk-frontend.git # or clone your own fork

cd govuk-frontend
```

## 3. Using nvm (optional)

If you work across multiple Node.js projects there's a good chance they require different Node.js and npm versions.

To enable this we use [nvm (Node Version Manager)](https://github.com/creationix/nvm) to switch between versions easily.

1. [install nvm](https://github.com/creationix/nvm#installation)
2. Run `nvm install` in the project directory (this will use [.nvmrc](/../../.nvmrc))

## 4. Install npm dependencies

We use [npm](https://docs.npmjs.com/getting-started/what-is-npm) to manage the dependencies in development.

```shell
npm install
```

## 5. Start a local server

This will build sources, serve pages and watch for changes.

```shell
npm start
```

By default, the local server will only accept connections from the same machine. If you need to allow external connections, for example if you want to test from another device, you'll need to set the `ALLOW_EXTERNAL_CONNECTIONS` environment variable to `true`:

```shell
ALLOW_EXTERNAL_CONNECTIONS=true npm start
```

## Deploying

You can deploy your project straight to a Heroku instance.

An existing Heroku instance can be found at: [http://govuk-frontend-review.herokuapp.com/](http://govuk-frontend-review.herokuapp.com/)
