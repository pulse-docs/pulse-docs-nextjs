import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {NextResponse} from "next/server";

export async function GET() {
    const session = getKindeServerSession();

    // Check if the user is authenticated
    if (!(await session.isAuthenticated())) {
        console.log("Unauthorized")
        return NextResponse.json({message: "Unauthorized", status: 401});
    }

    const accessToken = await session.getAccessToken();
    const response = await fetch(`${process.env.KINDE_ISSUER_URL}/api/v1/users`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    console.log(response)

    if (!response.ok) {
        console.log("Failed to fetch users")
        return NextResponse.json({message: "Failed to fetch users", status: 500});
    }

    const users = await response.json();
    console.log(users)
    return NextResponse.json({users});
}