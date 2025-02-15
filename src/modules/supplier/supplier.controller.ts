import { Body, Controller, Get, Post, Put, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { SupplierService } from "./supplier.service";
import { supplierSignUpDto, supplimantryInformationDto, uploadDocsDto } from "./dto/supplier.dto";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FormType } from "src/common/enums/form-types.enum";
import { CheckOtpDto, SendOtpDto } from "../auth/dto/otp.dto";
import { json } from "stream/consumers";
import { response } from "express";
import { SupplierAuth } from "src/common/decorators/auth.decorator";
import { UploadFileFieldS3 } from "src/common/interceptors/upload-file.interceptor";

@Controller("supplier")
@ApiTags("Supplier")
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}
  

  @Post('/send-otp')
  @ApiConsumes(FormType.Urlencoded)
  sendOtp(@Body() otpDto: SendOtpDto) {
    return this.supplierService.sendOtp(otpDto)
  }


  @Post('/signUp')
  @ApiConsumes(FormType.Urlencoded)
  signUp(@Body() supplierSignUpDto: supplierSignUpDto) {
    return this.supplierService.signUp(supplierSignUpDto);
  }


  @Post("/check-otp")
  @ApiConsumes(FormType.Urlencoded)
  checkOtp(@Body() checkOtp: CheckOtpDto) {
    return this.supplierService.checkOtp(checkOtp);
  }

  @Post('/supplimantary-information')
  @ApiConsumes(FormType.Urlencoded)
  @SupplierAuth()
  supplimantryInformation(@Body() infoDto: supplimantryInformationDto) {
    return this.supplierService.saveSupplementaryInformation(infoDto);
  }

  @Put("/upload-document")
  @ApiConsumes(FormType.Multipart)
  @SupplierAuth()
  @UseInterceptors(
    UploadFileFieldS3([
      {name: "acceptedDoc", maxCount: 1},
      {name: "image", maxCount: 1}
    ])
  )
  uploadDocument(@Body() infoDto: uploadDocsDto, @UploadedFiles() files: any) {
    return this.supplierService.uploadDocs(files);
  }
}
