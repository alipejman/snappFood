import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BasketService } from './basket.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserAuth } from 'src/common/decorators/auth.decorator';
import { FormType } from 'src/common/enums/form-types.enum';
import { BasketDto, discountBasketDto } from './dto/basket.dto';

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

  @Post('/discount')
  addDiscount(@Body() discountDto: discountBasketDto) {
    return this.basketService.addDiscount(discountDto);
  }

  @Delete("/discount")
  removeDiscount(@Body() discountDto: discountBasketDto) {
    return this.basketService.removeDiscount(discountDto);
  }

  @Delete()
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  removeFromBasket(@Body() basketDto: BasketDto) {
    return this.basketService.removeFromBasket(basketDto);
  }
}
