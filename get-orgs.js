const dependents = require('./dependents.json')
const orgs = new Set()

for (const repo of dependents.all_public_dependent_repos) {
  orgs.add(repo.owner)
}

for (const owner of orgs) {
  console.log(owner)
}
