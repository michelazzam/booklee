/*** Better Auth types ***/
export type BetterAuthUserType = {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
};
export type SessionType = {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
};

/*** Get me response type ***/
export type UserType = {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string;
  lastName: string;
  firstName: string;
  salonName: string;
  image: string | null;
  approvedByOwner: boolean;
};
export type OrganizationType = {
  _id: string;
  name: string;
  logo: string;
  phone: string;
  address: string;
  description: string;
  invitationKey: string;
  geoLocation: object | null;
  monthlyRevenueTarget: number;
};
export type GetMeResType = {
  user: UserType;
  organization: OrganizationType;
};

/*** Login types ***/
export type LoginReqType = {
  email: string;
  password: string;
};

/*** Sign up types ***/
export type SignUpReqType = {
  role: string;
  phone: string;
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  confirmPassword?: string;
};
export type SignUpResType = {
  token: null;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    emailVerified: boolean;
  };
};

/*** Verify Email OTP types ***/
export type VerifyEmailOtpReqType = {
  otp: string;
  email: string;
};

/*** Reset password types ***/
export type ResetPasswordReqType = {
  otp: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

/*** Auth error types ***/
export type AuthErrorType = {
  code: string;
  message: string;
};

/*** Device tokens types ***/
export type DeviceTokensReqType = {
  token: string;
  topics?: string[];
  appVersion?: string;
  deviceModel?: string;
  platform: 'ios' | 'android';
};
