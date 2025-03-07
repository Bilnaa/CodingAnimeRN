import { StyleSheet, SafeAreaView, Image, StatusBar } from "react-native";
import { Link } from "expo-router";
import { LoginForm } from "../../components/forms/LoginForm";
import { Text, View } from "../../components/Themed";
import { useTheme } from "../../context/ThemeContext";
import { useThemeColors } from "../../components/useThemeColors";

const LoginView = () => {
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
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign in to continue</Text>
      </View>
      
      <LoginForm />
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>Don't have an account? </Text>
        <Link href={"/auth/register"} style={[styles.link, { color: colors.primary }]}>Sign up</Link>
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

export default LoginView;