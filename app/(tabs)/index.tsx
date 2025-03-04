import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from "@/context/AuthContext";

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { logout } from "@/services/auth.service";

export default function TabOneScreen() {

  const { user } = useAuth();

  if (!user) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
