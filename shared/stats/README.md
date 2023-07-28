# GOV.UK Frontend stats

This package is used to generate Rollup visualizer stats for built GOV.UK Frontend modules.

```shell
npm run build:stats --workspace govuk-frontend
```

Stats are shown in the review app [deployed to Heroku](https://govuk-frontend-review.herokuapp.com) or when run locally using `npm start`.

## Stats for previous version

GOV.UK Frontend is resolved from [./packages/govuk-frontend](../../packages/govuk-frontend/) unless a previous version is installed locally:

```shell
npm install govuk-frontend@4.7.0 --save --workspace govuk-frontend-stats
```
