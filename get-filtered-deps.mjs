import { readFileSync } from 'fs'

// eslint-disable-next-line import/no-unresolved
import { Octokit } from 'octokit'

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
    auth: 'not committing my own auth token'
  })

  const commitRange = await octokit.rest.repos.listCommits({
    owner: 'alphagov',
    repo: 'govuk-design-system',
    path: 'package-lock.json',
    per_page: 100
  })

  const depDiff = await octokit.rest.dependencyGraph.diffRange({
    owner: 'alphagov',
    repo: 'govuk-design-system',
    basehead: `${commitRange.data[commitRange.data.length - 1].sha}...${commitRange.data[0].sha}`
  })

  console.log(depDiff.data.filter((item) => item.name === 'govuk-frontend'))
  console.log(filteredDeps[10])
}

getDeps()
