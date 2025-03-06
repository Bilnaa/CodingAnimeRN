import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { useThemeColors } from '../../../components/useThemeColors';
import { logout } from "../../../services/auth.service";
import { useAuth } from '../../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const colors = useThemeColors();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Use the main background color for both themes
  const sectionBackground = colors.background;
  
  // Use theme-appropriate border colors
  const borderColor = colors.text === '#FFFFFF' 
    ? 'rgba(255,255,255,0.1)' 
    : 'rgba(0,0,0,0.1)';

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      // Navigation will be handled by the auth state change in AuthContext
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderUserInfo = () => {
    if (!user) {
      return (
        <View style={[styles.section, { backgroundColor: sectionBackground, borderColor }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Not signed in</Text>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={[styles.section, { backgroundColor: sectionBackground, borderColor }]}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user.photoURL ? (
              <Image 
                source={{ uri: user.photoURL }} 
                style={styles.avatar} 
              />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarText}>{user.email?.charAt(0).toUpperCase() || 'U'}</Text>
              </View>
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user.displayName || 'Anime Fan'}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {user.email}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Use theme-appropriate divider colors
  const dividerColor = borderColor;

  return (
    <SafeAreaView 
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      </View>
      
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        {renderUserInfo()}
        
        <View style={[styles.section, { backgroundColor: sectionBackground, borderColor, marginTop: 20 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
          
          
          <View style={[styles.divider, { backgroundColor: dividerColor }]} />
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="time" size={24} color={colors.primary} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Watch History</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: dividerColor }]} />
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings" size={24} color={colors.primary} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        {user && (
          <TouchableOpacity 
            style={[styles.logoutButton, { borderColor: colors.danger }]}
            onPress={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.danger} />
            ) : (
              <>
                <Ionicons name="log-out" size={20} color={colors.danger} />
                <Text style={[styles.logoutText, { color: colors.danger }]}>Logout</Text>
              </>
            )}
          </TouchableOpacity>
        )}
        
        <Text style={[styles.versionText, { color: colors.textSecondary }]}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  menuItemText: {
    flex: 1,
    fontSize: 18,
    marginLeft: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
  },
}); 