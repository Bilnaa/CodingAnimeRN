import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { register, googleAuth } from "../../services/auth.service";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { resetGoogleSignIn } from "../../utils/auth.utils";

export const RegisterForm = () => {
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
        router.replace("/(tabs)");
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
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Google sign-up error:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput 
            style={styles.input}
            placeholder="Email" 
            placeholderTextColor="#999"
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
        </View>
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
      </View>
      
      <View>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput 
            style={styles.input}
            placeholder="Password" 
            placeholderTextColor="#999"
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) {
                setErrors(prev => ({ ...prev, password: "" }));
              }
            }}
            secureTextEntry={true}
            value={password}
          />
        </View>
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
      </View>

      <View>
        <View style={styles.inputContainer}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput 
            style={styles.input}
            placeholder="Confirm Password" 
            placeholderTextColor="#999"
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: "" }));
              }
            }}
            secureTextEntry={true}
            value={confirmPassword}
          />
        </View>
        {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
      </View>
      
      <TouchableOpacity 
        style={styles.registerButton} 
        onPress={submitRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.registerButtonText}>Register</Text>
        )}
      </TouchableOpacity>
      
      {errors.general ? <Text style={styles.generalErrorText}>{errors.general}</Text> : null}
      
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.divider} />
      </View>
      
      <TouchableOpacity 
        style={styles.googleButton} 
        onPress={handleGoogleSignUp}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <ActivityIndicator color="#444" size="small" />
        ) : (
          <>
            <Ionicons name="logo-google" size={20} color="#444" style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Sign up with Google</Text>
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
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 8,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#6200ee',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    paddingHorizontal: 16,
    color: '#666',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
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
    color: '#444',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  generalErrorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
  },
});