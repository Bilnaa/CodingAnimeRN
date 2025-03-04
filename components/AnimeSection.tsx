import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Text, View } from './Themed';
import { Anime } from '@tutkli/jikan-ts';
import AnimeCard from './AnimeCard';

interface AnimeSectionProps {
  title: string;
  animeList: Anime[];
  onSeeAllPress?: () => void;
  onAnimePress?: (anime: Anime) => void;
}

export default function AnimeSection({ 
  title, 
  animeList, 
  onSeeAllPress, 
  onAnimePress 
}: AnimeSectionProps) {
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
}); 