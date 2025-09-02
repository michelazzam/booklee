const checkIfAllEnvVariablesAreSet = <T extends object>(ENV: T) => {
  const envVariables = Object.keys(ENV);

  const missingEnvVariables = envVariables.filter((variable) => {
    const value = ENV[variable as keyof T];
    return value === undefined || value === "" || value === null;
  });

  if (missingEnvVariables?.length > 0) {
    console.warn(
      `🚨 Missing environment variables detected!\n` +
        `Missing keys: ${missingEnvVariables.join(", ")}`
    );
  } else {
    console.info("✅ All environment variables are properly set");
  }
};

export const ENV = {
  APP_VARIANT: process.env.EXPO_PUBLIC_APP_VARIANT,
  ENABLE_API_LOGS: process.env.EXPO_PUBLIC_ENABLE_API_LOGS === "true",
  ENABLE_ASYNC_ERROR_LOGS:
    process.env.EXPO_PUBLIC_ENABLE_ASYNC_ERROR_LOGS === "true",

  // API URLs
  API_URL: process.env.EXPO_PUBLIC_API_URL,
  IOS_API_URL: process.env.EXPO_PUBLIC_IOS_API_URL,
  ANDROID_API_URL: process.env.EXPO_PUBLIC_ANDROID_API_URL,
};

checkIfAllEnvVariablesAreSet(ENV);
