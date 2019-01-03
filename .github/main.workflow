workflow "New workflow" {
  on = "push"
  resolves = ["actions/bin/sh@master"]
}

action "actions/bin/sh@master" {
  uses = "actions/bin/sh@master"
  args = "git status"
}
