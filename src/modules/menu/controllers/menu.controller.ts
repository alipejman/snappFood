import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { PostFoodDto, UpdateFoodDto } from '../dto/post-food.dto';
import { MenuService } from '../service/menu.service';
import { SupplierAuth } from 'src/common/decorators/auth.decorator';
import { UploadFileS3 } from 'src/common/interceptors/upload-file.interceptor';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FormType } from 'src/common/enums/form-types.enum';

@Controller('food')
@ApiTags("food")
@SupplierAuth()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @UseInterceptors(
    UploadFileS3("image")
  )
  @ApiConsumes(FormType.Multipart, FormType.Json)
  create(@Body() postFoodDto: PostFoodDto, @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({maxSize: 10 * 1024 * 1024}),
      new FileTypeValidator({fileType: "image/(jpg|png|webp|jpeg)"}),
      ]
    })
  )Image: Express.Multer.File) {
    return this.menuService.create(postFoodDto, Image);
  }

  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.menuService.findOneById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateFoodDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
