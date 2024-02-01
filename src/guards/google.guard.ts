import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest() as Request;
    const isActivate = (await super.canActivate(context)) as boolean;
    await super.logIn(req);
    return isActivate;
  }
}
