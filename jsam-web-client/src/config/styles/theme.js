import { createMuiTheme } from '@material-ui/core/styles';

/* FIXME:
 * - Set up typography for different devices
 * -
 */

const initialCustomTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#3f51b5'
    },
    secondary: {
      main: '#ff5722'
    },
    text: {
      primary: '#212121',
      secondary: '#757575'
    }
  },
  typography: {
    htmlFontSize: 8,
    useNextVariants: true,
    suppressDeprecationWarnings: true,
    tableBody: {
      fontSize: '1.625rem'
    }
  },
  spacing: {
    minUnit: 8,
    unit: 16,
    maxUnit: 24,
    drawerWidth: {
      xlUp: 300,
      mdUp: 280
    }
  }
});

export { initialCustomTheme };

export default initialCustomTheme;
