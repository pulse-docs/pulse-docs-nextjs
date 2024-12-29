// src/lib/caseService.ts
import {unstable_noStore} from "next/cache";
import connect from '../gateway/mongo/mongo.resource';


const collection = "services";

export async function getServices(caseGuid:string) {
    unstable_noStore();
    try {
        const db = await connect();
        const col = db.collection(collection);
        const filter = caseGuid ? { "caseGuid": caseGuid } : {};
        return col.find(filter).sort({"date": 1}).toArray();
    } catch (err) {
        console.error('Failed to fetch services:', err);
        throw new Error('Failed to fetch services.');
    }
}

export async function getService(guid: string) {
    unstable_noStore();
    try {
        const db = await connect();
        const col = db.collection(collection);
        return await col.findOne({"guid": guid});
    } catch (err) {
        console.error('Failed to fetch service:', err);
        throw new Error('Failed to fetch service.');
    }
}

export async function createService(serviceData: any) {
    unstable_noStore();
    try {
        const db = await connect();
        const col = db.collection(collection);
        const newCase = { ...serviceData, createdAt: Date.now()};
        await col.insertOne(newCase);
        return newCase;
    } catch (err) {
        console.error('Failed to create service:', err);
        throw new Error('Failed to create service.');
    }
}

export async function updateService(serviceData: any) {
    delete serviceData._id;
    unstable_noStore();
    try {
        const db = await connect();
        const col = db.collection(collection);
        await col.updateOne({"guid": serviceData.guid}, {$set: serviceData});
    } catch (err) {
        console.error('Failed to update service:', err);
        throw new Error('Failed to update service.');
    }
    return serviceData;
}

export async function deleteService(guid: string) {
    unstable_noStore()
    try {
        const db = await connect();
        const col = db.collection(collection);
        await col.deleteOne({"guid": guid});
    } catch (err) {
        console.error('Failed to delete service:', err);
        throw new Error('Failed to delete service.');
    }
}
