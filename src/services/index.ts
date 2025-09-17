/*** Hooks ***/
export { CategoryServices } from './categories/hooks';
export { FavoritesServices } from './favorites/hooks';
export { LocationServices } from './locations/hooks';
export { SearchServices } from './search/hooks';
export { authClient } from './auth/auth-client';
export { apiClient } from './axios/interceptor';
export { withErrorCatch } from './axios/error';
export { AuthServices } from './auth/hooks';
export { UserServices } from './user/hooks';

/*** Types ***/
export type { Category, GetCategoriesResType, GetCategoriesReqType } from './categories/types';
export type { SearchHistoryItemType, GetSearchHistoryResType } from './search/types';
export type { ResErrorType } from './axios/types';
export type {
  BetterAuthUserType,
  AuthErrorType,
  SignUpReqType,
  LoginReqType,
  GetMeResType,
  SessionType,
  RoleType,
} from './auth/types';
export type { LocationCategoryType } from './locations/types';
export type {
  RemoveFromFavoritesReqType,
  RemoveFromFavoritesResType,
  AddToFavoritesReqType,
  AddToFavoritesResType,
  GetFavoritesResType,
} from './favorites/types';
export type {
  UpdateUserReqType,
  UpdateUserResType,
  GetUserMeResType,
  OrganizationType,
  UserType,
} from './user/types';
