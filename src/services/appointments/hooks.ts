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
  AvailabilityResponse,
  BookingDataResponse,
  UserAppointmentType,
} from './types';

/*** Get Upcoming User Appointments Hook ***/
const useGetUpcomingUserAppointments = () => {
  return useInfiniteQuery<UserAppointmentsResType, ResErrorType, UserAppointmentType[]>({
    initialPageParam: 1,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    queryKey: ['getUpcomingUserAppointments'],
    select: (data) =>
      data.pages.flatMap((page) => {
        return page.appointments.filter((appointment) => appointment.status === 'confirmed');
      }),
    queryFn: ({ pageParam }) => getUserAppointments(pageParam as number, { upcoming: true }),
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

/*** Get Past User Appointments Hook ***/
const useGetPastUserAppointments = () => {
  return useInfiniteQuery<UserAppointmentsResType, ResErrorType, UserAppointmentType[]>({
    initialPageParam: 1,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    queryKey: ['getPastUserAppointments'],
    select: (data) => data.pages.flatMap((page) => page.appointments),
    queryFn: ({ pageParam }) => getUserAppointments(pageParam as number, { past: true }),
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

/*** Get User Appointments needs review Hook ***/
const useGetUserAppointmentsNeedsReview = () => {
  return useInfiniteQuery<UserAppointmentsResType, ResErrorType, UserAppointmentType[]>({
    initialPageParam: 1,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    queryKey: ['getUserAppointmentsNeedsReview'],
    select: (data) =>
      data.pages.flatMap((page) =>
        page.appointments.filter((appointment) => appointment.status === 'confirmed')
      ),
    queryFn: ({ pageParam }) => getUserAppointments(pageParam as number, { needsReview: true }),
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

/*** Create Appointment Hook ***/
const useCreateAppointment = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation<CreateAppointmentResType, Error, CreateAppointmentReqType>({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['getUpcomingUserAppointments'],
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
        queryKey: ['getUpcomingUserAppointments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getPastUserAppointments'],
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
        queryKey: ['getUpcomingUserAppointments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getPastUserAppointments'],
      });
    },
  });
};

export const AppointmentServices = {
  useGetUserAppointmentsNeedsReview,
  useGetUpcomingUserAppointments,
  useGetPastUserAppointments,
  useGetLocationBookingData,
  useRescheduleAppointment,
  useCreateAppointment,
  useGetAvailabilities,
  useCancelAppointment,
};
