import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Anime, JikanClient } from '@tutkli/jikan-ts';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function AnimeDetailsScreen() {
  const route = useRoute<RouteProp<{ params: { animeId: number } }, 'params'>>();
  const navigation = useNavigation();
  const animeId = route.params.animeId;

  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchAnimeDetails();
  }, [animeId]);

  const fetchAnimeDetails = async () => {
    try {
      const client = new JikanClient();
      const response = await client.anime.getAnimeById(animeId);
      setAnime(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching anime details:', error);
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Implement your favorite logic here (e.g., AsyncStorage, Redux)
  };

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading anime details...</Text>
    </View>
  );

  const renderAnimeDetails = () => {
    if (!anime) return null;

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Background Image with Gradient Overlay */}
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: anime.images?.jpg?.large_image_url }}
            style={styles.backgroundImage}
            blurRadius={5}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradientOverlay}
          />

          {/* Anime Poster and Favorite Button Container */}
          <View style={styles.posterSection}>
            {/* Anime Poster */}
            <View style={styles.posterContainer}>
              <Image
                source={{ uri: anime.images?.jpg?.large_image_url }}
                style={styles.posterImage}
              />
            </View>

            {/* Favorite Button */}
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={toggleFavorite}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={30}
                color={isFavorite ? "red" : "white"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Anime Title and Basic Info */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{anime.title}</Text>
          <Text style={styles.subtitleText}>
            {anime.title_english || anime.title_japanese}
          </Text>

          <View style={styles.statContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Score</Text>
              <Text style={styles.statValue}>{anime.score?.toFixed(1)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Rank</Text>
              <Text style={styles.statValue}>#{anime.rank}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Episodes</Text>
              <Text style={styles.statValue}>{anime.episodes || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Synopsis */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Synopsis</Text>
          <Text style={styles.synopsisText}>{anime.synopsis}</Text>
        </View>

        {/* Additional Details */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type:</Text>
            <Text style={styles.detailValue}>{anime.type}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={styles.detailValue}>{anime.status}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Season:</Text>
            <Text style={styles.detailValue}>
              {anime.season ? `${anime.season} ${anime.year}` : 'N/A'}
            </Text>
          </View>
        </View>

        {/* Studios Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Studios</Text>
          <View style={styles.chipContainer}>
            {anime.studios?.map((studio) => (
              <View key={studio.mal_id} style={styles.chip}>
                <Text style={styles.chipText}>{studio.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Genres Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Genres</Text>
          <View style={styles.chipContainer}>
            {anime.genres?.map((genre) => (
              <View key={genre.mal_id} style={styles.chip}>
                <Text style={styles.chipText}>{genre.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    );
  };

  return loading ? renderLoadingState() : renderAnimeDetails();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: 'white',
  },
  headerContainer: {
    height: width * 0.7,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  posterSection: {
    position: 'absolute',
    bottom: 0, // Adjusted to remove space at the top
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'flex-start', // Align items to the top
  },
  posterContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  posterImage: {
    width: width * 0.4,
    height: width * 0.6,
    borderRadius: 10,
  },
  favoriteButton: {
    position: 'absolute',
    top: 0, // Align to the top of the poster
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginTop: 70,
    paddingHorizontal: 16,
  },
  titleText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitleText: {
    color: '#888',
    fontSize: 16,
    marginTop: 4,
  },
  statContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
  },
  statValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  synopsisText: {
    color: '#bbb',
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#888',
    marginRight: 8,
    fontWeight: 'bold',
  },
  detailValue: {
    color: 'white',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: {
    color: 'white',
    fontSize: 12,
  },
  bottomSpacer: {
    height: 100,
  },
});
