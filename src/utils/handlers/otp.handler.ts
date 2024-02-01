import * as speakeasy from 'speakeasy';

export const otpHandler = {
  genSecret: () => {
    const secret = speakeasy.generateSecret({ length: 20 });
    return secret.base32;
  },
  genOtp: (secret: string) => {
    const otp = speakeasy.totp({
      secret,
      algorithm: 'sha256',
      encoding: 'base32',
      step: 300, // 5 minutes
    });
    return otp;
  },
  verifyOtp: (secret: string, otp: string) => {
    const verifiedResult = speakeasy.totp.verify({
      secret,
      token: otp,
      algorithm: 'sha256',
      encoding: 'base32',
      step: 300, // 5 minutes
    });
    return verifiedResult;
  },
};
