import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { ActivityIndicator } from "react-native";

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if(!user) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
