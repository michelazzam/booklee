/*** Hooks ***/
export { authClient } from './auth/auth-client';
export { apiClient } from './axios/interceptor';
export { withErrorCatch } from './axios/error';
export { AuthServices } from './auth/hooks';
export { LocationServices } from './locations/hooks';
export { CategoryServices } from './categories/hooks';
export { SearchServices } from './search/hooks';
export { FavoritesServices } from './favorites/hooks';
export { UserServices } from './user/hooks';

/*** Types ***/
export type { ResErrorType } from './axios/types';
export type {
  BetterAuthUser,
  SignUpReqType,
  LoginReqType,
  GetMeResType,
  AuthError,
  RoleType,
  Session,
} from './auth/types';
export type {
  Location,
  GetLocationsResType,
  GetLocationsReqType,
  LocationService,
  Service,
  Price,
  Category as LocationCategory,
  GeoLocation,
  OperatingHours,
  WeeklyOperatingHours,
} from './locations/types';
export type { Category, GetCategoriesResType, GetCategoriesReqType } from './categories/types';
export type { SearchHistoryItem, GetSearchHistoryResType } from './search/types';
export type {
  Favorite,
  AddToFavoritesReqType,
  AddToFavoritesResType,
  GetFavoritesResType,
  RemoveFromFavoritesReqType,
  RemoveFromFavoritesResType,
} from './favorites/types';
export type {
  User,
  Organization,
  GetUserMeResType,
  UpdateUserReqType,
  UpdateUserResType,
} from './user/types';
