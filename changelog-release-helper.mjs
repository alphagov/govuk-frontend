import { readFileSync, writeFileSync } from 'fs'

import semver from 'semver'

getLatestChangelog()

async function getLatestChangelog() {
  const newVersion = process.argv.slice(2)[0] // assumes that the new version is parsed as a single argument with no qualifiers

  if (!semver.valid(newVersion)) {
    console.error('ERROR: This version you gave to the command is weird')
  }

  const changelogLines = (await readFileSync('./CHANGELOG.md', 'utf8')).split(
    '\n'
  )

  const unreleasedIndex = findIndexOfFirstMatchingLine(
    changelogLines,
    /^#+\s+Unreleased\s*$/i
  )
  const previousReleaseLineIndex = findIndexOfFirstMatchingLine(
    changelogLines,
    /^#+\s+v\d+\.\d+\.\d+\s+\(.+\)$/i
  )

  const previousReleaseNumber = semver.valid(
    semver.coerce(changelogLines[previousReleaseLineIndex])
  )

  if (semver.lt(newVersion, previousReleaseNumber)) {
    console.error(
      'ERROR: This version you gave to the command is less than the most recent version'
    )
  }

  const versionDiff = semver.diff(newVersion, previousReleaseNumber)

  if (!versionDiff) {
    console.error(
      'ERROR: This version you gave to the command is the same as the most recent version'
    )
  }
  let newVersionTitle

  if (versionDiff === 'major') {
    newVersionTitle = `## ${newVersion} (Breaking release)`
  } else if (versionDiff === 'minor') {
    newVersionTitle = `## ${newVersion} (Feature release)`
  } else if (versionDiff === 'patch') {
    newVersionTitle = `## ${newVersion} (Fix release)`
  }

  const newChangelogLines = [].concat(changelogLines)
  newChangelogLines.splice(unreleasedIndex + 1, 0, '', newVersionTitle)

  await writeFileSync('./CHANGELOG.md', newChangelogLines.join('\n'))

  const partialChangelog = changelogLines
    .slice(unreleasedIndex + 1, previousReleaseLineIndex - 1)
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

  await writeFileSync('./release-notes-body', partialChangelog.join('\n'))
}

function findIndexOfFirstMatchingLine(changelogLines, regExp) {
  return changelogLines
    .map((x, index) => (x.match(regExp) ? index : undefined))
    .filter((x) => x !== undefined)
    .at(0)
}
