import SingleContextNodeEnvironment from 'jest-environment-node-single-context'

import { globals } from '../globals.mjs'

/**
 * Single context Node.js environment
 * Adds real Node.js test globals for Dart Sass
 *
 * {@link https://github.com/sass/dart-sass#using-sass-with-jest}
 * {@link https://github.com/facebook/jest/issues/2549}
 */
class NodeEnvironment extends SingleContextNodeEnvironment {
  async setup () {
    await super.setup()

    // Add shared test globals
    // componentsData, componentsDirectory, examplesDirectory
    this.global.cache ??= await globals()
  }
}

export default NodeEnvironment
