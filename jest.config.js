const config = {
  preset: 'jest-puppeteer',
  setupFilesAfterEnv: [
    './config/jest-setup.js'
  ],
  snapshotSerializers: [
    'jest-serializer-html'
  ]
}

module.exports = config
