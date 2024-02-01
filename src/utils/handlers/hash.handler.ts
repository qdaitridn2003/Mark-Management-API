import * as bcrypt from 'bcrypt';

export const hashHandler = {
  gen: (value: string | Buffer) => {
    const saltRound = bcrypt.genSaltSync(1);
    const hashValue = bcrypt.hashSync(value, saltRound);
    return hashValue;
  },
  compare: (unHashValue: string | Buffer, hashValue: string) => {
    const comparedValue = bcrypt.compareSync(unHashValue, hashValue);
    return comparedValue;
  },
};
