import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
  ImageBackground,
  Alert,
  ToastAndroid,
  Modal,
  ActivityIndicator
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { Anime, JikanClient } from '@tutkli/jikan-ts';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { addFavoriteToFirebase, removeFavoriteFromFirebase } from "@/services/favorite.service";
import { useAuth } from "@/context/AuthContext";
import { useFavoriteStore } from "@/stores/favorite.store";
import { useTheme } from '@/context/ThemeContext';
import { useThemeColors } from '@/components/useThemeColors';

const { width, height } = Dimensions.get('window');
const POSTER_WIDTH = width * 0.35;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5;

export default function AnimeDetailsScreen() {
  const route = useRoute<RouteProp<{ params: { animeId: number } }, 'params'>>();
  const router = useRouter();
  const { user } = useAuth();
  const { favorites, addFavorite, removeFavorite } = useFavoriteStore();
  const { colorScheme } = useTheme();
  const colors = useThemeColors();
  const animeId = route.params.animeId;

  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const fetchAnimeDetails = useCallback(async () => {
    try {
      const client = new JikanClient();
      const response = await client.anime.getAnimeById(animeId);
      setAnime(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching anime details:', error);
      setLoading(false);
    }
  }, [animeId]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchAnimeDetails();
      setIsFavorite(favorites.includes(animeId));
    };

    fetchData();
  }, [animeId,favorites,fetchAnimeDetails])

  const toggleFavorite = async () => {
    if (!isFavorite) {
      setIsFavorite(true);
      addFavorite(animeId);
      await addFavoriteToFirebase(user!.uid, animeId);
    }
    else {
      setIsFavorite(false);
      removeFavorite(animeId);
      await removeFavoriteFromFirebase(user!.uid, animeId);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const openImagePreview = () => {
    setPreviewVisible(true);
  };

  const closeImagePreview = () => {
    setPreviewVisible(false);
  };

  const saveImageToGallery = async () => {
    if (!anime || savingImage) return;

    try {
      setSavingImage(true);

      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant media library permissions to save images.',
          [{ text: 'OK' }]
        );
        setSavingImage(false);
        return;
      }

      // Get image URL
      const imageUrl = anime.images?.jpg?.large_image_url;

      if (!imageUrl) {
        showSaveError('Image not available');
        setSavingImage(false);
        return;
      }

      // Download the image
      const fileUri = FileSystem.documentDirectory + `${anime.title.replace(/\s+/g, '_')}_poster.jpg`;
      const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);

      if (downloadResult.status !== 200) {
        showSaveError('Failed to download image');
        setSavingImage(false);
        return;
      }

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      await MediaLibrary.createAlbumAsync('Anime Posters', asset, false);

      // Show success message
      if (Platform.OS === 'android') {
        ToastAndroid.show('Image saved to gallery', ToastAndroid.SHORT);
      }
      else {
        Alert.alert('Success', 'Image saved to gallery');
      }

      // Close preview after saving
      closeImagePreview();

    } catch (error) {
      console.error('Error saving image:', error);
      showSaveError('Failed to save image');
    } finally {
      setSavingImage(false);
    }
  };

  const showSaveError = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
    else {
      Alert.alert('Error', message);
    }
  };

  const renderLoadingState = () => (
    <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <Text style={[styles.loadingText, { color: colors.text }]}>Loading anime details...</Text>
    </View>
  );

  const renderAnimeDetails = () => {
    if (!anime) return null;

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />

        {/* Header */}
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
            headerTitle: anime.title_english || anime.title || 'Anime Details',
            headerShadowVisible: false,
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={handleBackPress} style={{ marginLeft: 5 }}>
                <Ionicons name="chevron-back" size={28} color={colors.text}/>
              </TouchableOpacity>
            ),
          }}
        />

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Background Image with Gradient */}
          <View style={styles.headerContainer}>
            <ImageBackground
              source={{ uri: anime.images?.jpg?.large_image_url }}
              style={styles.headerBackground}
              blurRadius={3}
            >
              <LinearGradient
                colors={colorScheme === 'dark'
                  ? ['rgba(0,0,0,0.3)', `${colors.background}`]
                  : ['rgba(255,255,255,0.3)', `${colors.background}`]
                }
                style={styles.headerGradient}
              >
                <View style={styles.headerContent}>
                  {/* Poster */}
                  <TouchableOpacity
                    onPress={openImagePreview}
                    style={styles.posterTouchable}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: anime.images?.jpg?.large_image_url }}
                      style={styles.posterImage}
                    />
                    <View style={styles.previewIconContainer}>
                      <Ionicons name="expand-outline" size={18} color={colors.text}/>
                    </View>
                  </TouchableOpacity>

                  {/* Title and Subtitle */}
                  <View style={styles.titleContainer}>
                    <Text style={[styles.japaneseTitle, { color: colors.textSecondary }]} numberOfLines={1}>
                      {anime.title_japanese || ''}
                    </Text>
                    <Text style={[styles.titleText, { color: colors.text }]} numberOfLines={2}>
                      {anime.title_english || anime.title}
                    </Text>

                    <View style={[styles.statusRow, { backgroundColor: colors.backgroundSecondary }]}>
                      <Text style={[styles.statusText, { color: colors.text }]}>
                        {anime.status === "Finished Airing" ? "Finished" : anime.status}
                      </Text>
                    </View>

                    <View style={styles.scoreRow}>
                      <Text style={[styles.scoreText, { color: colors.text }]}>
                        {anime.score?.toFixed(1) || 'N/A'}
                      </Text>

                      <TouchableOpacity
                        style={[styles.heartButton, { backgroundColor: colors.primary }]}
                        onPress={toggleFavorite}
                      >
                        <Ionicons
                          name={isFavorite ? "heart" : "heart-outline"}
                          size={24}
                          color="#fff"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>

          {/* Information Cards */}
          <View style={styles.infoCardsContainer}>
            <View style={[styles.infoCard, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={styles.infoCardIcon}>
                <Ionicons name="calendar-outline" size={20} color={colors.primary}/>
              </View>
              <View>
                <Text style={[styles.infoCardLabel, { color: colors.textSecondary }]}>Year</Text>
                <Text style={[styles.infoCardValue, { color: colors.text }]}>{anime.year || 'Unknown'}</Text>
              </View>
            </View>

            <View style={[styles.infoCard, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={styles.infoCardIcon}>
                <Ionicons name="film-outline" size={20} color={colors.primary}/>
              </View>
              <View>
                <Text style={[styles.infoCardLabel, { color: colors.textSecondary }]}>Type</Text>
                <Text style={[styles.infoCardValue, { color: colors.text }]}>{anime.type || 'Unknown'}</Text>
              </View>
            </View>

            <View style={[styles.infoCard, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={styles.infoCardIcon}>
                <Ionicons name="time-outline" size={20} color={colors.primary}/>
              </View>
              <View>
                <Text style={[styles.infoCardLabel, { color: colors.textSecondary }]}>Status</Text>
                <Text style={[styles.infoCardValue, { color: colors.text }]}>{anime.status || 'Unknown'}</Text>
              </View>
            </View>
          </View>

          {/* Synopsis */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Synopsis</Text>
            <Text
              style={[styles.synopsisText, { color: colors.textSecondary }]}>{anime.synopsis || 'No synopsis available.'}</Text>
          </View>

          {/* Studios */}
          {anime.studios && anime.studios.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Studios</Text>
              <View style={styles.tagsContainer}>
                {anime.studios?.map((studio) => (
                  <View key={studio.mal_id} style={[styles.tag, { backgroundColor: colors.backgroundSecondary }]}>
                    <Text style={[styles.tagText, { color: colors.textSecondary }]}>{studio.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Genres */}
          {anime.genres && anime.genres.length > 0 && (
            <View style={[styles.section, styles.lastSection]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Genres</Text>
              <View style={styles.tagsContainer}>
                {anime.genres?.map((genre) => (
                  <View key={genre.mal_id} style={[styles.tag, { backgroundColor: colors.backgroundSecondary }]}>
                    <Text style={[styles.tagText, { color: colors.textSecondary }]}>{genre.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Image Preview Modal */}
        <Modal
          visible={previewVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeImagePreview}
        >
          <View
            style={[styles.previewContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.85)' }]}>
            <View style={styles.previewHeader}>
              <TouchableOpacity
                onPress={closeImagePreview}
                style={styles.previewCloseButton}
              >
                <Ionicons name="close" size={28} color="#fff"/>
              </TouchableOpacity>
              <Text style={styles.previewTitle} numberOfLines={1}>
                {anime.title}
              </Text>
              <View style={{ width: 28 }}/>
            </View>

            <Image
              source={{ uri: anime.images?.jpg?.large_image_url }}
              style={styles.previewImage}
              resizeMode="contain"
            />

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={saveImageToGallery}
              disabled={savingImage}
            >
              {savingImage ? (
                <ActivityIndicator color="#fff" size="small" style={styles.saveButtonIcon}/>
              ) : (
                <Ionicons name="download-outline" size={20} color="#fff" style={styles.saveButtonIcon}/>
              )}
              <Text style={styles.saveButtonText}>
                {savingImage ? 'Saving...' : 'Save to Gallery'}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  };

  return loading ? renderLoadingState() : renderAnimeDetails();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
  },
  headerContainer: {
    width: '100%',
    height: height * 0.4,
  },
  headerBackground: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  posterTouchable: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  posterImage: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 12,
  },
  previewIconContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'flex-end',
  },
  japaneseTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusRow: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  heartButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  infoCard: {
    width: width * 0.28,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoCardIcon: {
    marginBottom: 8,
  },
  infoCardLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  lastSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  synopsisText: {
    fontSize: 15,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 14,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
  },
  previewCloseButton: {
    padding: 4,
  },
  previewTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  saveButton: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
