import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { categoryEntity } from "./entities/category.entity";
import { DeepPartial, Repository } from "typeorm";
import { s3Service } from "../s3/s3.service";
import { CategoryMessage } from "src/common/enums/message.enum";
import { isBoolean } from "class-validator";
import { toBoolean } from "src/common/utilities/functions.utils";
import { paginationDto } from "src/common/dto/pagination.dto";
import {
  paginationGenerator,
  paginationSolver,
} from "src/common/utilities/pagination.utils";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(categoryEntity)
    private categoryRepository: Repository<categoryEntity>,
    private S3service: s3Service
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    image: Express.Multer.File
  ) {
    const { Location, key } = await this.S3service.UploadFile(
      image,
      "snapp-food-image"
    );
    let { title, slug, show, parentId } = createCategoryDto;
    const category = await this.findOneBySlug(slug);
    if (category) throw new ConflictException(CategoryMessage.AlreadyExist);
    if (isBoolean(show)) {
      show = toBoolean(show);
    }
    let parent: categoryEntity = null;
    if (parentId && !isNaN(parentId)) {
      parent = await this.findOneById(+parentId);
    }
    await this.categoryRepository.insert({
      title,
      slug,
      image: Location,
      imageKey: key,
      show: true,
    });
    return {
      message: "category created successfully ... ",
    };
  }

  async findOneById(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException(CategoryMessage.NotFound);
    return category;
  }

  async findOneBySlug(slug: string) {
    return this.categoryRepository.findOneBy({ slug });
  }

  async findAll(paginationDto: paginationDto) {
    const { limit, page, skip } = paginationSolver(
      paginationDto.page,
      paginationDto.limit
    );
    const [categories, count] = await this.categoryRepository.findAndCount({
      where: {},
      relations: {
        parent: true,
      },
      select: {
        parent: {
          title: true,
        },
      },
      skip,
      take: limit,
      order: { id: "DESC" },
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      categories,
    };
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    image: Express.Multer.File
  ) {
    const { parentId, show, slug, title } = updateCategoryDto;
    const category = await this.findOneById(id);
    const updateObject: DeepPartial<categoryEntity> = {};
    if (image) {
      const { Location, key } = await this.S3service.UploadFile(
        image,
        "snapp-food-image"
      );
      if (Location) {
        updateObject["image"] = Location;
        updateObject["imageKey"] = key;
    }
    if (category?.imageKey)
      await this.S3service.DeleteFile(category?.imageKey);
    }
    if (title) updateObject["title"] = title;
    if (show && isBoolean(show)) updateObject["show"] = toBoolean(show);
    if (parentId && !isNaN(parseInt(parentId.toString()))) {
      const category = await this.findOneById(+parentId);
      if (!category) throw new NotFoundException(CategoryMessage.NotFound);
      updateObject["parentId"] = category.id;
    }
    if (slug) {
      const category = await this.categoryRepository.findOneBy({ slug });
      if (category && category.id !== id) {
        throw new ConflictException(CategoryMessage.AlreadyExist);
      }
      updateObject["slug"] = slug;
    }
    await this.categoryRepository.update({ id }, updateObject);
    return {
      message: "Category SuccessFully Updated ✅",
    };
  }

  async remove(id: number) {
    const category = await this.findOneById(id);
    await this.categoryRepository.delete({id})
    return CategoryMessage.Deleted;
  }


  async findBySlug(slug: string) {
    const category = await this.categoryRepository.findOne({
        where: {slug},
        relations: {
            children: true
        }
    })
    if(!category) throw new NotFoundException(CategoryMessage.NotFound)
        return {
            category
        }
  }
}
