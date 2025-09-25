import { AxiosError } from 'axios';

import { apiClient } from '../axios/interceptor';

import { withErrorCatch } from '../axios/error';

import type {
  CreateAppointmentReqType,
  CreateAppointmentResType,
  UserAppointmentsResType,
  UserAppointmentsReqType,
  BookingDataResponse,
} from './types';

/*** Create Appointment ***/
export const createAppointment = async (
  data: CreateAppointmentReqType
): Promise<CreateAppointmentResType> => {
  const response = await apiClient.post<CreateAppointmentResType>('/appointments', data);
  return response.data;
};

/*** Get Location Booking Data ***/
export const getLocationBookingData = async (locationId: string): Promise<BookingDataResponse> => {
  const response = await apiClient.get<BookingDataResponse>(
    `/locations/${locationId}/booking-data`
  );
  return response.data;
};

/*** Get User Appointments ***/
export const getUserAppointments = async (page: number, filters?: UserAppointmentsReqType) => {
  let url = `appointments?page=${page}`;

  if (filters) {
    url += `&${Object.entries(filters)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`;
  }

  const [response, error] = await withErrorCatch(apiClient.get<UserAppointmentsResType>(url));

  if (error instanceof AxiosError) {
    throw {
      ...error.response?.data,
      status: error.response?.status,
    };
  } else if (error) {
    throw error;
  }

  return response?.data;
};
