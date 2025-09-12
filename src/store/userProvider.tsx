import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthServices } from '../services/auth/hooks';
import { apiClient } from '../services/axios/interceptor';

type UserProviderType = {
  isInitialized: boolean;
  isOnboardingCompleted: boolean;
  handleOnboardingCompleted: (isOnboardingCompleted: boolean) => void;
  assignTokenToAxios: (token: string) => void;
  removeTokenFromAxios: () => void;
};
const STORAGE_KEY = {
  onboardingCompleted: 'onboardingCompleted',
};

const UserProviderContext = createContext<UserProviderType>({
  isInitialized: true,
  isOnboardingCompleted: false,
  handleOnboardingCompleted: () => {},
  assignTokenToAxios: () => {},
  removeTokenFromAxios: () => {},
});

export const useUserProvider = () => useContext(UserProviderContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  /*** States ***/
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const { data: session } = AuthServices.useSession();

  useEffect(() => {
    const getPersistentData = async () => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem(STORAGE_KEY.onboardingCompleted);
        setIsOnboardingCompleted(onboardingCompleted === 'true');

        if (session?.session.token) {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${session?.session.token}`;
        }
      } catch (error) {
        console.error('Error getting onboarding completed', error);
      } finally {
        setIsInitialized(true);
      }
    };

    getPersistentData();
  }, []);

  const assignTokenToAxios = (token: string) => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };
  const removeTokenFromAxios = () => {
    apiClient.defaults.headers.common['Authorization'] = '';
  };

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
        assignTokenToAxios,
        removeTokenFromAxios,
      }}>
      {children}
    </UserProviderContext.Provider>
  );
};
