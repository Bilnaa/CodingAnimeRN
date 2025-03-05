# Firebase Setup Guide for Android

## Adding SHA-1 Certificate Fingerprint to Firebase

Your debug SHA-1 fingerprint is:
```
5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
```

Follow these steps to add it to your Firebase project:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project: "coding-anime"
3. Click on the gear icon (⚙️) next to "Project Overview" and select "Project settings"
4. Scroll down to the "Your apps" section and select the Android app (com.bilna.CodingAnimeRN)
5. In the "SHA certificate fingerprints" section, click "Add fingerprint"
6. Enter the SHA-1 fingerprint: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
7. Click "Save"
8. Download the updated `google-services.json` file
9. Replace the existing file in your project at `android/app/google-services.json`

## Verifying Google Sign-In Configuration

Make sure your `google-services.json` file contains:
1. The correct package name: `com.bilna.CodingAnimeRN`
2. The SHA-1 certificate fingerprint you just added
3. The correct OAuth client IDs

## Rebuilding Your App

After making these changes, rebuild your app:

```bash
cd android && ./gradlew clean && cd .. && npx expo run:android
```

## Debugging Tips

If you're still having issues:

1. Check the logs for specific error messages
2. Verify that Google Play Services is up to date on your device/emulator
3. Make sure your device has internet connectivity
4. Try clearing the app data and cache
5. Ensure you're using the latest version of the Google Sign-In library 