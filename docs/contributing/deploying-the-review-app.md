# Deploying the review app

GOV.UK Frontend review app is automatically deployed on Heroku for PRs raised from branches of the `alphagov/govuk-frontend` repository.
If you've forked GOV.UK Frontend in your own repository (for contributing a bug fix or a feature, for example),
you may want to deploy the review app as well, for example to share components preview with other people while working.
This will not happen automatically and you'll need to set up your own deployment for your repository.

## Hosting services

GOV.UK Frontend review app runs on hosting services that supports Node.js.
This means it does not run on 'static' hosting services like GitHub Pages or Netlify.

Your organisation may already use such hosting service (for the Prototype Kit, for example).
Check with your IT or digital team about which platform to use.

Some hosting services automatically publish every time you push to GitHub. For example:

- [Railway](https://railway.app/new/github)
- [Render](https://render.com/docs/github)
- [Heroku](https://devcenter.heroku.com/articles/github-integration) (requires payment)

## Configuring the deployment

On your chosen service, you'll need to configure some environment variables as well as the command to start the review app.

### Environment variables

The GOV.UK Frontend review app requires the following environment variables to be built and run on a hosting service:

```env
NPM_CONFIG_PRODUCTION=false
PUPPETEER_SKIP_DOWNLOAD=true
```

Each service will have its own way to configure environment variables.
Please check in the documentation of the service you've chosen for the steps to set them up.

### Starting the app

To start the GOV.UK Frontend review app, the hosting service will need to run the following command:

```sh
npm start --workspace @govuk-frontend/review
```

Hosting services supporting Procfile (like Heroku) should work out of the box,
as the command is already set up in [the Procfile at the root of this repository](../../Procfile).
For hosting services that don't support Procfile, please refer to the documentation of the service you've chosen.
