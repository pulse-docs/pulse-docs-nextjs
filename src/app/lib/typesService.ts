import {unstable_noStore} from "next/cache";
import connect from '@/app/gateway/mongo/mongo.resource';
import {ObjectId} from "bson";
import {deleteOne} from "@pinecone-database/pinecone/dist/data/vectors/deleteOne";

const collectionName = 'types';


export async function createType(serviceType: string) {
    unstable_noStore()
    try {
       const db = await connect();
         const col = db.collection(collectionName);
         await col.insertOne({serviceType})
    } catch (err) {
        console.error('Failed to create type:', err);
        throw new Error('Failed to create type.');
    }
}

export async function getTypes() {
    unstable_noStore()
    try {
        const db = await connect();
        const col = db.collection(collectionName);
        return col.find({}).toArray();
    } catch (err) {
        console.error('Failed to fetch types:', err);
        throw new Error('Failed to fetch types.');
    }
}

export async function updateType(id: string, type: string) {
    unstable_noStore()
    try {
        const db = await connect();
        const collection = db.collection(collectionName);
        const existingType = await collection.findOne({ _id: new ObjectId(id) });
        if (!existingType) {
            throw new Error('Type not found.');
        }
        await collection.updateOne({ _id: new ObjectId(id) }, { $set: { type } });
    } catch (err) {
        console.error('Failed to update type:', err);
        throw new Error('Failed to update type.');
    }
}

export async function deleteType(id: string) {
    unstable_noStore()
    try {
        const db = await connect();
        const collection = db.collection(collectionName);
        await collection.deleteOne({ _id: new ObjectId(id) });
    } catch (err) {
        console.error('Failed to delete type:', err);
        throw new Error('Failed to delete type.');
    }
}