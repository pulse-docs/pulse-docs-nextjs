"use client";

import {LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import {Box, Paper, Typography, Button, Stack} from "@mui/material";
import Link from "next/link";

export default function Login() {
    const requestAccessLink = process.env.NEXT_PUBLIC_KINDE_REQUEST_ACCESS_URL;
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    borderRadius: 3,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    maxWidth: 400,
                }}
            >
                <Typography variant="h5" gutterBottom sx={{justifyContent: "center"}}>
                    Welcome to PulseDocs
                </Typography>
                <Stack spacing={2} mt={2}>
                    <Button
                        component={LoginLink}
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Login
                    </Button>
                    <Button
                        component={Link}
                        href={requestAccessLink}
                        variant="outlined"
                        color="primary"
                        fullWidth
                    >
                        Request Access
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}