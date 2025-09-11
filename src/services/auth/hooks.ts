import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ResErrorType } from '../axios/types';
import { useUserProvider } from '~/src/store';
import { GetMeResType } from './types';
import { getMeApi } from './api';

const useGetMe = () => {
  /***** Constants *****/
  const { token } = useUserProvider();
  console.log('token from hooks', token);

  return useQuery<GetMeResType, ResErrorType, GetMeResType['user']>({
    retry: 1,
    enabled: !!token,
    gcTime: Infinity,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchInterval: false,
    queryFn: () => getMeApi(),
    queryKey: ['getMe', token],
    select: ({ user }) => user,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });
};

export const AuthServices = {
  useGetMe,
};
