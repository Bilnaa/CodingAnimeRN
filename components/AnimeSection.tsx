import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Text, View } from './Themed';
import { Anime } from '@tutkli/jikan-ts';
import AnimeCard from './AnimeCard';
import Colors from '../constants/Colors';
import { useColorScheme } from './useColorScheme';

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
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  // Get unique anime items for the section
  const uniqueAnimeItems = animeList.filter((anime, index, self) => 
    index === self.findIndex(a => a.mal_id === anime.mal_id)
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        {onSeeAllPress && (
          <TouchableOpacity onPress={onSeeAllPress}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        )}
      </View>
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
  seeAllText: {
    fontWeight: '600',
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
}); 