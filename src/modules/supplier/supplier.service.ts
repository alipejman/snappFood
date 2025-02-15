import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { supplierOtpEntity } from "./entities/supplier-otp.entity";
import { Repository } from "typeorm";
import { SupplierEntity } from "./entities/supplier.entity";
import { supplierSignUpDto, supplimantryInformationDto } from "./dto/supplier.dto";
import {
  AuthMessage,
  OtpMessage,
  SupplierMessage,
} from "src/common/enums/message.enum";
import { CategoryService } from "../category/category.service";
import { randomInt } from "crypto";
import { CheckOtpDto, SendOtpDto } from "../auth/dto/otp.dto";
import { first, NotFoundError } from "rxjs";
import { PayloadType } from "../auth/types/payload";
import { JwtService } from "@nestjs/jwt";
import { documentType } from "./types/documentFile.type";
import { Request } from "express";
import { REQUEST } from "@nestjs/core";
import { supplierStatus } from "src/common/enums/supplier.enum";
import { MulterField } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { Type } from "@aws-sdk/client-s3";
import { request } from "http";
import { s3Service } from "../s3/s3.service";

@Injectable({scope: Scope.REQUEST})
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private supplierRepository: Repository<SupplierEntity>,
    @InjectRepository(supplierOtpEntity)
    private supplierOtpRepository: Repository<supplierOtpEntity>,
    private categoryService: CategoryService,
    private JwtService: JwtService,
    @Inject(REQUEST) private req: Request,
    private s3Service: s3Service,
  ) {}

  async signUp(supplierSignUpDto: supplierSignUpDto) {
    const {
      categoryId,
      city,
      invite_code,
      manager_family,
      manager_name,
      store_name,
      phone,
    } = supplierSignUpDto;
    const supplier = await this.supplierRepository.findOneBy({ phone });
    if (supplier) throw new ConflictException(SupplierMessage.AlredyExist);
    const category = await this.categoryService.findOneById(categoryId);
    let agent: SupplierEntity = null;
    if (invite_code) {
      agent = await this.supplierRepository.findOneBy({ invite_code });
    }
    const mobileNumber = parseInt(phone);
    const account = this.supplierRepository.create({
      manager_name,
      manager_family,
      phone,
      categoryId: category.id,
      city,
      store_name,
      agentId: agent?.id ?? null,
      invite_code: mobileNumber.toString(32).toUpperCase(),
    });
    await this.supplierRepository.save(account);
    await this.createOtpForSupplier(account);
    return {
      message: OtpMessage.Send,
    };
  }

  async sendOtp(otpDto: SendOtpDto) {
    const { mobile } = otpDto;
    let supplier = await this.supplierRepository.findOneBy({ phone: mobile });
    if (!supplier) {
      throw new NotFoundException(SupplierMessage.NotFound);
    }
    await this.createOtpForSupplier(supplier);
    return {
      message: OtpMessage.Send,
    };
  }

  async createOtpForSupplier(supplier: SupplierEntity) {
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    const code = randomInt(10000, 99999).toString();
    let otp = await this.supplierOtpRepository.findOneBy({
      supplierId: supplier.id,
    });
    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException("otp code not expired");
      }
      otp.code = code;
      otp.expires_in = expiresIn;
    } else {
      otp = this.supplierOtpRepository.create({
        code,
        expires_in: expiresIn,
        supplierId: supplier.id,
      });
    }
    otp = await this.supplierOtpRepository.save(otp);
    supplier.otpId = otp.id;
    await this.supplierRepository.save(supplier);
  }

  async checkOtp(checkOtp: CheckOtpDto) {
    const { code, mobile } = checkOtp;
    const now = new Date();
    const supplier = await this.supplierRepository.findOne({
      where: { phone: mobile },
      relations: {
        otp: true,
      },
    });
    const otp = supplier?.otp;
    if (!supplier || !supplier?.otp)
      throw new NotFoundException(SupplierMessage.NotFound);
    if (otp?.code !== code)
      throw new UnauthorizedException(AuthMessage.IncorrectCode);
    if (otp?.expires_in < now)
      throw new UnauthorizedException(AuthMessage.ExpiredCode);
    if (!supplier.mobile_verify)
      await this.supplierRepository.update(
        { id: supplier.id },
        { mobile_verify: true }
      );
    const { accessToken, refreshToken } = this.makeTokens({
      id: supplier.id,
    });

    return {
      accessToken,
      refreshToken,
      message: AuthMessage.LoggedIn,
    };
  }

  makeTokens(payload: PayloadType) {
    const accessToken = this.JwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: "30d",
    });
    const refreshToken = this.JwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: "30d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }


  async saveSupplementaryInformation(infoDto: supplimantryInformationDto) {
    const {id} = this.req.user;
    const {email, national_code} = infoDto;
    let supplier = await this.supplierRepository.findOneBy({national_code});
    if(supplier && supplier.id !== id) {
      throw new ConflictException(SupplierMessage.NationalCodeUsed)
    }
    supplier = await this.supplierRepository.findOneBy({email});
    if(supplier && supplier.id !== id) {
      throw new ConflictException(SupplierMessage.EmailUsed);
    }
    await this.supplierRepository.update(
      {id},
      {
        national_code,
        email,
        status: supplierStatus.supplementryInformation
      }
    );
    return {
      message: SupplierMessage.Update
    }
  }


  async ValidateAccessToken(token : string) {
    try {
      const payload = await this.JwtService.verify<PayloadType>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET
      })
      if(typeof payload === "object" && payload?.id) {
        const supplier = await this.supplierRepository.findOneBy({id: payload.id});
        if(!supplier) {
          throw new UnauthorizedException(AuthMessage.LoggedInRequired)
        }
        return {
          id: supplier.id,
          first_name: supplier.manager_name,
          last_name: supplier.manager_family,
          mobile: supplier.phone
        }
      }
    } catch (error) {
      throw new UnauthorizedException(AuthMessage.LoggedInRequired)
    }
  }
 



  async uploadDocs(files: documentType) {
    const {id} = this.req.user;
    const {image, acceptedDoc} = files;
    const supplier = await this.supplierRepository.findOneBy({id});
    const imageResult = await this.s3Service.UploadFile(image[0], "image");
    const docResult = await this.s3Service.UploadFile(acceptedDoc[0], "acceptedDoc");
    if(imageResult) supplier.image = imageResult.Location;
    if(docResult) supplier.document = docResult.Location;
    supplier.status = supplierStatus.UploadedDocument;
    await this.supplierRepository.save(supplier);
    return {
      message: SupplierMessage.Uploaded
    } 
  }
}
