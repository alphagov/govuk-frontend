const configPaths = require('./config/paths.json')
const PORT = process.env.PORT || configPaths.ports.test

module.exports = {
  browserContext: 'incognito',
  launch: {
    // we use --no-sandbox --disable-setuid-sandbox as a workaround for the
    // 'No usable sandbox! Update your kernel' error
    // see more https://github.com/Googlechrome/puppeteer/issues/290
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  },
  server: {
    command: `cross-env PORT=${PORT} node app/start.js`,
    launchTimeout: 30000, // Allow time for application to start
    port: PORT
  }
}
