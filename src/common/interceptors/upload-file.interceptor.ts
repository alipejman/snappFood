import {
  FileFieldsInterceptor,
  FileInterceptor,
} from "@nestjs/platform-express";
import { MulterField } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { memoryStorage } from "multer";

export function UploadFileS3(filename: string) {
  return class UploadUtility extends FileInterceptor(filename, {
    storage: memoryStorage(),
  }) {};
}

export function UploadFileFieldS3(UploadedFiles: MulterField[]) {
  return class UploadUtility extends FileFieldsInterceptor(UploadedFiles, {
    storage: memoryStorage(),
  }) {};
}
