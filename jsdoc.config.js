module.exports = {
  opts: {
    destination: './app/dist/docs/jsdoc',
    recurse: true
  },
  plugins: [
    'node_modules/jsdoc-tsimport-plugin',
    'plugins/markdown'
  ],
  source: {
    includePattern: '.+\\.m?js$',
    excludePattern: '.+\\.test.m?js$'
  },
  templates: {
    cleverLinks: true
  }
}
