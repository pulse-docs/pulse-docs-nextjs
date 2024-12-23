import { unstable_noStore } from "next/cache";
import connect from '../gateway/mongo/mongo.resource';
import { ObjectId } from "bson";
import {getSignedURL, getThumbnailUrls} from "@/app/api/pages/route";

export async function getCases() {
    unstable_noStore();
    try {
        const db = await connect();
        const col = db.collection("cases");
        const cases = await col.aggregate([
            {
                $lookup: {
                    from: "uploads",
                    localField: "uploads",
                    foreignField: "guidUpload",
                    as: "uploadDetails"
                }
            },
            { $sort: { "dueDate": 1 } }
        ]).toArray();
        return cases;
    } catch (err) {
        console.error('Failed to fetch cases:', err);
        throw new Error('Failed to fetch cases.');
    }
}


export async function getCase(guid: string) {
    unstable_noStore();
    try {
        const db = await connect();
        const col = db.collection("cases");
        const cases = await col.aggregate([
            { $match: { "guid": guid } },
            {
                $lookup: {
                    from: "uploads",
                    localField: "uploads",
                    foreignField: "guidUpload",
                    as: "uploadDetails"
                }
            },
            {
                $lookup: {
                    from: "services",
                    localField: "guid",
                    foreignField: "caseGuid",
                    as: "serviceDetails"
                }
            }
        ]).toArray();

        cases[0].serviceDetails.forEach((service: any) => {
            service.items.forEach((item: any) => {
                item.url = getSignedURL(item.bucket, item.key)
            })
        })

        return cases[0];
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
        const newCase = { ...caseData, createdAt: Date.now() };
        await col.insertOne(newCase);
        return newCase;
    } catch (err) {
        console.error('Failed to create case:', err);
        throw new Error('Failed to create case.');
    }
}

export async function updateCase(caseData: any) {
    console.log('case update ', caseData);
    delete caseData._id;
    unstable_noStore();
    try {
        const db = await connect();
        const col = db.collection("cases");
        await col.updateOne({ "_id": new ObjectId(caseData.id) }, { $set: caseData });
    } catch (err) {
        console.error('Failed to update case:', err);
        throw new Error('Failed to update case.');
    }
    return caseData;
}

export async function deleteCase(id: string) {
    unstable_noStore();
    try {
        const db = await connect();
        const col = db.collection("cases");
        await col.deleteOne({ "_id": new ObjectId(id) });
    } catch (err) {
        console.error('Failed to delete case:', err);
        throw new Error('Failed to delete case.');
    }
}