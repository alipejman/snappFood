import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostMenuDto } from '../dto/post-menu.dto';
import { UpdateMenuDto } from '../dto/update-menu.dto';
import { MenuService } from '../service/menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() postMenuDto: PostMenuDto) {
    return this.menuService.create(postMenuDto);
  }

  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
