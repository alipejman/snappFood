import {UseGuards, applyDecorators} from "@nestjs/common";
import {ApiBearerAuth} from "@nestjs/swagger";
import {AuthGuard} from "src/modules/auth/guards/auth.guard";

export function UserAuth() {
  return applyDecorators(ApiBearerAuth("Authorization"), UseGuards(AuthGuard));
}