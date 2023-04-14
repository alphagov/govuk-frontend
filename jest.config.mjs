/**
 * @type {import('jest').Config}
 */
const config = {
  cacheDirectory: '<rootDir>/.cache/jest/',
  clearMocks: true,
  coveragePathIgnorePatterns: [
    '.test.(js|mjs)',
    '.eslintrc.js',
    'config/*',
    'vendor/*'
  ],

  /**
   * Default single context Node.js environment
   * Supports Node.js globals for Dart Sass tests
   *
   * {@link https://github.com/sass/dart-sass#using-sass-with-jest}
   * {@link https://github.com/facebook/jest/issues/2549}
   */
  testEnvironment: 'jest-environment-node-single-context',

  // Enable Babel transforms until Jest supports ESM
  // See: https://jestjs.io/docs/ecmascript-modules
  transform: {
    '^.+\\.m?js$': ['babel-jest', { rootMode: 'upward' }]
  },

  // Enable Babel transforms for ESM-only node_modules
  // See: https://jestjs.io/docs/ecmascript-modules
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!${[
      'del',
      'slash'
    ].join('|')}/)`
  ]
}

/**
 * @type {import('jest').Config}
 */
export default {
  collectCoverageFrom: ['./src/**/*.{js,mjs}'],
  projects: [
    {
      ...config,
      displayName: 'Build tasks',
      testMatch: [
        '**/tasks/build/*.test.{js,mjs}'
      ]
    },
    {
      ...config,
      displayName: 'Nunjucks macro tests',
      setupFilesAfterEnv: ['govuk-frontend-helpers/jest/matchers.js'],
      snapshotSerializers: [
        'jest-serializer-html'
      ],
      testEnvironment: 'govuk-frontend-helpers/jest/environment/jsdom.mjs',
      testMatch: [
        '**/(*.)?template.test.{js,mjs}'
      ]
    },
    {
      ...config,
      displayName: 'JavaScript unit tests',
      testEnvironment: 'govuk-frontend-helpers/jest/environment/jsdom.mjs',
      testMatch: [
        '**/*.unit.test.{js,mjs}'
      ]
    },
    {
      ...config,
      displayName: 'JavaScript behaviour tests',
      testMatch: [
        '**/*.test.{js,mjs}',

        // Exclude macro/unit tests
        '!**/(*.)?template.test.{js,mjs}',
        '!**/*.unit.test.{js,mjs}',

        // Exclude other tests
        '!**/components/globals.test.mjs',
        '!**/components/*/**',
        '!**/tasks/build/**'
      ],

      // Web server required
      globalSetup: 'govuk-frontend-helpers/jest/server/start.mjs',
      globalTeardown: 'govuk-frontend-helpers/jest/server/stop.mjs'
    },
    {
      ...config,
      displayName: 'JavaScript component tests',
      testEnvironment: 'govuk-frontend-helpers/jest/environment/puppeteer.mjs',
      testMatch: [
        '**/components/globals.test.mjs',
        '**/components/*/*.test.{js,mjs}',

        // Exclude macro/unit tests
        '!**/(*.)?template.test.{js,mjs}',
        '!**/*.unit.test.{js,mjs}'
      ],

      // Web server and browser required
      globalSetup: 'govuk-frontend-helpers/jest/browser/open.mjs',
      globalTeardown: 'govuk-frontend-helpers/jest/browser/close.mjs'
    }
  ],

  // Enable GitHub Actions reporter UI
  reporters: ['default', 'github-actions'],

  // Browser test increased timeout (5s to 15s)
  testTimeout: 15000
}
