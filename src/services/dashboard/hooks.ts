import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getAppointmentsApi, getOwnerMetricsApi } from './api';
import type {
  GetAppointmentsReqType,
  GetAppointmentsResType,
  GetOwnerMetricsReqType,
  GetOwnerMetricsResType,
} from './types';
import type { ResErrorType } from '../axios/types';

/*** Get Upcoming Appointments Hook (for Dashboard Home) ***/
export const useGetUpcomingAppointments = (params: GetAppointmentsReqType = {}) => {
  return useQuery<GetAppointmentsResType, ResErrorType>({
    queryKey: ['upcomingAppointments', params],
    queryFn: () =>
      getAppointmentsApi({
        ...params,
        upcoming: true,
        limit: params.limit || 6,
      }),
    enabled: !!params.locationId,
  });
};

/*** Get All Appointments with Infinite Scroll (for "See All" page) ***/
export const useGetAllAppointments = (params: Omit<GetAppointmentsReqType, 'page'> = {}) => {
  return useInfiniteQuery<GetAppointmentsResType, ResErrorType>({
    queryKey: ['allAppointments', params],
    queryFn: ({ pageParam = 1 }) =>
      getAppointmentsApi({
        ...params,
        page: pageParam as number,
        limit: params.limit || 20,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      const totalPages = lastPage.total
        ? Math.ceil(lastPage.total / (params.limit || 20))
        : currentPage;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!params.locationId,
  });
};

/*** Get Owner Metrics Hook ***/
export const useGetOwnerMetrics = (params: GetOwnerMetricsReqType) => {
  return useQuery<GetOwnerMetricsResType, ResErrorType>({
    queryKey: ['ownerMetrics', params],
    queryFn: () => getOwnerMetricsApi(params),
    enabled: !!params.organizationId,
  });
};

export const DashboardServices = {
  useGetUpcomingAppointments,
  useGetAllAppointments,
  useGetOwnerMetrics,
};
