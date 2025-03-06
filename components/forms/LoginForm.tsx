import React, { useState } from "react";
import { View as RNView, Text as RNText, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { login, googleAuth } from "../../services/auth.service";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { resetGoogleSignIn } from "../../utils/auth.utils";
import { useTheme } from "../../context/ThemeContext";
import { useThemeColors } from "../../components/useThemeColors";
import { View, Text } from "../../components/Themed";

export const LoginForm = () => {
  const { colorScheme } = useTheme();
  const colors = useThemeColors();
  const isDark = colorScheme === "dark";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: ""
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validateInputs = () => {
    const newErrors = {
      email: "",
      password: "",
      general: ""
    };
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const submitLogin = async () => {
    // Validate inputs first
    const newErrors = validateInputs();
    if (Object.values(newErrors).some(error => error !== "")) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({
      email: "",
      password: "",
      general: ""
    });
    
    try {
      await login(email, password, (message) => {
        setErrors(prev => ({
          ...prev,
          general: message
        }));
      });
      
      router.replace("/(app)/(tabs)");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrors({
      email: "",
      password: "",
      general: ""
    });
    
    try {
      // Reset Google Sign-In to clear any previous state
      await resetGoogleSignIn().catch(() => {});
      
      const user = await googleAuth((message) => {
        setErrors(prev => ({
          ...prev,
          general: message
        }));
      });
      
      if (user) {
        router.replace("/(app)/(tabs)");
      }
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setGoogleLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <RNView style={styles.formGroup}>
        <RNView style={[
          styles.inputContainer, 
          { 
            borderColor: isDark ? colors.backgroundSecondary : '#ddd',
            backgroundColor: isDark ? colors.backgroundSecondary : '#fff'
          }
        ]}>
          <Ionicons 
            name="mail-outline" 
            size={20} 
            color={isDark ? colors.textSecondary : '#666'} 
            style={styles.inputIcon} 
          />
          <TextInput
            style={[
              styles.input,
              { color: isDark ? colors.text : '#333' }
            ]}
            placeholder="Email" 
            placeholderTextColor={isDark ? colors.textMuted : '#999'}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) {
                setErrors(prev => ({ ...prev, email: "" }));
              }
            }}
            value={email}
          />
        </RNView>
        {errors.email ? <RNText style={styles.errorText}>{errors.email}</RNText> : null}
      </RNView>
      
      <RNView style={styles.formGroup}>
        <RNView style={[
          styles.inputContainer, 
          { 
            borderColor: isDark ? colors.backgroundSecondary : '#ddd',
            backgroundColor: isDark ? colors.backgroundSecondary : '#fff'
          }
        ]}>
          <Ionicons 
            name="lock-closed-outline" 
            size={20} 
            color={isDark ? colors.textSecondary : '#666'} 
            style={styles.inputIcon} 
          />
          <TextInput
            style={[
              styles.input,
              { color: isDark ? colors.text : '#333' }
            ]}
            placeholder="Password" 
            placeholderTextColor={isDark ? colors.textMuted : '#999'}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) {
                setErrors(prev => ({ ...prev, password: "" }));
              }
            }}
            secureTextEntry={true}
            value={password}
          />
        </RNView>
        {errors.password ? <RNText style={styles.errorText}>{errors.password}</RNText> : null}
      </RNView>
      
      <TouchableOpacity 
        style={[
          styles.loginButton,
          { backgroundColor: colors.primary }
        ]} 
        onPress={submitLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <RNText style={styles.loginButtonText}>Login</RNText>
        )}
      </TouchableOpacity>
      
      {errors.general ? <RNText style={styles.generalErrorText}>{errors.general}</RNText> : null}
      
      <RNView style={styles.dividerContainer}>
        <RNView style={[styles.divider, { backgroundColor: isDark ? colors.backgroundSecondary : '#ddd' }]} />
        <Text style={styles.dividerText}>OR</Text>
        <RNView style={[styles.divider, { backgroundColor: isDark ? colors.backgroundSecondary : '#ddd' }]} />
      </RNView>
      
      <TouchableOpacity 
        style={[
          styles.googleButton,
          { 
            backgroundColor: isDark ? colors.backgroundSecondary : '#fff',
            borderColor: isDark ? colors.backgroundSecondary : '#ddd'
          }
        ]} 
        onPress={handleGoogleLogin}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <ActivityIndicator color={isDark ? colors.text : '#444'} size="small" />
        ) : (
          <>
            <Ionicons 
              name="logo-google" 
              size={20} 
              color={isDark ? colors.text : '#444'} 
              style={styles.googleIcon} 
            />
            <RNText style={[
              styles.googleButtonText,
              { color: isDark ? colors.text : '#444' }
            ]}>Sign in with Google</RNText>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  loginButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    marginLeft: 12,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  generalErrorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
  },
  googleIcon: {
    marginRight: 12,
  },
});