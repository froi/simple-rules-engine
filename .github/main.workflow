workflow "Deploy to NPM" {
  on = "release"
  resolves = ["GitHub Action for npm"]
}

action "GitHub Action for npm" {
  uses = "actions/npm@master"
  secrets = ["NPM_AUTH_TOKEN"]
  args = "publish --accee-public"
}
