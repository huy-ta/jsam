import { useState } from 'react';

const useDropdownInput = initialValue => {
  const [value, setValue] = useState(initialValue);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleChange = e => {
    setValue(e.target.value);
  };

  return {
    value,
    onChange: handleChange,
    open: dropdownOpen,
    onClose: () => {
      setDropdownOpen(false);
    },
    onOpen: () => {
      setDropdownOpen(true);
    }
  };
};

export default useDropdownInput;
