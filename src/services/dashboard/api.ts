import { apiClient } from '../axios/interceptor';
import type {
  GetAppointmentsReqType,
  GetAppointmentsResType,
  GetOwnerMetricsReqType,
  GetOwnerMetricsResType,
} from './types';

/*** Get Appointments ***/
export const getAppointmentsApi = async (
  params: GetAppointmentsReqType
): Promise<GetAppointmentsResType> => {
  const response = await apiClient.get<GetAppointmentsResType>('/appointments', {
    params,
  });
  return response.data;
};

/*** Get Owner Metrics ***/
export const getOwnerMetricsApi = async (
  params: GetOwnerMetricsReqType
): Promise<GetOwnerMetricsResType> => {
  const response = await apiClient.get<GetOwnerMetricsResType>('/metrics/owner', {
    params,
  });
  return response.data;
};
