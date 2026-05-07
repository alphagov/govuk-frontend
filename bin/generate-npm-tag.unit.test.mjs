import childProcess from 'node:child_process'
import { promisify } from 'node:util'

const exec = promisify(childProcess.exec)

// Our build scripts are Shell scripts so won't run on Windows
// Unfortunately, Jest wants test files to have test suites,
// so we need to only run `describe` if the platform is not Windows
describeIf(process.platform !== 'win32')('generate-npm-tag.sh', () => {
  const highestReleasedVersion = '6.0.0'

  it.each([
    ['patch', '6.0.1', 'latest'],
    ['minor', '6.1.0', 'latest'],
    ['major', '7.0.0', 'latest'],
    ['internal', '6.0.0-internal', 'internal'],
    ['beta', '6.0.0-beta', 'next'],
    ['latest-...', '4.0.0', 'latest-v4']
  ])('%s bump', async (label, version, expectedTag) => {
    const { stdout } = await exec(
      `bin/generate-npm-tag.sh ${version} ${highestReleasedVersion}`
    )

    expect(stdout.trim()).toBe(expectedTag)
  })

  it('errors for any pre-release which is not `beta` or `internal`', async () => {
    expect.assertions(2)
    // Unfortunately Jest's `.rejects.toThrow` only allows to test the type of error or its message
    // so we need to explicitly `try/catch` to check the exit code and message
    try {
      await exec(`bin/generate-npm-tag.sh 6.0.0-rc ${highestReleasedVersion}`)
    } catch (e) {
      expect(e.code).toBe(1)
      expect(e.stdout).toMatch(
        "⚠️ Pre-releases with an identifier other than 'beta' or 'internal' " +
          'are not allowed, therefore we will not generate an npm tag. ' +
          'Please check your current version.'
      )
    }
  })
})

/**
 * Allows to skip a `describe` block if the condition is not met
 *
 * Jest does not allow empty test suites, so this allows to skip all tests
 * when a condition is not met (for ex. if tests are running in a specific platform)
 *
 * @param {boolean} condition - The condition that needs to be met for tests to run
 * @returns {Function} Jest's `describe` function if the `condition` is met, `describe.skip` otherwise
 */
function describeIf(condition) {
  return condition ? describe : describe.skip
}
