import { ApiPropertyOptional } from "@nestjs/swagger";

export class paginationDto {
    @ApiPropertyOptional({default: 1})
    page: number;
    @ApiPropertyOptional({default: 10})
    limit: number;
}