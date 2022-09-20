const config = {
  cacheDirectory: '<rootDir>/.cache/jest/'
}

module.exports = {
  projects: [
    {
      ...config,
      displayName: 'Gulp tasks',
      testMatch: [
        '**/gulp/**/*.test.{js,mjs}'
      ]
    },
    {
      ...config,
      displayName: 'Nunjucks macro tests',
      setupFilesAfterEnv: ['./config/jest/matchers.js'],
      snapshotSerializers: [
        'jest-serializer-html'
      ],
      testMatch: [
        '**/template.test.js'
      ]
    },
    {
      ...config,
      displayName: 'JavaScript unit tests',
      moduleFileExtensions: ['js', 'mjs'],
      transform: {
        '.*.js$': 'rollup-jest'
      },
      testMatch: [
        '**/*.unit.test.{js,mjs}'
      ]
    },
    {
      ...config,
      displayName: 'JavaScript behaviour tests',
      testMatch: [
        '**/*.test.js',

        // Exclude unit/snapshot tests
        '!**/template.test.js',
        '!**/*.unit.test.{js,mjs}',

        // Exclude other tests
        '!**/all.test.js',
        '!**/components/**',
        '!**/gulp/**'
      ],

      // Web server required
      globalSetup: './config/jest/server/start.mjs',
      globalTeardown: './config/jest/server/stop.mjs'
    },
    {
      ...config,
      displayName: 'JavaScript component tests',
      setupFilesAfterEnv: [require.resolve('expect-puppeteer')],
      testMatch: [
        '**/all.test.js',
        '**/components/**/*.test.js',

        // Exclude unit/snapshot tests
        '!**/template.test.js',
        '!**/*.unit.test.{js,mjs}'
      ],

      // Web server and browser required
      globalSetup: './config/jest/browser/open.mjs',
      globalTeardown: './config/jest/browser/close.mjs'
    }
  ]
}
