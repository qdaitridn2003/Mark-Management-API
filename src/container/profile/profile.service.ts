import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from 'src/entities';
import { ProfileParams } from 'src/types';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private profileRepo: Repository<ProfileEntity>,
  ) {}

  async editProfile(id: string, payload: ProfileParams) {
    const foundProfile = await this.profileRepo.findOneBy({ id });

    if (!foundProfile)
      throw new HttpException('Profile is not exist', HttpStatus.NOT_FOUND);

    foundProfile.firstName = payload.firstName;
    foundProfile.lastName = payload.lastName;
    foundProfile.birthday = payload.birthday;
    foundProfile.avatar = payload.avatar;
    foundProfile.isFirstChanging = false;

    await this.profileRepo.save(foundProfile);

    return { message: 'Successfully update profile' };
  }

  async fetchDetailProfile(id: string) {
    const foundProfile = await this.profileRepo.findOneBy({ id });

    console.log(foundProfile);

    if (!foundProfile)
      throw new HttpException('Profile is not exist', HttpStatus.NOT_FOUND);

    return { profile: foundProfile };
  }
}
