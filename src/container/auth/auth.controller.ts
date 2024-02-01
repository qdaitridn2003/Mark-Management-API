import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import {
  ChangePasswordDTO,
  LoginAccountDTO,
  RegisterAccountDTO,
  ResetPasswordDTO,
  UsernameAccountDTO,
} from './account.dto';
import { SendOTPType } from 'src/common';
import { Request, Response } from 'express';
import { JwtPayload } from 'src/types';
import { GoogleGuard } from 'src/guards';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() body: RegisterAccountDTO) {
    return this.authService.registerAccount(body);
  }

  @Post('/sign-in')
  signIn(@Body() body: LoginAccountDTO) {
    return this.authService.loginAccount(body);
  }

  @Post('/send-otp/confirm-email')
  sendOTPForConfirmEmail(@Body() body: UsernameAccountDTO) {
    return this.authService.sendOTP(body.username, SendOTPType.confirmEmail);
  }

  @Post('/send-otp/reset-password')
  sendOTPForResetPass(@Body() body: UsernameAccountDTO) {
    return this.authService.sendOTP(body.username, SendOTPType.resetPass);
  }

  @Put('/reset-password')
  resetPassword(@Body() body: ResetPasswordDTO) {
    return this.authService.resetPassword(body);
  }

  @ApiBearerAuth()
  @Put('/change-password')
  changePassword(
    @Res({ passthrough: true }) res: Response,
    @Body() body: ChangePasswordDTO,
  ) {
    const { authId } = res.locals as JwtPayload;
    return this.authService.changePassword({ ...body, id: authId });
  }

  @Post('/sign-in/google')
  signInWithGoogle() {
    return { link: 'http://localhost:8080/api/auth/google/redirect' };
  }

  //Redirect to google oauth2
  @ApiExcludeEndpoint()
  @Get('/google/redirect')
  @UseGuards(GoogleGuard)
  redirectToGoogle(@Req() req: Request) {
    // console.log(req.user);
    return { message: 'Successfully', accessToken: req.user };
  }
}
