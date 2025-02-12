import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { supplierOtpEntity } from './entities/supplier-otp.entity';
import { Repository } from 'typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { supplierSignUpDto } from './dto/supplier.dto';
import { SupplierMessage } from 'src/common/enums/message.enum';
import { CategoryService } from '../category/category.service';
import { randomInt } from 'crypto';

@Injectable()
export class SupplierService {
    constructor(
        @InjectRepository(SupplierEntity) private supplierRepository: Repository<SupplierEntity>,
        @InjectRepository(supplierOtpEntity) private supplierOtpRepository: Repository<supplierOtpEntity>,
        private categoryService: CategoryService,
    ) {}

    async signUp(supplierSignUpDto: supplierSignUpDto) {
        const {categoryId, city, invite_code, manager_family, manager_name, store_name, phone} = supplierSignUpDto;
        const supplier = await this.supplierRepository.findOneBy({phone});
        if(supplier) throw new ConflictException(SupplierMessage.AlredyExist);
        const category = await this.categoryService.findOneById(categoryId);
        let agent: SupplierEntity = null;
        if(invite_code) {
            agent = await this.supplierRepository.findOneBy({invite_code})
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
            invite_code: mobileNumber.toString(32).toUpperCase()
        })
        await this.supplierRepository.save(account);
        await this.createOtpForSupplier(account);
        return {
            message: "کد یکبار مصرف ارسال شد ✅"
        }

    }


    async createOtpForSupplier(supplier: SupplierEntity) {
        const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
        const code = randomInt(10000, 99999).toString();
        let otp = await this.supplierOtpRepository.findOneBy({
          supplierId: supplier.id
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
}
