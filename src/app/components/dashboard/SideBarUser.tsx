'use client';
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useEffect, useRef, useState } from "react";

type User = {
    given_name: string;
    family_name: string;
    email: string;
    picture: string;
    id: string;
};

type Organization = {
    orgCode: string;
    orgName: string;
};

type Roles = {
    name: string;
    value: Role[]
}

type Role = {
    id: string;
    key: string;
    name: string;
}

type UserResponse = {
    user: User;
    organization: Organization;
    roles: Roles;
};

export default function SideBarUser() {
    const [user, setUser] = useState<User | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [roles, setRoles] = useState<Roles | null>(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (localStorage.getItem("user") !== null) {
            setUser(JSON.parse(localStorage.getItem("user")!));
            setOrganization(JSON.parse(localStorage.getItem("organization")!));
            setRoles(JSON.parse(localStorage.getItem("roles")!));
        } else {
            if (!hasFetched.current) {
                hasFetched.current = true;
                fetch("/api/user")
                    .then((res) => res.json())
                    .then((data: UserResponse) => {
                        setUser(data.user);
                        setOrganization(data.organization);
                        setRoles(data.roles);
                        localStorage.setItem("user", JSON.stringify(data.user));
                        localStorage.setItem("organization", JSON.stringify(data.organization));
                        localStorage.setItem("roles", JSON.stringify(data.roles));
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        }
    }, []);

    return (
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Avatar
                src={user?.picture}
                alt={user?.given_name}
                sx={{ width: 48, height: 48, marginRight: 2 }}
            />
            <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {user?.given_name + " " + user?.family_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {organization?.orgName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {roles?.value[0].name}
                </Typography>
            </Box>
            <IconButton sx={{ marginLeft: "auto" }}>
                <SettingsIcon />
            </IconButton>
        </Box>
    );
}