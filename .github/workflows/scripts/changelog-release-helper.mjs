import { readFileSync, writeFileSync } from 'fs'

import semver from 'semver'

getLatestChangelog()

async function getLatestChangelog() {
  // Process parsed arguments. We are expecting at least a valid semver via the
  // --version flag OR the --release-notes-only flag which stops the changelog
  // update and the version checking from happening, meaning we don't need to
  // parse in the new version
  const args = process.argv.slice(2)
  const newVersionArg = args.indexOf('--version')
  const releaseNotesOnly = args.indexOf('--release-notes-only') !== -1

  // Retrieve the changelog and line indexes for the unreleased heading and the
  // previous release
  const changelogLines = (await readFileSync('./CHANGELOG.md', 'utf8')).split(
    '\n'
  )

  const versionTitleRegex = /^#+\s+v\d+\.\d+\.\d+\s+\(.+\)$/i

  const startIndex = findIndexOfFirstMatchingLine(
    changelogLines,
    releaseNotesOnly ? versionTitleRegex : /^#+\s+Unreleased\s*$/i
  )
  const previousReleaseLineIndex = findIndexOfFirstMatchingLine(
    changelogLines,
    versionTitleRegex,
    releaseNotesOnly ? startIndex + 1 : 0
  )

  if (!releaseNotesOnly) {
    if (newVersionArg === -1) {
      throw new Error(
        'Required --version flag not detected. Please provide a valid semantic version using the --version flag'
      )
    }

    const newVersion = args[newVersionArg + 1]

    if (!semver.valid(newVersion)) {
      throw new Error(
        'New version number could not be processed. Please ensure you are providing a valid semantic version using the --version flag'
      )
    }

    // Convert the previous release heading into a processable semver
    const previousReleaseNumber = semver.valid(
      semver.coerce(changelogLines[previousReleaseLineIndex])
    )

    // Check the new version against the old version. Firstly a quick check that
    // the new one isn't less than the old one
    if (semver.lte(newVersion, previousReleaseNumber)) {
      throw new Error(
        `The new version provided is less than or equal to the most recent version (${previousReleaseNumber}). Please provide a newer version number`
      )
    }

    // Get the version diff keyword (major, minor or patch) which we can use both
    // to help with validating the new version and building the title for the new
    // version to go in the changelog
    const versionDiff = semver.diff(newVersion, previousReleaseNumber)
    let newVersionTitle = null

    if (versionDiff === 'major') {
      newVersionIsOnlyIncrementingByOne(
        newVersion,
        previousReleaseNumber,
        'major'
      )
      newVersionTitle = buildNewReleaseTitle(newVersion, 'major')
    } else if (versionDiff === 'minor') {
      newVersionIsOnlyIncrementingByOne(
        newVersion,
        previousReleaseNumber,
        'minor'
      )
      newVersionTitle = buildNewReleaseTitle(newVersion, 'minor')
    } else if (versionDiff === 'patch') {
      newVersionIsOnlyIncrementingByOne(
        newVersion,
        previousReleaseNumber,
        'patch'
      )
      newVersionTitle = buildNewReleaseTitle(newVersion, 'patch')
    }

    if (!newVersionTitle) {
      throw new Error('Could not build new version title')
    }

    const newChangelogLines = [].concat(changelogLines)
    newChangelogLines.splice(startIndex + 1, 0, '', newVersionTitle)

    await writeFileSync('./CHANGELOG.md', newChangelogLines.join('\n'))
  }

  const partialChangelog = changelogLines
    .slice(startIndex + 1, previousReleaseLineIndex - 1)
    .filter((value, index, arr) => {
      if (
        value !== '' &&
        !value.startsWith('To install this version with npm')
      ) {
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

  await writeFileSync('./release-notes-body', partialChangelog.join('\n'))
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
