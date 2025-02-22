// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1D3944', // Dark blue shade
      contrastText: '#F2F2F2'
    },
    secondary: {
      main: '#FFA321', // Accent orange
      contrastText: '#262626'
    },
    background: {
      default: '#F2F2F2', // Light grey background
      paper: '#D9D9D9'
    },
    text: {
      primary: '#262626',
      secondary: '#999999'
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif'
  }
});

export default theme;
