import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { ActivityIndicator } from "react-native";

export {
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(app)/auth",
};

SplashScreen.preventAutoHideAsync();

// Wrapper component to use the theme context
function ThemedApp() {
  const { colorScheme, theme } = useTheme();
  const router = useRouter();
  
  // Force a refresh when the theme changes
  useEffect(() => {
    console.log('Theme changed in ThemedApp:', theme);
    // This will force a re-render of the current screen
    const timeout = setTimeout(() => {
      router.setParams({ refresh: Date.now().toString() });
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [theme]);
  
  return (
    <NavigationThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Slot/>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <ActivityIndicator size="large"/>;
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </AuthProvider>
  );
}