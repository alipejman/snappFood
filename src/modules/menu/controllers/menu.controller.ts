import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseIntPipe,
} from "@nestjs/common";
import { PostFoodDto, UpdateFoodDto } from "../dto/post-food.dto";
import { MenuService } from "../service/menu.service";
import { SupplierAuth } from "src/common/decorators/auth.decorator";
import { UploadFileS3 } from "src/common/interceptors/upload-file.interceptor";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FormType } from "src/common/enums/form-types.enum";
import { SKipAuth } from "src/common/decorators/skip-auth.decorator";

@Controller("food")
@ApiTags("food")
@SupplierAuth()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @UseInterceptors(UploadFileS3("image"))
  @ApiConsumes(FormType.Multipart, FormType.Json)
  create(
    @Body() postFoodDto: PostFoodDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: "image/(jpg|png|webp|jpeg)" }),
        ],
      })
    )
    Image: Express.Multer.File
  ) {
    return this.menuService.create(postFoodDto, Image);
  }

  @Get("/all-food-by-id/:id")
  @SKipAuth()
  findAll(@Param("id", ParseIntPipe) id: number) {
    return this.menuService.findAll(id);
  }

  @Get(":id")
  findOneById(@Param("id") id: string) {
    return this.menuService.findOneById(+id);
  }

  @Patch(":id")
  @UseInterceptors(UploadFileS3("image"))
  @ApiConsumes(FormType.Multipart, FormType.Json)
  update(
    @Param("id") id: string,
    @Body() updateFoodDto: UpdateFoodDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: "image/(jpg|png|jpeg|webp)" }),
        ],
      })
    )
    Image: Express.Multer.File
  ) {
    return this.menuService.update(+id, updateFoodDto, Image);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.menuService.remove(+id);
  }
}
