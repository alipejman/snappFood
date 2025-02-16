import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { SupplierAuth } from "src/common/decorators/auth.decorator";
import { FormType } from "src/common/enums/form-types.enum";
import { typeService } from "../service/type.service";
import { PostTypeDto } from "../dto/post-type.dto";

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

}