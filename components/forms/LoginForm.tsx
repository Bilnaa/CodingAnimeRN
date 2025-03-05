import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { login, googleAuth } from "../../services/auth.service";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { resetGoogleSignIn } from "../../utils/auth.utils";

export const LoginForm = () => {
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
      
      router.replace("/(tabs)");
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
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Google login error:", error);
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
      
      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={submitLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
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
        onPress={handleGoogleLogin}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <ActivityIndicator color="#444" size="small" />
        ) : (
          <>
            <Ionicons name="logo-google" size={20} color="#444" style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
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
  inputContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
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
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  googleButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#444',
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