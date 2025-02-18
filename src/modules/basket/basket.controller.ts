import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BasketService } from './basket.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserAuth } from 'src/common/decorators/auth.decorator';
import { FormType } from 'src/common/enums/form-types.enum';
import { BasketDto } from './dto/basket.dto';

@Controller('basket')
@ApiTags("Basket")
@UserAuth()
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post()
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  addToBasket(@Body() basketDto: BasketDto) {
    return this.basketService.addToBasket(basketDto);
  }

  @Get()
  getBasket() {
    return this.basketService.getBasket();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.basketService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBasketDto:any) {
    return this.basketService.update(+id, updateBasketDto);
  }

  @Delete()
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  removeFromBasket(@Body() basketDto: BasketDto) {
    return this.basketService.removeFromBasket(basketDto);
  }
}
