import { readFileSync, writeFileSync } from 'fs'

import { json2csv } from 'json-2-csv'
// eslint-disable-next-line import/no-unresolved
import { Octokit, RequestError } from 'octokit'
import { satisfies } from 'semver'
// const notAServiceWords = ['prototype', 'beta', 'alpha']
// const initialDepsFilter = []
const pageLimit = 10
let repoOwner
let repoName
let currentVersion = false

const octokit = new Octokit({
  auth: process.env.GITHUB_AUTH_TOKEN
})

getDeps()

async function getDeps() {
  // // This is a really gross way to get the json files but we're running into
  // // a problem when we try to import json. Eslint and node are intersecting
  // // in a way that makes it a bother to import json normally.
  // //
  // // See https://github.com/eslint/eslint/discussions/15305
  // // Solution taken from https://github.com/eslint/eslint/discussions/15305#discussioncomment-2400923
  // const ownerList = await JSON.parse(readFileSync('./actual-owners.json'))
  // const dependents = await JSON.parse(readFileSync('./dependents.json'))

  // for (const repo of dependents.all_public_dependent_repos) {
  //   if (
  //     !notAServiceWords.some(
  //       (word) =>
  //         repo.repo_name.includes(word) &&
  //         repo.repo_name !== 'govuk-prototype-kit'
  //     ) &&
  //     ownerList.includes(repo.owner) &&
  //     repo.name !== 'alphagov/govuk-frontend'
  //   ) {
  //     initialDepsFilter.push(repo)
  //   }
  // }

  const deps = await JSON.parse(
    readFileSync('dependents-filtered-by-name-and-owner.json')
  )
  const filteredDeps = []
  let csvDeps

  for (const dependent of deps) {
    let bisectResults = false
    let page = 1
    let lastCommitOfPreviousRange

    repoOwner = dependent.owner
    repoName = dependent.repo_name

    try {
      console.log(`Analysing ${repoOwner}/${repoName}`)
      console.log('Checking for a package.json...')
      const packageCheck = await octokit.rest.repos.getContent({
        owner: repoOwner,
        repo: repoName,
        path: 'package.json',
        headers: {
          accept: 'application/vnd.github.raw+json'
        }
      })

      const packageHasGovukFrontend =
        packageCheck.data.indexOf('"govuk-frontend"')

      if (packageHasGovukFrontend === -1) {
        throw new IndirectDependencyError()
      }

      while (!bisectResults && page <= pageLimit) {
        console.log(`Page ${page} of commit list`)
        const commitRange = await octokit.rest.repos.listCommits({
          owner: repoOwner,
          repo: repoName,
          path: 'package.json',
          per_page: 64,
          page
        })

        if (commitRange.data.length === 0) {
          console.log('no data :(')
          break
        }

        console.log(`${commitRange.data.length} commits`)

        if (lastCommitOfPreviousRange) {
          bisectResults = await bisectDiffRange(
            [lastCommitOfPreviousRange, commitRange.data[0]],
            containsCrownUpdate
          )
        }

        bisectResults =
          bisectResults ||
          (await bisectDiffRange(commitRange.data, containsCrownUpdate))
        lastCommitOfPreviousRange =
          commitRange.data[commitRange.data.length - 1]
        page++
      }

      if (!bisectResults) {
        console.log(
          "We weren't able to finish bisecting for some reason. Attempting to finish analysis manually..."
        )

        if (!currentVersion) {
          currentVersion = packageCheck.data.substring(
            packageHasGovukFrontend + 19,
            packageCheck.data.indexOf('",', packageHasGovukFrontend)
          )
        }
      }

      filteredDeps.push({
        name: dependent.name,
        url: `https://github.com/${dependent.name}`,
        currentVersion,
        crownUpdateDate: bisectResults?.commit?.author?.date
      })

      currentVersion = false

      console.log(`Analysis finished of ${dependent.name}`)

      const index = deps.findIndex((item) => item === dependent)

      console.log(`This was item number ${index + 1} of ${deps.length}`)

      const rateLimitData = await octokit.rest.rateLimit.get()
      console.log(
        `${rateLimitData.data.rate.remaining} remaining on rate limit`
      )

      csvDeps = await json2csv(filteredDeps)
      await writeFileSync('dependents-clean.csv', csvDeps)

      console.log('CSV file updated')

      if (rateLimitData.data.rate.remaining <= 10) {
        console.log(`We're about to hit the rate limit! Stopping the script.`)
      }
    } catch (e) {
      if (
        e instanceof RequestError &&
        e.response.url.endsWith('/package.json')
      ) {
        console.log(
          `${repoOwner}/${repoName} doesn't have a package.json and therefore can't be using govuk-frontend directly. Skipping...`
        )
      } else if (e instanceof IndirectDependencyError) {
        console.log(
          `${repoOwner}/${repoName} is using govuk-frontend as an indirect dependancy. Skipping...`
        )
      } else if (e instanceof NotUsingCrownError) {
        console.log(`${repoOwner}/${repoName} isn't using the new crown.`)
        filteredDeps.push({
          name: dependent.name,
          url: `https://github.com/${dependent.name}`,
          currentVersion,
          crownUpdateDate: 'N/A'
        })

        currentVersion = false
      } else {
        throw e
      }
    }
  }

  console.log('All done!')
}

async function bisectDiffRange(
  range,
  func,
  logMessage = 'starting new bisect...'
) {
  console.log(logMessage, range.length)
  if (await func(range)) {
    // Handle odd arrays where towards the end of the bisection
    // we'd get an array of only 1 element. That element will
    // be accounted for by the 'inBetweenRange' test
    // so we can ignore arrays with less than 2 items
    if (range < 2) {
      return
    }

    if (range.length === 2) {
      return range[0]
    }

    const rangeHalfLength = range.length / 2
    const firstHalf = range.slice(0, rangeHalfLength)
    const secondHalf = range.slice(rangeHalfLength)
    // The change of version may have happened between the first item of the second half
    // and the last item of the first half, so we need to also test a small range
    // containing these two if nothing is found in the first or second half of the commit range
    const inBetweenRange = range.slice(rangeHalfLength - 1, rangeHalfLength + 1)

    return (
      (await bisectDiffRange(firstHalf, func, 'bisecting first half')) ||
      (await bisectDiffRange(secondHalf, func, 'bisecting second half')) ||
      (await bisectDiffRange(inBetweenRange, func, 'bisecting between halves'))
    )
  }
}

async function containsCrownUpdate(range) {
  const depDiff = await octokit.rest.dependencyGraph.diffRange({
    owner: repoOwner,
    repo: repoName,
    basehead: `${range[range.length - 1].sha}...${range[0].sha}`
  })

  const frontendVersionChanges = depDiff.data.filter(
    (item) => item.name === 'govuk-frontend'
  )

  if (frontendVersionChanges.length === 0) {
    return false
  }

  // We try to define the latest and oldest versions twice using package-lock,
  // yarn.lock and package.json before giving up

  let latestVersion = getFrontendVersionsFromDiffRange(
    frontendVersionChanges,
    'added',
    'package-lock.json'
  )
  let oldestVersion = getFrontendVersionsFromDiffRange(
    frontendVersionChanges,
    'removed',
    'package-lock.json'
  )

  console.log(latestVersion, oldestVersion)

  if (!latestVersion && !oldestVersion) {
    latestVersion = getFrontendVersionsFromDiffRange(
      frontendVersionChanges,
      'added',
      'yarn.lock'
    )
    oldestVersion = getFrontendVersionsFromDiffRange(
      frontendVersionChanges,
      'removed',
      'yarn.lock'
    )
    console.log(latestVersion, oldestVersion)
  }

  if (!latestVersion && !oldestVersion) {
    latestVersion = getFrontendVersionsFromDiffRange(
      frontendVersionChanges,
      'added',
      'package.json'
    )?.replace('^', '')
    oldestVersion = getFrontendVersionsFromDiffRange(
      frontendVersionChanges,
      'removed',
      'package.json'
    )?.replace('^', '')
    console.log(latestVersion, oldestVersion)
  }

  if (!latestVersion) {
    console.log('Missing added entry')
    return false
  }

  if (!currentVersion) {
    currentVersion = latestVersion
    console.log('Current version set', currentVersion)

    if (
      (satisfies(currentVersion, '<5.1.0') &&
        satisfies(currentVersion, '>4.8.0')) ||
      (satisfies(currentVersion, '<4.8.0') &&
        satisfies(currentVersion, '>3.15.0')) ||
      satisfies(currentVersion, '<3.15.0')
    ) {
      throw new NotUsingCrownError()
    }
  }

  if (!oldestVersion) {
    console.log('Missing removed entry')
    return false
  }

  if (
    (satisfies(latestVersion, '>=5.1.0') &&
      satisfies(oldestVersion, '<5.1.0')) ||
    (satisfies(latestVersion, '>=4.8.0') &&
      satisfies(oldestVersion, '<4.8.0')) ||
    (satisfies(latestVersion, '>=3.15.0') &&
      satisfies(oldestVersion, '<3.15.0'))
  ) {
    console.log('Crown update detected')
    return true
  }
}

function getFrontendVersionsFromDiffRange(
  versionChanges,
  changeType,
  lockfileName
) {
  return versionChanges.find(
    (item) => item.change_type === changeType && item.manifest === lockfileName
  )?.version
}

class IndirectDependencyError extends Error {}
class NotUsingCrownError extends Error {}
