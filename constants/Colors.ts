// Base colors
const purpleLight = '#8A2BE2'; // BlueViolet
const purpleDark = '#9370DB'; // MediumPurple - Lighter purple for dark mode
const purpleMuted = '#9370DB'; // MediumPurple

const blueLight = '#1E90FF'; // DodgerBlue
const blueDark = '#4169E1'; // RoyalBlue
const blueMuted = '#87CEFA'; // LightSkyBlue

const greenLight = '#2E8B57'; // SeaGreen
const greenDark = '#3CB371'; // MediumSeaGreen
const greenMuted = '#90EE90'; // LightGreen

const dangerColor = '#FF3B30'; // Red for danger actions

// Theme colors
const darkThemePurple = '#9370DB';
const darkThemeBlue = '#4169E1';
const darkThemeGreen = '#3CB371';

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
  purple: {
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
    }
  },
  blue: {
    light: {
      text: '#333333',
      textSecondary: '#666666',
      textMuted: '#999999',
      background: '#FFFFFF',
      backgroundSecondary: '#F5F5F5',
      tint: blueLight,
      primary: blueLight,
      tabIconDefault: '#CCCCCC',
      tabIconSelected: blueLight,
      danger: dangerColor,
    },
    dark: {
      text: '#FFFFFF',
      textSecondary: '#AAAAAA',
      textMuted: '#888888',
      background: '#121212',
      backgroundSecondary: '#181818',
      tint: darkThemeBlue,
      primary: darkThemeBlue,
      tabIconDefault: '#666666',
      tabIconSelected: darkThemeBlue,
      danger: dangerColor,
    }
  },
  green: {
    light: {
      text: '#333333',
      textSecondary: '#666666',
      textMuted: '#999999',
      background: '#FFFFFF',
      backgroundSecondary: '#F5F5F5',
      tint: greenLight,
      primary: greenLight,
      tabIconDefault: '#CCCCCC',
      tabIconSelected: greenLight,
      danger: dangerColor,
    },
    dark: {
      text: '#FFFFFF',
      textSecondary: '#AAAAAA',
      textMuted: '#888888',
      background: '#121212',
      backgroundSecondary: '#181818',
      tint: darkThemeGreen,
      primary: darkThemeGreen,
      tabIconDefault: '#666666',
      tabIconSelected: darkThemeGreen,
      danger: dangerColor,
    }
  }
};
