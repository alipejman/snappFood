import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { PostTypeDto } from "../dto/post-type.dto";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { typeEntity } from "../entities/type.entity";
import { Repository } from "typeorm";
import { TypeMessage } from "src/common/enums/message.enum";
import { UpdateTypeDto } from "../dto/update-menu.dto";

@Injectable({scope: Scope.REQUEST})
export class typeService {
    constructor(
        @InjectRepository(typeEntity) private typeRepository: Repository<typeEntity>,
        @Inject(REQUEST) private req:Request,
    ) {}


    async postType(postTypeDto: PostTypeDto) {
        const {id} = this.req.user;
        const {priority, title} = postTypeDto;
        const type = await this.typeRepository.create({
            title: postTypeDto.title,
            priority: postTypeDto.priority,
            supplierId: id,
        });
        await this.typeRepository.save(type);
        return {
            message: TypeMessage.Post
        }
    }


    async findAll() {
        const {id} = this.req.user;
        return this.typeRepository.find({
            where: {supplierId: id},
            order: {id: "DESC"}
        })
    }

    async findOneById(id: number) {
        const {id: supplierId} = this.req.user;
        const type = await this.typeRepository.findOneBy({id, supplierId});
        if(!type) throw new NotFoundException(TypeMessage.NotFound);
        return type;
    }

    async remove(id: number) {
        const type = this.findOneById(id);
        await this.typeRepository.delete({id});
        return {
            message: TypeMessage.Delete
        }
    }

    async update(id: number, updateTypeDto: UpdateTypeDto) {
        const type = await this.findOneById(id);
        const {priority, title} = updateTypeDto;
        if(title) type.title = title;
        if(priority) type.priority = priority;
        await this.typeRepository.save(type);
        return {
            message: TypeMessage.Updated
        }
    }
}