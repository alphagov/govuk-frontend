import { readFileSync, writeFileSync } from 'fs'

import semver from 'semver'

export async function validateVersion(newVersion) {
  const changelogLines = await getChangelogLines()
  const previousReleaseLineIndex = getChangelogLineIndexes(changelogLines)[1]

  if (!semver.valid(newVersion)) {
    throw new Error(
      'New version number could not be processed by Semver. Please ensure you are providing a valid semantic version'
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
      `The new version provided is less than or equal to the most recent version (${previousReleaseNumber}). Please provide a newer version number`
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

export async function updateChangelog(newVersion) {
  const changelogLines = await getChangelogLines()
  const [startIndex, previousReleaseLineIndex] =
    getChangelogLineIndexes(changelogLines)

  // Convert the previous release heading into a processable semver
  const previousReleaseNumber = convertVersionHeadingToSemver(
    changelogLines[previousReleaseLineIndex]
  )

  const newVersionTitle = buildNewReleaseTitle(
    newVersion,
    semver.diff(newVersion, previousReleaseNumber)
  )
  const newChangelogLines = [].concat(changelogLines)

  newChangelogLines.splice(startIndex + 1, 0, '', newVersionTitle)
  await writeFileSync('./CHANGELOG.md', newChangelogLines.join('\n'))
}

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

  await writeFileSync('./release-notes-body', releaseNotes.join('\n'))
}

async function getChangelogLines() {
  return (await readFileSync('./CHANGELOG.md', 'utf8')).split('\n')
}

function getChangelogLineIndexes(changelogLines, fromUnreleasedHeading = true) {
  const versionTitleRegex = /^\s+#+\s+v\d+\.\d+\.\d+\s+\(.+\)$/i
  const startIndex = findIndexOfFirstMatchingLine(
    changelogLines,
    fromUnreleasedHeading ? /^\s+#+\s+Unreleased\s*$/i : versionTitleRegex
  )

  return [
    startIndex,
    findIndexOfFirstMatchingLine(
      changelogLines,
      versionTitleRegex,
      fromUnreleasedHeading ? 0 : startIndex + 1
    )
  ]
}

function findIndexOfFirstMatchingLine(changelogLines, regExp, offset = 0) {
  return (
    changelogLines
      .slice(offset)
      .map((x, index) => (x.match(regExp) ? index : undefined))
      .filter((x) => x !== undefined)
      .at(0) + offset
  )
}

function convertVersionHeadingToSemver(heading) {
  return semver.valid(semver.coerce(heading))
}

// Checks to see if the new version increments from the old version by one for
// its change type (major, minor or patch) and throws an error if it doesn't.
// Eg: if the current version is 4.3.12:

// - 4.3.13, 4.4.0 and 5.0.0 are valid
// - 4.3.14, 4.5.0, 6.0.0 and above for all aren't valid
function newVersionIsOnlyIncrementingByOne(newVersion, oldVersion, incType) {
  const correctIncrement = semver.inc(oldVersion, incType)

  if (!semver.satisfies(newVersion, `<=${correctIncrement}`)) {
    throw new Error(
      `New version is incrementing more than one for its increment type ${incType}. Please provide a version number than only increments by one from the current version. In this case, it's likely that your new version number should be: ${correctIncrement}`
    )
  }
}

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
