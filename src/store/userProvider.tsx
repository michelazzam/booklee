import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authClient } from '../services/auth/auth-client';
import { useQueryClient } from '@tanstack/react-query';
import * as Location from 'expo-location';

import { apiClient } from '../services/axios/interceptor';

import { ENV, guestData } from '../constants';

type UserLocation = {
  lat: number;
  lng: number;
} | null;

type UserProviderType = {
  userIsGuest: boolean;
  isInitialized: boolean;
  logoutGuest: () => void;
  userLocation: UserLocation;
  handleGuestLogin: () => void;
  isOnboardingCompleted: boolean;
  handleOnboardingCompleted: (isOnboardingCompleted: boolean) => void;
};
const STORAGE_KEY = {
  onboardingCompleted: 'onboardingCompleted',
};

const UserProviderContext = createContext<UserProviderType>({
  userIsGuest: false,
  userLocation: null,
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
  const [userLocation, setUserLocation] = useState<UserLocation>(null);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    const cookies = authClient.getCookie();
    const headers = {
      Cookie: cookies,
      'x-vercel-protection-bypass': ENV.VERCEL_PROTECTION_BYPASS,
    };

    const getUserLocation = async (): Promise<UserLocation> => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
          return null;
        }

        const location = await Location.getCurrentPositionAsync({});
        return {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        };
      } catch (error) {
        console.error('Error getting user location:', error);
        return null;
      }
    };
    const getPersistentData = async () => {
      try {
        const [onboardingCompleted, location] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY.onboardingCompleted),
          getUserLocation(),
        ]);

        setIsOnboardingCompleted(onboardingCompleted === 'true');
        setUserLocation(location);
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
        userLocation,
        isInitialized,
        handleGuestLogin,
        isOnboardingCompleted,
        handleOnboardingCompleted,
      }}>
      {children}
    </UserProviderContext.Provider>
  );
};
