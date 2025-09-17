/*** User types ***/
export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  salonName?: string;
  image?: string | null;
  approvedByOwner?: boolean;
};

export type Organization = {
  _id: string;
  name: string;
  address: string;
  phone: string;
  description: string;
  logo: string;
  monthlyRevenueTarget: number;
  geoLocation?: object | null;
  invitationKey: string;
};

export type GetUserMeResType = {
  user: User;
  organization: Organization;
};

export type UpdateUserReqType = {
  firstName?: string;
  lastName?: string;
  image?: string | null;
};

export type UpdateUserResType = {
  user: User;
};
