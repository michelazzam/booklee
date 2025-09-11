import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';

import { apiClient } from '~/src/services/axios/interceptor';

type UserProviderType = {
  token: string | null;
  isInitialized: boolean;
  deleteTokenFromStorage: () => Promise<void>;
  saveTokenToStorage: (newToken: string) => Promise<void>;
};

const UserProviderContext = createContext<UserProviderType>({
  token: null,
  isInitialized: false,
  saveTokenToStorage: async () => {},
  deleteTokenFromStorage: async () => {},
});

const STORAGE_KEYS = {
  TOKEN: 'user_token',
} as const;

export const useUserProvider = () => useContext(UserProviderContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  /***** Constants *****/
  const queryClient = useQueryClient();

  /***** State ******/
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const [savedToken] = await Promise.all([AsyncStorage.getItem(STORAGE_KEYS.TOKEN)]);

        if (savedToken) {
          // Handle both plain string and JSON stringified tokens
          let token = savedToken;
          try {
            // Try to parse as JSON in case it was stringified
            const parsed = JSON.parse(savedToken);
            if (typeof parsed === 'string') {
              token = parsed;
            }
          } catch {
            // If parsing fails, use the original string
            token = savedToken;
          }

          setToken(token);
          apiClient.defaults.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error loading persisted state:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadPersistedState();
  }, []);

  const saveTokenToStorage = async (newTokens: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, newTokens);
      setToken(newTokens);
      apiClient.defaults.headers.Authorization = `Bearer ${newTokens}`;
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  };
  const deleteTokenFromStorage = async () => {
    setToken(null);
    delete apiClient.defaults.headers.Authorization;
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);

    // Use a small delay to prevent race conditions with navigation
    await new Promise((resolve) => setTimeout(resolve, 100));
    await queryClient.cancelQueries();
    queryClient.clear();
  };

  return (
    <UserProviderContext.Provider
      value={{
        token,
        isInitialized,
        saveTokenToStorage,
        deleteTokenFromStorage,
      }}>
      {children}
    </UserProviderContext.Provider>
  );
};
