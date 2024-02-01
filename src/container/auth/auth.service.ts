import { MailerService } from '@nest-modules/mailer';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { resolve } from 'path';
import { RegisterStrategy, Role, SendOTPType } from 'src/common';
import { AccountEntity, ProfileEntity, RoleEntity } from 'src/entities';
import {
  ChangePasswordAccountParams,
  JwtPayload,
  LoginAccountParams,
  RegisterAccountParams,
  ResetPasswordAccountParams,
  UserInfoParams,
} from 'src/types';
import { hashHandler, otpHandler } from 'src/utils';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepo: Repository<AccountEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepo: Repository<ProfileEntity>,
    @InjectRepository(RoleEntity)
    private roleRepo: Repository<RoleEntity>,
    @Inject(MailerService) private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}

  private accountQueryBuilder = this.accountRepo.createQueryBuilder('account');

  async registerAccount(payload: RegisterAccountParams) {
    if (!otpHandler.verifyOtp(process.env.OTP_SECRET_KEY, payload.otp)) {
      throw new HttpException(
        'OTP has expired or invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.confirmPassword !== payload.password) {
      throw new HttpException(
        'Confirm password must be match with password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdProfile = this.profileRepo.create({ email: payload.username });
    await this.profileRepo.save(createdProfile);

    const hashPassword = hashHandler.gen(payload.password);
    const foundRole = await this.roleRepo.findOneBy({ name: Role.user });
    const createdAccount = this.accountRepo.create({
      username: payload.username,
      profile: createdProfile,
      password: hashPassword,
      strategy: RegisterStrategy.local,
      role: foundRole,
    });
    await this.accountRepo.save(createdAccount);

    return { message: 'Successfully register account' };
  }

  async loginAccount(payload: LoginAccountParams) {
    const foundAccount = await this.accountRepo.findOne({
      where: { username: payload.username },
      relations: ['role', 'profile'],
    });

    const foundProfile = await this.profileRepo.findOneBy({
      id: foundAccount.profile.id,
    });

    if (!foundAccount) {
      throw new HttpException('Account is not exist', HttpStatus.NOT_FOUND);
    }

    const comparedResult = hashHandler.compare(
      payload.password,
      foundAccount.password,
    );
    if (!comparedResult) {
      throw new HttpException('Password is wrong', HttpStatus.BAD_REQUEST);
    }

    const token = await this.signToken({
      authId: foundAccount.id,
      profileId: foundAccount.profile.id,
      role: foundAccount.role.name,
    });

    return {
      isFirstChanging: foundProfile.isFirstChanging,
      accessToken: token,
    };
  }

  async sendOTP(username: string, type: string) {
    const foundAccount = await this.accountRepo.findOneBy({
      username,
    });
    if (type === SendOTPType.confirmEmail) {
      if (foundAccount) {
        throw new HttpException(
          'Account has already existed',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      if (!foundAccount) {
        throw new HttpException('Account is not exist', HttpStatus.NOT_FOUND);
      }
    }

    return await this.dispatchOTPToEmail(username);
  }

  async resetPassword(payload: ResetPasswordAccountParams) {
    if (!otpHandler.verifyOtp(process.env.OTP_SECRET_KEY, payload.otp)) {
      throw new HttpException(
        'OTP has expired or invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.confirmNewPassword !== payload.newPassword) {
      throw new HttpException(
        'Confirm new password must be match with new password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const foundAccount = await this.accountRepo.findOneBy({
      username: payload.username,
    });

    if (!foundAccount) {
      throw new HttpException('Account is not exist', HttpStatus.NOT_FOUND);
    }

    const hashPassword = hashHandler.gen(payload.newPassword);
    foundAccount.password = hashPassword;
    await this.accountRepo.save(foundAccount);

    return { message: 'Successfully reset password' };
  }

  async changePassword(payload: ChangePasswordAccountParams) {
    const foundAccount = await this.accountRepo.findOneBy({ id: payload.id });

    if (!foundAccount) {
      throw new HttpException('Account is not exist', HttpStatus.NOT_FOUND);
    }

    if (!hashHandler.compare(payload.oldPassword, foundAccount.password)) {
      throw new HttpException(
        'Old password is not correct',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.confirmNewPassword !== payload.newPassword) {
      throw new HttpException(
        'Confirm new password must be match with new password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = hashHandler.gen(payload.newPassword);
    foundAccount.password = hashPassword;
    await this.accountRepo.save(foundAccount);

    return { message: 'Successfully change password' };
  }

  // This function just use in this service
  private async dispatchOTPToEmail(username: string) {
    const otp = otpHandler.genOtp(process.env.OTP_SECRET_KEY);
    await this.mailerService.sendMail({
      to: username,
      template: resolve('./src/common/templates/email.template.hbs'),
      subject: 'Confirming Is That You To Make This Request',
      context: { otp },
    });

    return {
      message: 'OTP has sent to your email, please check it !',
    };
  }

  //This function just use in this service
  private async signToken(payload: JwtPayload) {
    const token = this.jwtService.signAsync(payload, {
      algorithm: 'HS256',
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '1h',
    });
    return token;
  }

  async validateGoogleUser(userInfo: UserInfoParams) {
    const foundAccount = await this.accountRepo.findOne({
      where: { username: userInfo.email },
      relations: ['profile', 'role'],
    });

    let token;

    if (foundAccount) {
      token = await this.signToken({
        authId: foundAccount.id,
        profileId: foundAccount.profile.id,
        role: foundAccount.role.name,
      });
      return token;
    }

    const createdProfile = await this.profileRepo.create({
      isFirstChanging: false,
      email: userInfo.email,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      avatar: userInfo.avatarURL,
    });
    await this.profileRepo.save(createdProfile);

    const foundRole = await this.roleRepo.findOneBy({ name: Role.user });
    const createdAccount = await this.accountRepo.create({
      username: userInfo.email,
      thirdPartyId: userInfo.id,
      strategy: RegisterStrategy.google,
      profile: createdProfile,
      password: '',
      role: foundRole,
    });
    await this.accountRepo.save(createdAccount);

    token = await this.signToken({
      authId: createdAccount.id,
      profileId: createdAccount.id,
      role: createdAccount.role.name,
    });

    return token;
  }
}
