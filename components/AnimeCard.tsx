import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions, View as RNView } from 'react-native';
import { Text, View } from './Themed';
import { Anime } from '@tutkli/jikan-ts';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { useColorScheme } from './useColorScheme';

interface AnimeCardProps {
  anime: Anime;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = width * 0.85;

export default function AnimeCard({ anime, onPress }: AnimeCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          shadowColor: colorScheme === 'light' ? 'rgba(0,0,0,0.2)' : 'transparent'
        }
      ]} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: anime.images.jpg.large_image_url || anime.images.jpg.image_url }} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Add button */}
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: `${colors.primary}CC` }]}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
      
      {/* Gradient overlay */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMiddle, colors.gradientEnd]}
        style={styles.gradient}
      >
        <RNView style={styles.contentContainer}>
          <Text style={[styles.secondaryLabel, { color: '#FFFFFF' }]}>
            {anime.type} • {anime.status} • {anime.score ? `★ ${anime.score}` : 'N/A'}
          </Text>
          <Text style={[styles.primaryText, { color: '#FFFFFF' }]}>{anime.title}</Text>
        
          <Text style={[styles.description, { color: '#DDDDDD' }]} numberOfLines={3}>
            {anime.synopsis || 'No description available'}
          </Text>
        </RNView>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: 500, // Taller card
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    marginRight: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  addButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  contentContainer: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  secondaryLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  primaryText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  textLabel: {
    fontSize: 18,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 