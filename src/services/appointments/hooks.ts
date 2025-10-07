import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import {
  getLocationBookingData,
  rescheduleAppointment,
  getUserAppointments,
  createAppointment,
  getAvailabilities,
  cancelAppointment,
} from './api';

import type { ResErrorType } from '../axios/types';

import type {
  RescheduleAppointmentResType,
  RescheduleAppointmentReqType,
  CreateAppointmentReqType,
  CreateAppointmentResType,
  CancelAppointmentResType,
  CancelAppointmentReqType,
  UserAppointmentsResType,
  UserAppointmentsReqType,
  AvailabilityResponse,
  BookingDataResponse,
  UserAppointment,
} from './types';

/*** Create Appointment Hook ***/
const useCreateAppointment = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation<CreateAppointmentResType, Error, CreateAppointmentReqType>({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getUserAppointments'],
      });
    },
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
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    queryKey: ['getUserAppointments', filters],
    select: (data) =>
      data.pages.flatMap((page) => {
        if (filters?.upcoming) {
          return page.appointments.filter((appointment) => appointment.status === 'confirmed');
        }

        return page.appointments;
      }),
    queryFn: ({ pageParam, queryKey }) =>
      getUserAppointments(pageParam as number, queryKey[1] ?? {}),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && lastPage.appointments.length > 0) {
        return allPages.length + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (_, allPages) => {
      if (allPages.length > 1) {
        return allPages.length - 1;
      }
      return undefined;
    },
  });
};

/*** Get Availabilities Hook ***/
const useGetAvailabilities = (
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

/*** Cancel Appointment Hook ***/
const useCancelAppointment = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation<CancelAppointmentResType, ResErrorType, CancelAppointmentReqType>({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getUserAppointments'],
      });
    },
  });
};

/*** Reschedule Appointment Hook ***/
const useRescheduleAppointment = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation<RescheduleAppointmentResType, ResErrorType, RescheduleAppointmentReqType>({
    mutationFn: rescheduleAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getUserAppointments'],
      });
    },
  });
};

export const AppointmentServices = {
  useGetLocationBookingData,
  useRescheduleAppointment,
  useGetUserAppointments,
  useCreateAppointment,
  useGetAvailabilities,
  useCancelAppointment,
};
