import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme types - removed 'light' and 'dark' options
export type ThemeType = 'system' | 'purple' | 'blue' | 'green';

// Define the context shape
type ThemeContextType = {
  theme: ThemeType;
  colorScheme: 'light' | 'dark';
  setTheme: (theme: ThemeType) => void;
};

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  colorScheme: 'light',
  setTheme: () => {},
});

// Storage key for persisting theme preference
const THEME_STORAGE_KEY = 'user-theme-preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get device color scheme
  const deviceColorScheme = useDeviceColorScheme() || 'light';
  
  // State for the user's theme preference
  const [theme, setThemeState] = useState<ThemeType>('system');
  
  // Always use device color scheme for light/dark mode
  const colorScheme = deviceColorScheme;

  // Log current theme state
  console.log('ThemeProvider - Current theme:', theme, 'colorScheme:', colorScheme);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        console.log('Loaded theme from storage:', savedTheme);
        if (savedTheme) {
          // Ensure the saved theme is still valid with our current options
          if (['system', 'purple', 'blue', 'green'].includes(savedTheme)) {
            console.log('Setting theme to:', savedTheme);
            setThemeState(savedTheme as ThemeType);
          }
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    
    loadTheme();
  }, []);

  // Function to set and save theme preference
  const setTheme = async (newTheme: ThemeType) => {
    console.log('Setting theme to:', newTheme);
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      console.log('Theme saved to storage:', newTheme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext); 