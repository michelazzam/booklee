import { type AppVariantType } from '~/src/constants';
import { type ExpoConfig } from 'expo/config';
import 'dotenv/config';

const appVariant = process.env.APP_VARIANT as AppVariantType;

const getAppName = () => {
  if (appVariant === 'development') {
    return 'Booklee (Dev)';
  }

  if (appVariant === 'preview') {
    return 'Booklee (Preview)';
  }

  return 'Booklee';
};
const getAppUniqueIdentifier = () => {
  // if (appVariant === 'development') {
  //   return 'app.booklee.dev';
  // }

  // if (appVariant === 'preview') {
  //   return 'app.booklee.preview';
  // }

  return 'app.booklee';
};

const config: ExpoConfig = {
  slug: 'booklee',
  version: '1.0.1',
  scheme: 'booklee',
  name: getAppName(),
  newArchEnabled: true,
  owner: 'michel.azzam',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: false,
    usesAppleSignIn: true,
    bundleIdentifier: getAppUniqueIdentifier(),
    icon: './src/assets/images/appImages/appleIcon.png',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSLocationWhenInUseUsageDescription:
        'This app requires your location to provide map services and find nearby locations.',
      NSLocationAlwaysAndWhenInUseUsageDescription:
        'This app requires your location to provide map services and find nearby locations.',
    },
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
  android: {
    edgeToEdgeEnabled: true,
    package: getAppUniqueIdentifier(),
    icon: './src/assets/images/appImages/appleIcon.png',
    adaptiveIcon: {
      foregroundImage: './src/assets/images/appImages/androidIcon.png',
      backgroundImage: './src/assets/images/appImages/androidBackground.png',
    },
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
  },
  plugins: [
    'expo-router',
    'expo-apple-authentication',
    [
      'expo-splash-screen',
      {
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#476c80',
        image: './src/assets/images/splashIcon.png',
      },
    ],
  ],
  extra: {
    eas: {
      projectId: 'ae00c1a5-c13e-414f-9a35-2dcacf670b7e',
    },
  },
  updates: {
    url: 'https://u.expo.dev/ae00c1a5-c13e-414f-9a35-2dcacf670b7e',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  experiments: {
    typedRoutes: true,
  },
};

export default config;
