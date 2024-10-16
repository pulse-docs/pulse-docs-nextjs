// theme.js
import { createTheme } from "@mui/material/styles";

// Define light theme
export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#006973",
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#4A6266",
            contrastText: "#FFFFFF",
        },
        background: {
            default: "#F5FAFB",
            paper: "#FFFFFF",
        },
        error: {
            main: "#BA1A1A",
            contrastText: "#FFFFFF",
        },
        surface: {
            main: "#F5FAFB",
        },
        onSurface: "#171D1E",
    },
});

// Define dark theme
export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#81D3DF",
            contrastText: "#00363C",
        },
        secondary: {
            main: "#B1CBCF",
            contrastText: "#1C3438",
        },
        background: {
            default: "#0E1415",
            paper: "#1B2122",
        },
        error: {
            main: "#FFB4AB",
            contrastText: "#690005",
        },
        surface: {
            main: "#0E1415",
        },
        onSurface: "#DEE3E4",
    },
});

// Define light-medium-contrast theme
export const lightMediumContrastTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#004A52",
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#2F474A",
            contrastText: "#FFFFFF",
        },
        background: {
            default: "#F5FAFB",
            paper: "#FFFFFF",
        },
        error: {
            main: "#8C0009",
            contrastText: "#FFFFFF",
        },
        surface: {
            main: "#F5FAFB",
        },
        onSurface: "#171D1E",
    },
});

// Define dark-high-contrast theme
export const darkHighContrastTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#F1FDFF",
            contrastText: "#000000",
        },
        secondary: {
            main: "#F1FDFF",
            contrastText: "#000000",
        },
        background: {
            default: "#0E1415",
            paper: "#1B2122",
        },
        error: {
            main: "#FFBAB1",
            contrastText: "#370001",
        },
        surface: {
            main: "#0E1415",
        },
        onSurface: "#FFFFFF",
    },
});