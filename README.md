# Booklee 📚

A modern React Native booking application built with Expo Router and TypeScript, featuring authentication, video splash screen, onboarding, and a beautiful UI with custom components.

## 🚀 Features

- **Video Splash Screen** - Engaging video introduction using expo-video
- **Better Auth Integration** - Complete authentication system with email/password and Google OAuth
- **Password Reset Flow** - Email-based password reset with resend functionality and timer
- **Dual User Roles** - Separate experiences for customers and business owners (dashboard)
- **Onboarding Experience** - Beautiful multi-step onboarding with custom illustrations
- **Modern UI Components** - Custom design system with configurable components
- **Tab Navigation** - Customer app with Home, Search, Favorites, Bookings, and Account tabs
- **Dashboard Interface** - Business owner dashboard with Analytics, Calendar, and Account management
- **Toast Notifications** - Configurable toast system with multiple variants
- **Type Safety** - Full TypeScript support with strict typing
- **Custom Fonts** - Montserrat font family integration
- **Responsive Design** - Optimized for both iOS and Android
- **Real-time Updates** - TanStack Query for efficient data fetching and caching

## 📱 Tech Stack

- **Framework**: [Expo](https://expo.dev/) with SDK 53
- **Navigation**: [Expo Router](https://expo.github.io/router/) with file-based routing
- **Language**: TypeScript
- **Authentication**: [Better Auth](https://www.better-auth.com/) - Modern authentication library
- **State Management**: React Context + TanStack Query (React Query v5)
- **Styling**: React Native StyleSheet with custom theme system
- **Video**: Expo Video for splash screen and media playback
- **Icons**: Custom SVG icons with React Native
- **Animations**: React Native Reanimated 3
- **Forms & Validation**: Zod for schema validation
- **Storage**: Expo SecureStore for sensitive data persistence
- **Maps**: Google Maps integration for location services
- **Notifications**: Toastify React Native

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
cd booklee
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
EXPO_PUBLIC_API_URL=your-api-url
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 4. Prebuild (Generate Native Code)

**⚠️ REQUIRED STEP:** Generate the native iOS and Android directories before running the app:

```bash
npm run prebuild
```

This command:

- Generates native `ios/` and `android/` directories
- Configures native dependencies (expo-video, Google Maps, Better Auth, etc.)
- Sets up the development build environment
- **Must be run before first launch and after adding new native dependencies**

### 5. Run the App

After prebuild completes, run the app on your preferred platform:

#### iOS (macOS only)

```bash
npm run ios
```

This will:

- Build the iOS app
- Launch the iOS Simulator
- Start the Metro bundler

#### Android

```bash
npm run android
```

This will:

- Build the Android app
- Launch the Android Emulator (must be running)
- Start the Metro bundler

#### Alternative: Start Metro Separately

You can also start the development server separately:

```bash
npm start
```

Then press:

- `i` for iOS simulator
- `a` for Android emulator
- `w` for web (limited support)

## 🏗️ Project Structure

```
booklee/
├── app/                              # Expo Router pages
│   ├── (authenticated)/              # Customer app routes (protected)
│   │   ├── (tabs)/                  # Customer tab navigation
│   │   │   ├── index.tsx           # Home/Explore
│   │   │   ├── search/             # Search flow
│   │   │   ├── favorites.tsx       # Saved locations
│   │   │   ├── bookings/           # User bookings
│   │   │   └── account.tsx         # User account
│   │   └── (screens)/              # Additional screens
│   │       ├── booking/            # Booking flow
│   │       ├── location/           # Location details
│   │       └── settings/           # Settings screens
│   ├── (dashboard)/                  # Business owner routes (protected)
│   │   ├── (tabs)/                  # Dashboard tab navigation
│   │   │   ├── index.tsx           # Dashboard home
│   │   │   ├── analytics.tsx       # Business analytics
│   │   │   ├── calendar.tsx        # Appointment calendar
│   │   │   └── account.tsx         # Business account
│   │   └── (screens)/              # Dashboard screens
│   │       └── dashboard/          # Dashboard features
│   ├── (unauthenticated)/           # Public routes
│   │   ├── login/                  # Login & password reset
│   │   │   ├── index.tsx          # Login screen
│   │   │   └── forgot-password/   # Password reset flow
│   │   ├── signup/                 # Registration flow
│   │   │   ├── index.tsx          # Signup screen
│   │   │   └── email-verification.tsx
│   │   └── onboarding/            # App introduction
│   ├── index.tsx                   # Video splash screen
│   ├── _layout.tsx                 # Root layout
│   └── +not-found.tsx              # 404 screen
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── base/                  # Base components (Text, Icon, etc.)
│   │   ├── buttons/               # Button variants
│   │   ├── textInputs/            # Input components with validation
│   │   ├── modals/                # Modal components
│   │   ├── calendars/             # Calendar components
│   │   ├── booking/               # Booking-related components
│   │   ├── preview/               # Preview cards & components
│   │   └── utils/                 # Utility components
│   ├── constants/                  # App constants
│   │   ├── theme.ts               # Theme configuration
│   │   ├── enums.ts               # App-wide enums
│   │   ├── images.ts              # Image constants
│   │   └── env.ts                 # Environment variables
│   ├── hooks/                      # Custom React hooks
│   │   ├── useTimer.ts            # Timer hook for resend functionality
│   │   ├── usePermissions.ts      # Permission handling
│   │   └── useDebouncing.ts       # Debounce hook
│   ├── services/                   # API services
│   │   ├── auth/                  # Authentication (Better Auth)
│   │   ├── appointments/          # Booking management
│   │   ├── locations/             # Location services
│   │   ├── user/                  # User management
│   │   ├── dashboard/             # Dashboard analytics
│   │   └── axios/                 # HTTP client & interceptors
│   ├── store/                      # Global state management
│   │   ├── userProvider.tsx       # User context
│   │   └── index.ts
│   ├── assets/                     # Static assets
│   │   ├── fonts/                 # Montserrat font family
│   │   ├── icons/                 # SVG icons
│   │   ├── images/                # Image assets
│   │   └── splashVideo.mp4        # Splash screen video
│   └── helper/                     # Helper functions
│       └── validation/            # Form validation utilities
├── ios/                            # iOS native code (generated)
├── android/                        # Android native code (generated)
├── app.config.ts                   # Expo configuration
├── eas.json                        # EAS Build configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies
```

## 🎨 Design System

The app features a comprehensive design system with:

- **Custom Text Component** - Configurable typography with Montserrat fonts (Regular, Medium, SemiBold, Bold)
- **Icon System** - Custom SVG icons with consistent styling and theming
- **Toast System** - Four notification variants (success, error, info, warning) with custom components
- **Theme Configuration** - Centralized theme with:
  - Color palette (neutrals, primary blues/greens, secondary colors, messaging colors)
  - Spacing system (xs to 3xl)
  - Border radii (xs to full)
  - Typography variants (body, headlines, CTA styles)
  - Shadow presets
- **Input Components** - Multiple input variants (email, password, phone, text) with validation
- **Button Components** - Primary and secondary buttons with loading states
- **Modal System** - Reusable modal components with Bottom Sheet integration
- **Card Components** - Location previews, booking cards, analytics cards

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

### Core

- **expo** (SDK 53) - React Native framework
- **expo-router** - File-based navigation and routing
- **react-native** - Core mobile framework
- **typescript** - Type safety

### Authentication & API

- **better-auth** - Modern authentication library with email/password and OAuth
- **@tanstack/react-query** (v5) - Server state management and data fetching
- **axios** - HTTP client with interceptors
- **zod** - Schema validation

### UI & Interactions

- **react-native-reanimated** (v3) - High-performance animations
- **react-native-gesture-handler** - Gesture recognition
- **@gorhom/bottom-sheet** - Bottom sheet modals
- **toastify-react-native** - Toast notifications
- **react-native-keyboard-controller** - Keyboard management
- **expo-video** - Video playback for splash screen

### Maps & Location

- **react-native-google-maps** - Google Maps integration
- **expo-location** - Location services

### Storage & Security

- **expo-secure-store** - Secure token storage
- **@react-native-async-storage/async-storage** - Local data persistence

### Development

- **reactotron-react-native** - Debugging and development tools

## 🔐 Authentication

The app includes a complete authentication system powered by Better Auth:

### Features

- **Email/Password Authentication** - Traditional email and password login
- **Google OAuth** - Social authentication with Google
- **Password Reset** - Email-based password reset with resend timer
- **Email Verification** - Verify user email addresses
- **Secure Storage** - Tokens stored using Expo SecureStore
- **Route Protection** - Automatic route guarding based on auth state
- **Session Management** - Better Auth session handling with auto-refresh
- **Dual User Roles** - Customer and business owner authentication flows

### Implementation

- Better Auth client with cookie-based sessions
- Axios interceptors for authenticated requests
- React Query integration for user data fetching
- Protected route groups: `(authenticated)` and `(dashboard)`
- Automatic redirect to login for unauthenticated users

## 🎯 App Flow

### User Journey

1. **Video Splash Screen** - Engaging video introduction (can be skipped)
2. **Onboarding** - Multi-step introduction to app features
3. **Authentication** - Login or signup with email/password or Google
4. **Main App** - Access based on user role:

#### Customer Experience

- **Home/Explore** - Discover locations and services
- **Search** - Advanced search with filters
- **Favorites** - Saved locations for quick access
- **Bookings** - Manage appointments and reservations
- **Account** - Profile settings and preferences

#### Business Owner Dashboard

- **Dashboard** - Overview of business metrics
- **Analytics** - Detailed business insights and reports
- **Calendar** - Appointment management and scheduling
- **Account** - Business profile and settings

## 🎯 Environment Variants

The app supports multiple build variants:

- **Development** (`APP_VARIANT=development`) - Full debugging, dev tools, Reactotron enabled
- **Preview** (`APP_VARIANT=preview`) - Staging environment for testing
- **Production** (`APP_VARIANT=production`) - Optimized production build

## ⚡ Quick Start (TL;DR)

For experienced developers who want to get started quickly:

```bash
# 1. Clone and install
git clone <your-repo-url>
cd booklee
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your API keys

# 3. Generate native code (REQUIRED)
npm run prebuild

# 4. Run the app
npm run ios          # For iOS
# OR
npm run android      # For Android
```

## 📄 License

This project is private and proprietary.

## 👥 Contributing

This is a private project. Please follow the established code style and patterns when contributing.

---

**Need help?** Check the [Expo Documentation](https://docs.expo.dev/) or [React Native Documentation](https://reactnative.dev/docs/getting-started) for more information.
