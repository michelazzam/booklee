import { useQuery } from '@tanstack/react-query';

import { getCategoriesApi } from './api';

import type { GetCategoriesResType, GetCategoriesReqType, Category } from './types';
import type { ResErrorType } from '../axios/types';

export const useGetCategories = (params?: GetCategoriesReqType) => {
  return useQuery<GetCategoriesResType, ResErrorType, Category[]>({
    queryKey: ['getCategories', params],
    select: ({ categories }) => categories,
    queryFn: () => getCategoriesApi(params),
  });
};

export const CategoryServices = {
  useGetCategories,
};
