import { GoogleSignin } from '@react-native-google-signin/google-signin';

/**
 * Resets Google Sign-In by signing out
 */
export const resetGoogleSignIn = async (): Promise<void> => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.error('Error resetting Google Sign-In:', error);
  }
}; 