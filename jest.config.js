const config = {
  cacheDirectory: '<rootDir>/.cache/jest/'
}

module.exports = {
  projects: [
    {
      ...config,
      displayName: 'Snapshot tests',
      testMatch: ['./**/template.test.js'],
      snapshotSerializers: [
        'jest-serializer-html'
      ],
      setupFilesAfterEnv: [
        './config/jest-setup.js'
      ]
    },
    {
      ...config,
      displayName: 'JavaScript behaviour tests',
      testMatch: ['./**/*.test.js', '!./**/template.test.js'],
      preset: 'jest-puppeteer'
    },
    {
      ...config,
      displayName: 'JavaScript unit tests',
      transform: {
        '.*.js$': 'rollup-jest'
      },
      moduleFileExtensions: ['js', 'mjs'],
      testMatch: ['./**/*.unit.test.mjs', './**/*.unit.test.js']
    }
  ]
}
