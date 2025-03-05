// Define a cohesive color palette
const primaryColor = '#6200EE'; // Primary purple - consistent across modes
const secondaryLight = '#03DAC6'; // Teal accent
const secondaryDark = '#03DAC6';
const accentLight = '#FF5252'; // Red accent for important actions
const accentDark = '#FF5252';

export default {
  light: {
    // Base colors
    primary: primaryColor,
    secondary: secondaryLight,
    accent: accentLight,
    
    // Text colors
    text: '#121212',
    textSecondary: '#666666',
    textMuted: '#999999',
    
    // Background colors
    background: '#F8F9FA',
    backgroundSecondary: '#F0F2F5',
    card: '#FFFFFF',
    cardBorder: '#E0E0E0',
    
    // UI elements
    tint: primaryColor,
    tabIconDefault: '#CCCCCC',
    tabIconSelected: primaryColor,
    
    // Status colors
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
    
    // Gradients
    gradientStart: 'transparent',
    gradientMiddle: 'rgba(0,0,0,0.6)',
    gradientEnd: 'rgba(0,0,0,0.85)',
  },
  dark: {
    // Base colors
    primary: primaryColor,
    secondary: secondaryDark,
    accent: accentDark,
    
    // Text colors
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    textMuted: '#999999',
    
    // Background colors
    background: '#121212',
    backgroundSecondary: '#1E1E1E',
    card: '#1E1E1E',
    cardBorder: '#333333',
    
    // UI elements
    tint: primaryColor,
    tabIconDefault: '#666666',
    tabIconSelected: primaryColor,
    
    // Status colors
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
    
    // Gradients
    gradientStart: 'transparent',
    gradientMiddle: 'rgba(0,0,0,0.7)',
    gradientEnd: 'rgba(0,0,0,0.9)',
  },
};
