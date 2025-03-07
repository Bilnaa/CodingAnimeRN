import React, { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import Markdown from 'react-native-markdown-display';

const MarkdownScreen = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        const url = `https://raw.githubusercontent.com/Bilnaa/CodingAnimeRN/refs/heads/develop/README.md?token=${process.env.EXPO_PUBLIC_README_TOKEN}`;
        const response = await fetch(url);
        const content = await response.text();
        setMarkdown(content);
      } catch (error) {
        console.error("Erreur lors du chargement du fichier markdown :", error);
      }
    };

    loadMarkdown();
  }, []);

  return (
    <ScrollView style={{ padding: 16 }}>
      {markdown ? (
        <Markdown>{markdown}</Markdown>
      ) : (
        <Text>Chargement...</Text>
      )}
    </ScrollView>
  );
};

export default MarkdownScreen;