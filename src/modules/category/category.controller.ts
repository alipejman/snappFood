import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
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
import { UpdateCategoryDto } from "./dto/update-category.dto";

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

  @Patch(":id")
  @UseInterceptors(UploadFileS3("image"))
  @ApiConsumes(FormType.Multipart)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({maxSize: 10 * 1024 * 1024}),
          new FileTypeValidator({fileType: "image/(jpg|png|webp|jpeg)"})
        ]
      })
    )
    Image: Express.Multer.File
  ) {
    return this.categoryService.update(id, updateCategoryDto, Image)
  }

  @Delete("/:id")
  @ApiConsumes(FormType.Urlencoded)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.remove(id)
  }
}
