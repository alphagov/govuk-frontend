/* eslint-env jest */

const { toHaveNoViolations } = require('jest-axe')

expect.extend(toHaveNoViolations)

// Puppeteer can be slow and result in timeouts on TravisCI,
// so we're bumping the default to 10 seconds
jest.setTimeout(10000)
