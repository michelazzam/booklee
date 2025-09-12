import axios from 'axios';

import { ENV } from '~/src/constants';

const getBaseURL = () => {
  return ENV.API_URL;
};

export const apiClient = axios.create({
  baseURL: getBaseURL(),
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    if (ENV.ENABLE_API_LOGS) {
      console.info(
        '\n===== API Request =====',
        `\nMethod: ${config.method?.toUpperCase()}`,
        `\nURL:    ${config.baseURL}${config.url}`,
        `\nHeaders: ${JSON.stringify(config.headers, null, 2)}`,
        `\nParams: ${JSON.stringify(config.params, null, 2)}`,
        `\nData:   ${JSON.stringify(config.data, null, 2)}`,
        '\n======================='
      );
    }
    return config;
  },
  (error) => {
    if (ENV.ENABLE_API_LOGS) {
      console.error(
        '\n=== API Request Error ===',
        `\nURL:     ${error.config?.url}`,
        `\nMessage: ${error.message}`,
        `\nStatus:  ${error.response?.status}`,
        `\nData:    ${JSON.stringify(error.response?.data, null, 2)}`,
        '\n========================='
      );
    }
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    if (ENV.ENABLE_API_LOGS) {
      console.info(
        '\n===== API Response =====',
        `\nStatus: ${response.status}`,
        `\nURL:    ${response.config.baseURL}${response.config.url}`,
        `\nData:   ${JSON.stringify(response.data, null, 2)}`,
        '\n========================'
      );
    }
    return response;
  },
  (error) => {
    if (ENV.ENABLE_API_LOGS) {
      console.error(
        '\n=== API Response Error ===',
        `\nStatus: ${error.response?.status}`,
        `\nURL:    ${error.config?.baseURL}${error.config?.url}`,
        `\nMessage: ${error.message}`,
        `\nData:   ${JSON.stringify(error.response?.data, null, 2)}`,
        '\n=========================='
      );
    }
    return Promise.reject(error);
  }
);
