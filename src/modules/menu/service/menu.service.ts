import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { PostFoodDto, UpdateFoodDto } from '../dto/post-food.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuEntity } from '../entities/menu.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { typeService } from './type.service';
import { s3Service } from 'src/modules/s3/s3.service';
import { MenuMessage } from 'src/common/enums/message.enum';
import { NotFound } from '@aws-sdk/client-s3';
import { NotFoundError } from 'rxjs';
import { typeEntity } from '../entities/type.entity';

@Injectable({scope: Scope.REQUEST})
export class MenuService {
  constructor(
    @Inject(REQUEST) private req: Request,
    @InjectRepository(MenuEntity) private menuRepository: Repository<MenuEntity>,
    @InjectRepository(typeEntity) private typeRepositort: Repository<typeEntity>,
    private typeservice: typeService,
    private s3Service: s3Service,
  ) {}


  async create(postFoodDto: PostFoodDto, Image: Express.Multer.File) {
    const {id: supplierId} = this.req.user;
    const {name, price, typeId, description, discount} = postFoodDto;
    const type = await this.typeservice.findOneById(typeId);
    const {Location, key} = await this.s3Service.UploadFile(Image, "menu-item");
    const item = await this.menuRepository.create({
      name,
      price,
      supplierId,
      typeId: type.id,
      description,
      discount,
      image: Location,
      key: key,
    });
    await this.menuRepository.save(item);
    return {
      message: MenuMessage.created
    }
  }

   findAll(supplierId: number) {
    return this.typeRepositort.find({
      where: {supplierId},
      relations: {
        items: true,
      }
    });
  }

  async findOneById(id: number) {
    const food = await this.menuRepository.findOneBy({id});
    if(!food) throw new NotFoundException(MenuMessage.NotFound);
    return food;
  }

  async update(id: number, updateFoodDto: UpdateFoodDto, image: Express.Multer.File) {
    const {id: supplierId} = this.req.user;
    const food = await this.findOneById(id);
    if(food.supplierId !== supplierId) {
      throw new NotFoundException(MenuMessage.NotFound);
    }
    const {description, discount, name, price, typeId} = updateFoodDto;
    if(description) food.description = description;
    if(discount) food.discount = discount;
    if(name) food.name = name;
    if(price) food.price = price;
    if(typeId) food.typeId = typeId
    if(image) {
      const {Location, key} = await this.s3Service.UploadFile(image, "menu-item");
      food.image = Location;
      food.key = key
    }
    await this.menuRepository.save(food);
    return {
      message: MenuMessage.Updated
    }
  }

  async remove(id: number) {
    const food = await this.findOneById(id);
    await this.menuRepository.delete({id});
    return {
      message: MenuMessage.Deleted
    }
  }
}
