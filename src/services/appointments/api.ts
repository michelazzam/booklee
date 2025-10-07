import { AxiosError } from 'axios';

import { apiClient } from '../axios/interceptor';

import { withErrorCatch } from '../axios/error';

import type {
  RescheduleAppointmentResType,
  RescheduleAppointmentReqType,
  CreateAppointmentReqType,
  CancelAppointmentResType,
  CreateAppointmentResType,
  CancelAppointmentReqType,
  UserAppointmentsResType,
  UserAppointmentsReqType,
  BookingDataResponse,
  AvailabilityResponse,
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

/*** Get Availabilities ***/
export const getAvailabilities = async (
  locationId: string,
  date: string,
  serviceId: string,
  baseDurationMinutes: number
): Promise<AvailabilityResponse> => {
  const response = await apiClient.get<AvailabilityResponse>(`/appointments/availabilities`, {
    params: {
      locationId,
      date,
      serviceId,
      baseDurationMinutes,
    },
  });
  return response.data;
};

/*** Cancel Appointment ***/
export const cancelAppointment = async (
  data: CancelAppointmentReqType
): Promise<CancelAppointmentResType> => {
  const [response, error] = await withErrorCatch(
    apiClient.delete<CancelAppointmentResType>('/appointments', { data })
  );

  if (error instanceof AxiosError) {
    throw {
      ...error.response?.data,
      status: error.response?.status,
    };
  } else if (error) {
    throw error;
  }

  return response.data;
};

/*** Reschedule Appointment ***/
export const rescheduleAppointment = async (
  data: RescheduleAppointmentReqType
): Promise<RescheduleAppointmentResType> => {
  const [response, error] = await withErrorCatch(
    apiClient.post<RescheduleAppointmentResType>('/appointments/reschedule', data)
  );

  if (error instanceof AxiosError) {
    throw {
      ...error.response?.data,
      status: error.response?.status,
    };
  } else if (error) {
    throw error;
  }

  return response.data;
};
