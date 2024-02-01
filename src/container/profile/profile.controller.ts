import { Body, Controller, Get, Put, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ProfileDTO } from './profile.dto';
import { JwtPayload } from 'src/types';
import { ProfileService } from './profile.service';

@Controller('profile')
@ApiTags('Profile')
@ApiBearerAuth()
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Put('/update-profile')
  updateProfile(
    @Res({ passthrough: true }) res: Response,
    @Body() body: ProfileDTO,
  ) {
    const { profileId } = res.locals as JwtPayload;
    return this.profileService.editProfile(profileId, body);
  }

  @Get('/get-profile')
  getProfile(@Res({ passthrough: true }) res: Response) {
    const { profileId } = res.locals as JwtPayload;
    return this.profileService.fetchDetailProfile(profileId);
  }
}
