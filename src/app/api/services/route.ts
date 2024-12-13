import {NextRequest, NextResponse} from "next/server";
import {createService, updateService, deleteService, getService, getServices} from '@/app/lib/servicesService';
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";


export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    // Single service
    if (searchParams.get('guid')) {
        const service = await getService(searchParams.get('guid') as string);
        return NextResponse.json({ status: 200, body: service });
    }

    // All services for a case
    if (searchParams.get('caseGuid')) {
        const services = await getServices(searchParams.get('caseGuid') as string);
        return NextResponse.json({ status: 200, body: services });
    }

    return NextResponse.json({ status: 400, body: { message: 'Invalid request' } });
}


export async function POST(req: NextRequest) {
    const { getUser, isAuthenticated, getClaim } = getKindeServerSession();
    if (!(await isAuthenticated())) {
        return new Response("Unauthorized", { status: 401 });
    }

    const newService = await createService(await req.json());
    return NextResponse.json({ status: 201, body: newService });
}