import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class UsernameAccountDTO {
  @ApiProperty({ type: 'string', example: 'example@mail.com', required: true })
  @IsNotEmpty()
  @IsEmail()
  username: string;
}

export class RegisterAccountDTO extends UsernameAccountDTO {
  @ApiProperty({ type: 'string', example: 'example', required: true })
  @MinLength(6)
  @Matches(new RegExp('^[a-z0-9]*$'), {
    message: 'Password must be not have special characters and capital letters',
  })
  password: string;

  @ApiProperty({ type: 'string', example: 'example', required: true })
  @MinLength(6)
  @Matches(new RegExp('^[a-z0-9]*$'), {
    message:
      'Confirm password must be not have special characters and capital letters',
  })
  confirmPassword: string;

  @ApiProperty({ type: 'string', example: '123456', required: true })
  @IsNotEmpty()
  otp: string;
}

export class LoginAccountDTO extends UsernameAccountDTO {
  @ApiProperty({ type: 'string', example: 'example', required: true })
  @IsNotEmpty()
  password: string;
}

export class ChangePasswordDTO {
  @ApiProperty({ type: 'string', example: 'example', required: true })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ type: 'string', example: 'example', required: true })
  @MinLength(6)
  @Matches(new RegExp('^[a-z0-9]*$'), {
    message:
      'Confirm new password must be not have special characters and capital letters',
  })
  newPassword: string;

  @ApiProperty({ type: 'string', example: 'example', required: true })
  @MinLength(6)
  @Matches(new RegExp('^[a-z0-9]*$'), {
    message:
      'Confirm new password must be not have special characters and capital letters',
  })
  confirmNewPassword: string;
}

export class ResetPasswordDTO extends UsernameAccountDTO {
  @ApiProperty({ type: 'string', example: '123456', required: true })
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ type: 'string', example: 'example', required: true })
  @MinLength(6)
  @Matches(new RegExp('^[a-z0-9]*$'), {
    message:
      'New password must be not have special characters and capital letters',
  })
  newPassword: string;

  @ApiProperty({ type: 'string', example: 'example', required: true })
  @MinLength(6)
  @Matches(new RegExp('^[a-z0-9]*$'), {
    message:
      'Confirm new password must be not have special characters and capital letters',
  })
  confirmNewPassword: string;
}
