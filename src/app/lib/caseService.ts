// src/lib/caseService.ts
import {unstable_noStore} from "next/cache";
import connect from '../gateway/mongo/mongo.resource';
import {ObjectId} from "bson";

export async function getCases() {
    unstable_noStore();
    try {
        const db = await connect();
        const col = db.collection("cases");
        const cases = col.find({}).toArray();
        return cases;
    } catch (err) {
        console.error('Failed to fetch cases:', err);
        throw new Error('Failed to fetch cases.');
    }
}

export async function getCase(id: string) {
    unstable_noStore();
    try {
        const db = await connect();
        const col = db.collection("cases");
        const cases = await col.findOne({"_id": new ObjectId(id)});
        return cases;
    } catch (err) {
        console.error('Failed to fetch case:', err);
        throw new Error('Failed to fetch case.');
    }
}

export async function createCase(caseData: any) {
    unstable_noStore();
    try {
        const db = await connect();
        const col = db.collection("cases");
        const newCase = { ...caseData, createdAt: Date.now()};
        await col.insertOne(newCase);
        return newCase;
    } catch (err) {
        console.error('Failed to create case:', err);
        throw new Error('Failed to create case.');
    }
}

export async function updateCase(caseData: any) {
    console.log('case update ',caseData);
    delete caseData._id;
    unstable_noStore();
    try {
        const db = await connect();
        const col = db.collection("cases");
        await col.updateOne({"_id": new ObjectId(caseData.id)}, {$set: caseData});
    } catch (err) {
        console.error('Failed to update case:', err);
        throw new Error('Failed to update case.');
    }
    return caseData;
}

export async function deleteCase(id: string) {
    unstable_noStore()
    try {
        const db = await connect();
        const col = db.collection("cases");
        await col.deleteOne({"_id": new ObjectId(id)});
    } catch (err) {
        console.error('Failed to delete case:', err);
        throw new Error('Failed to delete case.');
    }
}