import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { CategoryModule } from '../category/category.module';
import { AuthModule } from '../auth/auth.module';
import { SupplierModule } from '../supplier/supplier.module';
import { MenuModule } from '../menu/menu.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig()),
    CategoryModule,
    AuthModule,
    SupplierModule,
    MenuModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
