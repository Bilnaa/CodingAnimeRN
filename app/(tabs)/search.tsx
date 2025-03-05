import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Keyboard } from 'react-native';
import { Text, View } from '../../components/Themed';
import { JikanClient, Anime, AnimeType } from '@tutkli/jikan-ts';
import AnimeGridCard from '../../components/AnimeGridCard';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';

export default function SearchScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'Tout' },
    { id: 'tv', label: 'TV' },
    { id: 'movie', label: 'Film' },
    { id: 'ova', label: 'OAV' },
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
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnimePress = (anime: Anime) => {
    // Navigate to anime details page (to be implemented)
    console.log('Selected anime:', anime.title);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {hasSearched ? (
        <>
          <MaterialIcons name="search-off" size={64} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Aucun résultat trouvé</Text>
          <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>Essayez un autre terme de recherche ou un filtre</Text>
        </>
      ) : (
        <>
          <Ionicons name="search" size={64} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Rechercher un anime</Text>
          <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>Entrez le titre d'un anime</Text>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header section with search bar */}
      <View style={styles.headerSection}>
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.backgroundSecondary }]}>
            <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search anime..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
          <TouchableOpacity 
            style={[styles.searchButton, { backgroundColor: colors.primary }]} 
            onPress={handleSearch}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Filter buttons in a fixed-height container */}
        <View style={styles.filtersWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.filtersScrollContent}
          >
            {filters.map(filter => (
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
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Content section */}
      <View style={styles.contentSection}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Searching...</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerSection: {
    // Fixed height section for search and filters
    marginBottom: 16,
  },
  contentSection: {
    // This will take the remaining space
    flex: 1,
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
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  searchButton: {
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  filtersWrapper: {
    height: 40, // Fixed height for the filters section
  },
  filtersScrollContent: {
    paddingBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
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
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
