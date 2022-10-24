import TestEnvironment from 'jest-environment-node'

/**
 * Default Node.js environment
 */
class NodeEnvironment extends TestEnvironment {
  async setup () {
    await super.setup()
  }
}

export default NodeEnvironment
