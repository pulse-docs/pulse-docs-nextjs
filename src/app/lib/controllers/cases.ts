import {Case} from "../../utils/definitions";
import {embedQuery, fetchTopK} from "../../utils/data.pinecone";
import {fetchFileByIDs} from "../../utils/data.mongo";
import fuzzysort from "fuzzysort";
import connect from "../../utils/resource.mongo";
import OpenAI from "openai"

const openai = new OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY || '';

// getCasesByFileId accepts a query and topK parameter and returns a list of cases that match the query.
// It's poorly named
export async function getCasesByFileId({query, topK}: {
    query: string,
    topK: number
}): Promise<Case[] | undefined> {
    // Get the top matches from Pinecone
    const pineconeResponse = await fetchTopK(query, topK);
    const pineconeFileIDs = pineconeResponse?.map((match) => match.id) || [];

    // [{file_id: UUID, score: 0.9}, {file_id: UUID, score: 0.8}]
    const pineconeMatchScores = pineconeResponse?.map((match) => ({[match.id]: match.score})) || [];

    const tmp = await getCaseByFuzzy({query})

    // Get cases by file IDs
    const cases: Case[] = await fetchFileByIDs(pineconeFileIDs) || [];

    // Update w/ pinecone scores. Make sure to round to 2 decimal places for better sorting
    for (let i = 0; i < cases.length; i++) {
        for (let j = 0; j < pineconeMatchScores.length; j++) {
            if (cases[i].file_id === Object.keys(pineconeMatchScores[j])[0]) {
                cases[i].score = Math.round(Object.values(pineconeMatchScores[j])[0] * 10000) / 100;
            }
        }
    }
    for (let i = 0; i < cases.length; i++) {
        const scoreEoi = fuzzysort.single(query, cases[i].extent_of_injury)?.score || 0;
        const scoreMoi = fuzzysort.single(query, cases[i].method_of_injury)?.score || 0;
        cases[i].score = (scoreEoi + scoreMoi)
        //cases[i].score = scoreEoi
    }
    cases.sort((a, b) => b.score - a.score);
    return cases;
}

export async function getCaseByFuzzyMRI({query, topK, filter}:{
    query?: string,
    topK?: number,
    filter?: string
}) {
    // Ensure parameters are defined
    if (!query || !topK) {
        return;
    }

    topK = 100;
    const results = await getCaseByFuzzy({query, topK, filter})
    return results?.filter((c) => c.mri_records?.length > 0).slice(0, 10);
}


/* getCaseByFuzzy accepts a query, topK, and filter parameter and returns a list of cases that match the query.
 */
export async function getCaseByFuzzy({query, topK, filter, fullSearch}: {
    query?: string,
    topK?: number,
    filter?: string
    fullSearch?: boolean
}) {
    // Ensure parameters are defined
    if (!query || !topK) {
        return;
    }

    // Query MongoDB for the `extent_of_injury` field
    const db = await connect();

    const col = db.collection(`${process.env.MONGO_COL_CASES}`);

    const search = fullSearch ? {
        $search: {
            index: "extent_of_injury",
            text: {
                path: "extent_of_injury",
                query: query,
                fuzzy: {}
            }
        }

    }
      : {
            $search: {
                index: "fullSearch",
                text: {
                    path: "text",
                    query: query,
                }
            }
        }

    const cursor = col.aggregate<Case>([
        // This is the fuzzy part. Pretty sure this scans the whole database.
        // Replacing w/ vector would be better
        search,
        // Projection
        {
            $project: {
                _id: 0,
                file_id: 1,
                claim_id: 1,
                extent_of_injury: 1,
                method_of_injury: 1,
                score: {$meta: "searchScore"},
                questions: 1,
                sections: 1,
                date_of_injury: 1,
                text: 1,
                mri_records: 1
            }
        },
        {
            $match: {
                text: {$ne: null}
            }
        },
        {
            $sort: {score: -1}
        },
        {
            $limit: topK
        }
    ]);
    let cases = (await cursor.toArray()).map(doc => {return {...doc} as Case});

    for (let i = 0; i < cases.length; i++) {
        // Replace any non-alphanumeric characters with an empty string
        let q2 = query.replace(/[^a-zA-Z0-9 ]/g, ' ');
        let eoi = cases[i].extent_of_injury.replace(/[^a-zA-Z0-9 ]/g, ' ');

        cases[i].score = fuzzysort.single(q2, eoi)?.score || 0;
    }
    cases.sort((a, b) => b.score - a.score);

    cases.forEach((c, idxCase) => {
        let paragraphs = c.text.split(/\n{2,}/g)
        paragraphs.forEach((p, idxParagraph) => {
            if (p.match(new RegExp(/.*possible\s+treatment\s+plan.*/g, 'i'))) {
                cases[idxCase].treatment = paragraphs[idxParagraph + 1]
            }
        })
    })
    // The Mongo Fuzzy scoring doesn't sort the results. This works much better
    if (!filter) {
        return cases;
    } else {
        /*
        * This is a filter function that uses a regex pattern to match all tokens in the filter string.
        * It then counts the number of matches in each cases and sorts the cases by the number of matches.
         */

        // Split the filter string into tokens
        const tokens = filter.split(/\s+/g).filter(Boolean);  // split on whitespace
        // Create a regex pattern that matches all tokens
        const regexPattern = new RegExp(tokens.map((t) => `(?=.*${t})`).join(''), 'i');

        for (let i = 0; i < cases.length; i++) {
            cases[i].matches = 0
            cases[i].matched = []
            /// Split the text into paragraphs
            const paragraphs = cases[i].text.split(/\n{2,}/g);
            paragraphs.forEach((p) => {
                if (regexPattern.test(p)){
                    cases[i].matches += 1 // Update count for display
                    cases[i].score += 1 // Update the score
                    cases[i].matched.push(p) // Add paragraphs for display
                }
            })

        }
        // Only return those cards with matches, sorted form least to greatest
        return cases.filter((c) => c.matches > 0).sort((a, b) => b.score - a.score);
    }

}

export async function ragAndLLMMRI({query, history, question, filter}: {
    query: string,
    history: string,
    question: string,
    filter: string

}) {
    //  Hist the best matching cases
    let cases = await getCaseByFuzzyMRI({query, topK: 5, filter});
    let objs = cases?.map((c) => c.mri_records).flat();
    let text = objs?.map((m) => m.record).join(' ');
    console.log(text)
    //let text = cases?.map((c) => c.mri_records?.map((m) => m.record).join(' ')).join(' END_OF_CASE ');
    //const text = cases?.map((c) => c.text.replace(/\s+/g, ' ')).join(' END_OF_CASE ');
    const resp = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                "role": "system",
                "content": "You are an experienced doctor skilled in medical peer review. Your response is professional and delivered in a succinct, manner suitable for legal documentation related to the cases. Return only the response."
            },
            {
                "role": "system",
                "content": `Review the following cases and be prepared to provide a response to the users question. Reference the following cases to help  inform your response: ${text}`
            },
            {
                "role": "user", "content": `HISTORICAL CONTEXT: ${text}  CURRENT CONTEXT: ${history} QUESTION: ${question}. The historical context is provided only for logic and language. Refer only to the current context for the response.`
            }
        ],
    });
    return resp.choices[0].message.content;
}

export async function ragAndLLM({history, question, filter}: {
    history: string,
    question: string,
    filter: string

}) {
    //  Hist the best matching cases
    let cases = await getCasesByFileId({query:history, topK: 5});
    const text = cases?.map((c) => c.text.replace(/\s+/g, ' ')).join(' END_OF_CASE ');
    const thread = await openai.beta.threads.create()
    const message = await openai.beta.threads.messages.create(thread.id, {
        "role": "user", "content": `HISTORICAL CONTEXT: ${text}  CURRENT CONTEXT: ${history} QUESTION: ${question}. The historical context is provided only for logic and language. Refer only to the current context for the response. Your response must be based on the CURRENT CONTEXT.`
    });
    const run = await openai.beta.threads.runs.create(thread.id, {assistant_id: "asst_yzaJPKI1AvHv73ek2tMJZCZs"});

    let resp = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while ("completed" !== `${resp.status}`) {
        resp = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }
    const msgList = await openai.beta.threads.messages.list(thread.id);
    return msgList.data[0].content[0];


    // const resp = await openai.chat.completions.create({
    //     model: 'gpt-4o',
    //     messages: [
    //         {
    //             "role": "system",
    //             "content": "You are an experienced doctor skilled in medical peer review. Your response is professional and delivered in a succinct, manner suitable for legal documentation related to the cases. Return only the response."
    //         },
    //         {
    //             "role": "system",
    //             "content": `Review the following cases and be prepared to provide a response to the users question. Reference the following cases to help  inform your response: ${text}`
    //         },
    //         {
    //             "role": "user", "content": `HISTORICAL CONTEXT: ${text}  CURRENT CONTEXT: ${history} QUESTION: ${question}. The historical context is provided only for logic and language. Refer only to the current context for the response. Your response must be based on the CURRENT CONTEXT.`
    //         }
    //     ],
    // });
    //return resp.choices[0].message.content;
}
