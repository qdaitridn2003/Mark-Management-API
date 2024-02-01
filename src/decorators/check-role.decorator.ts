import { SetMetadata } from '@nestjs/common';
import { MetaDataKey } from 'src/common';

export const CheckRole = (...roles: string[]) =>
  SetMetadata(MetaDataKey.roles, roles);
