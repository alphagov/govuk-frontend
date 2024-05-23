const ownerList = require('./actual-owners.json')
const dependents = require('./dependents.json')
const notAServiceWords = ['prototype', 'beta', 'alpha']
const filteredDeps = new Set()

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

console.log(filteredDeps)
