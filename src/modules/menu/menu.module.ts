import { Module } from '@nestjs/common';
import { MenuController } from './controllers/menu.controller';
import { MenuService } from './service/menu.service';
import { typeService } from './service/type.service';
import { feedbackService } from './service/feedback.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeEntity } from './entities/type.entity';
import { MenuEntity } from './entities/menu.entity';
import { MenuFeedbackEntity } from './entities/feedback.entity';
import { typeController } from './controllers/type.controller';
import { feedbackController } from './controllers/feedback.controller';
import { JwtService } from '@nestjs/jwt';
import { SupplierModule } from '../supplier/supplier.module';

@Module({
  imports: [
    SupplierModule,
    TypeOrmModule.forFeature([typeEntity, MenuEntity, MenuFeedbackEntity])],
  controllers: [MenuController, typeController, feedbackController],
  providers: [MenuService, typeService, feedbackService],
  exports: [MenuService, typeService, feedbackService, TypeOrmModule]
})
export class MenuModule {}
