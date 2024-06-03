import { readFileSync } from 'fs'

// eslint-disable-next-line import/no-unresolved
import { Octokit } from 'octokit'
import { satisfies } from 'semver'

const notAServiceWords = ['prototype', 'beta', 'alpha']
const filteredDeps = []

async function getDeps() {
  // This is a really gross way to get the json files but we're running into
  // a problem when we try to import json. Eslint and node are intersecting
  // in a way that makes it a bother to import json normally.
  //
  // See https://github.com/eslint/eslint/discussions/15305
  // Solution taken from https://github.com/eslint/eslint/discussions/15305#discussioncomment-2400923
  const ownerList = await JSON.parse(readFileSync('./actual-owners.json'))
  const dependents = await JSON.parse(readFileSync('./dependents.json'))

  for (const repo of dependents.all_public_dependent_repos) {
    if (
      !notAServiceWords.some(
        (word) =>
          repo.repo_name.includes(word) &&
          repo.repo_name !== 'govuk-prototype-kit'
      ) &&
      ownerList.includes(repo.owner) &&
      repo.name !== 'alphagov/govuk-frontend'
    ) {
      filteredDeps.push(repo)
    }
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_AUTH_TOKEN
  })

  const repoOwner = 'alphagov'
  const repoName = 'whitehall'
  let lockfileName = 'package-lock.json'
  let bisectResults
  let page = 1
  let lastCommitOfPreviousRange
  try {
    while (!bisectResults) {
      console.log('Page', page)
      let commitRange = await octokit.rest.repos.listCommits({
        owner: repoOwner,
        repo: repoName,
        path: lockfileName,
        per_page: 64,
        page
      })

      if (commitRange.data.length === 0) {
        lockfileName = 'yarn.lock'
        commitRange = await octokit.rest.repos.listCommits({
          owner: repoOwner,
          repo: repoName,
          path: lockfileName,
          per_page: 64,
          page
        })
      }

      if (commitRange.data.length === 0) {
        console.log('no data :(')
        return
      }

      if (lastCommitOfPreviousRange) {
        bisectResults = await bisectDiffRange(
          [lastCommitOfPreviousRange, commitRange.data[0]],
          containsCrownUpdate
        )
      }

      bisectResults =
        bisectResults ||
        (await bisectDiffRange(commitRange.data, containsCrownUpdate))
      console.log(bisectResults)
      lastCommitOfPreviousRange = commitRange.data[commitRange.data.length - 1]
      page++
    }
  } catch (e) {
    if (e instanceof IndirectDependencyError) {
      console.log('Indirect dependency')
      return
    }

    throw e
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

    // `govuk-frontend` may appear in lockfiles, but not be listed in `package.json`
    // when brought as a dependency of a dependency. We can skip those by throwing
    // (easier than returning)
    if (
      !frontendVersionChanges.find((item) => item.manifest === 'package.json')
    ) {
      throw new IndirectDependencyError()
    }

    const latestVersion = frontendVersionChanges.find(
      (item) => item.change_type === 'added' && item.manifest === lockfileName
    )?.version
    const oldestVersion = frontendVersionChanges.find(
      (item) => item.change_type === 'removed' && item.manifest === lockfileName
    )?.version

    if (!latestVersion) {
      console.log('Missing added entry')
      return false
    }

    if (!oldestVersion) {
      console.log('Missing removed entry')
      return false
    }

    if (
      satisfies(latestVersion, '>=5.1.0') &&
      satisfies(oldestVersion, '<5.1.0')
    ) {
      console.log('Crown update detected')
      return true
    }
  }
}

getDeps()

async function bisectDiffRange(range, func) {
  console.log('we bisectin...', range.length)
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
      (await bisectDiffRange(firstHalf, func)) ||
      (await bisectDiffRange(secondHalf, func)) ||
      (await bisectDiffRange(inBetweenRange, func))
    )
  }
}

class IndirectDependencyError extends Error {}
