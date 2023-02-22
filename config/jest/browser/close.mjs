import { teardown } from 'jest-environment-puppeteer'

// Close browser, stop server
export default () => teardown()
