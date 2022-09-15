module.exports = {
  extends: 'standard',
  ignorePatterns: [
    '!.*',
    'dist/**/*',
    'node_modules',
    'node_modules/.*',
    'package-lock.json',
    'package/**/*',
    'public/**/*',
    'src/govuk/vendor/polyfills/**/*'
  ],
  overrides: [
    {
      files: ['**/*.test.{cjs,js,mjs}'],
      env: {
        jest: true
      }
    }
  ]
}
