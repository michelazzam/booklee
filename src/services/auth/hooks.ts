import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ResErrorType } from "../axios/types";

// const useGetMe = () => {
//   /***** Constants *****/
//   const { tokens } = useUserProvider();
//   const token = tokens?.accessToken ?? "";

//   return useQuery<GetMeResType, ResErrorType, UserType>({
//     retry: 1,
//     enabled: !!token,
//     gcTime: Infinity,
//     staleTime: Infinity,
//     refetchOnMount: false,
//     refetchInterval: false,
//     queryFn: () => getMeApi(),
//     queryKey: ["getMe", token],
//     select: ({ user }) => user,
//     refetchOnWindowFocus: false,
//     refetchIntervalInBackground: false,
//   });
// };

export const AuthServices = {};
