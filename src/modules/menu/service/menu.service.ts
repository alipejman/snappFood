import { Inject, Injectable, Scope } from '@nestjs/common';
import { PostFoodDto, UpdateFoodDto } from '../dto/post-food.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuEntity } from '../entities/menu.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { typeService } from './type.service';
import { s3Service } from 'src/modules/s3/s3.service';
import { MenuMessage } from 'src/common/enums/message.enum';

@Injectable({scope: Scope.REQUEST})
export class MenuService {
  constructor(
    @Inject(REQUEST) private req: Request,
    @InjectRepository(MenuEntity) private menuRepository: Repository<MenuEntity>,
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

  findAll() {
    return `This action returns all menu`;
  }

  findOneById(id: number) {
    return `This action returns a #${id} menu`;
  }

  update(id: number, updateMenuDto: UpdateFoodDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
