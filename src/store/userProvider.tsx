import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authClient } from '../services/auth/auth-client';
import { useQueryClient } from '@tanstack/react-query';

import { apiClient } from '../services/axios/interceptor';

import { guestData } from '../constants';

type UserProviderType = {
  userIsGuest: boolean;
  isInitialized: boolean;
  logoutGuest: () => void;
  handleGuestLogin: () => void;
  isOnboardingCompleted: boolean;
  handleOnboardingCompleted: (isOnboardingCompleted: boolean) => void;
};
const STORAGE_KEY = {
  onboardingCompleted: 'onboardingCompleted',
};

const UserProviderContext = createContext<UserProviderType>({
  userIsGuest: false,
  isInitialized: true,
  logoutGuest: () => {},
  handleGuestLogin: () => {},
  isOnboardingCompleted: false,
  handleOnboardingCompleted: () => {},
});

export const useUserProvider = () => useContext(UserProviderContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  /*** States ***/
  const [userIsGuest, setUserIsGuest] = useState(false);
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
  const handleGuestLogin = async () => {
    setUserIsGuest(true);
    queryClient.setQueryData(['getMe'], { user: guestData, organization: null });
    // Set onboarding as completed for guest users so they can access the app
    if (!isOnboardingCompleted) {
      await handleOnboardingCompleted(true);
    }
  };
  const logoutGuest = async () => {
    await queryClient.clear();
    setUserIsGuest(false);
  };

  return (
    <UserProviderContext.Provider
      value={{
        userIsGuest,
        logoutGuest,
        isInitialized,
        handleGuestLogin,
        isOnboardingCompleted,
        handleOnboardingCompleted,
      }}>
      {children}
    </UserProviderContext.Provider>
  );
};
