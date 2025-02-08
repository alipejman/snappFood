namespace NodeJS {
    interface ProcessEnv {
        // application environment
        PORT: number;

        // database environment
        DB_HOST: string;
        DB_PORT: number;
        DB_USER: string;
        DB_PASS: string;
        DB_NAME: string;

        // s3 environment
        S3_ACCESS_KEY_ID: string;
        S3_SECRET_ACCESS_KEY: string;
        S3_ENDPOINT: string;
        S3_BUCKET_NAME: string;
        S3_REGION: string
    }
}