import {unstable_noStore} from "next/cache";
import connect from '@/app/gateway/mongo/mongo.resource';

const collection = "questions";

export async function getQuestions(filter: any = {}) {
    unstable_noStore();
    try {
        const db = await connect();
        const col = db.collection(collection);
        return col.find(filter).sort({"date": 1}).toArray();
    } catch (err) {
        console.error('Failed to fetch questions:', err);
        throw new Error('Failed to fetch questions.');
    }
}

export async function getQuestion(guid: string) {
    unstable_noStore();
    try {
        const db = await connect();
        const col = db.collection(collection);
        return await col.findOne({"questionGuid": guid});
    } catch (err) {
        console.error('Failed to fetch question:', err);
        throw new Error('Failed to fetch question.');
    }
}

export async function createQuestion(questionData: any) {
    unstable_noStore();
    try {
        const db = await connect();
        const col = db.collection(collection);
        const newQuestion = { ...questionData, createdAt: Date.now()};
        await col.insertOne(newQuestion);
        return newQuestion;
    } catch (err) {
        console.error('Failed to create question:', err);
        throw new Error('Failed to create question.');
    }
}

export async function updateQuestion(questionData: any) {
    delete questionData._id;
    unstable_noStore();
    try {
        const db = await connect();
        const col = db.collection(collection);
        await col.updateOne({"questionGuid": questionData.guid}, {$set: questionData});
    } catch (err) {
        console.error('Failed to update question:', err);
        throw new Error('Failed to update question.');
    }
    return questionData;
}

export async function deleteQuestion(guid: string) {
    unstable_noStore();
    try {
        const db = await connect();
        const col = db.collection(collection);
        await col.deleteOne({"questionGuid": guid});
    } catch (err) {
        console.error('Failed to delete question:', err);
        throw new Error('Failed to delete question.');
    }
}
