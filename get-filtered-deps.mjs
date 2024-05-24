import { readFileSync } from 'fs'

// eslint-disable-next-line import/no-unresolved
import { Octokit } from 'octokit'

const notAServiceWords = ['prototype', 'beta', 'alpha']
const filteredDeps = new Set()

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
      filteredDeps.add(repo)
    }
  }

  // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
  const octokit = new Octokit({ auth: '' })

  const test = await octokit.rest.repos.listCommits({
    owner: 'alphagov',
    repo: 'govuk-design-system',
    path: 'package.json'
  })

  const sha = test.data[0].sha

  const shaTest = await octokit.rest.repos.getCommit({
    owner: 'alphagov',
    repo: 'govuk-design-system',
    ref: sha
  })

  console.log(shaTest.data)
}

getDeps()
