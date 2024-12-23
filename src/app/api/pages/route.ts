// pages/api/getImageUrls.js
import AWS from 'aws-sdk';
import {NextRequest, NextResponse} from "next/server";

const s3 = new AWS.S3();


export function getSignedURL(bucketName: string, key: string) {
    return s3.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: key,
        Expires: 3600, // URLs expire in 1 hour
    });
}

export async function getSignedURLs(objs: { bucket: string, key: string }[]) {
    return Promise.all(objs.map(async obj => {
        return {
            bucket: obj.bucket,
            key: obj.key,
            url: await getSignedURL(obj.bucket, obj.key)
        }
    }));
}


export async function getThumbnailUrls(caseGuid: string, uploadGuid: string) {
    const bucketName = process.env.S3_BUCKET_NAME || null;
    if (!bucketName) {
        return NextResponse.json({ status: 500, body: { message: 'S3 bucket name is required' } });
    }

    const prefix = `uploads/${caseGuid}/${uploadGuid}/thumbnails`;

    try {
        // List all files under the document's folder
        const data = await s3
            .listObjectsV2({ Bucket: bucketName, Prefix: prefix })
            .promise();
        if (!data.Contents) {
            return NextResponse.json({ status: 404, body: { message: 'No images found' } });
        }
        const imageUrls = data.Contents.map((item) =>   {
            return {
                bucket: bucketName,
                key: item.Key,
                url : s3.getSignedUrl('getObject', {
                    Bucket: bucketName,
                    Key: item.Key,
                    Expires: 3600, // URLs expire in 1 hour
                })
            }}
        );
        return NextResponse.json({ imageUrls });
    } catch (error) {
        console.error('Error fetching images:', error);
        return NextResponse.json({ status: 500, body: { message: 'Failed to fetch images' } });
    }
}



export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    if (!searchParams.has('caseGuid')) {
        return NextResponse.json({ status: 400, body: { message: 'caseGuid is required' } });
    }

    if (!searchParams.has("uploadGuid")) {
        return NextResponse.json({ status: 400, body: { message: 'uploadGuid is required' } });
    }

    const bucketName = process.env.S3_BUCKET_NAME || null;
    if (!bucketName) {
        return NextResponse.json({ status: 500, body: { message: 'S3 bucket name is required' } });
    }

    const caseGuid = searchParams.get('caseGuid');
    const uploadGuid = searchParams.get('uploadGuid');


    return getThumbnailUrls(caseGuid, uploadGuid);
    // const prefix = `uploads/${caseGuid}/${uploadGuid}/thumbnails`;
    //
    // try {
    //     // List all files under the document's folder
    //     const data = await s3
    //         .listObjectsV2({ Bucket: bucketName, Prefix: prefix })
    //         .promise();
    //     if (!data.Contents) {
    //         return NextResponse.json({ status: 404, body: { message: 'No images found' } });
    //     }
    //     const imageUrls = data.Contents.map((item) =>   {
    //         return {
    //             bucket: bucketName,
    //             key: item.Key,
    //             url : s3.getSignedUrl('getObject', {
    //                 Bucket: bucketName,
    //                 Key: item.Key,
    //                 Expires: 3600, // URLs expire in 1 hour
    //             })
    //         }}
    //     );
    //     return NextResponse.json({ imageUrls });
    // } catch (error) {
    //     console.error('Error fetching images:', error);
    //     return NextResponse.json({ status: 500, body: { message: 'Failed to fetch images' } });
    // }
}