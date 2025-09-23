import { useMutation, useQuery } from '@tanstack/react-query';
import { createAppointment, getLocationBookingData } from './api';
import type {
  CreateAppointmentReqType,
  CreateAppointmentResType,
  BookingDataResponse,
} from './types';

/*** Create Appointment Hook ***/
export const useCreateAppointment = () => {
  return useMutation<CreateAppointmentResType, Error, CreateAppointmentReqType>({
    mutationFn: createAppointment,
  });
};

/*** Get Location Booking Data Hook ***/
export const useGetLocationBookingData = (locationId: string) => {
  return useQuery<BookingDataResponse, Error>({
    queryKey: ['location-booking-data', locationId],
    queryFn: () => getLocationBookingData(locationId),
    enabled: !!locationId,
  });
};

export const AppointmentServices = {
  useCreateAppointment,
  useGetLocationBookingData,
};
