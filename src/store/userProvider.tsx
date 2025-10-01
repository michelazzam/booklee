import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authClient } from '../services/auth/auth-client';

import { apiClient } from '../services/axios/interceptor';

type UserProviderType = {
  isInitialized: boolean;
  isOnboardingCompleted: boolean;
  handleOnboardingCompleted: (isOnboardingCompleted: boolean) => void;
  resetOnboarding: () => Promise<void>;
  isBusinessMode: boolean;
  setBusinessMode: (isBusinessMode: boolean) => void;
};
const STORAGE_KEY = {
  onboardingCompleted: 'onboardingCompleted',
  businessMode: 'businessMode',
};

const UserProviderContext = createContext<UserProviderType>({
  isInitialized: true,
  isOnboardingCompleted: false,
  handleOnboardingCompleted: () => {},
  resetOnboarding: async () => {},
  isBusinessMode: false,
  setBusinessMode: () => {},
});

export const useUserProvider = () => useContext(UserProviderContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  /*** States ***/
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [isBusinessMode, setIsBusinessModeState] = useState(false);

  useEffect(() => {
    const cookies = authClient.getCookie();
    const headers = {
      Cookie: cookies,
    };

    const getPersistentData = async () => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem(STORAGE_KEY.onboardingCompleted);
        setIsOnboardingCompleted(onboardingCompleted === 'true');

        const businessMode = await AsyncStorage.getItem(STORAGE_KEY.businessMode);
        setIsBusinessModeState(businessMode === 'true');
      } catch (error) {
        console.error('Error getting persistent data', error);
      } finally {
        setIsInitialized(true);
      }
    };

    getPersistentData();
    apiClient.defaults.headers.common = headers;
  }, []);

  const handleOnboardingCompleted = async (isOnboardingCompleted: boolean) => {
    setIsOnboardingCompleted(isOnboardingCompleted);
    await AsyncStorage.setItem(STORAGE_KEY.onboardingCompleted, isOnboardingCompleted.toString());
  };

  const resetOnboarding = async () => {
    setIsOnboardingCompleted(false);
    await AsyncStorage.removeItem(STORAGE_KEY.onboardingCompleted);
  };

  const setBusinessMode = async (isBusinessMode: boolean) => {
    setIsBusinessModeState(isBusinessMode);
    await AsyncStorage.setItem(STORAGE_KEY.businessMode, isBusinessMode.toString());
  };

  return (
    <UserProviderContext.Provider
      value={{
        isInitialized,
        isOnboardingCompleted,
        handleOnboardingCompleted,
        resetOnboarding,
        isBusinessMode,
        setBusinessMode,
      }}>
      {children}
    </UserProviderContext.Provider>
  );
};
