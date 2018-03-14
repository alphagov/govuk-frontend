const chalk = require('chalk')
const rimraf = require('rimraf')
const os = require('os')
const path = require('path')

const DIR = path.join(os.tmpdir(), 'jest-puppeteer-global-setup')

module.exports = async function () {
  console.log(chalk.green('Teardown Puppeteer'))
  await global.__BROWSER__.close()
  console.log(chalk.green('Close server'))
  await global.__SERVER__.close()
  rimraf.sync(DIR)
}
