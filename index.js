const flattenizer = require('flattenizer');
class SimpleRulesEngine {
  constructor(rules) {
    this._rules = rules;
  }

  _executeValidation(validationFn, value) {
    return Promise.resolve(validationFn(value));
  }

  _executeOutcome(outcomeFn, target) {
    return Promise.resolve(outcomeFn(target));
  }

  async _applyRule(rule, target) {
    const field = rule.field;

    const validationResult = await this._executeValidation(rule.validation, target[field]);

    if (validationResult) {
      return this._executeOutcome(rule.outcome, target);
    } else {
      return Promise.resolve(target);
    }
  }

  async execute(target) {
    let flattenedObj = flattenizer.flatten(target);

    if (Array.isArray(this._rules)) {
      for (let rule of this._rules) {
        flattenedObj = await this._applyRule(rule, flattenedObj);
      }
      return flattenizer.unflatten(flattenedObj);
    } else {
      if (typeof this._rules === 'object') {
        return this._applyRule(this._rules, flattenedObj);
      }
    }
  }
}

module.exports = SimpleRulesEngine;
