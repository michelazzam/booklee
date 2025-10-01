import { apiClient } from '../axios/interceptor';
import type { GetAppointmentsReqType, GetAppointmentsResType } from './types';

/*** Get Appointments ***/
export const getAppointmentsApi = async (
  params: GetAppointmentsReqType
): Promise<GetAppointmentsResType> => {
  const response = await apiClient.get<GetAppointmentsResType>('/appointments', {
    params,
  });
  return response.data;
};
