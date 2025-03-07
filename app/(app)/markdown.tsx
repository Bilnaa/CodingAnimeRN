import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../components/useThemeColors';
import { View } from '../../components/Themed';
import { Stack } from 'expo-router';

const MarkdownScreen = () => {
  const [markdown, setMarkdown] = useState('');
  const { colorScheme } = useTheme();
  const colors = useThemeColors();

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        const url = `https://raw.githubusercontent.com/Bilnaa/CodingAnimeRN/refs/heads/develop/README.md`;
        const response = await fetch(url);
        const content = await response.text();
        setMarkdown(content);
      } catch (error) {
        console.error("Erreur lors du chargement du fichier markdown :", error);
      }
    };

    loadMarkdown();
  }, []);

  // Define markdown styles based on the current theme
  const markdownStyles = {
    // Base styles
    body: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 24,
    },
    // Headings
    heading1: {
      color: colors.text,
      fontSize: 28,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
    },
    heading2: {
      color: colors.text,
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 8,
    },
    heading3: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 14,
      marginBottom: 7,
    },
    heading4: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 12,
      marginBottom: 6,
    },
    heading5: {
      color: colors.text,
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 5,
    },
    heading6: {
      color: colors.text,
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 8,
      marginBottom: 4,
    },
    // Paragraphs
    paragraph: {
      color: colors.text,
      marginVertical: 8,
    },
    // Links
    link: {
      color: colors.primary,
      textDecorationLine: 'underline' as const,
    },
    // Lists
    bullet_list: {
      marginVertical: 8,
    },
    ordered_list: {
      marginVertical: 8,
    },
    list_item: {
      color: colors.text,
      flexDirection: 'row' as const,
      marginVertical: 4,
    },
    // Code blocks
    code_inline: {
      color: colorScheme === 'dark' ? '#f8f8f2' : '#272822',
      backgroundColor: colorScheme === 'dark' ? '#272822' : '#f5f5f5',
      borderRadius: 3,
      paddingHorizontal: 4,
      paddingVertical: 2,
      fontFamily: 'monospace',
    },
    code_block: {
      color: colorScheme === 'dark' ? '#f8f8f2' : '#272822',
      backgroundColor: colorScheme === 'dark' ? '#272822' : '#f5f5f5',
      borderRadius: 5,
      padding: 10,
      marginVertical: 10,
      fontFamily: 'monospace',
    },
    // Blockquotes
    blockquote: {
      backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#f0f0f0',
      borderLeftColor: colors.primary,
      borderLeftWidth: 4,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginVertical: 10,
    },
    // Tables
    table: {
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#444' : '#ddd',
      marginVertical: 10,
    },
    thead: {
      backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
    },
    th: {
      padding: 8,
      color: colors.text,
      fontWeight: 'bold',
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#444' : '#ddd',
    },
    td: {
      padding: 8,
      color: colors.text,
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#444' : '#ddd',
    },
    // Horizontal rule
    hr: {
      backgroundColor: colorScheme === 'dark' ? '#444' : '#ddd',
      height: 1,
      marginVertical: 16,
    },
    // Images
    image: {
      marginVertical: 10,
    },
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: "About",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }} 
      />
      <ScrollView style={styles.scrollView}>
        {markdown ? (
          <Markdown style={markdownStyles}>{markdown}</Markdown>
        ) : (
          <Text style={{ color: colors.text }}>Chargement...</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 16,
  },
});

export default MarkdownScreen;