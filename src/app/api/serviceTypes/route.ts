import {deleteType, createType, getTypes, updateType} from '@/app/lib/typesService';
import {NextRequest, NextResponse} from "next/server";


export async function GET(req: NextRequest){
    const types = await getTypes();
    return NextResponse.json({ status: 200, body: types });
}

export async function POST(req: NextRequest){
    const { type } = await req.json();
    await createType(type);
    return NextResponse.json({ status: 201 });
}

export async function DELETE(req: NextRequest){
    const searchParams = req.nextUrl.searchParams;
    await deleteType(searchParams.get('id') as string);
    return NextResponse.json({ status: 204 });
}