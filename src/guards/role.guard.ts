import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { MetaDataKey } from 'src/common';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const listRoles = this.reflector.get<string[]>(
      MetaDataKey.roles,
      context.getHandler(),
    );

    if (!listRoles) return true;

    const res = context.switchToHttp().getResponse() as Response;
    const role = res.locals.role;

    if (listRoles.includes(role)) return true;

    return false;
  }
}
