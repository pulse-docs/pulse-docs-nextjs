import { NextRequest, NextResponse } from 'next/server';
import formidable, { File } from 'formidable';
import AWS from 'aws-sdk';
import fs from 'fs';
import { Readable } from 'stream';
import http from 'http';
import { v4 as uuidV4 } from 'uuid';
import { createUpload, deleteUpload } from '@/app/lib/uploadService';

const config = {
    api: {
        bodyParser: false, // Disable automatic body parsing to allow Formidable to handle it
    },
};

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Convert NextRequest to an IncomingMessage with necessary headers for formidable
async function requestToIncomingMessage(req: NextRequest): Promise<http.IncomingMessage> {
    const contentLength = req.headers.get('content-length');
    const contentType = req.headers.get('content-type') || '';

    // Convert ArrayBuffer to Buffer
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a readable stream from the buffer
    const stream = new Readable();
    stream._read = () => {};
    stream.push(buffer);
    stream.push(null);

    const request = Object.assign(stream, {
        headers: {
            'content-length': contentLength,
            'content-type': contentType,
        },
        method: req.method,
        url: req.url,
    });

    return request as http.IncomingMessage;
}

// Helper function to parse files and fields using Formidable
async function parseForm(req: NextRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
    const form = formidable({ multiples: true });
    const incomingRequest = await requestToIncomingMessage(req);

    return new Promise((resolve, reject) => {
        form.parse(incomingRequest, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });
}

export async function POST(req: NextRequest) {
    console.log('POST /api/upload');
    try {
        // Parse fields and files
        const { fields, files } = await parseForm(req);

        const guidCase = (fields.guidCase as unknown as string)[0];
        const bucket = process.env.S3_BUCKET_NAME as string;
        const uploadedBy = (fields.uploadedBy as unknown as string)[0];

        // Extract the GUID from the fields
        if (!guidCase) {
            return NextResponse.json({ error: 'GUID is required in the form data' }, { status: 400 });
        }

        // Use the GUID to create an S3 folder structure
        const uploadPromises = Object.values(files).flat().map((file) => {
            const currentFile = file as File;

            const guidUpload = uuidV4().toString();

            const fileStream = fs.createReadStream(currentFile.filepath);
            const fileExtension = currentFile.originalFilename?.split('.').pop();
            const key = `uploads/${guidCase}/${guidUpload}/${guidUpload}.${fileExtension}`;
            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME as string,
                Key: key, // Use the GUID in the S3 path
                Body: fileStream,
                ContentType: currentFile.mimetype || 'application/octet-stream',
            };

            return s3.upload(uploadParams).promise().then(() => {
                // Upload to S3 and then save the upload details to the database
                createUpload({
                    guidCase,
                    guidUpload,
                    bucket,
                    key: key,
                    filename: currentFile.originalFilename || guidUpload,
                    uploadedBy: uploadedBy,
                    createdAt: Date.now(),
                });
            });
        });

        await Promise.all(uploadPromises);
        return NextResponse.json({ message: `Files uploaded successfully to folder: uploads/${guidCase}` });
    } catch (error) {
        console.error('Error uploading files:', error);
        return NextResponse.json({ error: 'Error uploading files' }, { status: 500 });
    }
}

// GET: Retrieve all files for a given GUID
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url || '', 'http://localhost');
        const guid = searchParams.get('guid');
        if (!guid) {
            return NextResponse.json({ error: 'GUID is required as a query parameter' }, { status: 400 });
        }

        const listParams = {
            Bucket: process.env.S3_BUCKET_NAME as string,
            Prefix: `uploads/${guid}/`, // Prefix for the specified GUID
        };

        const data = await s3.listObjectsV2(listParams).promise();

        const files = data.Contents?.map((file) => ({
            key: file.Key,
            lastModified: file.LastModified,
            size: file.Size,
            name: file.Key?.split('/').pop(),
        })) || [];

        return NextResponse.json({ files });
    } catch (error) {
        console.error('Error retrieving files:', error);
        return NextResponse.json({ error: 'Error retrieving files' }, { status: 500 });
    }
}

// DELETE: Delete single file given the file key
export async function DELETE(req: NextRequest) {
    console.log('DELETE /api/upload');
    try {
        const { searchParams } = new URL(req.url || '', 'http://localhost');
        const guidUpload = searchParams.get('guidUpload');
        if (!guidUpload) {
            return NextResponse.json({ error: 'guidUpload is required as a query parameter' }, { status: 400 });
        }
        const guidCase = searchParams.get('guidCase');
        if (!guidCase) {
            return NextResponse.json({ error: 'guidCase is required as a query parameter' }, { status: 400 });
        }

        const key = searchParams.get('key');
        if (!key) {
            return NextResponse.json({ error: 'Key is required as a query parameter' }, { status: 400 });
        }

        const decodedGuidCase = decodeURIComponent(guidCase);
        const decodedGuidUpload = decodeURIComponent(guidUpload);
        console.log('decodedGuidCase:', decodedGuidCase);
        console.log('decodedGuidUpload:', decodedGuidUpload);

        const listParams = {
            Bucket: process.env.S3_BUCKET_NAME as string,
            Prefix: `uploads/${decodedGuidCase}/${decodedGuidUpload}/`,
        };
        const listedObjects = await s3.listObjectsV2(listParams).promise();
        if (listedObjects.Contents?.length === 0) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }
        console.log('listedObjects:', listedObjects);

        const deleteParams: AWS.S3.DeleteObjectsRequest = {
            Bucket: process.env.S3_BUCKET_NAME as string,
            Delete: { Objects: [] },
        };
        listedObjects.Contents?.forEach((file) => {
            console.log('file:', file);
            deleteParams.Delete.Objects.push({ Key: file.Key as string });
        });
        await s3.deleteObjects(deleteParams).promise().then(() => {
            deleteUpload(decodedGuidCase, decodedGuidUpload);
        });

        return NextResponse.json({ message: 'File(s) deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        return NextResponse.json({ error: 'Error deleting file' }, { status: 500 });
    }
}