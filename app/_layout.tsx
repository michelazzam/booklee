/* eslint-disable @typescript-eslint/no-require-imports */
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useEffect, useMemo, useState } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';
import ToastManager from 'toastify-react-native';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';

import { UserProvider, useUserProvider } from '~/src/store';
import { AuthServices } from '~/src/services';

import { CustomToast } from '~/src/components/base';

// Allow Reactotron to be used in development mode
if (__DEV__) {
  require('../ReactotronConfig');
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});
const toastConfig = {
  success: (props: any) => (
    <CustomToast type="success" title={props.text1} onPress={props.hide} message={props.text2} />
  ),
  error: (props: any) => (
    <CustomToast type="error" title={props.text1} onPress={props.hide} message={props.text2} />
  ),
  info: (props: any) => (
    <CustomToast type="info" title={props.text1} message={props.text2} onPress={props.hide} />
  ),
  warning: (props: any) => (
    <CustomToast type="warning" title={props.text1} onPress={props.hide} message={props.text2} />
  ),
};

const Navigation = () => {
  /*** States ***/
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  /*** Constants ***/
  const { isInitialized } = useUserProvider();
  const { isFetched: isUserFetched } = AuthServices.useGetMe();
  const { isAuthenticated, isLoading: isAuthLoading } = AuthServices.useGetBetterAuthUser();
  const [fontsLoaded] = useFonts({
    'Montserrat-Bold': require('../src/assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Medium': require('../src/assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Regular': require('../src/assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-SemiBold': require('../src/assets/fonts/Montserrat-SemiBold.ttf'),
  });

  /*** Memoization ***/
  const appInitialized = useMemo(() => {
    if (!isFirstLaunch) {
      return true;
    }

    if (!(fontsLoaded && isInitialized) && isAuthLoading) {
      return false;
    }

    // If not authenticated, we can hide
    if (!isAuthenticated) {
      return true;
    }

    // If authenticated, wait for user to be fetched
    return !!isUserFetched;
  }, [fontsLoaded, isInitialized, isAuthLoading, isAuthenticated, isUserFetched, isFirstLaunch]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
    }

    if (appInitialized) {
      setTimeout(() => {
        SplashScreen.hideAsync();
        // Mark first launch as complete
        setIsFirstLaunch(false);
      }, 1000);
    }
  }, [appInitialized]);

  if (!appInitialized) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />

      <Slot
        screenOptions={{
          animation: 'fade',
          contentStyle: { backgroundColor: '#ffffff' },
        }}
      />
    </>
  );
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <KeyboardProvider>
              <UserProvider>
                <Navigation />
                <ToastManager config={toastConfig} useModal={false} />
              </UserProvider>
            </KeyboardProvider>
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
