> [!WARNING]  
> This is a school project, it's not a personal project every contributor has rights to this code. It is proprietary.
# AniVault

A React Native application for anime enthusiasts that allows you to track what you like with authentication features.

## Made by 
Group 1

- Nabil Noufele MEHDI
- Nils DARGENT
- Mathis ZERARI
- Diego CARVALHO DOS SANTOS

## Features

- User authentication (Email/Password and Google Sign-In)
- Anime browsing, discovery and information page
- User profiles
- __We get the data from this API : [Jikan API](https://jikan.moe/)__
- __We use this library to interact with the API : [Jikan TS](https://github.com/tutkli/jikan-ts)__

## Setup

### Prerequisites

- Node.js
- Yarn or npm
- React Native development environment
- Firebase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   yarn install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID=your_firebase_web_client_id
   EXPO_PUBLIC_FIREBASE_IOS_CLIENT_ID=your_firebase_ios_client_id
   ```

### Setting up Google Sign-In

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Authentication > Sign-in method
4. Enable Google Sign-In
5. Add your app's SHA-1 fingerprint:
   - For debug: `cd android && ./gradlew signingReport`
   - Look for the SHA-1 fingerprint in the debug section
6. Go to the [Google Cloud Console](https://console.cloud.google.com/)
7. Select your Firebase project
8. Go to APIs & Services > Credentials
9. Find the Web Client ID (OAuth 2.0 Client ID with type "Web application")
10. Add this Web Client ID to your `.env` file as `EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID`

### Running the app

```
yarn start
```

Then choose your platform:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for web

## Project Structure

- `app/` - Expo Router screens
- `components/` - Reusable components
- `services/` - API and authentication services
- `config/` - Configuration files
- `context/` - React context providers
- `constants/` - Constants and theme files

## Authentication Flow

The app supports two authentication methods:

1. **Email/Password Authentication**:
   - Users can register with email and password
   - Form validation ensures secure passwords
   - Error messages are displayed under each input field

2. **Google Sign-In**:
   - Users can sign in with their Google account
   - Uses `@react-native-google-signin/google-signin` package
   - Requires proper setup in Firebase console

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 
