import {unstable_noStore as noStore} from 'next/cache';
import {Case, User} from '@/app/utils/definitions';
import connect from './resource.mongo';


export async function getUser(email: string): Promise<User | undefined> {
    console.debug('getUser', email);
    try {
        console.debug('connecting...')
        const db = await connect();
        const col = db.collection(`${process.env.MONGO_COL_USERS}`)
        const result = await col.findOne<User>({ email: email });
        console.log("get user result: ", result)
        return result ? result : undefined;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    } 
}



export async function fetchFileByIDs(ids: string[]): Promise<Case[] | null> {
    noStore();
    if (!ids) {
        console.log('No query provided');
        return [];
    }

    try {
        const db = await connect();
        const col = db.collection(`${process.env.MONGO_COL_CASES}`)
        const cursor = col
            .find<Case>({ file_id: { $in: ids } })
            .project({_id: 0, file_id: 1, claim_id: 1, extent_of_injury: 1, method_of_injury: 1, score: 1, questions: 1, sections: 1, date_of_injury: 1, text: 1})

        const documents = await cursor.toArray()
        return documents.map(doc => {
            return {
                ...doc
            } as Case
        })
    } catch (err) {
        console.log(err)
        return null;
    }
};
