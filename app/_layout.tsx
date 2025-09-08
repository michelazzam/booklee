import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as NavigationBar from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';
import ToastManager from 'toastify-react-native';
import { useEffect, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';

import { UserProvider, useUserProvider } from '~/src/store';
// import { AuthServices } from "~/src/services";

import { CustomToast } from '~/src/components/base/toast';

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
  /*** Constants ***/
  const { isInitialized } = useUserProvider();
  // const { isFetched: isUserFetched } = AuthServices.useGetMe();
  const [fontsLoaded] = useFonts({
    'Montserrat-Regular': require('../src/assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Medium': require('../src/assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-SemiBold': require('../src/assets/fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-Bold': require('../src/assets/fonts/Montserrat-Bold.ttf'),
  });

  /*** Memoization ***/
  const isAppReady = useMemo(() => {
    let isReady = fontsLoaded && isInitialized;

    // if (tokens?.accessToken) {
    //   isReady = isUserFetched;
    // }

    return isReady;
  }, [fontsLoaded, isInitialized]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
    }

    if (isAppReady) {
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!isAppReady) {
    return null;
  }

  return (
    <>
      <Slot
        screenOptions={{
          animation: 'fade',
          contentStyle: { backgroundColor: '#ffffff' },
        }}
      />
      <StatusBar style="auto" />
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
                <ToastManager config={toastConfig} />
                <Navigation />
              </UserProvider>
            </KeyboardProvider>
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
