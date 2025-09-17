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

/*** User favorites type ***/
export type FavoriteType = {
  _id: string;
  slug: string;
  name: string;
  logo: string;
  city: string;
  tags: string[];
};

/*** Get user favorites type ***/
export type GetFavoritesResType = {
  ok: boolean;
  favorites: FavoriteType[];
};

/*** Add to user favorites type ***/
export type AddToFavoritesReqType = {
  locationId: string;
};
export type AddToFavoritesResType = {
  ok: boolean;
  message?: string;
};

/*** Remove from user favorites type ***/
export type RemoveFromFavoritesReqType = {
  locationId: string;
};
export type RemoveFromFavoritesResType = {
  ok: boolean;
  message?: string;
};
