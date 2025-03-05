import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Anime, JikanClient } from '@tutkli/jikan-ts';
import AnimeGridCard from '../../../components/AnimeGridCard';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';
import { useColorScheme } from '../../../components/useColorScheme';

export default function CategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [loading, setLoading] = useState(true);
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      fetchAnimeByCategory();
    }
  }, [category]);

  const fetchAnimeByCategory = async () => {
    if (!category) {
      setError("No category specified");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const jikanClient = new JikanClient();
      let response;
      
      switch (category) {
        case 'Top Anime':
          response = await jikanClient.top.getTopAnime({ limit: 25 });
          break;
        case 'Currently Airing':
          const currentSeason = new Date().getMonth() >= 9 ? 'fall' : 
                               new Date().getMonth() >= 6 ? 'summer' : 
                               new Date().getMonth() >= 3 ? 'spring' : 'winter';
          const currentYear = new Date().getFullYear();
          response = await jikanClient.seasons.getSeason(currentYear, currentSeason);
          break;
        case 'Upcoming Anime':
          const currentSeasonForUpcoming = new Date().getMonth() >= 9 ? 'fall' : 
                                          new Date().getMonth() >= 6 ? 'summer' : 
                                          new Date().getMonth() >= 3 ? 'spring' : 'winter';
          let nextSeason;
          let nextYear = new Date().getFullYear();
          
          if (currentSeasonForUpcoming === 'fall') {
            nextSeason = 'winter';
            nextYear = nextYear + 1;
          } else if (currentSeasonForUpcoming === 'winter') {
            nextSeason = 'spring';
          } else if (currentSeasonForUpcoming === 'spring') {
            nextSeason = 'summer';
          } else {
            nextSeason = 'fall';
          }
          
          response = await jikanClient.seasons.getSeason(nextYear, nextSeason as any, { limit: 25 });
          break;
        default:
          setError(`Unknown category: ${category}`);
          setLoading(false);
          return;
      }
      
      // Remove duplicates
      const uniqueAnime = response.data.filter((anime, index, self) => 
        index === self.findIndex(a => a.mal_id === anime.mal_id)
      );
      
      setAnimeList(uniqueAnime);
    } catch (err) {
      console.error(`Error fetching ${category}:`, err);
      setError(`Failed to load ${category}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnimePress = (anime: Anime) => {
    console.log('Anime pressed:', anime.title);
    // Navigate to anime details screen
    // router.push(`/anime/${anime.mal_id}`);
  };

  const handleBackPress = () => {
    router.back();
  };

  const renderItem = ({ item }: { item: Anime }) => (
    <View style={styles.gridItem}>
      <AnimeGridCard 
        anime={item} 
        onPress={() => handleAnimePress(item)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: category || 'Anime List',
          headerBackTitle: 'Back',
          headerBackVisible: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={handleBackPress}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      {!category ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>No category specified</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]} 
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading anime data...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>{error}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]} 
            onPress={fetchAnimeByCategory}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={animeList}
          renderItem={renderItem}
          keyExtractor={(item) => item.mal_id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
  },
  gridItem: {
    flex: 1,
    margin: 8,
    maxWidth: '47%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 