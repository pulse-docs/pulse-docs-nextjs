// src/pages/api/cases/index.ts
import { NextRequest } from "next/server";
import { NextApiRequest, NextApiResponse } from 'next';
import { getCases, getCase, createCase, updateCase, deleteCase } from '../../lib/caseService';
import {NextResponse} from "next/server";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";


export async function GET(req: NextRequest) {
    // Get Single
    const searchParams = req.nextUrl.searchParams;
    if (searchParams.get('guid')) {
        const cases = await getCase(searchParams.get('guid') as string);
        console.log("API CASEs: ", cases);
        return NextResponse.json({ status: 200, body: cases });
    }

    // Get All
    const cases = await getCases();
    return NextResponse.json({ status: 200, body: cases });
}

export async function POST(req: NextRequest) {
    // Check Auth
    const { getUser, isAuthenticated, getClaim } = getKindeServerSession();
    if (!(await isAuthenticated())) {
        return new Response("Unauthorized", { status: 401 });
    }


    const newCase = await createCase(await req.json());
    return NextResponse.json({ status: 201, body: newCase });
}

export async function PUT(req: NextRequest) {
    const updatedCase = await updateCase(await req.json());
    return NextResponse.json({ status: 200, body: updatedCase });
}

export async function DELETE(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    await deleteCase(searchParams.get('id') as string);
    return NextResponse.json({ status: 204 });
}