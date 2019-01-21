import { useState } from 'react';

const useRegexTextFieldInput = (initialValue, regex) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    const { value: newValue } = e.target;
    if (regex.test(newValue)) {
      setValue(newValue);
    }
  };

  return {
    value,
    onChange: handleChange
  };
};

export default useRegexTextFieldInput;
