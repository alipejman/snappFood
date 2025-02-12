import { Body, Controller, Post } from "@nestjs/common";
import { SupplierService } from "./supplier.service";
import { supplierSignUpDto } from "./dto/supplier.dto";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FormType } from "src/common/enums/form-types.enum";
import { CheckOtpDto, SendOtpDto } from "../auth/dto/otp.dto";

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


}
