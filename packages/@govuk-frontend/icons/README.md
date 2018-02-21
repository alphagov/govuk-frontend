# Icons

## Usage

If using express or similar, you need to configure the app to use resolve the npm package install path to `/icons`
Example
```
app.use('/icons', express.static(path.join(__dirname, '/node_modules/@govuk-frontend/icons')))
```
For static use, the path is set to `/icons`. You need to copy images from `/node_modules/@govuk-frontend/icon` to the root of your folder.
See `dist` folder for an example.


<!--
## Installation

```
npm install --save @govuk-frontend/icons
```
-->
