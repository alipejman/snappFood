import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { CategoryModule } from '../category/category.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig()),
    CategoryModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
