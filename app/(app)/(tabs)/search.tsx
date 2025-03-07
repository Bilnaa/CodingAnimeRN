import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Keyboard, StatusBar } from 'react-native';
import { Text, View } from '@/components/Themed';
import { JikanClient, Anime, AnimeType } from '@tutkli/jikan-ts';
import AnimeGridCard from '@/components/AnimeGridCard';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useThemeColors } from '@/components/useThemeColors';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const colors = useThemeColors();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'tv', label: 'TV' },
    { id: 'movie', label: 'Movie' },
    { id: 'ova', label: 'OVA' },
    { id: 'special', label: 'Special' },
    { id: 'ona', label: 'ONA' }
  ];
    
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    Keyboard.dismiss();
    
    try {
      const client = new JikanClient();
      const response = await client.anime.getAnimeSearch({
        q: searchQuery,
        type: selectedFilter !== 'all' ? selectedFilter as AnimeType : undefined,
        status: selectedFilter === 'airing' ? 'airing' : 
               selectedFilter === 'upcoming' ? 'upcoming' : undefined,
        limit: 20,
      });
      
      setSearchResults(response.data);
    } catch (error) {
      console.error('Erreur de recherche:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnimePress = async (anime: Anime) => {
    console.log('Anime sélectionné:', anime.title);
    router.push({
      pathname: "/details",
      params: {animeId: anime.mal_id},
    });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {hasSearched ? (
        <>
          <MaterialIcons name="search-off" size={64} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No results found</Text>
          <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>Try a different search term or filter</Text>
        </>
      ) : (
        <>
          <Ionicons name="search" size={64} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Search for an anime</Text>
          <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>Enter the title of an anime</Text>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Section d'en-tête avec barre de recherche */}
      <View style={[styles.headerSection, { backgroundColor: colors.background }]}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Search</Text>
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.backgroundSecondary }]}>
            <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search for an anime..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
         {/*  <TouchableOpacity 
            style={[styles.searchButton, { backgroundColor: colors.primary }]} 
            onPress={handleSearch}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity> */}
        </View>

        {/* Boutons de filtre dans un conteneur à hauteur fixe */}
        <View style={[styles.filtersWrapper, { backgroundColor: colors.background }]}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.filtersScrollContent}
          >
            {filters.map(filter => {
              console.log('Filter button color:', colors.primary);
              return (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterButton,
                    { backgroundColor: colors.backgroundSecondary },
                    selectedFilter === filter.id && { backgroundColor: colors.primary }
                  ]}
                  onPress={() => setSelectedFilter(filter.id)}
                >
                  <Text 
                    style={[
                      styles.filterText,
                      { color: colors.textSecondary },
                      selectedFilter === filter.id && { color: 'white' }
                    ]}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Section de contenu */}
      <View style={[styles.contentSection, { backgroundColor: colors.background }]}>
        {isLoading ? (
          <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Recherche en cours...</Text>
          </View>
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={({ item }) => (
              <AnimeGridCard 
                anime={item} 
                onPress={() => handleAnimePress(item)}
              />
            )}
            keyExtractor={(item) => item.mal_id.toString()}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.resultsContainer}
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
    paddingTop: 8,
    paddingBottom: 8,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 16,
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
    marginRight: 8,
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
  searchButton: {
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 48,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  filtersWrapper: {
    height: 44,
    marginBottom: 16,
  },
  filtersScrollContent: {
    paddingBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  resultsContainer: {
    paddingBottom: 20,
    paddingHorizontal: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});
