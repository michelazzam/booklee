/*** Hooks ***/
export { LocationServices } from './locations/hooks';
export { authClient } from './auth/auth-client';
export { apiClient } from './axios/interceptor';
export { withErrorCatch } from './axios/error';
export { AuthServices } from './auth/hooks';
export { UserServices } from './user/hooks';
export { AppointmentServices } from './appointments/hooks';
export { DashboardServices } from './dashboard/hooks';

/*** Types ***/
export type { ResErrorType } from './axios/types';
export type {
  ServiceBooking,
  AvailabilityData,
  AvailabilityResponse,
  TimeSlot,
} from './appointments/types';
export type {
  BetterAuthUserType,
  AuthErrorType,
  SignUpReqType,
  LoginReqType,
  GetMeResType,
  SessionType,
  RoleType,
} from './auth/types';
export type {
  LocationCategoryType,
  GetLocationsReqType,
  SearchHistoryType,
  DetailedLocationType,
  LocationType,
} from './locations/types';
export type {
  UpdateUserReqType,
  UpdateUserResType,
  GetUserMeResType,
  OrganizationType,
  UserType,
  GetUserLocationsResType,
  UserLocationItemType,
} from './user/types';
export type {
  CreateAppointmentReqType,
  CreateAppointmentResType,
  BookingData,
  BookingStep,
  SelectedService,
  Employee,
  BookingService,
  BookingDataResponse,
} from './appointments/types';
export type {
  DashboardAppointmentType,
  GetAppointmentsReqType,
  GetAppointmentsResType,
} from './dashboard/types';
