# Booklee 📚

A modern React Native booking application built with Expo Router and TypeScript, featuring authentication, onboarding, and a beautiful UI with custom components.

## 🚀 Features

- **Authentication System** - Complete login/signup flow with token management
- **Onboarding Experience** - Beautiful multi-step onboarding with custom illustrations
- **Modern UI Components** - Custom design system with configurable components
- **Tab Navigation** - Five-tab layout for Home, Search, Favorites, Bookings, and Account
- **Toast Notifications** - Configurable toast system with multiple variants
- **Type Safety** - Full TypeScript support with strict typing
- **Custom Fonts** - Montserrat font family integration
- **Responsive Design** - Optimized for both iOS and Android

## 📱 Tech Stack

- **Framework**: [Expo](https://expo.dev/) with SDK 53
- **Navigation**: [Expo Router](https://expo.github.io/router/) with file-based routing
- **Language**: TypeScript
- **State Management**: React Context + TanStack Query
- **Styling**: React Native StyleSheet with custom theme system
- **Icons**: Expo Vector Icons + Lucide React Native
- **Animations**: React Native Reanimated 3
- **Storage**: AsyncStorage for token persistence

## 🛠️ Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18 or later)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **iOS Simulator** (for iOS development)
- **Android Studio & Emulator** (for Android development)

## 🏃‍♂️ Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd bookly
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory (use `.env.example` as template):

```bash
cp .env.example .env
```

Configure your environment variables:

```env
APP_VARIANT=development
EXPO_PUBLIC_APP_VARIANT=development
EXPO_PUBLIC_ENABLE_API_LOGS=true
EXPO_PUBLIC_ENABLE_ASYNC_ERROR_LOGS=true
# Add your API URLs here
EXPO_PUBLIC_API_URL=your-api-url
```

### 4. Prebuild (Generate Native Code)

Generate the native iOS and Android directories:

```bash
npm run prebuild
```

This command:

- Generates native `ios/` and `android/` directories
- Configures native dependencies
- Sets up the development build environment

### 5. Start Development Server

```bash
npm start
```

This will start the Expo development server with options to:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app (for Expo Go builds)

## 📱 Running on Devices

### iOS

```bash
npm run ios
```

### Android

```bash
npm run android
```

### Web

```bash
npm run web
```

## 🏗️ Project Structure

```
bookly/
├── app/                          # Expo Router pages
│   ├── (authenticated)/          # Protected routes
│   │   ├── (tabs)/              # Main tab navigation
│   │   └── onboarding/          # Onboarding flow
│   ├── (unauthenticated)/       # Public routes
│   │   ├── login/               # Login screens
│   │   └── signup/              # Signup screens
│   └── _layout.tsx              # Root layout
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── base/                # Base components (Text, Icon, Toast)
│   │   ├── buttons/             # Button components
│   │   ├── textInputs/          # Input components
│   │   └── utils/               # Utility components
│   ├── constants/               # App constants and theme
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API services and hooks
│   ├── store/                   # Context providers
│   └── assets/                  # Images, fonts, icons
├── app.config.ts                # Expo configuration
└── package.json
```

## 🎨 Design System

The app features a comprehensive design system with:

- **Custom Text Component** - Configurable typography with Montserrat fonts
- **Icon System** - Unified icon components with consistent styling
- **Toast System** - Configurable notifications with multiple variants
- **Theme Configuration** - Centralized colors, spacing, and typography
- **Button Components** - Multiple button variants with loading states

## 🔧 Available Scripts

### Development

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser

### Building

- `npm run prebuild` - Generate native directories
- `npm run build:dev` - Development build for all platforms
- `npm run build:prod` - Production build for all platforms
- `npm run build:dev:ios` - Development build for iOS only
- `npm run build:prod:android` - Production build for Android only

### Updates & Deployment

- `npm run update:dev` - Push development update
- `npm run update:prod` - Push production update
- `npm run submit:prod` - Submit to app stores

### Code Quality

- `npm run lint` - Run ESLint and Prettier checks
- `npm run format` - Auto-fix linting and formatting issues

## 🚨 Troubleshooting

### Prebuild Issues

If you encounter prebuild errors:

```bash
# Clean and regenerate native directories
rm -rf ios android
npm run prebuild --clean
```

### Metro Cache Issues

```bash
# Clear Metro cache
npx expo start --clear
```

### iOS Build Issues

```bash
# Clean iOS build
cd ios && xcodebuild clean && cd ..
npm run ios
```

### Android Build Issues

```bash
# Clean Android build
cd android && ./gradlew clean && cd ..
npm run android
```

## 📦 Key Dependencies

- **expo-router** - File-based navigation system
- **@tanstack/react-query** - Server state management
- **react-native-reanimated** - High-performance animations
- **@gorhom/bottom-sheet** - Bottom sheet components
- **react-native-gesture-handler** - Gesture recognition
- **toastify-react-native** - Toast notification system

## 🔐 Authentication

The app includes a complete authentication system with:

- Token-based authentication
- Secure token storage with AsyncStorage
- Automatic token refresh handling
- Route protection based on authentication state

## 🎯 Environment Variants

The app supports multiple build variants:

- **Development** - Full debugging, dev tools enabled
- **Preview** - Staging environment for testing
- **Production** - Optimized production build

## 📄 License

This project is private and proprietary.

## 👥 Contributing

This is a private project. Please follow the established code style and patterns when contributing.

---

**Need help?** Check the [Expo Documentation](https://docs.expo.dev/) or [React Native Documentation](https://reactnative.dev/docs/getting-started) for more information.
