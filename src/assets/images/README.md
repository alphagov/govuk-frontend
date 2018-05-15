# Assets

## Usage

If using express or similar, you need to configure the app to use resolve
the npm package install path to `/assets`

Example:

```
app.use('/assets', express.static(path.join(__dirname, '/node_modules/@govuk-frontend/assets')))
```

For static use, the path is set to `/assets/images`. You need to copy assets
from `/node_modules/@govuk-frontend/assets` to the root of your folder.

See `dist` folder for an example.
