import TestEnvironment from 'jest-environment-node'

import { globals } from '../globals.mjs'

/**
 * Default Node.js environment
 * Adds shared test globals
 */
class NodeEnvironment extends TestEnvironment {
  async setup () {
    await super.setup()

    // Add shared test globals
    // componentsData, componentsDirectory, examplesDirectory
    this.global.cache ??= await globals()
  }
}

export default NodeEnvironment
