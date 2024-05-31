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
      ownerList.includes(repo.owner)
    ) {
      filteredDeps.push(repo)
    }
  }

  const octokit = new Octokit({
    auth: 'not committing my auth token soz'
  })

  const repoOwner = 'alphagov'
  const repoName = 'govuk-design-system'
  let lockfileName = 'package-lock.json'

  let commitRange = await octokit.rest.repos.listCommits({
    owner: repoOwner,
    repo: repoName,
    path: lockfileName,
    per_page: 100
  })

  if (commitRange.data.length === 0) {
    lockfileName = 'yarn.lock'
    commitRange = await octokit.rest.repos.listCommits({
      owner: repoOwner,
      repo: repoName,
      path: lockfileName,
      per_page: 100
    })
  }

  if (commitRange.data.length === 0) {
    console.log('no data :(')
    return
  }

  const depDiff = await octokit.rest.dependencyGraph.diffRange({
    owner: repoOwner,
    repo: repoName,
    basehead: `${commitRange.data[commitRange.data.length - 1].sha}...${commitRange.data[0].sha}`
  })

  const frontendVersionChanges = depDiff.data.filter(
    (item) => item.name === 'govuk-frontend' && item.manifest === lockfileName
  )
  const latestVersion = frontendVersionChanges.find(
    (item) => item.change_type === 'added'
  ).version
  const oldestVersion = frontendVersionChanges.find(
    (item) => item.change_type === 'removed'
  )?.version

  if (
    satisfies(latestVersion, '>=5.1.0') &&
    satisfies(oldestVersion, '<5.1.0')
  ) {
    console.log('Crown update detected')
    console.log(commitRange.data[0])
  }
  // If latestVersion >= 5.1.0 && oldestVersion < 5.1.0 -> That's a crown upgrade
}

getDeps()
