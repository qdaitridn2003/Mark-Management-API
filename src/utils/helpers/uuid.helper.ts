import { v4 as v4Uuid } from 'uuid';

export const uuidHelper = () => {
  const uuid = v4Uuid();
  return uuid;
};
