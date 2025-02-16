import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller('feedback')
@ApiTags("feedback")

export class feedbackController {
    constructor() {}
    
}