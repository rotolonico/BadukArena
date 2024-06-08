import { createTheme } from "@mui/material";


const theme = createTheme({
    palette: {
        primary: {
        main: "#262424",
        },
        secondary: {
        main: "#8f8f93",
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