import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { SupplierAuth } from "src/common/decorators/auth.decorator";
import { FormType } from "src/common/enums/form-types.enum";
import { typeService } from "../service/type.service";
import { PostTypeDto, UpdateTypeDto } from "../dto/post-type.dto";

@Controller('type')
@ApiTags('Type')
@SupplierAuth()

export class typeController {
    constructor(
        private typeService: typeService,
        
    ) {}

    @Post('/create-type')
    @ApiConsumes(FormType.Urlencoded, FormType.Json)
    postType(@Body() postTypeDto: PostTypeDto) {
        return this.typeService.postType(postTypeDto);
    }

    @Get()
    findAll() {
        return this.typeService.findAll();
    }

    @Get(":id")
    findOneById(@Param("id", ParseIntPipe) id: number) {
        return this.typeService.findOneById(id)
    }

    @Delete("/:id")
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.typeService.remove(id);
    }

    @Put('/:id')
    @ApiConsumes(FormType.Urlencoded, FormType.Json)
    update(@Param("id", ParseIntPipe) id: number, @Body() updateTypeDto: UpdateTypeDto) {
        return this.typeService.update(id, updateTypeDto);
    }

}