module.exports = {
  // ESLint's configuration will let it ignore built files
  // in `dist` or `package` that we want left alone, as well as the polyfills
  '*.{cjs,js,mjs}': ['npm run lint:js:cli -- --fix'],
  '*.scss': ['npm run lint:scss:cli -- --fix']
}
