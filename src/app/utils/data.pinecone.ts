import { Pinecone, QueryResponse, RecordMetadata} from '@pinecone-database/pinecone';
import { embed } from 'ai';
import { unstable_noStore as noStore } from 'next/cache';
import { MatchField, PineconeQueryResponse } from '@/app/utils/definitions';
import { openai} from '@ai-sdk/openai';









export async function connectClientPC(){
    const pinecone = new Pinecone({apiKey : process.env.PINECONE_API_KEY || ''});
    return pinecone;
}


// Get the index name from the environment variable
export async function fetchIndex() {
    try {

        const pc = await connectClientPC();
        const indexName = process.env.PINECONE_INDEX_NAME;
        return pc.listIndexes();
    } catch (err) {
        console.log(err)
        return err
    } finally {
        //client.end();
    }


}

export interface Match {
    id: string;
    score: number;
    values: string[];
    metadata: {
        file_name: string;
    }
}
// Get top k results from the Pinecone index
export async function fetchTopKMRI(query: string, k: number){
    noStore();
    if (!query) {
        console.log('No query provided');
        return null
    }

    try {
        const pc = await connectClientPC();
        const indexName = "mri-responses";
        const vector = await embedQuery(query.toLocaleLowerCase());
        //console.log('queryembed', queryembed)
        const idx = pc.Index<RecordMetadata>(indexName);
        //console.log('idx', idx)
        const resp = await idx.query({
            vector: vector,
            topK: k,
            includeValues: false,
            includeMetadata: true
        })
        return resp.matches as MatchField[];

    } catch (err) {
        console.log(err)
        return null
    } finally {
        //client.end();
    }
}


// Get top k results from the Pinecone index
export async function fetchTopK(query: string, k: number){
    noStore();
    if (!query) {
        console.log('No query provided');
        return null
    }

    try {
        const pc = await connectClientPC();
        const indexName = process.env.PINECONE_INDEX_NAME || 'questions-embedding';
        const vector = await embedQuery(query.toLocaleLowerCase());
        //console.log('queryembed', queryembed)
        const idx = pc.Index<RecordMetadata>(indexName);
        //console.log('idx', idx)
        const resp = await idx.query({
            vector: vector,
            topK: k,
            includeValues: false,
            includeMetadata: true
        })
        return resp.matches as MatchField[];

    } catch (err) {
        console.log(err)
        return null
    } finally {
        //client.end();
    }
}

export async function fetchMatchFileName(query: string, fileName: string){
    noStore();
    if (!fileName || !query) {
        console.log('No query provided');
        return [];
    }

    try {
        const pc = await connectClientPC();
        const indexName = process.env.PINECONE_INDEX_NAME || 'questions-embedding';
        console.log('indexName', indexName)
        const vector = await embedQuery(query);
        //console.log('queryembed', queryembed)
        const idx = pc.Index(indexName);
        //console.log('idx', idx)
        const resp = await idx.query({
            vector: vector,
            topK: 10,
            includeValues: false,
            includeMetadata: true,
            filter: {file_name: {$eq: fileName}}

        })
        resp.matches?.map((match) => {console.log(match.metadata)})
        //console.log(`${fileName}`, resp.matches)
        return resp;

    } catch (err) {
        console.log(err)
        return err
    } finally {
        //client.end();
    }

}

// Embed a user query
export async function embedQuery(query: string) {
    const { embedding } = await embed({
        model: openai.embedding('text-embedding-3-small'),
        value: query,
    });
    return embedding;
}


//export { pinecone }