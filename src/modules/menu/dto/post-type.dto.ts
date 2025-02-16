import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Length } from "class-validator";

export class PostTypeDto {
    @ApiProperty()
    @IsString()
    @Length(3, 30)
    title: string;
    @ApiProperty()
    @IsNumber()
    priority: number;
}