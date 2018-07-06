const RulesEngine = require('../index');

const sites = [
  {
    site_name: 'Product Hunt',
    url: 'https://producthunt.com'
  },
  {
    site_name: 'NPM',
    url: 'https://npmjs.org'
  },
  {
    site_name: 'Github',
    url: undefined
  },
  {
    site_name: 'My Localhost',
    url: 'http://localhost'
  }
];

const rules = [
  {
    validation: function(obj) {
      if (obj['url']) {
        if (obj['url'].match(/^(http:\/\/||https:\/\/)localhost/g)) {
          obj.error = {
            message: 'Localhost is not a valid URL'
          };
        }
        if (
          obj['url'].match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g)
        ) {
          return true;
        }
      } else {
        obj.error = {
          message: 'URL should not be empty!!!'
        };
      }
      return true;
    },
    outcome: function(obj) {
      if (obj.error) {
        /* eslint-disable */
        console.error(`[ERROR]: ${obj.error.message}`, obj);
        /* eslint-enable */
      } else {
        /* eslint-disable */
        console.log('YAY not errors!!!');
        /* eslint-enable */
      }
      return obj;
    }
  }
];

const engine = new RulesEngine(rules);

sites.forEach((site) => {
  engine.execute(site);
});
