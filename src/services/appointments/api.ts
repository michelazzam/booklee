import { apiClient } from '../axios/interceptor';
import type {
  CreateAppointmentReqType,
  CreateAppointmentResType,
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
