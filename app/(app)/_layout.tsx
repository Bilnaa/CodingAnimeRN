import React from 'react';
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { ActivityIndicator, StatusBar } from "react-native";
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AppLayout() {
  const { user, loading } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  if (loading) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
        <ActivityIndicator 
          size="large" 
          color={colors.primary} 
          style={{ flex: 1, backgroundColor: colors.background }} 
        />
      </SafeAreaProvider>
    );
  }

  if(!user) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="category" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
