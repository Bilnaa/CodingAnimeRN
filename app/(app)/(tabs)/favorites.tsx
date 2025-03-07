import React, { useEffect, useState, useCallback } from "react";
import { FlatList, StyleSheet, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Anime, JikanClient } from "@tutkli/jikan-ts";
import { useFavoriteStore } from "@/stores/favorite.store";
import AnimeGridCard from '@/components/AnimeGridCard';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/components/useThemeColors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { favorites } = useFavoriteStore();
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [filteredAnimes, setFilteredAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Helper function to add delay between API calls
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Helper function to fetch with retry
  const fetchWithRetry = useCallback(async <T,>(
    fetchFn: () => Promise<T>,
    retries = 3,
    baseDelay = 1000,
    maxDelay = 10000
  ): Promise<T> => {
    try {
      return await fetchFn();
    } catch (error: any) {
      if (retries <= 0) {
        throw error;
      }
      
      // If we get a 429 Too Many Requests, wait longer
      const isRateLimited = error.response && error.response.status === 429;
      
      // Calculate delay with exponential backoff
      const waitTime = isRateLimited 
        ? Math.min(maxDelay, baseDelay * Math.pow(2, 3 - retries))
        : baseDelay;
      
      console.log(`Request failed, retrying in ${waitTime}ms... (${retries} retries left)`);
      await delay(waitTime);
      
      return fetchWithRetry(fetchFn, retries - 1, baseDelay, maxDelay);
    }
  }, []);

  const fetchAnimes = useCallback(async () => {
    setIsLoading(true);
    try {
      const client = new JikanClient();
      const results: Anime[] = [];
      
      // Process favorites in batches of 3 to respect API rate limit
      for (let i = 0; i < favorites.length; i++) {
        const favorite = favorites[i];
        
        // Use fetchWithRetry to handle rate limiting and retries
        const response = await fetchWithRetry(
          () => client.anime.getAnimeById(favorite),
          3, // retries
          1000, // base delay
          5000 // max delay
        );
        
        results.push(response.data);
        
        // Add a delay after each request (except the last one)
        if (i < favorites.length - 1) {
          await delay(350); // Wait 350ms between requests to stay under 3 req/sec
        }
      }
      
      setAnimes(results);
      setFilteredAnimes(results);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, [favorites, fetchWithRetry]);

  useEffect(() => {
    fetchAnimes()
  }, [fetchAnimes])

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredAnimes(animes);
    } else {
      const filtered = animes.filter(anime => 
        anime.title.toLowerCase().includes(text.toLowerCase()) ||
        (anime.title_english && anime.title_english.toLowerCase().includes(text.toLowerCase()))
      );
      setFilteredAnimes(filtered);
    }
  };

  const handleAnimePress = (anime: Anime) => {
    router.push({
      pathname: "/details",
      params: { animeId: anime.mal_id },
    });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {animes.length === 0 ? (
        <>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No favorites yet</Text>
          <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>Add some anime to your favorites</Text>
        </>
      ) : (
        <>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No results found</Text>
          <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>Try a different search term</Text>
        </>
      )}
    </View>
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAnimes().finally(() => setRefreshing(false));
  }, [fetchAnimes]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.headerSection, { backgroundColor: colors.background }]}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Favorites</Text>
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.backgroundSecondary }]}>
            <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search in favorites..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={handleSearch}
              clearButtonMode="while-editing"
            />
          </View>
        </View>
      </View>

      <View style={[styles.contentSection, { backgroundColor: colors.background }]}>
        {isLoading ? (
          <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading favorites...</Text>
          </View>
        ) : filteredAnimes.length > 0 ? (
          <FlatList
            data={filteredAnimes}
            renderItem={({ item }) => (
              <AnimeGridCard 
                anime={item} 
                onPress={() => handleAnimePress(item)}
              />
            )}
            keyExtractor={(item) => item.mal_id.toString()}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={[styles.resultsContainer, { backgroundColor: colors.background }]}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
          />
        ) : (
          renderEmptyState()
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  contentSection: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    gap: 16,
  },
  resultsContainer: {
    paddingTop: 16,
    paddingBottom: 24,
  },
});
