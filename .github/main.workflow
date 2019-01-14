workflow "Deploy on push" {
  on = "push"
  resolves = ["Deploy to Staging"]
}

action "Master branch" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Deploy to Staging" {
  needs = "Master branch"
  uses = "./.github/deploy"
  args = "push staging"
  secrets = ["SSH_KEY_DECRYPT_PASSPHRASE"]
}
