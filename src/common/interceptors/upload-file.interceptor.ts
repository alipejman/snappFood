import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

export function UploadFileS3(filename: string) {
    return class UploadUtility extends FileInterceptor(filename, {
        storage: memoryStorage(),
    }) {};
}