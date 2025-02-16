import { PartialType } from '@nestjs/swagger';
import { PostMenuDto } from './post-menu.dto';

export class UpdateMenuDto extends PartialType(PostMenuDto) {}
