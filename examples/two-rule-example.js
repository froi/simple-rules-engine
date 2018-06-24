const fetch = require('node-fetch');
const RulesEngine = require('../index');

const rules = [
  {
    field: 'permissions.usageType',
    validation: function(value) {
      return value === 'openSource';
    },
    outcome: function(obj) {
      if (obj['repositoryURL']) {
        obj.score = obj.score ? obj.score + 1 : 1;
        return obj;
      } else {
        return obj;
      }
    }
  },
  {
    field: 'permissions.usageType',
    validation: function(value) {
      return value === 'governmentWideReuse';
    },
    outcome: function(obj) {
      if (obj['repositoryURL']) {
        return obj;
      } else {
        obj.score = obj.score ? obj.score + 1 : 1;
        return obj;
      }
    }
  }
];

const engine = new RulesEngine(rules);

fetch('https://open.gsa.gov/code.json')
  .then((response) => response.json())
  .then((json) => json.releases)
  .then(async (releases) => {
    let openSourceCount = 0;
    let governmentWideReuseCount = 0;
    for (let repo of releases) {
      let result = await engine.execute(repo);
      if (result.permissions.usageType === 'openSource') {
        openSourceCount += 1;
      }
      if (result.permissions.usageType === 'governmentWideReuse') {
        governmentWideReuseCount += 1;
      }
    }
    /* eslint-disable */
    console.log(`openSourceCount: ${openSourceCount}, governmentWideReuseCount: ${governmentWideReuseCount}`);
    /* eslint-enable */
  });
