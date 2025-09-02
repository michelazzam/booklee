import { ENV } from "~/src/constants";

type ConnectionErrorResType = {
  errorType: string;
  message: string;
  userMessage: string;
  isConnectionError: boolean;
};
const handleConnectionError = (error: any): ConnectionErrorResType => {
  if (error && typeof error === "object") {
    const errorMessage = error.message || "";
    const errorCode = error.code || "";

    if (!error.response) {
      if (errorCode === "ECONNREFUSED") {
        return {
          isConnectionError: true,
          errorType: "CONNECTION_REFUSED",
          message: "Backend server is not running or refusing connections",
          userMessage:
            "Unable to fetch data. Try again later or contact support if problem persists.",
        };
      }

      if (errorCode === "ENOTFOUND") {
        return {
          isConnectionError: true,
          errorType: "HOST_NOT_FOUND",
          message: "Backend server hostname could not be resolved",
          userMessage:
            "Unable to fetch data. Check your internet connection and try again.",
        };
      }

      if (errorCode === "ECONNABORTED" || errorMessage.includes("timeout")) {
        return {
          isConnectionError: true,
          errorType: "TIMEOUT",
          message: "Connection to backend server timed out",
          userMessage:
            "Unable to fetch data. Check your internet connection and try again.",
        };
      }

      if (
        errorMessage.includes("Network Error") ||
        errorMessage.includes("network error")
      ) {
        return {
          isConnectionError: true,
          errorType: "NETWORK_ERROR",
          message: "Network error - cannot reach backend server",
          userMessage:
            "Unable to fetch data. Check your internet connection and try again.",
        };
      }

      return {
        isConnectionError: true,
        errorType: "NO_RESPONSE",
        message: "No response received from backend server",
        userMessage: "Unable to fetch data. Try again later.",
      };
    }

    if (error.response && error.response.status >= 500) {
      return {
        isConnectionError: true,
        errorType: "SERVER_ERROR",
        message:
          "Backend server is responding but experiencing internal errors",
        userMessage: "Unable to fetch data. Try again in a few minutes.",
      };
    }
  }

  return {
    isConnectionError: false,
    errorType: "OTHER",
    message: "Not a connection error",
    userMessage: "",
  };
};

export const withErrorCatch = async <
  T,
  E extends new (message?: string) => Error
>(
  promise: Promise<T>,
  errorsToCatch?: E[],
  enableErrorLogs?: boolean
): Promise<[T, undefined] | [undefined, E]> => {
  const isErrorLogsEnabled = enableErrorLogs || ENV.ENABLE_ASYNC_ERROR_LOGS;

  try {
    const data = await promise;

    const result: [T, undefined] = [data, undefined];

    return result;
  } catch (e) {
    const error = e as E;
    const { isConnectionError, errorType, message, userMessage } =
      handleConnectionError(error);

    if (isConnectionError) {
      if (isErrorLogsEnabled) {
        console.error(
          `==============================================`,
          `\n🚨 BACKEND CONNECTION ERROR 🚨`,
          `\nError Type: ${errorType}`,
          `\nTechnical Message: ${message}`,
          `\nUser Message: ${userMessage}`,
          `\nCannot connect to backend: ${ENV.API_URL}`,
          `\nOriginal Error: ${error}`,
          `\n==============================================`
        );
      }

      const userFriendlyError = new Error(userMessage) as unknown as E;
      (userFriendlyError as any).isConnectionError = true;
      (userFriendlyError as any).errorType = errorType;
      (userFriendlyError as any).originalError = error;

      return [undefined, userFriendlyError];
    }

    if (isErrorLogsEnabled && error) {
      console.error(
        `==============================================`,
        `\nAsync With Error Catch Error:\n`,
        `message:\n`,
        // @ts-expect-error
        error.message,
        `\ncause:\n`,
        // @ts-expect-error
        error.cause,
        `\nstack:\n`,
        // @ts-expect-error
        error.stack,
        `\n==============================================\n`,
        error,
        `\n==============================================`
      );
    }

    if (!Array.isArray(errorsToCatch)) {
      return [undefined, error];
    }

    if (errorsToCatch.includes(error)) {
      return [undefined, error];
    }

    return [undefined, error];
  }
};
