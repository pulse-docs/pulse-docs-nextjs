'use client';
import {Avatar, Box, IconButton, Typography} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import {useEffect, useRef, useState} from "react";



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
}


type UserResponse = {
    user: User;

}


export default function SideBarUser(){
    const [user, setUser] = useState<User |null>(null);
    const hasFetched = useRef(false)
    useEffect(() => {
        if (localStorage.getItem("user") !== null) {
            setUser(JSON.parse(localStorage.getItem("user")!));
        } else {
            if (!hasFetched.current) {
                hasFetched.current = true;
                fetch("/api/user")
                    .then((res) => res.json())
                    .then((data) => {
                        setUser(data.user);
                        localStorage.setItem("user", JSON.stringify(data.user));
                        console.log(data);
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
                src={user?.picture} // Replace with actual user avatar
                alt={user?.given_name}
                sx={{ width: 48, height: 48, marginRight: 2 }}
            />
            <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {user?.given_name + " " + user?.family_name}
                </Typography>
                {/*<Typography variant="body2" color="text.secondary">*/}
                {/*    {user?.email}*/}
                {/*</Typography>*/}
            </Box>
            <IconButton sx={{ marginLeft: "auto" }}>
                {/* TODO: This should link to the user settings page */}
                <SettingsIcon />
            </IconButton>
        </Box>
    );
}