import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './utils/theme';

const globalStyles = `
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Open Sans", sans-serif;
  }

  .MuiAppBar-root {
    background-color: #262424 !important; /* Colore primario definito nel tema */
    color: #fff; /* Assicurati che il testo sia visibile */
  }

  select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  option {
    color: #000; /* Colore del testo delle opzioni */
  }
`;

const GlobalStyle = () => (
    <style>
        {globalStyles}
    </style>
);

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyle />
        <App />
    </ThemeProvider>,
    document.getElementById('root')
);
