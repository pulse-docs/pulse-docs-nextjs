'use client';
import {
    Avatar,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    Toolbar,
    Typography,
    useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import {LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";
import {useEffect} from "react";

const drawerWidth = 280;

const Sidebar = ({ onThemeChange, currentTheme }: {
    onThemeChange: (theme: string) => void;
    currentTheme: string;
}) => {
    const theme = useTheme(); // Access the current theme

    useEffect(() => {
        // Load the current theme from local storage
        const savedTheme = localStorage.getItem("theme") || "dark";
        onThemeChange(savedTheme);
    }, []);

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    backgroundColor: theme.palette.background.default, // Use theme color
                    color: theme.palette.text.primary, // Use theme text color
                    borderRight: `1px solid ${theme.palette.divider}`, // Use theme divider
                },
            }}
        >
            {/* User Profile Section */}
            <Toolbar sx={{ padding: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <Avatar
                        src="/profile-pic.jpg" // Replace with actual user avatar
                        alt="User Avatar"
                        sx={{ width: 48, height: 48, marginRight: 2 }}
                    />
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Kevin Dukkon
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            hey@kevdu.co
                        </Typography>
                    </Box>
                    <IconButton sx={{ marginLeft: "auto" }}>
                        <SettingsIcon />
                    </IconButton>
                </Box>
            </Toolbar>

            <Divider />

            {/* Search Input */}
            {/*<Box sx={{ padding: 2 }}>*/}
            {/*    <TextField*/}
            {/*        fullWidth*/}
            {/*        placeholder="Search"*/}
            {/*        variant="outlined"*/}
            {/*        size="small"*/}
            {/*        InputProps={{*/}
            {/*            startAdornment: <SearchIcon sx={{ marginRight: 1 }} />,*/}
            {/*        }}*/}
            {/*        sx={{*/}
            {/*            "& .MuiOutlinedInput-root": {*/}
            {/*                backgroundColor: theme.palette.background.paper, // Theme-aware background*/}
            {/*            },*/}
            {/*        }}*/}
            {/*    />*/}
            {/*</Box>*/}

            {/* Navigation Links */}
            <List>
                <ListItem disablePadding>
                    <ListItemButton component="a" href="/dashboard">
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton component="a" href="/dashboard/accounts">
                        <ListItemIcon>
                            <AccountBalanceWalletIcon />
                        </ListItemIcon>
                        <ListItemText primary="Accounts" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton component="a" href="/dashboard/cards">
                        <ListItemIcon>
                            <CreditCardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Cards" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton component="a" href="/dashboard/transactions">
                        <ListItemIcon>
                            <ReceiptIcon />
                        </ListItemIcon>
                        <ListItemText primary="Transactions" />
                    </ListItemButton>
                </ListItem>
            </List>

            <Divider />

            {/* Theme Selector */}
            <Box sx={{ padding: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                    Theme
                </Typography>
                <Select
                    fullWidth
                    size="small"
                    value={currentTheme}
                    onChange={(e) => onThemeChange(e.target.value)}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: theme.palette.background.paper,
                        },
                    }}
                >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="custom">Custom</MenuItem>
                </Select>
            </Box>

            {/* Logout Button */}
            <Box sx={{ padding: 2, marginTop: "auto" }} component={LogoutLink}>
                <ListItemButton>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            </Box>
        </Drawer>
    );
};

export default Sidebar;