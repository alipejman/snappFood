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
    }
}