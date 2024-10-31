// src/pages/api/cases/index.ts
import { NextRequest } from "next/server";
import { NextApiRequest, NextApiResponse } from 'next';
import { getCases, createCase, updateCase, deleteCase } from '../../lib/caseService';
import {NextResponse} from "next/server";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";


export async function GET() {
    const cases = await getCases();
    return NextResponse.json({ status: 200, body: cases });
}

export async function POST(req: NextApiRequest) {
    // Check Auth
    const { getUser, isAuthenticated, getClaim } = getKindeServerSession();
    if (!(await isAuthenticated())) {
        return new Response("Unauthorized", { status: 401 });
    }

    const reader = req.body.getReader()
    const {done, value} = await reader.read()
    const body = JSON.parse(new TextDecoder().decode(value))
    const newCase = await createCase(body);
    return NextResponse.json({ status: 201, body: newCase });
}

export async function PUT(req: NextApiRequest) {
    const updatedCase = await updateCase(req.body);
    return NextResponse.json({ status: 200, body: updatedCase });
}

export async function DELETE(req: NextRequest) {
    console.log("Route DELETE")
    const searchParams = req.nextUrl.searchParams;
    await deleteCase(searchParams.get('id') as string);
    return NextResponse.json({ status: 204 });
}