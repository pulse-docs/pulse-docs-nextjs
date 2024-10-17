"use client";

import { useEffect, useState } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import {lightTheme, darkTheme, lightMediumContrastTheme, darkHighContrastTheme} from "../theme";
import Sidebar from "../components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [themeName, setThemeName] = useState("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "dark";
        setThemeName(savedTheme);
    }, []);

    const getTheme = () => {
        switch (themeName) {
            case "dark":
                return darkTheme;
            case "lightContrast":
                return lightMediumContrastTheme;
            case "darkContrast":
                return darkHighContrastTheme;
            default:
                return lightTheme;
        }
    };

    const handleThemeChange = (newTheme: string) => {
        setThemeName(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <ThemeProvider theme={getTheme()}>
            <CssBaseline />
            <Box sx={{ display: "flex", height: "100vh" }}>
                <Sidebar onThemeChange={handleThemeChange} currentTheme={themeName} />
                <Box sx={{ flexGrow: 1, p: 3, overflowY: "auto" }}>{children}</Box>
            </Box>
        </ThemeProvider>
    );
}