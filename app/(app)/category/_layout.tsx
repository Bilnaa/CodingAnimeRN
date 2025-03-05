import { Stack } from 'expo-router';
import Colors from '../../../constants/Colors';
import { useColorScheme } from '../../../components/useColorScheme';

export default function CategoryLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: true }} />
    </Stack>
  );
} 