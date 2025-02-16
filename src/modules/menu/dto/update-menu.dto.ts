import { PartialType } from '@nestjs/swagger';
import { PostMenuDto } from './post-menu.dto';
import { PostTypeDto } from './post-type.dto';

export class UpdateMenuDto extends PartialType(PostMenuDto) {}


export class UpdateTypeDto extends PartialType(PostTypeDto) {}