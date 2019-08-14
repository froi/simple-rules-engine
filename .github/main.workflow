workflow "Deploy to NPM" {
  on = "release"
  resolves = [
    "Publish to npm"
  ]
}

action "Publish to npm" {
  uses = "actions/npm@master"
  secrets = ["NPM_AUTH_TOKEN"]
  args = "publish --access-public"
}
