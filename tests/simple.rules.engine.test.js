const chai = require('chai');
const SimpleRulesEngine = require('../index');
chai.should();

describe('apply rules', function () {
  let target;
  beforeEach(function () {
    target = {
      name: 'simple-rules-engine',
      github_url: '',
      description: 'A rules engine with a small API and simple rules configuration ',
      license: {
        name: 'MIT',
        url: 'https://choosealicense.com/licenses/mit/'
      },
      languages: ['javascript'],
      author: {
        name: 'Froilan Irizarry',
        github_user: 'froi',
        email: 'hello@froilanirizarry.me'
      }
    };
  });
  describe('single rule passing field name (sync)', function () {
    let singleRule;
    before(function () {
      singleRule = {
        field: 'name',
        validation: function (value) {
          return value === 'simple-rules-engine';
        },
        outcome: function (obj) {
          obj.passed = true;
          return obj;
        }
      };
    });
    it('should return modified target', function () {
      const engine = new SimpleRulesEngine(singleRule);
      return engine.execute(target).then((result) => {
        result.passed.should.be.equal(true);
      });
    });
  });
  describe('multiple rules passing field name (sync)', function () {
    let rules;
    before(function () {
      rules = [
        {
          field: 'name',
          validation: function (value) {
            return value === 'simple-rules-engine';
          },
          outcome: function (obj) {
            obj.passed = true;
            return obj;
          }
        },
        {
          field: 'author.name',
          validation: function (value) {
            return value === 'Axel Rivera';
          },
          outcome: function (obj) {
            obj.passed = false;
            return obj;
          }
        },
        {
          field: 'author.email',
          validation: function (value) {
            return value === 'hello@froilanirizarry.me';
          },
          outcome: function (obj) {
            obj.correct_email = true;
            return obj;
          }
        }
      ];
    });
    it('should return modified target', function () {
      const engine = new SimpleRulesEngine(rules);
      return engine.execute(target).then((result) => {
        result.correct_email.should.be.equal(true);
        result.passed.should.be.equal(true);
        result.author.email.should.be.equal('hello@froilanirizarry.me');
      });
    });
  });
  describe('single rule passing field name (async)', function () {
    let singleRule;
    before(function () {
      singleRule = {
        field: 'name',
        validation: function (value) {
          return Promise.resolve(value === 'simple-rules-engine');
        },
        outcome: function (obj) {
          obj.passed = true;
          return Promise.resolve(obj);
        }
      };
    });
    it('should return modified target', function () {
      const engine = new SimpleRulesEngine(singleRule);
      return engine.execute(target).then((result) => {
        result.passed.should.be.equal(true);
      });
    });
    it('should fail if promise rejected', function () {
      const engine = new SimpleRulesEngine({
        field: 'name',
        validation: function (value) {
          return Promise.reject(new Error(`value=${value}`));
        },
        outcome: function (obj) {
          obj.passed = true;
          return Promise.resolve(obj);
        }
      });
      return engine.execute(target).catch((err) => {
        chai.expect(err).to.exist.and.be.instanceof(Error).and.have.property('message', 'value=simple-rules-engine');
      });
    });
  });
  describe('multiple rules passing field name (async)', function () {
    let rules;
    before(function () {
      rules = [
        {
          field: 'name',
          validation: function (value) {
            return Promise.resolve(value === 'simple-rules-engine');
          },
          outcome: function (obj) {
            obj.passed = true;
            return Promise.resolve(obj);
          }
        },
        {
          field: 'author.name',
          validation: function (value) {
            return Promise.resolve(value === 'Axel Rivera');
          },
          outcome: function (obj) {
            obj.passed = false;
            return Promise.resolve(obj);
          }
        },
        {
          field: 'author.email',
          validation: function (value) {
            return Promise.resolve(value === 'hello@froilanirizarry.me');
          },
          outcome: function (obj) {
            obj.correct_email = true;
            return Promise.resolve(obj);
          }
        }
      ];
    });
    it('should return modified target', function () {
      const engine = new SimpleRulesEngine(rules);
      return engine.execute(target).then((result) => {
        result.correct_email.should.be.equal(true);
        result.passed.should.be.equal(true);
        result.author.email.should.be.equal('hello@froilanirizarry.me');
      });
    });
    it('should fail if promise rejected', function () {
      const engine = new SimpleRulesEngine([
        {
          field: 'name',
          validation: function (value) {
            return Promise.reject(new Error(`value=${value}`));
          },
          outcome: function (obj) {
            obj.passed = true;
            return Promise.resolve(obj);
          }
        },
        {
          field: 'author.name',
          validation: function (value) {
            return Promise.resolve(value === 'Axel Rivera');
          },
          outcome: function (obj) {
            obj.passed = false;
            return Promise.resolve(obj);
          }
        },
        {
          field: 'author.email',
          validation: function (value) {
            return Promise.resolve(value === 'hello@froilanirizarry.me');
          },
          outcome: function (obj) {
            obj.correct_email = true;
            return Promise.resolve(obj);
          }
        }
      ]);
      return engine.execute(target).catch((err) => {
        chai.expect(err).to.exist.and.be.instanceof(Error).and.have.property('message', 'value=simple-rules-engine');
      });
    });
  });

  describe('single rule without passing field name (sync)', function () {
    let singleRule;
    before(function () {
      singleRule = {
        validation: function (obj) {
          return obj.name === 'simple-rules-engine';
        },
        outcome: function (obj) {
          obj.passed = true;
          return obj;
        }
      };
    });
    it('should return modified target', function () {
      const engine = new SimpleRulesEngine(singleRule);
      return engine.execute(target).then((result) => {
        result.passed.should.be.equal(true);
      });
    });
  });
  describe('multiple rules without passing field name (sync)', function () {
    let rules;
    before(function () {
      rules = [
        {
          validation: function (obj) {
            return obj['name'] === 'simple-rules-engine';
          },
          outcome: function (obj) {
            obj.passed = true;
            return obj;
          }
        },
        {
          validation: function (obj) {
            return obj['author.name'] === 'Axel Rivera';
          },
          outcome: function (obj) {
            obj.passed = false;
            return obj;
          }
        },
        {
          validation: function (obj) {
            return obj['author.email'] === 'hello@froilanirizarry.me';
          },
          outcome: function (obj) {
            obj.correct_email = true;
            return obj;
          }
        }
      ];
    });
    it('should return modified target', function () {
      const engine = new SimpleRulesEngine(rules);
      return engine.execute(target).then((result) => {
        result.correct_email.should.be.equal(true);
        result.passed.should.be.equal(true);
        result.author.email.should.be.equal('hello@froilanirizarry.me');
      });
    });
  });
  describe('single rule passing field name (async)', function () {
    let singleRule;
    before(function () {
      singleRule = {
        validation: function (obj) {
          return Promise.resolve(obj['name'] === 'simple-rules-engine');
        },
        outcome: function (obj) {
          obj.passed = true;
          return Promise.resolve(obj);
        }
      };
    });
    it('should return modified target', function () {
      const engine = new SimpleRulesEngine(singleRule);
      return engine.execute(target).then((result) => {
        result.passed.should.be.equal(true);
      });
    });
    it('should fail if promise rejected', function () {
      const engine = new SimpleRulesEngine({
        validation: function (obj) {
          return Promise.reject(new Error(`value=${obj['name']}`));
        },
        outcome: function (obj) {
          obj.passed = true;
          return Promise.resolve(obj);
        }
      });
      return engine.execute(target).catch((err) => {
        chai.expect(err).to.exist.and.be.instanceof(Error).and.have.property('message', 'value=simple-rules-engine');
      });
    });
  });
  describe('multiple rules passing field name (async)', function () {
    let rules;
    before(function () {
      rules = [
        {
          validation: function (obj) {
            return Promise.resolve(obj['name'] === 'simple-rules-engine');
          },
          outcome: function (obj) {
            obj.passed = true;
            return Promise.resolve(obj);
          }
        },
        {
          validation: function (obj) {
            return Promise.resolve(obj['author.name'] === 'Axel Rivera');
          },
          outcome: function (obj) {
            obj.passed = false;
            return Promise.resolve(obj);
          }
        },
        {
          validation: function (obj) {
            return Promise.resolve(obj['author.email'] === 'hello@froilanirizarry.me');
          },
          outcome: function (obj) {
            obj.correct_email = true;
            return Promise.resolve(obj);
          }
        }
      ];
    });
    it('should return modified target', function () {
      const engine = new SimpleRulesEngine(rules);
      return engine.execute(target).then((result) => {
        result.correct_email.should.be.equal(true);
        result.passed.should.be.equal(true);
        result.author.email.should.be.equal('hello@froilanirizarry.me');
      });
    });
    it('should fail if promise rejected', function () {
      const engine = new SimpleRulesEngine([
        {
          validation: function (obj) {
            return Promise.reject(new Error(`value=${obj['name']}`));
          },
          outcome: function (obj) {
            obj.passed = true;
            return Promise.resolve(obj);
          }
        },
        {
          validation: function (obj) {
            return Promise.resolve(obj['author.name'] === 'Axel Rivera');
          },
          outcome: function (obj) {
            obj.passed = false;
            return Promise.resolve(obj);
          }
        },
        {
          validation: function (obj) {
            return Promise.resolve(obj['author.email'] === 'hello@froilanirizarry.me');
          },
          outcome: function (obj) {
            obj.correct_email = true;
            return Promise.resolve(obj);
          }
        }
      ]);
      return engine.execute(target).catch((err) => {
        chai.expect(err).to.exist.and.be.instanceof(Error).and.have.property('message', 'value=simple-rules-engine');
      });
    });
  });
});
