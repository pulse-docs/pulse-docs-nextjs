import {unstable_noStore} from "next/cache";
import connect from './mongo.resource';

export async function getDocumentCount(): Promise<number> {
    unstable_noStore();
    try {
        const db = await connect();
        const col = db.collection("docs_step_0");
        return  await col.countDocuments({});
    } catch (error) {
        console.error('Failed to fetch document count:', error);
        throw new Error('Failed to fetch document count.');
    }
}

