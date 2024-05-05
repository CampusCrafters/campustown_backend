import { PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
} as S3ClientConfig);

export const uploadImgToS3 = async (fileName: string, buffer: any, mimetype: any) => {
    const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: mimetype,
    };

    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3.send(uploadCommand);

    const imageUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURIComponent(
        fileName
    )}`;
    return imageUrl;
};
