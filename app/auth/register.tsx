import { RegisterForm } from "../../components/forms/RegisterForm";
import { StyleSheet, SafeAreaView, Image, StatusBar } from "react-native";
import { Link } from "expo-router";
import { Text, View } from "../../components/Themed";
import { useTheme } from "../../context/ThemeContext";
import { useThemeColors } from "../../components/useThemeColors";

const RegisterView = () => {
  const { colorScheme } = useTheme();
  const colors = useThemeColors();
  const isDark = colorScheme === "dark";

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: colors.background }
    ]}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={isDark ? "#121212" : "#ffffff"}
      />
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Create Account</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign up to get started</Text>
      </View>

      <RegisterForm />

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>Already have an account? </Text>
        <Link href="/auth/login" style={[styles.link, { color: colors.primary }]}>Sign in</Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },
  footerText: {
  },
  link: {
    fontWeight: '600',
  },
});