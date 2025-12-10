import type { LocationType } from '../locations/types';

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
  name?: string;
  phone?: string;
  lastName?: string;
  salonName?: string;
  firstName?: string;
};
export type UpdateUserResType = {
  user: UserType;
};

/*** Update user Image type ***/
export type UpdateUserImageResType = {
  user: UserType;
};

/*** Get user favorites type ***/
export type GetFavoritesResType = {
  ok: boolean;
  favorites: LocationType[];
};

/*** Add to user favorites type ***/
export type AddToFavoritesReqType = {
  locationId: string;
};
export type AddToFavoritesResType = {
  ok: boolean;
  favorites: LocationType[];
};

/*** Remove from user favorites type ***/
export type RemoveFromFavoritesReqType = {
  locationId: string;
};
export type RemoveFromFavoritesResType = {
  ok: boolean;
  removed: boolean;
};

/*** User Locations Types ***/
export type UserLocationEmployeeType = {
  _id: string;
  name: string;
  rating: number;
  specialties: string[];
  serviceIds: string[];
};

export type UserLocationServiceType = {
  _id: string;
  name: string;
  duration: number;
  price: number;
};

export type UserLocationHoursType = {
  open: string;
  close: string;
  closed: boolean;
};

export type UserLocationDataType = {
  employees: UserLocationEmployeeType[];
  services: UserLocationServiceType[];
  hours: Record<string, UserLocationHoursType>;
};

export type UserLocationItemType = {
  id: string;
  name: string;
};

export type GetUserLocationsResType = {
  ok: boolean;
  organizationId: string;
  locations: UserLocationItemType[];
  locationData: Record<string, UserLocationDataType>;
};

/*** Delete user type ***/
export type DeleteUserResType = {
  ok: boolean;
  message?: string;
};

/*** Send push notification type ***/
export type SendPushNotificationReqType = {
  body: string;
  title: string;
  userId: string;
};
export type SendPushNotificationResType = {
  ok: boolean;
  message?: string;
};
