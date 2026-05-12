import { readFileSync, writeFileSync } from 'fs'

import semver from 'semver'

const processingErrorMessage =
  'There was a problem processing information from the changelog. This likely means that there is an issue with the changelog content itself. Please check it and try running this task again.'

/**
 * Update the changelog with a new version heading
 *
 * Inserts a new heading between the 'Unreleased' heading and the most recent
 * content
 *
 * @param {string} newVersion - New version to add to the changelog
 * @param {string} previousVersion - Previous version. Used for calculating difference
 *   in versions to build the changelog title
 */
export function updateChangelog(newVersion, previousVersion) {
  // Skip the entire function if the release version is internal eg: 5.1.0-internal.0
  const newVersionIsAPrerelease = versionIsAPrerelease(newVersion)
  if (newVersionIsAPrerelease) {
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

  const newLines = [newVersionTitle]
  if (newVersionIsAPrerelease) {
    newLines.push(
      `> [!WARNING]`,
      `> Do not use in production.`,
      `> Use this release to prepare for the changes coming in version \`${removePrereleaseFlag(newVersion)}\`.`,
      ``
    )
  }

  // Inject the new lines into the CHANGELOG
  changelogLines.splice(startIndex + 1, 0, '', ...newLines)

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

/**
 * Remove any pre-release flag from a version e.g. 1.0.0-alpha -> 1.0.0
 *
 * @param {string} version - version number
 * @returns {string} - version number without any pre-release flag
 */
function removePrereleaseFlag(version) {
  const parsedVersion = semver.parse(version)
  parsedVersion.prerelease = []
  return parsedVersion.format()
}
