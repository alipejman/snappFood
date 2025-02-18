import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FormType } from 'src/common/enums/form-types.enum';
import { DiscountDto } from './dto/discount.dto';


@Controller('discount')
@ApiTags("Discount")

export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  create(@Body() discountDto: DiscountDto) {
    return this.discountService.create(discountDto);
  }
  @Get()
  findAll() {
    return this.discountService.findAll();
  }
  @Delete("/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.discountService.delete(id);
  }

  
}
