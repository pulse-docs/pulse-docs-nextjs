import { NextRequest, NextResponse } from "next/server";
import { S3Client, CreateMultipartUploadCommand } from "@aws-sdk/client-s3";
import {v4} from 'uuid';

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function POST(req: NextRequest) {
    try {

        const { fileName, fileType, guidCase } = await req.json();

        console.log("Step 1: Upload-multipart:", guidCase)
        const ext = fileName.split('.').pop();
        const uploadGuid = v4().toString();
        const key = `uploads/${guidCase}/${uploadGuid}/${uploadGuid}.${ext}`;

        const command = new CreateMultipartUploadCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            ContentType: fileType,
        });
        const response = await s3.send(command);
        return NextResponse.json({ uploadId: response.UploadId, key: key });
    } catch (error) {
        console.error("Error initializing multipart upload:", error);
        return NextResponse.json({ error: "Failed to start upload" }, { status: 500 });
    }
}