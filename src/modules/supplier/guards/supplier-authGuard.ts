import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { SupplierService } from "../supplier.service";
import { Reflector } from "@nestjs/core";
import { SKIP_AUTH } from "src/common/decorators/skip-auth.decorator";
import { Request } from "express";
import { AuthMessage } from "src/common/enums/message.enum";
import { isJWT } from "class-validator";

@Injectable()
export class SupplierAuthGuard implements CanActivate {
  constructor(
    private supplierService: SupplierService,
    private reflector: Reflector
  ) {}
  async canActivate(context: ExecutionContext) {
    const IsSkippedAuth = this.reflector.get<boolean>(
      SKIP_AUTH,
      context.getHandler()
    );
    if (IsSkippedAuth) return true;
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest<Request>();
    const token = this.extractToken(request);
    request.user = await this.supplierService.ValidateAccessToken(token);
    return true;
  }

  protected extractToken(request: Request) {
    const { authorization } = request.headers;
    if (!authorization || authorization?.trim() == "") {
      throw new UnauthorizedException(AuthMessage.LoggedInRequired);
    }
    const [bearer, token] = authorization?.split(" ");
    if (bearer?.toLocaleLowerCase() !== "bearer" || !token || !isJWT(token)) {
      throw new UnauthorizedException(AuthMessage.LoggedInRequired);
    }
    return token;
  }
}
