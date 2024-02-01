import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity, ProfileEntity, RoleEntity } from 'src/entities';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { GoogleStrategy, SessionSerializer } from 'src/utils';
import { MetaDataKey } from 'src/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity, ProfileEntity, RoleEntity]),
    PassportModule.register({ session: true }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.NODEMAILER_HOST,
          secure: false,
          auth: {
            user: process.env.NODEMAILER_USERNAME,
            pass: process.env.NODEMAILER_PASSWORD,
          },
        },
        template: {
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
        defaults: {
          from: `No Reply <${process.env.NODEMAILER_USERNAME}>`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionSerializer,
    JwtService,
    GoogleStrategy,
    { provide: MetaDataKey.authServices, useClass: AuthService },
  ],
})
export class AuthModule {}
