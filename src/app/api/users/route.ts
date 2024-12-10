import { getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";


const fetchAccessToken = async () => {
    const clientId = process.env.KINDE_CLIENT_ID_M2M || ""; // Your M2M client ID
    const clientSecret = process.env.KINDE_CLIENT_SECRET_M2M || ""; // Your M2M client secret
    const domain = process.env.KINDE_ISSUER_URL || ""; // Your Kinde domain


    const tokenEndpoint = `${domain}/oauth2/token`;
    try {
        const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret,
                audience: `${domain}/api`, // Adjust the audience as needed
            }),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch access token: ${response.statusText}`);
        }
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error.message);
        throw new Error('Failed to fetch access token');
    }
};

export async function GET() {
    const token = await fetchAccessToken()
    const domain = process.env.KINDE_ISSUER_URL || ""; // Your Kinde domain

    const response = await fetch(`${domain}/api/v1/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }})

    // const data = await response.json();
    // data.users.map((user: any) => {
    //
    // }
    // const responseRoles = await fetch(`${domain}/api/v1/organization/org_ec8cd634f18f/user_roles`, {
    //     headers: {
    //         Authorization: `Bearer ${token}`,
    //     }})
    //
    // console.log(await responseRoles.json())
    return NextResponse.json(await response.json());
}


