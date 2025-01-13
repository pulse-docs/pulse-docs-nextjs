import {NextRequest, NextResponse} from "next/server";
import { fetchAccessToken } from "@/app/lib/kindeService";



export async function GET(req: NextRequest) {
    const token = await fetchAccessToken()

    const domain = process.env.KINDE_ISSUER_URL || ""; // Your Kinde domain
    if (domain === "") {
        return NextResponse.json({ status: 500, body: { message: 'Kinde domain is required' } });
    }

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
        console.error('API: users/: ', response);
        return NextResponse.json({ status: response.status, body: { message: 'Failed to fetch users from kinde' } });
    }

    const users = await response.json();
    return NextResponse.json(users.organization_users);

}


