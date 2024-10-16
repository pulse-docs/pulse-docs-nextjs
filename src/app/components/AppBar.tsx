// components/AppBarComponent.tsx
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {LoginLink, LogoutLink, useKindeAuth} from "@kinde-oss/kinde-auth-nextjs";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";




export default async function AppBarComponent(){
    const {isAuthenticated, getUser} = getKindeServerSession();
    const user = await getUser();


    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h6" sx={{flexGrow: 1}}>
                    PulseDocs
                </Typography>

                <Typography variant="body1" sx={{mr: 2}}>
                    Welcome, {user?.given_name}!
                </Typography>
                <Avatar alt={user?.given_name || ""} src={user?.picture || ""} sx={{ml: 2}}/>

            </Toolbar>
        </AppBar>
    );
}