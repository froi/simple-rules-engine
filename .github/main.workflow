workflow "Deploy to NPM" {
  on = "release"
  resolves = [
    "Publish to npm",
    "Publish to GPR",
  ]
}

action "Publish to npm" {
  uses = "actions/npm@master"
  secrets = ["NPM_AUTH_TOKEN"]
  args = "publish --accee-public"
}

action "Publish to GPR" {
  uses = "actions/npm@master"
  secrets = ["GITHUB_TOKEN"]
  args = "publish"
  env = {
    NPM_REGISTRY_URL = "https://npm.pkg.github.com/"
  }
}
