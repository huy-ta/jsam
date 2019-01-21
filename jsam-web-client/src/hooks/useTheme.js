import { useEffect, useState } from 'react';
import { initialCustomTheme } from '../config/styles/theme';

const useTheme = () => {
  const [theme, setTheme] = useState(initialCustomTheme);

  useEffect(() => {
    const onResizeWindowDimensions = () => {
      const minWidth = theme.breakpoints.values.sm;
      const maxWidth = theme.breakpoints.values.xl;
      const width = window.innerWidth;

      const ratio = (width - minWidth) / (maxWidth - minWidth);

      let spacingUnit = theme.spacing.unit;
      const minSpacingUnit = theme.spacing.minUnit;
      const maxSpacingUnit = theme.spacing.maxUnit;
      if (ratio > 0) {
        if (ratio > 1) {
          spacingUnit = maxSpacingUnit;
        } else {
          spacingUnit = (maxSpacingUnit - minSpacingUnit) * ratio + minSpacingUnit;
        }
      } else {
        spacingUnit = minSpacingUnit;
      }

      const newTheme = {
        ...theme,
        spacing: {
          ...theme.spacing,
          unit: spacingUnit
        }
      };

      setTheme(newTheme);
    };

    onResizeWindowDimensions();
    window.addEventListener('resize', onResizeWindowDimensions);
    return () => {
      window.removeEventListener('resize', onResizeWindowDimensions);
    };
  }, []);

  return theme;
};

export default useTheme;
