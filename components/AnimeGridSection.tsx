import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';
import { Anime } from '@tutkli/jikan-ts';
import AnimeGridCard from './AnimeGridCard';

interface AnimeGridSectionProps {
  title: string;
  animeList: Anime[];
  onSeeAllPress?: () => void;
  onAnimePress?: (anime: Anime) => void;
}

export default function AnimeGridSection({ 
  title, 
  animeList, 
  onSeeAllPress, 
  onAnimePress 
}: AnimeGridSectionProps) {
  // Get unique anime items for the grid
  const uniqueAnimeItems = animeList.slice(0, 6).filter((anime, index, self) => 
    index === self.findIndex(a => a.mal_id === anime.mal_id)
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.gridContainer}>
        {uniqueAnimeItems.map((anime, index) => (
          <AnimeGridCard 
            key={`${anime.mal_id}-${index}`} 
            anime={anime} 
            onPress={() => onAnimePress && onAnimePress(anime)}
          />
        ))}
      </View>
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
  seeAllText: {
    fontSize: 16,
    color: '#666',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
}); 