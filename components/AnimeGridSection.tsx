import React from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Dimensions, View as RNView } from 'react-native';
import { Text, View } from './Themed';
import { Anime } from '@tutkli/jikan-ts';
import AnimeGridCard from './AnimeGridCard';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface AnimeGridSectionProps {
  animeList: Anime[];
  onAnimePress?: (anime: Anime) => void;
}

const { width } = Dimensions.get('window');
const PAGE_SIZE = 6; // 6 items per page

export default function AnimeGridSection({ 
  animeList = [], // Provide default empty array to prevent undefined errors
  onAnimePress 
}: AnimeGridSectionProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  // Safely handle null or undefined animeList
  const safeAnimeList = animeList || [];
  
  // Get unique anime items for the grid
  const uniqueAnimeItems = safeAnimeList.filter((anime, index, self) => 
    anime && anime.mal_id && index === self.findIndex(a => a && a.mal_id === anime.mal_id)
  );

  // Render a page of 6 items (2 rows of 3)
  const renderPage = ({ item }: { item: Anime[] }) => {
    const firstRow = item.slice(0, 3);
    const secondRow = item.slice(3, 6);
    
    return (
      <RNView style={styles.page}>
        <RNView style={styles.row}>
          {firstRow.map((anime, index) => (
            anime ? (
              <AnimeGridCard 
                key={anime.mal_id || `first-row-${index}`} 
                anime={anime} 
                onPress={() => onAnimePress && onAnimePress(anime)}
              />
            ) : (
              <View key={`empty-first-row-${index}`} style={styles.emptyCard} />
            )
          ))}
        </RNView>
        
        <RNView style={styles.row}>
          {secondRow.map((anime, index) => (
            anime ? (
              <AnimeGridCard 
                key={anime.mal_id || `second-row-${index}`} 
                anime={anime} 
                onPress={() => onAnimePress && onAnimePress(anime)}
              />
            ) : (
              <View key={`empty-second-row-${index}`} style={styles.emptyCard} />
            )
          ))}
        </RNView>
      </RNView>
    );
  };

  // Create pages of 6 items each
  const pages: Anime[][] = [];
  
  // Only proceed if we have items
  if (uniqueAnimeItems.length > 0) {
    for (let i = 0; i < uniqueAnimeItems.length; i += PAGE_SIZE) {
      const page = uniqueAnimeItems.slice(i, i + PAGE_SIZE);
      // Ensure each page has exactly 6 items (or fill with empty slots)
      while (page.length < PAGE_SIZE) {
        page.push(null as any);
      }
      pages.push(page);
    }
  } else {
    // If no items, create one empty page
    const emptyPage = Array(PAGE_SIZE).fill(null);
    pages.push(emptyPage as any);
  }

  return (
    <View style={styles.container}>
      <FlatList
        key="horizontal-pages"
        data={pages}
        renderItem={renderPage}
        keyExtractor={(_, index) => `page-${index}`}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={width}
        decelerationRate="fast"
        pagingEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    height: 550, // Significantly increased height to ensure both rows are visible
  },
  page: {
    width: width,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24, // Increased margin between rows
    width: '100%',
  },
  emptyCard: {
    width: (width - 64) / 3, // Same width as AnimeGridCard
    height: ((width - 64) / 3) * 1.5, // Same height ratio as AnimeGridCard image
    backgroundColor: 'transparent',
  },
}); 