import {NextRequest, NextResponse} from "next/server";
import {getQuestions, getQuestion, createQuestion, updateQuestion, deleteQuestion} from '@/app/lib/questionService';


export async function GET(req: NextRequest) {
    // Quesitons for a case
    const searchParams = req.nextUrl.searchParams;
    if (searchParams.get('caseGuid')) {
        const filter = { caseGuid: searchParams.get('caseGuid') };
        const question = await getQuestions(filter);
        return NextResponse.json({ status: 200, body: question });
    }

    // Single question
    if (searchParams.get('questionGuid')) {
        const question = await getQuestion(searchParams.get('questionGuid') as string);
        return NextResponse.json({ status: 200, body: question });
    }

    // Get all questions
    const questions = await getQuestions();
    return NextResponse.json({ status: 200, body: questions });
}

export async function POST(req: NextRequest) {
    await createQuestion(await req.json());
    return NextResponse.json({ status: 201, body: {} });
}

export async function PUT(req: NextRequest) {
    await updateQuestion(await req.json());
    return NextResponse.json({ status: 200, body: {} });
}

export async function DELETE(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    console.log(searchParams.get('guid'));
    await deleteQuestion(searchParams.get('guid') as string);
    return NextResponse.json({ status: 204 });
}