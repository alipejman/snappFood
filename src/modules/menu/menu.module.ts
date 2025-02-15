import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './service/menu.service';

@Module({
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
