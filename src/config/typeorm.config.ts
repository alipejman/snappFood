import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { config } from "dotenv";
import { join } from "path";
config();
config({
    path: join(process.cwd(),`.env.${process.env.NODE_ENV}`)
})


export function typeOrmConfig() : TypeOrmModuleOptions {
    const {DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER} = process.env;
    return {
        type: "mysql",
        host: DB_HOST,
        port: +DB_PORT,
        username: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        autoLoadEntities: true,
        synchronize: true,
        entities: [
            "dist/**/**/**/*.entity{.ts, .js}",
            "dist/**/**/*.entity{.ts, .js}",
        ]
    }
}