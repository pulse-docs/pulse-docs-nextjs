 import {ragAndLLM} from "../../lib/controllers/cases";
 import {NextResponse} from "next/server";
//
export async function POST(req) {
    const data = await req.json();
    const { history, question } = data;
    if (!history || !question) {
        return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const resp = await ragAndLLM({history, question, filter: ''});

    return NextResponse.json(resp.text.value, { status: 200 });

}

export async function GET(req){
    return NextResponse.json({error: 'Not supported'}, {status: 400});
}

