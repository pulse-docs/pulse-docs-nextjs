import { getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {NextRequest, NextResponse} from "next/server";


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
        console.error('Error fetching access token:', error);
        throw new Error('Failed to fetch access token');
    }
};

export async function GET(req: NextRequest) {
    const token = await fetchAccessToken()
    const domain = process.env.KINDE_ISSUER_URL || ""; // Your Kinde domain
    // Get the orgCode from URL Params
    const searchParams = req.nextUrl.searchParams;
    if (!searchParams.has('orgCode')) {
        return NextResponse.json({ status: 400, body: { message: 'orgCode is required' } });
    }
    const orgCode = searchParams.get('orgCode') as string;
    const response = await fetch(`${domain}/api/v1/organizations/${orgCode}/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }})

    if (!response.ok) {
        return NextResponse.json({ status: 500, body: { message: 'Failed to fetch users' } });
    }
    const users = await response.json();
    console.log(users)
    return NextResponse.json(users.organization_users);

}


