import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Keyboard } from 'react-native';
import { Text, View } from '../../components/Themed';
import { JikanClient, Anime, AnimeType } from '@tutkli/jikan-ts';
import AnimeGridCard from '../../components/AnimeGridCard';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';

export default function SearchScreen() {
  const router = useRouter();
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
    { id: 'ona', label: 'ONA' },
    { id: 'music', label: 'Music' },
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
          <MaterialIcons name="search-off" size={64} color="#999" />
          <Text style={styles.emptyText}>No results found</Text>
          <Text style={styles.emptySubtext}>Try a different search term or filter</Text>
        </>
      ) : (
        <>
          <Ionicons name="search" size={64} color="#999" />
          <Text style={styles.emptyText}>Search for anime</Text>
          <Text style={styles.emptySubtext}>Enter a title, character, or studio</Text>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header section with search bar */}
      <View style={styles.headerSection}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search anime..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
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
                  selectedFilter === filter.id && styles.filterButtonActive
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <Text 
                  style={[
                    styles.filterText,
                    selectedFilter === filter.id && styles.filterTextActive
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
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Searching...</Text>
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
    backgroundColor: '#f0f0f0',
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
    backgroundColor: '#4a6ee0',
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
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#4a6ee0',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: 'white',
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
    color: '#666',
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
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
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
