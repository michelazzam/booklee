/*** Hooks ***/
export { authClient } from './auth/auth-client';
export { apiClient } from './axios/interceptor';
export { withErrorCatch } from './axios/error';
export { AuthServices } from './auth/hooks';
export { LocationServices } from './locations/hooks';

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
  Category,
  GeoLocation,
  OperatingHours,
  WeeklyOperatingHours,
} from './locations/types';
