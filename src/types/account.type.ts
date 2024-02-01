export type RegisterAccountParams = {
  username: string;
  password: string;
  confirmPassword: string;
  otp: string;
};

export type LoginAccountParams = {
  username: string;
  password: string;
};

export type ResetPasswordAccountParams = {
  username: string;
  newPassword: string;
  confirmNewPassword: string;
  otp: string;
};

export type ChangePasswordAccountParams = {
  id: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type UserInfoParams = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarURL: string;
};
