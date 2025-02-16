import { Injectable } from '@nestjs/common';
import { UpdateMenuDto } from '../dto/update-menu.dto';
import { PostMenuDto } from '../dto/post-menu.dto';

@Injectable()
export class MenuService {
  create(postMenuDto: PostMenuDto) {
    return 'This action adds a new menu';
  }

  findAll() {
    return `This action returns all menu`;
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
