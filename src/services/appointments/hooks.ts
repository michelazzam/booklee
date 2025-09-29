import { useMutation, useQuery, useInfiniteQuery } from '@tanstack/react-query';

import {
  createAppointment,
  getLocationBookingData,
  getUserAppointments,
  getAvailabilities,
} from './api';

import type { ResErrorType } from '../axios/types';

import type {
  CreateAppointmentReqType,
  CreateAppointmentResType,
  UserAppointmentsResType,
  BookingDataResponse,
  UserAppointment,
  UserAppointmentsReqType,
  AvailabilityResponse,
} from './types';

/*** Create Appointment Hook ***/
const useCreateAppointment = () => {
  return useMutation<CreateAppointmentResType, Error, CreateAppointmentReqType>({
    mutationFn: createAppointment,
  });
};

/*** Get Location Booking Data Hook ***/
const useGetLocationBookingData = (locationId: string) => {
  return useQuery<BookingDataResponse, Error>({
    queryKey: ['location-booking-data', locationId],
    queryFn: () => getLocationBookingData(locationId),
    enabled: !!locationId,
  });
};

/*** Get User Appointments Hook ***/
const useGetUserAppointments = (filters?: UserAppointmentsReqType) => {
  return useInfiniteQuery<UserAppointmentsResType, ResErrorType, UserAppointment[]>({
    initialPageParam: 1,
    queryKey: ['getUserAppointments', filters],
    select: ({ pages }) => pages.flatMap((page) => page.appointments),
    queryFn: ({ pageParam = 1 }) => getUserAppointments(pageParam as number, filters ?? {}),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.appointments.length > 0 ? allPages.length + 1 : undefined;
    },
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
  useGetLocationBookingData,
  useGetUserAppointments,
  useCreateAppointment,
  useGetAvailabilities,
};
