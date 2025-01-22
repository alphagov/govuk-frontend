import { packageResolveToPath } from '@govuk-frontend/lib/names'
import { replacePathSepForRegex } from 'jest-regex-util'

import jestPuppeteerConfig from './jest-puppeteer.config.js'

// Detect when browser has been launched headless
const { headless = 'new' } = jestPuppeteerConfig.launch

/**
 * Jest project config defaults
 *
 * @type {import('@jest/types').Config.ProjectConfig}
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

  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/packages/govuk-frontend/dist/'
  ],

  /**
   * Default single context Node.js environment
   * Supports Node.js globals for Dart Sass tests
   *
   * {@link https://github.com/sass/dart-sass#using-sass-with-jest}
   * {@link https://github.com/facebook/jest/issues/2549}
   */
  testEnvironment: 'jest-environment-node-single-context',

  // Enable Babel transforms until Jest supports ESM and `import()`
  // See: https://jestjs.io/docs/ecmascript-modules
  transform: {
    // Transform all `*.mjs` to compatible CommonJS
    '^.+\\.mjs$': [
      'babel-jest',
      {
        rootMode: 'upward'
      }
    ],

    // Transform some `*.js` to compatible CommonJS
    ...Object.fromEntries(
      ['slash'].map((packagePath) => [
        replacePathSepForRegex(`${packageResolveToPath(packagePath)}$`),
        [
          'babel-jest',
          {
            rootMode: 'upward'
          }
        ]
      ])
    )
  },

  // Enable Babel transforms for ESM-only node_modules
  // See: https://jestjs.io/docs/ecmascript-modules
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!${['slash'].join('|')}/)`
  ]
}

/**
 * Jest config
 *
 * @type {import('@jest/types').Config.InitialOptions}
 * @example
 * ```shell
 * npx jest --selectProjects "Nunjucks macro tests"
 * npx jest --selectProjects "JavaScript unit tests"
 * ```
 */
export default {
  collectCoverageFrom: ['./packages/govuk-frontend/src/**/*.{js,mjs}'],
  coverageProvider: 'v8',

  // Reduce CPU usage during project test runs
  maxWorkers: headless
    ? '50%' // Matches Jest default (50%) via `--watch`
    : 1, // Use only 1x browser window when headless

  projects: [
    {
      ...config,
      displayName: 'Build tasks',
      testMatch: ['**/tasks/build/*.test.{js,mjs}']
    },
    {
      ...config,
      displayName: 'Nunjucks macro tests',
      snapshotSerializers: ['jest-serializer-html'],
      testMatch: ['**/(*.)?template.test.{js,mjs}']
    },
    {
      ...config,
      displayName: 'JavaScript unit tests',
      testMatch: [
        '**/*.unit.test.{js,mjs}',

        // Exclude build tests
        '!**/tasks/build/*.test.{js,mjs}'
      ]
    },
    {
      ...config,
      displayName: 'JavaScript behaviour tests',
      testEnvironment: '@govuk-frontend/helpers/jest/environment/jsdom.mjs',
      testMatch: ['**/*.jsdom.test.{js,mjs}'],
      setupFilesAfterEnv: ['@testing-library/jest-dom']
    },
    {
      ...config,
      displayName: 'JavaScript component tests',
      testEnvironment: '@govuk-frontend/helpers/jest/environment/puppeteer.mjs',
      testMatch: [
        '**/*.puppeteer.test.{js,mjs}',

        // Exclude accessibility tests
        '!**/accessibility.puppeteer.test.mjs'
      ],

      // Web server and browser required
      globalSetup: '@govuk-frontend/helpers/jest/browser/open.mjs',
      globalTeardown: '@govuk-frontend/helpers/jest/browser/close.mjs'
    },
    {
      ...config,
      displayName: 'Accessibility tests',
      setupFilesAfterEnv: ['@govuk-frontend/helpers/jest/matchers.js'],
      testEnvironment: '@govuk-frontend/helpers/jest/environment/puppeteer.mjs',
      testMatch: ['**/accessibility.puppeteer.test.mjs'],

      // Web server and browser required
      globalSetup: '@govuk-frontend/helpers/jest/browser/open.mjs',
      globalTeardown: '@govuk-frontend/helpers/jest/browser/close.mjs'
    },
    {
      ...config,
      displayName: 'Workflow helper tests',
      testMatch: ['**/workflows/scripts/*.test.{js,mjs}']
    }
  ],

  // Enable GitHub Actions reporter UI
  reporters: ['default', 'github-actions'],

  // Browser test increased timeout (5s to 60s)
  testTimeout: 60000
}
