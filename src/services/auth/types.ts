/*** Better Auth types ***/
export type BetterAuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
};
export type Session = {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
};

/*** Get me response type ***/
export type GetMeResType = {
  user: {
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
  organization: {
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
};

/*** Login types ***/
export type LoginReqType = {
  email?: string;
  phone?: string;
  password: string;
};

/*** Sign up types ***/
export type RoleType = 'owner' | 'manager' | 'stylist' | 'receptionist';
export type SignUpReqType = {
  email: string;
  phone: string;
  role: RoleType;
  password: string;
  lastName: string;
  firstName: string;
  salonName?: string;
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

/*** Auth error types ***/
export type AuthError = {
  code: string;
  message: string;
};
