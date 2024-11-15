import { NextRequest, NextResponse } from 'next/server';
import formidable, { File } from 'formidable';
import AWS from 'aws-sdk';
import fs from 'fs';
import { Readable } from 'stream';
import http from 'http';

export const config = {
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
    try {
        // Parse fields and files
        const { fields, files } = await parseForm(req);

        // Extract the GUID from the fields
        console.log('Fields:', fields);
        const guid = fields.guid as string;
        if (!guid) {
            return NextResponse.json({ error: 'GUID is required in the form data' }, { status: 400 });
        }

        // Use the GUID to create an S3 folder structure
        const uploadPromises = Object.values(files).flat().map((file) => {
            const currentFile = file as File;
            const fileStream = fs.createReadStream(currentFile.filepath);

            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME as string,
                Key: `uploads/${guid}/${currentFile.originalFilename}`, // Use the GUID in the S3 path
                Body: fileStream,
                ContentType: currentFile.mimetype || 'application/octet-stream',
            };

            return s3.upload(uploadParams).promise();
        });

        await Promise.all(uploadPromises);
        return NextResponse.json({ message: `Files uploaded successfully to folder: uploads/${guid}` });
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
        })) || [];

        return NextResponse.json({ files });
    } catch (error) {
        console.error('Error retrieving files:', error);
        return NextResponse.json({ error: 'Error retrieving files' }, { status: 500 });
    }
}
