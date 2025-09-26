import { useMutation, useQuery } from '@tanstack/react-query';
import { createAppointment, getLocationBookingData, getAvailabilities } from './api';
import type {
  CreateAppointmentReqType,
  CreateAppointmentResType,
  BookingDataResponse,
  AvailabilityResponse,
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

/*** Get Availabilities Hook ***/
export const useGetAvailabilities = (
  locationId: string,
  date: string,
  serviceId: string,
  baseDurationMinutes: number,
  enabled = true
) => {
  return useQuery<AvailabilityResponse, Error>({
    queryKey: ['availabilities', locationId, date, serviceId, baseDurationMinutes],
    queryFn: () => getAvailabilities(locationId, date, serviceId, baseDurationMinutes),
    enabled: enabled && !!locationId && !!date && !!serviceId,
  });
};

export const AppointmentServices = {
  useCreateAppointment,
  useGetLocationBookingData,
  useGetAvailabilities,
};
