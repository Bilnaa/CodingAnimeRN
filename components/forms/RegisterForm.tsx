import React, { useState } from "react";
import { View as RNView, Text as RNText, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { register, googleAuth } from "../../services/auth.service";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { resetGoogleSignIn } from "../../utils/auth.utils";
import { useTheme } from "../../context/ThemeContext";
import { useThemeColors } from "../../components/useThemeColors";
import { View, Text } from "../../components/Themed";

export const RegisterForm = () => {
  const { colorScheme } = useTheme();
  const colors = useThemeColors();
  const isDark = colorScheme === "dark";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    general: ""
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validateInputs = () => {
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
      general: ""
    };
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password should be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const submitRegister = async () => {
    if (!validateInputs()) {
      return;
    }
    
    setLoading(true);
    setErrors({ email: "", password: "", confirmPassword: "", general: "" });
    
    try {
      await register(email, password, (message) => {
        if (message.includes("Email already in use")) {
          setErrors(prev => ({ ...prev, email: message }));
        } else if (message.includes("Invalid email")) {
          setErrors(prev => ({ ...prev, email: message }));
        } else if (message.includes("Password should be")) {
          setErrors(prev => ({ ...prev, password: message }));
        } else {
          setErrors(prev => ({ ...prev, general: message }));
        }
      });
      
      // Only navigate if no errors occurred
      if (!errors.email && !errors.password && !errors.general) {
        router.replace("/(app)/(tabs)");
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setErrors({ email: "", password: "", confirmPassword: "", general: "" });
    
    try {
      // Reset Google Sign-In to clear any previous state
      await resetGoogleSignIn().catch(() => {});
      
      const user = await googleAuth((message) => {
        setErrors(prev => ({ ...prev, general: message }));
      });
      
      if (user) {
        router.replace("/(app)/(tabs)");
      }
    } catch (error) {
      console.error("Google sign-up error:", error);
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
            backgroundColor: isDark ? colors.backgroundSecondary : '#f9f9f9'
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
            backgroundColor: isDark ? colors.backgroundSecondary : '#f9f9f9'
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

      <RNView style={styles.formGroup}>
        <RNView style={[
          styles.inputContainer, 
          { 
            borderColor: isDark ? colors.backgroundSecondary : '#ddd',
            backgroundColor: isDark ? colors.backgroundSecondary : '#f9f9f9'
          }
        ]}>
          <Ionicons 
            name="shield-checkmark-outline" 
            size={20} 
            color={isDark ? colors.textSecondary : '#666'} 
            style={styles.inputIcon} 
          />
          <TextInput 
            style={[
              styles.input,
              { color: isDark ? colors.text : '#333' }
            ]}
            placeholder="Confirm Password" 
            placeholderTextColor={isDark ? colors.textMuted : '#999'}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: "" }));
              }
            }}
            secureTextEntry={true}
            value={confirmPassword}
          />
        </RNView>
        {errors.confirmPassword ? <RNText style={styles.errorText}>{errors.confirmPassword}</RNText> : null}
      </RNView>
      
      <TouchableOpacity 
        style={[
          styles.registerButton,
          { backgroundColor: colors.primary }
        ]} 
        onPress={submitRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <RNText style={styles.registerButtonText}>Register</RNText>
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
        onPress={handleGoogleSignUp}
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
            ]}>Sign up with Google</RNText>
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
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 8,
  },
  registerButton: {
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
  registerButtonText: {
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
    paddingHorizontal: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  googleIcon: {
    marginRight: 8,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
});