const validator = require('validator');

const validateFieldByOneRule = (fieldValue, rule) => {
  // Start out assuming valid
  let errorMessage = '';

  // Determine the field value, the method to invoke and optional args from
  // the rule definition
  const args = rule.args || [];
  const validWhen = typeof rule.validWhen === 'undefined' ? true : rule.validWhen;
  const validationMethod = typeof rule.method === 'string' ? validator[rule.method] : rule.method;

  // Call the validationMethod with the current field value as the first
  // argument and then any additional arguments. If the result doesn't match the rule.validWhen property,
  // then modify the validation object for the field and set the isValid
  // field to false
  if (validationMethod(fieldValue, ...args) !== validWhen) {
    errorMessage = rule.message;
  }

  return errorMessage;
};

const validateFieldByMultipleRules = (fieldValue, validationRules) => {
  if (!Array.isArray(validationRules)) {
    return validateFieldByOneRule(fieldValue, validationRules);
  }

  // Start out assuming valid
  let errorMessage = '';

  // For each validation rule
  validationRules.forEach(rule => {
    // If the field hasn't already been marked invalid by an earlier rule
    if (!errorMessage) {
      errorMessage = validateFieldByOneRule(fieldValue, rule);
    }
  });

  return errorMessage;
};

export { validateFieldByOneRule, validateFieldByMultipleRules };

export default validateFieldByOneRule;
