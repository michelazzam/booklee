/*** User types ***/
export type UserType = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  lastName?: string;
  firstName?: string;
  salonName?: string;
  image?: string | null;
  approvedByOwner?: boolean;
};
export type OrganizationType = {
  _id: string;
  name: string;
  logo: string;
  phone: string;
  address: string;
  description: string;
  invitationKey: string;
  geoLocation?: object | null;
  monthlyRevenueTarget: number;
};
export type GetUserMeResType = {
  user: UserType;
  organization: OrganizationType;
};

/*** Update user type ***/
export type UpdateUserReqType = {
  lastName?: string;
  firstName?: string;
  image?: string | null;
};
export type UpdateUserResType = {
  user: UserType;
};
