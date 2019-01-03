workflow "New workflow" {
  on = "push"
  resolves = ["Deploy"]
}

action "Deploy" {
  uses = "./deploy/"
  args = "push staging"
}
