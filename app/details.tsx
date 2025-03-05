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
import { useRoute, RouteProp } from '@react-navigation/native';
import { Anime, JikanClient } from '@tutkli/jikan-ts';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function AnimeDetailsScreen() {
  const route = useRoute<RouteProp<{ params: { animeId: number } }, 'params'>>();
  const animeId = route.params.animeId;

  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);

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

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <Text>Loading anime details...</Text>
    </View>
  );

  const renderAnimeDetails = () => {
    if (!anime) return null;

    return (
      <ScrollView style={styles.container}>
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

          {/* Back Button */}
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Anime Poster */}
          <View style={styles.posterContainer}>
            <Image 
              source={{ uri: anime.images?.jpg?.large_image_url }} 
              style={styles.posterImage} 
            />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
  },
  posterContainer: {
    position: 'absolute',
    bottom: -50,
    left: 16,
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
});