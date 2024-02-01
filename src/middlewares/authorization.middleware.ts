import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Response, Request } from 'express';
import { JwtPayload } from 'src/types';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return next(
        new HttpException(
          'Not available authorization',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    }

    const token = authorization.includes('Bearer')
      ? authorization.split(' ')[1]
      : authorization;

    try {
      const { authId, profileId, role } =
        await this.jwtService.verifyAsync<JwtPayload>(token, {
          secret: process.env.JWT_SECRET_KEY,
          // algorithms: ['HS256'],
        });

      res.locals.authId = authId;
      res.locals.profileId = profileId;
      res.locals.role = role;

      return next();
    } catch (error) {
      return next(new UnauthorizedException(error));
    }
  }
}
