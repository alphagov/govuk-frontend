workflow "New workflow" {
  on = "push"
  resolves = ["Deploy"]
}

action "Deploy" {
  uses = "./.github/deploy"
  args = "push staging"
  secrets = ["SSH_KEY_DECRYPT_PASSPHRASE"]
}
