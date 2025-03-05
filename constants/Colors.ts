const purpleLight = '#8A2BE2'; // BlueViolet
const purpleDark = '#9370DB'; // MediumPurple - Lighter purple for dark mode
const purpleMuted = '#9370DB'; // MediumPurple
const dangerColor = '#FF3B30'; // Red for danger actions

// Using a consistent purple color for dark theme
const darkThemePurple = '#9370DB';

export default {
  light: {
    text: '#333333',
    textSecondary: '#666666',
    textMuted: '#999999',
    background: '#FFFFFF',
    backgroundSecondary: '#F5F5F5',
    tint: purpleLight,
    primary: purpleLight,
    tabIconDefault: '#CCCCCC',
    tabIconSelected: purpleLight,
    danger: dangerColor,
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    textMuted: '#888888',
    background: '#121212',
    backgroundSecondary: '#181818',
    tint: darkThemePurple,
    primary: darkThemePurple,
    tabIconDefault: '#666666',
    tabIconSelected: darkThemePurple,
    danger: dangerColor,
  },
};
