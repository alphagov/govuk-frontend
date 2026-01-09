import { readFileSync, writeFileSync } from 'fs'

import semver from 'semver'

const processingErrorMessage =
  'There was a problem processing information from the changelog. This likely means that there is an issue with the changelog content itself. Please check it and try running this task again.'

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
 * @param {string} newVersion - New version to validate
 * @param {string} previousVersion - Previous version to compare to
 */
export function validateVersion(newVersion, previousVersion) {
  if (!semver.valid(newVersion)) {
    throw new Error(
      `New version number ${newVersion} could not be processed by Semver. Please ensure you are providing a valid semantic version`
    )
  }

  const previousReleaseNumber = validatePreviousVersionNumber(previousVersion)

  // Check the new version against the old version. Firstly a quick check that
  // the new one isn't less than the old one
  if (semver.lte(newVersion, previousReleaseNumber)) {
    throw new Error(
      `New version number ${newVersion} is less than or equal to the most recent version (${previousReleaseNumber}). Please provide a newer version number`
    )
  }

  // Get the version diff keyword (major, minor, patch plus prerelease versions
  // of those 3 and prerelease for differences between prereleases) which we can
  // use to help with validating the new version
  const versionDiff = semver.diff(newVersion, previousReleaseNumber)
  const identifier = versionIsAPrerelease(newVersion)
    ? getPrereleaseIdentifier(newVersion)
    : undefined

  if (!versionDiff) {
    throw new Error(
      'Could not determine difference between new and previous versions. Please check the version number you provided and the changelog content'
    )
  }

  // Check if the new version increments from the old version by one for
  // its change type (major, minor, patch) and throws an error if it doesn't.
  // Eg: if the current version is 4.3.12:
  // - 4.3.13, 4.4.0 and 5.0.0 are valid
  // - 4.3.14, 4.5.0, 6.0.0 and above for all aren't valid
  const correctIncrement = semver.inc(
    previousReleaseNumber,
    versionDiff,
    false,
    identifier
  )

  if (!semver.satisfies(newVersion, `<=${correctIncrement}`)) {
    throw new Error(
      `New version number ${newVersion} is incrementing more than one for its increment type (${versionDiff}). Please provide a version number than only increments by one from the current version. In this case, it's likely that your new version number should be: ${correctIncrement}`
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
 * @param {string} newVersion - New version to add to the changelog. We presume
 *   that this is a valid version as this function is always run after validateVersion
 *   has passed.
 * @param {string} previousVersion - Previous version. Used for calculating difference
 *   in versions to build the changelog title
 */
export function updateChangelog(newVersion, previousVersion) {
  // Skip the entire function if the release version is internal eg: 5.1.0-internal.0
  if (versionIsAPrerelease(newVersion)) {
    const identifier = getPrereleaseIdentifier(newVersion)

    if (identifier === 'internal') {
      console.log(
        'This is an internal release, intended for testing only. The changelog will therefore not be updated.'
      )
      return
    }
  }

  const changelogLines = getChangelogLines()
  const [startIndex, previousReleaseLineIndex] =
    getChangelogLineIndexes(changelogLines)

  const versionDiff = semver.diff(
    newVersion,
    validatePreviousVersionNumber(previousVersion)
  )

  if (!versionDiff) {
    throw new Error(processingErrorMessage)
  }
  const newVersionTitle = `## v${newVersion} (${convertIncTypeWord(versionDiff, newVersion, true, changelogLines[previousReleaseLineIndex])} release)`

  changelogLines.splice(startIndex + 1, 0, '', newVersionTitle)
  writeFileSync('./CHANGELOG.md', changelogLines.join('\n'))
}

/**
 * Generates release notes from the most recent changelog
 *
 * Creates a text file 'release-notes-body' from the content between either the
 * release heading passed to it by newVersion or the 'Unreleased' heading and the
 * following release heading if newVersion is tagged as internal
 *
 * @param {string} newVersion - Version used to find start point for release notes
 * @param {object} [options] - Release notes options
 * @param {string} [options.actor] - Github username of user who ran workflow
 * @param {string} [options.runId] - ID of Build release workflow to reference
 */
export function generateReleaseNotes(newVersion, options) {
  // Get the identifier from the version if there is one as we'll use this to
  // change what we pass to getChangelogLineIndexes if the version has an
  // 'internal' tag
  const identifier = versionIsAPrerelease(newVersion)
    ? getPrereleaseIdentifier(newVersion)
    : undefined
  const changelogLines = getChangelogLines()
  const [startIndex, previousReleaseLineIndex] = getChangelogLineIndexes(
    changelogLines,
    identifier === 'internal' ? undefined : newVersion
  )

  const releaseNotes = changelogLines
    .slice(startIndex + 1, previousReleaseLineIndex - 1)
    .map((line) =>
      line.replace(/^\s+/, '').startsWith('##')
        ? line.replace(/^\s+/, '').substring(1)
        : line
    )

  if (options && options.actor && options.runId) {
    releaseNotes.push('')
    releaseNotes.push(
      `Pull request generated on behalf of @${options.actor} by [run ${options.runId}](https://github.com/alphagov/govuk-frontend/actions/runs/${options.runId}) of the [Build release workflow](https://github.com/alphagov/govuk-frontend/actions/workflows/build-release.yml)`
    )
  }

  writeFileSync('./release-notes-body', releaseNotes.join('\n'))
}

/**
 * Validates the previous govuk-frontend version number, presumed passed from
 * the govuk-frontend package.json
 *
 * @param {string} previousVersion - pervious version number
 * @returns {string} - Validated semver of previous version
 */
function validatePreviousVersionNumber(previousVersion) {
  const previousReleaseNumber = semver.valid(previousVersion)

  if (!previousReleaseNumber) {
    throw new Error(
      `Previous version number ${previousVersion} could not be processed by Semver. Please ensure a valid version is being passed to the script via the govuk-frontend package.json package.`
    )
  }

  return previousReleaseNumber
}

/**
 * Get the changelog and split it into an array separated by lines
 *
 * @returns {Array<string>} - Changelog split into an array by lines
 */
function getChangelogLines() {
  return readFileSync('./CHANGELOG.md', 'utf8').split('\n')
}

/**
 * Gets the start and end headings in the changelog for processing by the
 * exported functions
 *
 * @param {Array<string>} changelogLines - Produced from getChangelogLines
 * @param {string|undefined} heading - Optional query to look for heading
 *   where the first index is pulled from eg: 'Unreleased'
 * @returns {Array<number>} - Indexes in the changelog identifying start and end lines
 */
function getChangelogLineIndexes(changelogLines, heading = undefined) {
  // Build regex for finding the correct heading in the changelog
  // If a heading hasn't been passed to the function, use 'Unreleased'
  const defaultHeadingRegex = '\\d+\\.\\d+\\.\\d+(-.+\\.\\d+)?'
  const headingRegex = heading
    ? heading.replaceAll('.', '\\.').replace('v', '')
    : 'Unreleased'

  const startIndex = findIndexOfFirstMatchingLine(
    changelogLines,
    buildHeadingRegexQuery(headingRegex)
  )

  if (startIndex === -1) {
    throw new Error(processingErrorMessage)
  }

  const endIndex = findIndexOfFirstMatchingLine(
    changelogLines,
    buildHeadingRegexQuery(defaultHeadingRegex),
    startIndex + 1
  )

  if (endIndex === -1) {
    throw new Error(processingErrorMessage)
  }

  return [startIndex, endIndex]
}

/**
 * Builds the search query for headings when getting indexes in the changelog
 *
 * @param {string} identifier - Either the semantic version or 'Unreleased'
 * @returns {RegExp} - Complete heading regex including hashes and release type formatting
 */
function buildHeadingRegexQuery(identifier) {
  return new RegExp(`^\\s*#+\\s+v?${identifier}\\s*(\\(.+\\))?$`, 'i')
}

/**
 * Get the first matching line in the changelog that matches the passed regex
 *
 * @param {Array<string>} changelogLines - Produced from getChangelogLines
 * @param {RegExp} regExp - Regular Expression to match against
 * @param {number} offset - Offset from start of the changelogLines array
 * @returns {number} - Index in changeLogLines or -1 if we can't locate the index
 */
function findIndexOfFirstMatchingLine(changelogLines, regExp, offset = 0) {
  const foundIndex = changelogLines
    .slice(offset)
    .map((x, index) => (x.match(regExp) ? index : undefined))
    .filter((x) => x !== undefined)
    .at(0)
  return foundIndex ? foundIndex + offset : -1
}

/**
 * Checks if a version string is a pre-release or not
 *
 * Returns true only if a semver is a pre-release with an identifier and an
 * identifier base, eg:
 *
 * - 4.0.0 - false
 * - 4.0.0-beta false
 * - 4.0.0-0 false
 * - 4.0.0.beta.0 true
 *
 * @param {string} version
 * @returns {boolean} - If the passed version is a pre-release or not
 */
function versionIsAPrerelease(version) {
  return /^\d+\.\d+\.\d+-\D+\.\d+$/i.test(version)
}

/**
 * Get the identifier and identifier base of a pre-release semver
 *
 * @param {string} version
 * @returns {string} - the identifier of the pre-release
 */
function getPrereleaseIdentifier(version) {
  return version.substring(version.indexOf('-') + 1, version.lastIndexOf('.'))
}

/**
 * Convert a standard SemVer increment word eg: major, minor or patch into the
 * wording we use for release titles. The conversion:
 *
 * - major -> breaking
 * - minor -> feature
 * - patch -> fix
 *
 * If the increment is a pre-release eg: prepatch, we split the 'pre' substring
 * from the inc and call this function recursively to generate a string of the
 * format '{identifier} {increment type}' Eg: where the current version is 6.2.1
 * and the new version is 6.3.0-beta.0, the generated string would be
 * 'Beta feature'
 *
 * @param {string} incType - SemVer increment type
 * @param {string|null} version - SemVer version
 * @param {boolean} capitalise - If the returned string should start with a capital
 *   letter or not
 * @param {string|null} lastReleaseTitle - Previous release title
 * @returns {string} - The reworded increment type
 */
function convertIncTypeWord(
  incType,
  version = null,
  capitalise = false,
  lastReleaseTitle = null
) {
  let rewordedIncType

  if (incType === 'major') {
    rewordedIncType = 'breaking'
  } else if (incType === 'minor') {
    rewordedIncType = 'feature'
  } else if (incType === 'patch') {
    rewordedIncType = 'fix'
  } else if (incType === 'prerelease' && lastReleaseTitle != null) {
    rewordedIncType = lastReleaseTitle.substring(
      lastReleaseTitle.indexOf('(') + 1,
      lastReleaseTitle.indexOf(' release')
    )
  } else if (incType.includes('pre') && version != null) {
    const identifier = getPrereleaseIdentifier(version)
    rewordedIncType = `${identifier} ${convertIncTypeWord(incType.slice(3))}`
  } else {
    rewordedIncType = incType
  }

  return capitalise
    ? `${rewordedIncType.charAt(0).toUpperCase()}${rewordedIncType.slice(1)}`
    : rewordedIncType
}
