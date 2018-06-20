const chai = require('chai')
const should = chai.should()
const SimpleRulesEngine = require('../index')

describe('apply rules', function() {
  let target;
  beforeEach(function() {
    target = {
      name: "simple-rules-engine",
      github_url: "",
      description: "A rules engine with a small API and simple rules configuration ",
      license: {
        name: "MIT",
        url: "https://choosealicense.com/licenses/mit/",
      },
      languages: [
        "javascript"
      ],
      author: {
        name: "Froilan Irizarry",
        github_user: "froi",
        email: "hello@froilanirizarry.me"
      }
    }
  })
  describe('single rule', function () {
    let singleRule;
    before(function () {
      rule = {
        field: "name",
        validation: function (value) {
          return value === 'simple-rules-engine'
        },
        outcome: function (obj) {
          obj.passed = true
        }
      }
    })
    it('should return modified target', function() {
      const engine = new SimpleRulesEngine(rule)
      return engine.execute(target)
        .then( result => {
          result.passed.should.be.equal(true)
        })
    })
  })
  describe('multiple rules', function() {
    let rules;
    before(function() {
      rules = [
        {
          field: "name",
          validation: function (value) {
            return value === 'simple-rules-engine'
          },
          outcome: function (obj) {
            obj.passed = true
          }
        },
        {
          field: "author.name",
          validation: function (value) {
            return value === 'Froilan Irizarry'
          },
          outcome: function (obj) {
            obj.passed = false
          }
        },
        {
          field: "author.email",
          validation: function (value) {
            return value === 'hello@froilanirizarry.me'
          },
          outcome: function (obj) {
            obj.correct_email = true
          }
        }
      ]
    })
    it('should return modified target', function () {
      const engine = new SimpleRulesEngine(rules)
      return engine.execute(target).then( result => {
        result.correct_email.should.be.equal(true)
      })
    })
  })
})

