// Environment variables configuration
export const ENV = {
  FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  FIREBASE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID,
  FIREBASE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_FIREBASE_IOS_CLIENT_ID,
};

// Validate required environment variables
const validateEnv = () => {
  const requiredVars = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_WEB_CLIENT_ID'
  ];
  
  const missingVars = requiredVars.filter(varName => !ENV[varName as keyof typeof ENV]);
  
  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
};

// Log validation result during development
if (__DEV__) {
  const isValid = validateEnv();
  if (isValid) {
    console.log('Environment variables loaded successfully');
  }
}

export default ENV; 