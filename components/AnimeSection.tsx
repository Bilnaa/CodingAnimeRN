import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Text, View } from './Themed';
import { Anime } from '@tutkli/jikan-ts';
import AnimeCard from './AnimeCard';
import { useThemeColors } from './useThemeColors';

interface AnimeSectionProps {
  animeList: Anime[];
  onAnimePress?: (anime: Anime) => void;
}

export default function AnimeSection({ 
  animeList, 
  onAnimePress 
}: AnimeSectionProps) {
  const colors = useThemeColors();
  
  // Get unique anime items for the section
  const uniqueAnimeItems = animeList.filter((anime, index, self) => 
    index === self.findIndex(a => a.mal_id === anime.mal_id)
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {uniqueAnimeItems.map((anime, index) => (
          <AnimeCard 
            key={`${anime.mal_id}-${index}`} 
            anime={anime} 
            onPress={() => onAnimePress && onAnimePress(anime)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
}); 