import { type AppVariantType } from "~/src/constants";
import { type ExpoConfig } from "expo/config";

const appVariant = process.env.APP_VARIANT as AppVariantType;

const getAppName = () => {
  if (appVariant === "development") {
    return "Booklee (Dev)";
  }

  if (appVariant === "preview") {
    return "Booklee (Preview)";
  }

  return "Booklee";
};
const getAppUniqueIdentifier = () => {
  if (appVariant === "development") {
    return "app.booklee.dev";
  }

  if (appVariant === "preview") {
    return "app.booklee.preview";
  }

  return "app.booklee";
};

const config: ExpoConfig = {
  slug: "booklee",
  version: "1.0.0",
  scheme: "booklee",
  name: getAppName(),
  newArchEnabled: true,
  owner: "michel.azzam",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  ios: {
    supportsTablet: true,
    icon: "./src/assets/images/appImages/icon.png",
    bundleIdentifier: getAppUniqueIdentifier(),
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    edgeToEdgeEnabled: true,
    package: getAppUniqueIdentifier(),
    icon: "./src/assets/images/appImages/icon.png",
    adaptiveIcon: {
      backgroundColor: "#ffffff",
      foregroundImage: "./src/assets/images/appImages/icon.png",
    },
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./src/assets/images/appImages/icon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        image: "./src/assets/images/appImages/icon.png",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
