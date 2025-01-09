// pages/api/getImageUrls.js
import AWS from 'aws-sdk';
import {NextRequest, NextResponse} from "next/server";
import {getSignedURL, getThumbnailUrls} from "@/app/lib/pagesService";






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

    if (!caseGuid || !uploadGuid) {
        return NextResponse.json({ status: 400, body: { message: 'caseGuid and uploadGuid are required' } });
    }

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