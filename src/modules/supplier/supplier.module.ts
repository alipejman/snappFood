import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { supplierOtpEntity } from './entities/supplier-otp.entity';
import { SupplierEntity } from './entities/supplier.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { CategoryService } from '../category/category.service';
import { s3Service } from '../s3/s3.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([supplierOtpEntity, SupplierEntity, CategoryEntity])],
  controllers: [SupplierController],
  providers: [SupplierService, CategoryService, s3Service, JwtService],
  exports:[SupplierService, TypeOrmModule, s3Service, JwtService]
})
export class SupplierModule {}
