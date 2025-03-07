import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "@firebase/auth";
import { auth } from "../config/firebase.config";
import { FirebaseError } from "@firebase/app";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import ENV from '../config/env.config';

// Initialize Google Sign-In with platform-specific configuration
GoogleSignin.configure({
    webClientId: ENV.FIREBASE_WEB_CLIENT_ID,
    iosClientId: Platform.OS === 'ios' ? ENV.FIREBASE_IOS_CLIENT_ID : undefined,
    offlineAccess: true,
    forceCodeForRefreshToken: true,
});

export const register = async (email: string, password: string, setError: (message: string) => void) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password)
    }
    catch (e: any) {
        const err = e as FirebaseError
        if(err.code === "auth/email-already-in-use") {
            setError("Email already in use")
        }
        else if(err.code === "auth/invalid-email") {
            setError("Invalid email")
        }
        else if(err.code === "auth/weak-password") {
            setError("Password should be at least 6 characters")
        }
        else {
            setError("An unexpected error occurred, please try in a few seconds")
        }
    }
}

export const login = async (email: string, password: string, setError: (message: string) => void) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
    }
    catch (e: any) {
        const err = e as FirebaseError
        if(err.code === "auth/invalid-credential") {
            setError("Invalid credentials")
        }
        else {
            setError("An unexpected error occurred, please try in a few seconds")
        }
    }
}

export const googleAuth = async (setError: (message: string) => void) => {
    try {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

        // Sign in with Google
        await GoogleSignin.signIn();

        const { idToken } = await GoogleSignin.getTokens();
        
        // Create a Google credential with the token
        const googleCredential = GoogleAuthProvider.credential(idToken);
        
        // Sign-in with credential
        const userCredential = await signInWithCredential(auth, googleCredential);
        
        return userCredential.user;
    } catch (e: any) {
        console.error("Google Sign-In Error:", e);
        console.error("Error details:", JSON.stringify(e, null, 2));
        
        // Handle specific error messages based on the error code or message
        if (e.code === 'SIGN_IN_CANCELLED' || e.message?.includes('cancelled')) {
            setError("Sign-in process was cancelled");
        } else if (e.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
            setError("Google Play Services is not available on this device");
        } else if (e.code === 'auth/account-exists-with-different-credential') {
            setError("An account already exists with the same email address but different sign-in credentials");
        } else if (e.code === 'auth/popup-blocked') {
            setError("Sign-in popup was blocked by the browser");
        } else if (e.code === 'auth/popup-closed-by-user') {
            setError("Sign-in popup was closed before completing the sign-in");
        } else if (e.message?.includes('400') || e.message?.includes('invalid_request')) {
            setError("Authentication request was invalid. Check your Google configuration.");
        } else {
            setError("An error occurred with Google authentication");
        }
    }
}

export const logout = async () => {
    try {
        // Sign out from Firebase
        await auth.signOut();
        
        // Sign out from Google
        await GoogleSignin.signOut();
    } catch (error) {
        console.error("Logout Error:", error);
    }
}