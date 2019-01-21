const validator = require('validator');

const validateField = (fieldValue, validationRules) => {
  // Start out assuming valid
  let validation = {
    isValid: true
  };

  if (!Array.isArray(validationRules)) {
    const rule = validationRules;
    if (validation.isValid) {
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
        validation = { isValid: false, message: rule.message };
      }
    }

    return validation;
  }
  // For each validation rule
  validationRules.forEach(rule => {
    // If the field hasn't already been marked invalid by an earlier rule
    if (validation.isValid) {
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
        validation = { isValid: false, message: rule.message };
      }
    }
  });

  return validation;
};

console.log(validateField('quochuy', { method: 'isEmail', message: 'Email formatted incorrectly.' }));
