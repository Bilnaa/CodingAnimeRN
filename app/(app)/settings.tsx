import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View as RNView } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useTheme, ThemeType } from '../../context/ThemeContext';
import { useThemeColors } from '../../components/useThemeColors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import Colors from '../../constants/Colors';

export default function SettingsScreen() {
  const { theme, setTheme } = useTheme();
  const colors = useThemeColors();
  
  // Theme options with typed icons and colors - removed Light and Dark options
  const themeOptions: { 
    label: string; 
    value: ThemeType; 
    icon: any;
    lightColor: string;
    darkColor: string;
  }[] = [
    { 
      label: 'System Default', 
      value: 'system', 
      icon: 'phone-portrait-outline',
      lightColor: colors.primary,
      darkColor: colors.primary
    },
    { 
      label: 'Purple', 
      value: 'purple', 
      icon: 'color-palette-outline',
      lightColor: Colors.purple.light.primary,
      darkColor: Colors.purple.dark.primary
    },
    { 
      label: 'Blue', 
      value: 'blue', 
      icon: 'color-palette-outline',
      lightColor: Colors.blue.light.primary,
      darkColor: Colors.blue.dark.primary
    },
    { 
      label: 'Green', 
      value: 'green', 
      icon: 'color-palette-outline',
      lightColor: Colors.green.light.primary,
      darkColor: Colors.green.dark.primary
    },
  ];

  return (
    <>
      {/* Hide the default header */}
      <Stack.Screen options={{ headerShown: false }} />
      
      <SafeAreaView 
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        </View>
        
        <ScrollView 
          style={[styles.container, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.section, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
            
            <RNView style={styles.themeOptionsContainer}>
              {themeOptions.map((option) => (
                <TouchableOpacity 
                  key={option.value}
                  style={[
                    styles.themeOption,
                    theme === option.value && { 
                      borderColor: colors.primary,
                      borderWidth: 2,
                      backgroundColor: colors.primary + '10'
                    }
                  ]}
                  onPress={() => setTheme(option.value)}
                >
                  <RNView style={styles.themeOptionContent}>
                    <RNView style={styles.colorPreviewContainer}>
                      <RNView 
                        style={[
                          styles.colorPreview, 
                          { backgroundColor: option.lightColor }
                        ]}
                      >
                        <Ionicons 
                          name={option.icon} 
                          size={20} 
                          color={option.value === 'system' ? '#FFFFFF' : '#FFFFFF'} 
                        />
                      </RNView>
                      
                      {option.value !== 'system' && (
                        <RNView 
                          style={[
                            styles.colorPreviewDark, 
                            { backgroundColor: option.darkColor }
                          ]}
                        />
                      )}
                    </RNView>
                    
                    <RNView style={styles.themeTextContainer}>
                      <Text style={[styles.themeOptionText, { color: colors.text }]}>
                        {option.label}
                      </Text>
                      {option.value === 'system' && (
                        <Text style={[styles.themeOptionSubtext, { color: colors.textSecondary }]}>
                          Follows your device light/dark settings
                        </Text>
                      )}
                    </RNView>
                  </RNView>
                  
                  {theme === option.value && (
                    <RNView style={[styles.checkmarkContainer, { backgroundColor: colors.primary }]}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </RNView>
                  )}
                </TouchableOpacity>
              ))}
            </RNView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
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
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  themeOptionsContainer: {
    gap: 12,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  themeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorPreviewContainer: {
    position: 'relative',
    width: 40,
    height: 40,
    marginRight: 16,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  colorPreviewDark: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  themeTextContainer: {
    flex: 1,
  },
  themeOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  themeOptionSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 