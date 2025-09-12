/*** Hooks ***/
export { authClient } from './auth/auth-client';
export { apiClient } from './axios/interceptor';
export { withErrorCatch } from './axios/error';
export { AuthServices } from './auth/hooks';

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
