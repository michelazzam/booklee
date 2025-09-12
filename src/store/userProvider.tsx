import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authClient } from '../services/auth/auth-client';

import { apiClient } from '../services/axios/interceptor';

type UserProviderType = {
  isInitialized: boolean;
  isOnboardingCompleted: boolean;
  handleOnboardingCompleted: (isOnboardingCompleted: boolean) => void;
};
const STORAGE_KEY = {
  onboardingCompleted: 'onboardingCompleted',
};

const UserProviderContext = createContext<UserProviderType>({
  isInitialized: true,
  isOnboardingCompleted: false,
  handleOnboardingCompleted: () => {},
});

export const useUserProvider = () => useContext(UserProviderContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  /*** States ***/
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    const cookies = authClient.getCookie();
    const headers = {
      Cookie: cookies,
    };

    const getPersistentData = async () => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem(STORAGE_KEY.onboardingCompleted);
        setIsOnboardingCompleted(onboardingCompleted === 'true');
      } catch (error) {
        console.error('Error getting onboarding completed', error);
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

  return (
    <UserProviderContext.Provider
      value={{
        isInitialized,
        isOnboardingCompleted,
        handleOnboardingCompleted,
      }}>
      {children}
    </UserProviderContext.Provider>
  );
};
