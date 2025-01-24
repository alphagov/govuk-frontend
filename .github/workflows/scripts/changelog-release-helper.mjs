import { readFileSync, writeFileSync } from 'fs'

import semver from 'semver'

/**
 * Validate a new version of GOV.UK Frontend
 *
 * Throws an error if any of the following are true:
 *
 * - The version can't be processed by semver and we therefore presume it isn't
 * a valid semver
 * - The version is less than the current version
 * - The version increments the current version by more than one possible
 * increment, eg: going from 3.1.0 to 5.0.0, 3.3.0 or 3.1.2
 *
 * @param {string} newVersion
 */
export async function validateVersion(newVersion) {
  const changelogLines = await getChangelogLines()
  const previousReleaseLineIndex = getChangelogLineIndexes(changelogLines)[1]

  if (!semver.valid(newVersion)) {
    throw new Error(
      `New version number ${newVersion} could not be processed by Semver. Please ensure you are providing a valid semantic version`
    )
  }

  // Convert the previous release heading into a processable semver
  const previousReleaseNumber = convertVersionHeadingToSemver(
    changelogLines[previousReleaseLineIndex]
  )

  // Check the new version against the old version. Firstly a quick check that
  // the new one isn't less than the old one
  if (semver.lte(newVersion, previousReleaseNumber)) {
    throw new Error(
      `New version number ${newVersion} is less than or equal to the most recent version (${previousReleaseNumber}). Please provide a newer version number`
    )
  }

  // Get the version diff keyword (major, minor or patch) which we can use to
  // help with validating the new version
  const versionDiff = semver.diff(newVersion, previousReleaseNumber)

  if (versionDiff === 'major') {
    newVersionIsOnlyIncrementingByOne(
      newVersion,
      previousReleaseNumber,
      'major'
    )
  } else if (versionDiff === 'minor') {
    newVersionIsOnlyIncrementingByOne(
      newVersion,
      previousReleaseNumber,
      'minor'
    )
  } else if (versionDiff === 'patch') {
    newVersionIsOnlyIncrementingByOne(
      newVersion,
      previousReleaseNumber,
      'patch'
    )
  }

  console.log('No errors noted in the new version. We can proceed!')
}

/**
 * Update the changelog with a new version heading
 *
 * Inserts a new heading between the 'Unreleased' heading and the most recent
 * content
 *
 * @param {string} newVersion
 */
export async function updateChangelog(newVersion) {
  const changelogLines = await getChangelogLines()
  const [startIndex, previousReleaseLineIndex] =
    getChangelogLineIndexes(changelogLines)

  // Convert the previous release heading into a processable semver
  const previousReleaseNumber = convertVersionHeadingToSemver(
    changelogLines[previousReleaseLineIndex]
  )
  const versionDiff = semver.diff(newVersion, previousReleaseNumber)

  if (!versionDiff) {
    throw new Error('There was a problem')
  }

  const newVersionTitle = buildNewReleaseTitle(newVersion, versionDiff)
  const newChangelogLines = [].concat(changelogLines)

  newChangelogLines.splice(startIndex + 1, 0, '', newVersionTitle)
  await writeFileSync('./CHANGELOG.md', newChangelogLines.join('\n'))
}

/**
 * Generates release notes from the most recent changelog
 *
 * Creates a text file 'release-notes-body' from the content between either the
 * first release heading (default) or the 'Unreleased' heading and the following
 * release heading
 *
 * @param {boolean} fromUnreleasedHeading
 */
export async function generateReleaseNotes(fromUnreleasedHeading = false) {
  const changelogLines = await getChangelogLines()
  const [startIndex, previousReleaseLineIndex] = getChangelogLineIndexes(
    changelogLines,
    fromUnreleasedHeading
  )

  const releaseNotes = changelogLines
    .slice(startIndex + 1, previousReleaseLineIndex - 1)
    .filter((value, index, arr) => {
      if (value !== '') {
        return true
      }
      if (
        arr[index + 1].startsWith('#') ||
        (index > 0 && arr[index - 1].startsWith('#'))
      ) {
        return true
      }
      return false
    })
    .map((value) => {
      const line = value.replace(/^\s+/, '')
      return line.startsWith('##') ? line.substring(1) : line
    })

  await writeFileSync('./release-notes-body', releaseNotes.join('\n'))
}

/**
 * Get the changelog and split it into an array separated by lines
 *
 * @returns {Promise<Array<string>>} - Changelog split into an array by lines
 */
async function getChangelogLines() {
  return (await readFileSync('./CHANGELOG.md', 'utf8')).split('\n')
}

/**
 * Gets the start and end headings in the changelog for processing by the
 * exported functions
 *
 * @param {Array<string>} changelogLines
 * @param {boolean} fromUnreleasedHeading
 * @returns {Array<number>} - Indexes in the changelog identifying start and end lines
 */
function getChangelogLineIndexes(changelogLines, fromUnreleasedHeading = true) {
  const versionTitleRegex = /^\s*#+\s+v\d+\.\d+\.\d+\s+\(.+\)$/i
  const errorMessage =
    'There was a problem retrieving indexes from the changelog. This likely means that there is an issue with the changelog file itself. Please check it and try running this task again.'
  const startIndex = findIndexOfFirstMatchingLine(
    changelogLines,
    fromUnreleasedHeading ? /^\s*#+\s+Unreleased\s*$/i : versionTitleRegex
  )

  if (!startIndex) {
    throw new Error(errorMessage)
  }

  const endIndex = findIndexOfFirstMatchingLine(
    changelogLines,
    versionTitleRegex,
    fromUnreleasedHeading ? 0 : startIndex + 1
  )

  if (!endIndex) {
    throw new Error()
  }

  return [startIndex, endIndex]
}

/**
 * Get the first matching line in the changelog that matches the passed regex
 *
 * @param {Array<string>} changelogLines
 * @param {RegExp} regExp
 * @param {number} offset
 * @returns {number|undefined} - Index in changeLogLines
 */
function findIndexOfFirstMatchingLine(changelogLines, regExp, offset = 0) {
  return (
    changelogLines
      .slice(offset)
      .map((x, index) => (x.match(regExp) ? index : undefined))
      .filter((x) => x !== undefined)
      .at(0) + offset
  )
}

/**
 * Convert a release heading into a semver
 *
 * @param {string} heading
 * @returns {string} - Processed semver which we expect to have the format X.Y.Z
 */
function convertVersionHeadingToSemver(heading) {
  return semver.valid(semver.coerce(heading))
}

/**
 * Checks to see if the new version increments from the old version by one for
 * its change type (major, minor or patch) and throws an error if it doesn't.
 * Eg: if the current version is 4.3.12:
 *
 * - 4.3.13, 4.4.0 and 5.0.0 are valid
 * - 4.3.14, 4.5.0, 6.0.0 and above for all aren't valid
 *
 * @param {string} newVersion
 * @param {string} oldVersion
 * @param {import('semver').ReleaseType} incType
 */
function newVersionIsOnlyIncrementingByOne(newVersion, oldVersion, incType) {
  const correctIncrement = semver.inc(oldVersion, incType)

  if (!semver.satisfies(newVersion, `<=${correctIncrement}`)) {
    throw new Error(
      `New version number ${newVersion} is incrementing more than one for its increment type (${incType}). Please provide a version number than only increments by one from the current version. In this case, it's likely that your new version number should be: ${correctIncrement}`
    )
  }
}

/**
 * Constructs a release heading for the changelog based on a passed semver and
 * a diff keyword (major, minor or patch)
 *
 * @param {string} newVersion
 * @param {string} incType
 * @returns {string} - Constructed release heading of format '## v[semver (X.Y.Z)] ([Type] release)'
 */
function buildNewReleaseTitle(newVersion, incType) {
  let rewordedIncType

  if (incType === 'major') {
    rewordedIncType = 'Breaking'
  } else if (incType === 'minor') {
    rewordedIncType = 'Feature'
  } else if (incType === 'patch') {
    rewordedIncType = 'Fix'
  } else {
    rewordedIncType = incType
  }

  return `## v${newVersion} (${rewordedIncType} release)`
}
