import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { BasketDto, discountBasketDto } from "./dto/basket.dto";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { MenuEntity } from "../menu/entities/menu.entity";
import { IsNull, Not, Repository } from "typeorm";
import { BasketMessage } from "src/common/enums/message.enum";
import { BasketEntity } from "./entities/basket.entity";
import { DiscountService } from "../discount/discount.service";

@Injectable({ scope: Scope.REQUEST })
export class BasketService {
  constructor(
    @Inject(REQUEST) private req: Request,
    @InjectRepository(MenuEntity)
    private foodRepository: Repository<MenuEntity>,
    @InjectRepository(BasketEntity)
    private basketRepository: Repository<BasketEntity>,
    private discountService: DiscountService,
  ) {}

  async addToBasket(basketDto: BasketDto) {
    const { id: userId } = this.req.user;
    const { foodId } = basketDto;
    const food = await this.getOne(foodId);

    const basketItem = await this.basketRepository.findOne({
      where: {
        userId,
        foodId,
      },
    });

    if (basketItem) {
      basketItem.count += 1;
      await this.basketRepository.save(basketItem);
    } else {
      const newBasketItem = this.basketRepository.create({
        userId,
        foodId,
        count: 1,
      });
      await this.basketRepository.save(newBasketItem);
    }

    return {
      message: BasketMessage.Added,
    };
  }

  async removeFromBasket(basketDto: BasketDto) {
    const {id: userId} = this.req.user;
    const { foodId } = basketDto;
    const food = await this.getOne(foodId);
    let basketItem = await this.basketRepository.findOne({
      where: {
        userId,
        foodId
      }
    });
    if(basketItem) {
      if(basketItem.count <= 1) {
        await this.basketRepository.delete({id: basketItem.id})
      } else {
        basketItem.count -= 1
        await this.basketRepository.save(basketItem)
      }
      return {
        message: BasketMessage.Deleted
      }
    }
  }

  async getOne(id: number) {
    const item = await this.foodRepository.findOne({
      where: { id },
    });
    if (!item) throw new NotFoundException(BasketMessage.NotFound);
    return item;
  }

  async getBasket() {
    const {id: userId} = this.req.user;
    const basketItem = await this.basketRepository.find({
      relations: {
        discount: true,
        food: {
          supplier: true
        }
      },
      where: {
        userId,
      }
    });

    const foods = basketItem.filter((item) => item.foodId);
    const supplierDiscounts = basketItem.filter((item) => item?.discount?.supplierId);
    const generalDiscounts = basketItem.find((item) => item?.discount?.id && !item?.discount?.supplierId);


    if (foods.length === 0) {
      return {
          message: "سبد خرید شما خالی است."
      };
  }

    let total_amount= 0;
    let payment_amount =0;
    let total_discount_amount= 0;
    let foodList = [];



    for (const item of foods) {
      let discount_amount = 0;
      let discountCode:string = null;
      const {food, count}= item;
      total_amount += food.price * count;
      const supplierId = food.supplierId;
      let foodPrice = food.price * count;
      if(food.is_active && food.discount > 0) {
        discount_amount += food.price * (food.discount / 100),
        foodPrice = foodPrice - foodPrice * (food.discount / 100)
      }
      const discountItem = supplierDiscounts.find(
        ({discount}) => discount.supplierId === supplierId
      );
      if(discountItem) {
        const {discount: {amount, limit, active, code, percent, usage}} = discountItem;
        if(active) {
          if(!limit || (limit && limit > usage)) {
            discountCode = code;
            if(percent && percent > 0) {
              discount_amount += foodPrice * (percent / 100);
              foodPrice = foodPrice - foodPrice * (percent / 100);
            } else if(amount && amount > 0) {
              discount_amount += amount ;
              foodPrice = amount > foodPrice ? 0 : foodPrice - amount;
            }
          }
        }
      }

      payment_amount += foodPrice;
      total_discount_amount += discount_amount;
      foodList.push({
        foodId: food.id,
        name: food.name,
        description: food.description,
        count,
        image: food.image,
        price: food.price,
        total_amount: food.price * count,
        discountCode,
        supplierId,
        suppliername: food?.supplier?.manager_name,
        supplierImage: food?.supplier?.image,
      })

      let generalDiscountDetail= {};
      if(generalDiscounts?.discount?.active){
        const {discount} = generalDiscounts;
        if(discount?.limit && discount.limit > discount.usage) {
          let discount_amount = 0;
          if(discount.percent > 0) {
            discount_amount = payment_amount * (discount.percent / 100);
          } else if (discount.amount > 0) {
            discount_amount = discount.amount
          }
          payment_amount = discount_amount > payment_amount ? 0 : payment_amount - discount_amount;
          total_discount_amount += discount_amount;
          generalDiscountDetail = {
            code: discount.code,
            percent: discount.percent,
            amount: discount.amount,
            discount_amount,
          }
        }
      }
      return {
        total_amount,
        total_discount_amount,
        foodList,
        payment_amount,
        generalDiscountDetail
      }
    }
  }

  async addDiscount(discountDto: discountBasketDto) {
    const {id: userId} = this.req.user;
    const {code} = discountDto;

    const discount= await this.discountService.findOneByCode(code);
    if(!discount.active) {
      throw new BadRequestException("this discount code is not active")
    }
    if(discount.limit && discount.limit <= discount.usage) {
      throw new BadRequestException(
        "the capacity of this code is full"
      )
    }
    if(discount?.expires_in && discount?.expires_in?.getTime() <= new Date().getTime()) {
      throw new BadRequestException("this code is expired")
    }
    const userBasketDiscount = await this.basketRepository.findOneBy({
      discountId: discount.id,
      userId
    })
    if(userBasketDiscount) {
      throw new BadRequestException("code alredy used");
    }
    if(discount.supplierId) {
      const discountOfSupplier = await this.basketRepository.findOne({
        relations: {
          discount: true
        },
        where: {
          userId,
          discount: {
            supplierId: discount.supplierId
          }
        }
      })
      if(discountOfSupplier) {
        throw new BadRequestException("you cant not use several time of supplier discount")
      }
      const userBasket = await this.basketRepository.findOne({
        relations: {
          food: true
        },
        where: {
          userId,
          food: {
            supplierId: discount.supplierId
          }
        }
      });
      if(!userBasket) {
        throw new BadRequestException("you can not use this code in basket")
      }
    } else if(!discount.supplierId) {
      const generalDiscount = await this.basketRepository.findOne({
        relations: {
          discount: true
        },
        where: {
          userId,
          discount: {
            id: Not(IsNull()),
            supplierId: IsNull()
          }
        }
      });
      if(generalDiscount) {
        throw new BadRequestException("Already Used General discount")
      }
    }
    await this.basketRepository.insert({
      discountId: discount.id,
      userId
    })

    return {
      message : "you added discount code successfully"
    }

  }

 async removeDiscount(discountDto: discountBasketDto) {
  const {id: userId} = this.req.user;
  const {code} = discountDto;
  const discount = await this.discountService.findOneByCode(code);
  const basketDiscount = await this.basketRepository.findOne({
    where: {
      discountId: discount.id
    }
  });
  if(!basketDiscount) {
    throw new BadRequestException("not fount discount in basket")
  }
  await this.basketRepository.delete({
    discountId: discount.id, userId
  })
  return {
    message: "you delete discount code successfully"
  }
 }
}
