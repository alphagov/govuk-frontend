module.exports = {
  overrides: [
    {
      files: ['puppeteer-*'],
      globals: {
        page: true,
        browser: true
      }
    }
  ]
}
