import OpenAI from 'openai';
const openai = new OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY;

import {NextResponse} from "next/server";
import {fetchTopKMRI} from "../../utils/data.pinecone";

export async function POST(req) {
    const data = await req.json();
    const { history, question } = data;
    if (!history || !question) {
        return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const arr = await fetchTopKMRI(history, 20);
    const docs = arr.map((item) => `BEGIN SAMPLE: ${item.metadata.text} END SAMPLE`);
    const resp = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages:[
            {
                role: 'system',
                content: 'You are a medical peer reviewer. You\'re tasked with reviewing a MRI findings report. You\'re task is to generate two paragraphs. The first paragraph describes in detail work related MRI findings. The second paragraphs desribes non work related MRI findings. If there are no findings for work related or non-work related, include a single sentence stating that there were no findings")}',
            },
            {
                role: "system",
                content:  `These findings are similar medical conditions but do not represent the current patent's MRI findings. Refer to these MRI findings and medical response to generate your answer to the user question. ${docs}`
            },
            {
                role: "system",
                content: "Return your response in the following format. The format is two paragraphs. Use the exact wording from the user input in each FINDING: " +
                    "The work-related findings are: FINDING (MEDICAL DESCRIPTION IN PARENTHESIS). FINDING (MEDICAL DESCRIPTION IN PARENTHESIS). " +
                    "The non-work related findings are: FINDING (MEDICAL DESCRIPTION IN PARENTHESIS). FINDING (MEDICAL DESCRIPTION IN PARENTHESIS)."
            },
            {
                role: 'user',
                content: `${question} MRI Findings: ${history}`,
            }
        ]
    })

    return NextResponse.json(resp.choices[0].message.content, { status: 200 });

}

export async function GET(req){
    return NextResponse.json({error: 'Not supported'}, {status: 400});
}

