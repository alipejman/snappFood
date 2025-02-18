import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketEntity } from './entities/basket.entity';
import { MenuEntity } from '../menu/entities/menu.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([BasketEntity, MenuEntity])],
  controllers: [BasketController],
  providers: [BasketService],
})
export class BasketModule {}
