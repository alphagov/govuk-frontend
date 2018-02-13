/* eslint-env jest */

const { toHaveNoViolations } = require('jest-axe')

expect.extend(toHaveNoViolations)
