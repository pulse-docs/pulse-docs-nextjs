import { NextRequest, NextResponse } from "next/server";
import { S3Client, CompleteMultipartUploadCommand } from "@aws-sdk/client-s3";
import {createUpload} from "@/app/lib/uploadService";

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function POST(req: NextRequest) {
    try {
        const { fileName, uploadId, parts, guidCase, uploadedBy, key } = await req.json();
        console.log("Step 3: Upload-complete:", guidCase)
        // Ensure parts are correctly formatted with ETag inside double quotes
        const formattedParts = parts
            .map((part: { ETag: string; PartNumber: any; }) => ({
                ETag: part.ETag.startsWith('"') ? part.ETag : `"${part.ETag}"`, // Ensure ETag is in quotes
                PartNumber: part.PartNumber,
            }))
            .sort((a: { PartNumber: number; }, b: { PartNumber: number; }) => a.PartNumber - b.PartNumber); // Ensure parts are in order

        const command = new CompleteMultipartUploadCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: { Parts: formattedParts },
        });

        const response = await s3.send(command);
        const guidUpload = key.split("/")[2];
        await createUpload({
                guidCase: guidCase,
                guidUpload: guidUpload,
                bucket: process.env.S3_BUCKET_NAME!,
                key: key,
                filename: fileName,
                uploadedBy: uploadedBy,
                createdAt: Date.now()
        })

        return NextResponse.json({ message: "Upload completed successfully!", location: response.Location });
    } catch (error) {
        console.error("Error completing multipart upload:", error);
        // @ts-ignore
        return NextResponse.json({ error: "Failed to complete upload", details: error.message }, { status: 500 });
    }
}