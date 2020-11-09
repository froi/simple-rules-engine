# Simple Rules Engine

A rules engine with a small API and simple rules configuration.

[![Build Status](https://travis-ci.com/froi/simple-rules-engine.svg?branch=master)](https://travis-ci.com/froi/simple-rules-engine)
[![Maintainability](https://api.codeclimate.com/v1/badges/40369d8d7cc85a28d475/maintainability)](https://codeclimate.com/github/froi/simple-rules-engine/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/40369d8d7cc85a28d475/test_coverage)](https://codeclimate.com/github/froi/simple-rules-engine/test_coverage)

## Usage

Please take a look at the [examples](https://github.com/froi/simple-rules-engine/tree/master/examples) folder for a complete `simple` use of this code.

### Installing

`npm install simple-rules-engine`

### Writing Rules

Rules are JSON objects and can be a single object or an array of them.

The expected format is simple by design. Each rule object needs three fields:

- field: the name of the field you want to apply this rule to. For nested objects this value should be in dot-notation / flattened format. Ex. `field: author.name`
- validation: the validation function you wish to perfom on field. This function needs to return a boolean value
- outcome: the function with the logic to be applied to the target object if the validation is `true`. It's important to note that the outcome only runs when the validation returns a true value. This behavior is just the initial step.

Ex.

```javascript
const rule = {
  field: 'name',
  validation: function (value) {
    return value === 'John Snow';
  },
  outcome: function (obj) {
    obj.is_awesome = true;
    return obj;
  }
};
```

### What happens when a validation return false

The engine will just return the target object that was passed in. As mentioned above this might change soon. Any feedback on this would be welcomed as a [Github Issue](https://github.com/froi/simple-rules-engine/issues) using the feedback template.
