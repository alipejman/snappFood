import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discount.entity';
import { DeepPartial, Repository } from 'typeorm';
import { DiscountDto } from './dto/discount.dto';

@Injectable()
export class DiscountService {
constructor(
  @InjectRepository(DiscountEntity) private discountRepository: Repository<DiscountEntity>,
) {}


async create(discountDto: DiscountDto) {
  const {amount, code, expires_in, limit, percent} = discountDto;
  await this.checkExistCode(code);
  const discountObject: DeepPartial<DiscountEntity> = {code};
  if((!amount && !percent) || (amount && percent)) {
    throw new BadRequestException('you must enter one of amount or percent field')
  }
  if(amount && !isNaN(parseFloat(amount.toString()))) {
    discountObject["amount"] = amount;
  } else if(percent && !isNaN(parseFloat(percent.toString()))) {
    discountObject["percent"] = percent;
  }

  if(expires_in && !isNaN(parseInt(expires_in.toString()))) {
    const time = 1000 * 60 * 60 * 24 * expires_in;
    discountObject["expires_in"] = new Date(new Date().getTime() + time);
  }

  if(limit && !isNaN(parseInt(limit.toString()))) {
    discountObject["limit"] = limit;
  }

  const discount = await this.discountRepository.create(discountObject);
  await this.discountRepository.save(discount);
  return {
    message: "discount code Created ✅"
  }
}

async checkExistCode(code: string) {
  const discount = await this.discountRepository.findOne({
    where: {
      code
    }
  })
  if (discount) throw new ConflictException("already exist code");
  return discount;
}


findAll() {
  return this.discountRepository.find({});
}

async delete(id: number) {
  const discount = await this.discountRepository.findOneBy({id})
  if(!discount) {
    throw new NotFoundException("discount code not found")
  }
  await this.discountRepository.delete({id});
  return {
    message: "discount code deleted successfully"
  }
}

async findOneByCode(code:string) {
  const discount = await this.discountRepository.findOneBy({code: code});
  if(!discount) throw new NotFoundException("Discount Code Is Not Working.")
    return discount;
}
}
