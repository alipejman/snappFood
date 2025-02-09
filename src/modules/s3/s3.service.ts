import { Injectable } from "@nestjs/common";
import { S3 } from "@aws-sdk/client-s3";
import { extname } from "path";

@Injectable()
export class s3Service {
    private readonly s3: S3;
    constructor() {
        this.s3 = new S3({
            region: process.env.S3_REGION, // منطقه صحیح را وارد کنید
            endpoint: process.env.S3_ENDPOINT, // اضافه کردن endpoint
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            },
        });
    }

    async UploadFile(file: Express.Multer.File, bucket: string) {
        const ext = extname(file.originalname);
        const key = `${bucket}/${Date.now()}${ext}`;

        await this.s3.putObject({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
        });

        // ساخت URL فایل بارگذاری شده
        const url = `https://${process.env.S3_ENDPOINT}/${key}`; // استفاده از endpoint شما

        return { Location: url, key: key }; // برگرداندن URL
    }

    async DeleteFile(key: string) {
        return this.s3.deleteObject({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: decodeURI(key)
        });
    }
}
