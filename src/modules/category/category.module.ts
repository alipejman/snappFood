import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { categoryEntity } from './entities/category.entity';
import { s3Service } from '../s3/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([categoryEntity])],
  controllers: [CategoryController],
  providers: [CategoryService, s3Service],
})
export class CategoryModule {}
