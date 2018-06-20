const flatten = require('obj-flatten')

class SimpleRulesEngine {
  constructor(rules) {
    this._rules = rules
  }

  _executeValidation(validationFn, value) {
    return Promise.resolve(validationFn(value))
  }

  _executeOutcome(outcomeFn, target) {
    return Promise.resolve(outcomeFn(target))
  }

  async _applyRule(rule, target) {
    const field = rule.field
  
    const validationResult = await this._executeValidation(rule.validation, target[field])

    if(validationResult) {
      const outcomeResult = await this._executeOutcome(rule.outcome, target)
      return outcomeResult
    } else {
      return target
    }
  }

  async execute(target) {
    const _target = target
    const flattenedObj = flatten(target)

    if(Array.isArray(this._rules)) {
      this._rules.forEach(rule => {
        return this._applyRule(rule, flattenedObj)
      })
    } else {
      typeof(this._rules) === Object
      return this._applyRule(this._rules, flattenedObj)
    }
  }
}

module.exports = SimpleRulesEngine
