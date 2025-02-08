import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { categoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { s3Service } from '../s3/s3.service';
import { CategoryMessage } from 'src/common/enums/message.enum';
import { isBoolean } from 'class-validator';
import { toBoolean } from 'src/common/utilities/functions.utils';
import { paginationDto } from 'src/common/dto/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utilities/pagination.utils';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(categoryEntity) private categoryRepository: Repository<categoryEntity>,
        private S3service: s3Service
    ) {}

    async create(createCategoryDto: CreateCategoryDto, image: Express.Multer.File) {
        const {Location} = await this.S3service.UploadFile(
            image,
            "snapp-food-image"
        )
        let {title, slug, show, parentId} = createCategoryDto;
        const category = await this.findOneBySlug(slug);
        if(category) throw new ConflictException(CategoryMessage.AlreadyExist);
        if(isBoolean(show)) {
            show = toBoolean(show);
        }
        let parent : categoryEntity = null;
        if(parentId && !isNaN(parentId)) {
          parent =  await this.findOneById(+parentId)
        }
        await this.categoryRepository.insert({
            title,
            slug,
            image: Location,
            show: true
        })
        return {
            message: "category created successfully ... "
        }
    }

    async findOneById(id: number) {
        const category = await this.categoryRepository.findOneBy({id});
        if(!category) throw new NotFoundException(CategoryMessage.NotFound);
        return category;
    }

   async findOneBySlug(slug: string) {
    return this.categoryRepository.findOneBy({slug});
   }


   async findAll(paginationDto: paginationDto) {
    const {limit, page, skip} = paginationSolver(paginationDto.page, paginationDto.limit)
    const [categories, count] = await this.categoryRepository.findAndCount({
        where: {},
        relations: {
            parent: true
        },
        select: {
            parent: {
                title: true
            }
        },
        skip,
        take: limit,
        order: {id: "DESC"}
    })
    return{
        pagination: paginationGenerator(count, page, limit),
        categories
    }
   }
}
