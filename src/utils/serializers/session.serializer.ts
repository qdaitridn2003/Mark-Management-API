/* eslint-disable @typescript-eslint/ban-types */
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportSerializer } from '@nestjs/passport';
import { MetaDataKey } from 'src/common';
import { AuthService } from 'src/container';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(MetaDataKey.authServices) private readonly authService: AuthService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {
    super();
  }
  serializeUser(token: string, done: Function) {
    // console.log('Serialize User:', user);
    return done(null, token);
  }
  async deserializeUser(token: string, done: Function) {
    console.log('Deserialize Payload:', token);
    try {
      const verifiedToken = this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      done(null, verifiedToken);
    } catch (error) {
      done(error, null);
    }
    // return done(null, payload);
    // const signedInAccount = await this.authService.signInGoogle(payload.id);
    // return signedInAccount ? done(null, signedInAccount) : done(null, null);
  }
}
