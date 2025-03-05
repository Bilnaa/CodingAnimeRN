import { StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

import { JikanClient, Anime, AnimeSeason } from '@tutkli/jikan-ts';
import AnimeSection from '@/components/AnimeSection';
import AnimeGridSection from "@/components/AnimeGridSection";

        
export default function TabOneScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
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
    console.log('Anime pressed:', anime.title);

    router.push({
      pathname: "/details",
      params: {animeId: anime.mal_id},
    });
  };
  

  const handleSeeAllPress = (category: string) => {
    console.log('See all pressed for:', category);
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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {topAnimeLoading ? (
        renderLoadingSection()
      ) : (
        <AnimeSection 
          title="Top Anime" 
          animeList={topAnime}
          onAnimePress={handleAnimePress}
          onSeeAllPress={() => handleSeeAllPress('Top Anime')}
        />
      )}
      
      {airingAnimeLoading ? (
        renderLoadingSection()
      ) : (
        <AnimeGridSection 
          title="Currently Airing" 
          animeList={airingAnime}
          onAnimePress={handleAnimePress}
          onSeeAllPress={() => handleSeeAllPress('Currently Airing')}
        />
      )}
      
      {upcomingAnimeLoading ? (
        renderLoadingSection()
      ) : (
        <AnimeGridSection 
          title="Upcoming Anime" 
          animeList={upcomingAnime}
          onAnimePress={handleAnimePress}
          onSeeAllPress={() => handleSeeAllPress('Upcoming Anime')}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    marginVertical: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
