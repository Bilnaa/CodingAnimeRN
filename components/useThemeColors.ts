import Colors from '../constants/Colors';
import { useTheme } from '../context/ThemeContext';

export function useThemeColors() {
  const { theme, colorScheme } = useTheme();

  // For system theme, use the default colors
  if (theme === 'system') {
    return Colors[colorScheme];
  }
  
  // For custom themes (purple, blue, green), use the theme-specific colors with system light/dark mode
  return Colors[theme][colorScheme];
} 