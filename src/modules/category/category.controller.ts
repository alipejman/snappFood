import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { UploadFileS3 } from "src/common/interceptors/upload-file.interceptor";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { FormType } from "src/common/enums/form-types.enum";
import { paginationDto } from "src/common/dto/pagination.dto";
import { pagination } from "src/common/decorators/pagination.decorator";

@Controller("category")
@ApiTags("Category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(UploadFileS3("image"))
  @ApiConsumes(FormType.Multipart)
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" }),
        ],
      })
    )
    image: Express.Multer.File,
  ) {
      return this.categoryService.create(createCategoryDto, image);
  }


  @Get()
  @pagination()
  findAll(@Query() paginationDto: paginationDto) {
    return this.categoryService.findAll(paginationDto)
  }
}
