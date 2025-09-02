import { AxiosError } from "axios";

import { withErrorCatch } from "../axios/error";
import { apiClient } from "../axios/interceptor";

/*** API for get me ***/
// export const getMeApi = async () => {
//   const [response, error] = await withErrorCatch(
//     apiClient.get<GetMeResType>(`/users/authenticate`)
//   );

//   if (error instanceof AxiosError) {
//     throw {
//       ...error.response?.data,
//       status: error.response?.status,
//     };
//   } else if (error) {
//     throw error;
//   }

//   return response?.data;
// };