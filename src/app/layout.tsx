// // layout.tsx
// import { ThemeProvider} from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
//
// import Box from "@mui/material/Box";
// import {LoginLink, LogoutLink, useKindeAuth} from "@kinde-oss/kinde-auth-nextjs";
//
// import {
//     lightTheme,
//     darkTheme,
//     lightMediumContrastTheme,
//     darkHighContrastTheme,
// } from "./theme";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import Avatar from "@mui/material/Avatar";
// import Button from "@mui/material/Button";
// import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
//
// export default async function Layout({ children }: { children: React.ReactNode }) {
//
//
//     const {isAuthenticated, getUser} = getKindeServerSession();
//     const user = await getUser();
//     // const [themeName, setThemeName] = useState("light");
//     //
//     // const handleThemeChange = (newTheme: string) => {
//     //     setThemeName(newTheme);
//     // };
//     //
//     // const getTheme = () => {
//     //     switch (themeName) {
//     //         case "light":
//     //             return lightTheme;
//     //         case "dark":
//     //             return darkTheme;
//     //         case "light-medium-contrast":
//     //             return lightMediumContrastTheme;
//     //         case "dark-high-contrast":
//     //             return darkHighContrastTheme;
//     //         default:
//     //             return lightTheme;
//     //     }
//     // };
//     // GET call to api/protected to obtain user is authenticated
//
//     return (
//         <html lang="en">
//         <body>
//         <ThemeProvider theme={darkHighContrastTheme}>
//             <CssBaseline />
//             <AppBar position="fixed">
//                 <Toolbar>
//                     <Typography variant="h6" sx={{flexGrow: 1}}>
//                         PulseDocs
//                     </Typography>
//
//                     {(await isAuthenticated()) ? (
//                         <>
//                             <Typography variant="body1" sx={{mr: 2}}>
//                                 Welcome, {user?.given_name}!
//                             </Typography>
//                             <Avatar alt={user?.given_name || ""} src={user?.picture || ""} sx={{ml: 2}}/>
//
//                             <Button component={LogoutLink} variant="contained" color="secondary">
//                                 Logout
//                             </Button>
//                         </>
//                     ) :(
//                         <Button component={LoginLink} variant="contained" color="primary">
//                             Login
//                         </Button>
//                     )}
//                 </Toolbar>
//             </AppBar>
//             {children}
//         </ThemeProvider>
//         </body>
//         </html>
//     );
// }

import "./globals.css";
import {
    RegisterLink,
    LoginLink,
    LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import Login from "@/app/components/Login";
import Button from "@mui/material/Button";
import AppBarComponent from "@/app/components/AppBar";

export const metadata = {
    title: "Kinde Auth",
    description: "Kinde with NextJS App Router",
};

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, getUser } = getKindeServerSession();
    const user = await getUser();

    return (
        <html lang="en">
        <body>
        <header>
            <nav className="nav container">
                <div>
                    {!(await isAuthenticated()) ? (
                        // If the user is not authenticated, show the sign-in and sign-up buttons
                        <>
                            <Login />
                        </>
                    ) : (
                        // If the user is authenticated, show the user's profile picture and name
                        <></>
                    )}
                </div>
            </nav>
        </header>
        <main>{children}</main>
        <footer className="footer">
            <div className="container">
                {/*<strong className="text-heading-2">KindeAuth</strong>*/}
                {/*<p className="footer-tagline text-body-3">*/}
                {/*    Visit our{" "}*/}
                {/*    <Link className="link" href="https://kinde.com/docs">*/}
                {/*        help center*/}
                {/*    </Link>*/}
                {/*</p>*/}

                <small className="text-subtle">
                    © 2024 Pulse Document Processing, LLC. All rights reserved
                </small>
            </div>
        </footer>
        </body>
        </html>
    );
}