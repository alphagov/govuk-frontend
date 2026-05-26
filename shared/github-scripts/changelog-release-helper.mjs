import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { paths } from '@govuk-frontend/config'
import semver from 'semver'

const CHANGELOG_FILE_PATH = join(paths.root, 'CHANGELOG.md')

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
  const validatedNewVersion = validateVersionNumber(newVersion)
  const validatedPreviousVersion = validateVersionNumber(previousVersion)

  // Skip the entire function if the release version is internal eg: 5.1.0-internal.0
  const newVersionIsAPrerelease = versionIsAPrerelease(validatedNewVersion)
  if (newVersionIsAPrerelease) {
    const identifier = getPrereleaseIdentifier(validatedNewVersion)

    if (identifier === 'internal') {
      console.log(
        'This is an internal release, intended for testing only. The changelog will therefore not be updated.'
      )
      return
    }
  }

  const changelogLines = getChangelogLines()
  const [startIndex] = getChangelogLineIndexes(changelogLines)

  const versionDiff = semver.diff(validatedNewVersion, validatedPreviousVersion)
  if (!versionDiff) {
    throw new Error(processingErrorMessage)
  }
  const newVersionTitle = `## v${validatedNewVersion} (${capitalise(convertIncTypeWord(versionDiff, validatedNewVersion))})`

  const newLines = [newVersionTitle]
  if (newVersionIsAPrerelease) {
    newLines.push(
      `> [!WARNING]`,
      `> Do not use in production.`,
      `> Use this release to prepare for the changes coming in version \`${removePrereleaseFlag(validatedNewVersion)}\`.`,
      ``
    )
  }

  // Add content on how to install the release
  newLines.push(
    `To install this version with npm, run \`npm install govuk-frontend@${validatedNewVersion}\`. ` +
      `You can also find more information about [how to stay up to date](https://frontend.design-system.service.gov.uk/staying-up-to-date/#updating-to-the-latest-version) in our documentation.`,
    ``
  )

  // Inject the new lines into the CHANGELOG
  changelogLines.splice(startIndex + 1, 0, '', ...newLines)

  writeFileSync(CHANGELOG_FILE_PATH, changelogLines.join('\n'))
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
 * Validates the version number that it is a semantic versioned string.
 *
 * @param {string} version - version number
 * @returns {string} - Validated semver of version
 */
function validateVersionNumber(version) {
  const validatedVersion = semver.valid(version)

  if (!validatedVersion) {
    throw new Error(
      `Version number "${version}" could not be parsed as a semantic versioned string.`
    )
  }

  return validatedVersion
}

/**
 * Get the changelog and split it into an array separated by lines
 *
 * @returns {Array<string>} - Changelog split into an array by lines
 */
function getChangelogLines() {
  return readFileSync(CHANGELOG_FILE_PATH, 'utf8').split('\n')
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
  if (!versionIsAPrerelease(version)) {
    return ''
  }
  // Prerelease is made up of an optional string label and a number increment
  // e.g. `1.0.0-beta.0` and `1.0.0-0`, so only return something if we find a label
  const prereleaseIdentifier = semver
    .prerelease(version)
    .find((part) => typeof part === 'string')
  if (!prereleaseIdentifier) {
    return ''
  }
  return prereleaseIdentifier
}

/**
 * Convert a standard SemVer increment word eg: major, minor or patch into the
 * wording we use for release titles.
 *
 * @param {string} incType - SemVer increment type
 * @param {string|null} version - SemVer version
 * @returns {string} - The reworded increment type
 */
function convertIncTypeWord(incType, version) {
  let rewordedIncType = incType

  // If there's a prerelease flag e.g. 1.0.0-beta.0 use that to decide
  const prereleaseIdentifier = getPrereleaseIdentifier(version)
  if (prereleaseIdentifier) {
    if (prereleaseIdentifier === 'rc') {
      return 'release candidate'
    }
    rewordedIncType = prereleaseIdentifier
  } else if (incType === 'major') {
    rewordedIncType = 'breaking'
  } else if (incType === 'minor') {
    rewordedIncType = 'feature'
  } else if (incType === 'patch') {
    rewordedIncType = 'fix'
  }

  return `${rewordedIncType} release`
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

/**
 * Capitalise a word or sentance so the first letter is uppercase
 *
 * @param {string} word
 * @returns {string} - capitalised string
 */
function capitalise(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}
