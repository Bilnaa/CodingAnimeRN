import { StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, View } from '@/components/Themed';
import { useThemeColors } from '@/components/useThemeColors';

import { JikanClient, Anime, AnimeSeason } from '@tutkli/jikan-ts';
import AnimeSection from '@/components/AnimeSection';
import AnimeGridSection from "@/components/AnimeGridSection";
import { useAuth } from "@/context/AuthContext";
import { useFavoriteStore } from "@/stores/favorite.store";

        
export default function TabOneScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  const { user } = useAuth();
  const { loadFavorites } = useFavoriteStore()

  // Individual loading states for each section
  const [topAnimeLoading, setTopAnimeLoading] = useState(true);
  const [airingAnimeLoading, setAiringAnimeLoading] = useState(true);
  const [upcomingAnimeLoading, setUpcomingAnimeLoading] = useState(true);
  
  // Data states
  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [airingAnime, setAiringAnime] = useState<Anime[]>([]);
  const [upcomingAnime, setUpcomingAnime] = useState<Anime[]>([]);
  
  // Helper function to add delay between API calls
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Helper function to remove duplicates by mal_id
  const removeDuplicates = (animeList: Anime[]): Anime[] => {
    const seen = new Set();
    return animeList.filter(anime => {
      if (seen.has(anime.mal_id)) {
        return false;
      }
      seen.add(anime.mal_id);
      return true;
    });
  };

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

  useEffect(() => {
      if (user) {
        loadFavorites(user.uid)
      }
    }, [user]
  );

  useEffect(() => {
    const jikanClient = new JikanClient();
    
    // Fetch top anime
    const fetchTopAnime = async () => {
      try {
        const response = await fetchWithRetry(
          () => jikanClient.top.getTopAnime(),
          3, // retries
          1000, // base delay
          5000 // max delay
        );
        setTopAnime(removeDuplicates(response.data));
      } catch (err) {
        console.error('Error fetching top anime:', err);
      } finally {
        setTopAnimeLoading(false);
      }
    };
    
    // Fetch currently airing anime
    const fetchAiringAnime = async () => {
      try {
        // Increased delay to 1000ms (1 second)
        await delay(1000);
        
        const currentSeason: AnimeSeason = new Date().getMonth() >= 9 ? 'fall' : 
                             new Date().getMonth() >= 6 ? 'summer' : 
                             new Date().getMonth() >= 3 ? 'spring' : 'winter';
        const currentYear = new Date().getFullYear();
        
        const response = await fetchWithRetry(
          () => jikanClient.seasons.getSeason(currentYear, currentSeason),
          3, // retries
          1000, // base delay
          5000 // max delay
        );
        
        const airingData = removeDuplicates(response.data);
        setAiringAnime(airingData);
        
      } catch (err) {
        console.error('Error fetching airing anime:', err);
        setAiringAnimeLoading(false);
      } finally {
        setAiringAnimeLoading(false);
      }
    };
    
    // Fetch upcoming anime
    const fetchUpcomingAnime = async () => {
      try {
        // Increased delay to 2000ms (2 seconds)
        await delay(2000);
        
        const currentSeason: AnimeSeason = new Date().getMonth() >= 9 ? 'fall' : 
                             new Date().getMonth() >= 6 ? 'summer' : 
                             new Date().getMonth() >= 3 ? 'spring' : 'winter';
        const currentYear = new Date().getFullYear();
        
        let nextSeason: AnimeSeason;
        let nextYear = currentYear;
        if (currentSeason === 'fall') {
          nextSeason = 'winter';
          nextYear = currentYear + 1;
        } else if (currentSeason === 'winter') {
          nextSeason = 'spring';
        } else if (currentSeason === 'spring') {
          nextSeason = 'summer';
        } else {
          nextSeason = 'fall';
        }
        
        const response = await fetchWithRetry(
          () => jikanClient.seasons.getSeason(nextYear, nextSeason),
          3, // retries
          1000, // base delay
          5000 // max delay
        );
        
        setUpcomingAnime(removeDuplicates(response.data));
      } catch (err) {
        console.error('Error fetching upcoming anime:', err);
      } finally {
        setUpcomingAnimeLoading(false);
      }
    };
    

    // Start fetches in sequence to ensure dependencies are available
    fetchTopAnime();
    fetchAiringAnime();
    fetchUpcomingAnime();
  }, [fetchWithRetry]);

  const handleAnimePress = async (anime: Anime) => {
    router.push({
      pathname: "/details",
      params: {animeId: anime.mal_id},
    });
  };
  

  const handleSeeAllPress = (category: string) => {
    router.push({
      pathname: "/category",
      params: { category }
    });
  };


  // Render loading placeholder for a section
  const renderLoadingSection = () => (
    <View style={styles.loadingSectionContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading anime data...</Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Home</Text>
      </View>

      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>

        {topAnimeLoading ? (
          renderLoadingSection()
        ) : (
          <AnimeSection
            animeList={topAnime}
            onAnimePress={handleAnimePress}
          />
        )}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Currently Airing</Text>
        </View>

        {airingAnimeLoading ? (
          renderLoadingSection()
        ) : (
          <AnimeGridSection
            animeList={airingAnime}
            onAnimePress={handleAnimePress}
          />
        )}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Anime</Text>
        </View>

        {upcomingAnimeLoading ? (
          renderLoadingSection()
        ) : (
          <AnimeGridSection
            animeList={upcomingAnime}
            onAnimePress={handleAnimePress}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
  },
  sectionHeader: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSectionContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  }
});
