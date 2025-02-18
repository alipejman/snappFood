import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discount.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DiscountService {
constructor(
  @InjectRepository(DiscountEntity) private discountRepository: Repository<DiscountEntity>,
) {}

async findOneByCode(code:string) {
  const discount = await this.discountRepository.findOneBy({code: code});
  if(!discount) throw new NotFoundException("Discount Code Is Not Working.")
    return discount;
}
}
