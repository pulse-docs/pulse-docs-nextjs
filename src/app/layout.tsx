import "./globals.css";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Login from "@/app/components/Login";

export const metadata = {
    title: "PulseDocs",
    description: "PulseDocs is a document processing application",
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
        <main>
                {children}
        </main>
        <footer className="footer">
            <div className="container">
                <small className="text-subtle">
                    © 2024 Pulse Document Processing, LLC. All rights reserved
                </small>
            </div>
        </footer>
        </body>
        </html>
    );
}