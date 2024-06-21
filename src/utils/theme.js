import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#262424",
            contrastText: "#fff",
        },
        secondary: {
            main: "#8f8f93",
            contrastText: "#fff",
        },
    },
    typography: {
        fontFamily: "Open Sans, sans-serif",
        h6: {
            fontWeight: 500,
        },
    },
});

export default theme;
