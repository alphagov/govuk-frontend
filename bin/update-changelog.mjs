import { updateChangelog } from '../shared/github-scripts/changelog-release-helper.mjs'

// npm exposes these environment variable as part of the lifecycle hooks
// (https://github.com/npm/cli/blob/c97b39b1e3436cd20a67ab5f4012a5f395c538b9/workspaces/libnpmversion/lib/version.js#L100-L103)
const { npm_old_version: previousVersion, npm_new_version: newVersion } =
  process.env

if (!previousVersion || !newVersion) {
  throw new Error('Both previous and new version must be set to continue.')
}

console.log(
  `Updating changelog from version ${previousVersion} to ${newVersion}...`
)

updateChangelog(newVersion, previousVersion)
