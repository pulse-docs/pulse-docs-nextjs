import {unstable_noStore} from "next/cache";
import connect from "@/app/gateway/mongo/mongo.resource";

interface Upload {
    guidCase: string;
    guidUpload: string;
    bucket: string;
    key: string;
    filename: string;
    uploadedBy: string;
    createdAt: number;
}


export async function createUpload(upload: Upload){
    console.log('upload',upload);
    unstable_noStore();
    try {
        const db = await connect();
        const col = db.collection("uploads");
        await col.insertOne(upload);

        const colCases = db.collection("cases");
        // @ts-ignore
        await colCases.updateOne({"guidCase": upload.guidCase}, {$push: {uploads: upload.guidUpload}});


        return upload;
    } catch (err) {
        console.error('Failed to create upload:', err);
        throw new Error('Failed to create upload.');
    }
}

export async function deleteUpload(guidCase: string, guidUpload: string){
    unstable_noStore();
    try {
        const db = await connect();
        const col = db.collection("uploads");
        await col.deleteOne({guidUpload});

        const colCases = db.collection("cases");
        // @ts-ignore
        await colCases.updateOne({"guid": guidCase}, {$pull: {uploads: guidUpload}});

        return;
    } catch (err) {
        console.error('Failed to delete upload:', err);
        throw new Error('Failed to delete upload.');
    }
}