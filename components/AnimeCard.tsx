import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions, View as RNView } from 'react-native';
import { Text, View } from './Themed';
import { Anime } from '@tutkli/jikan-ts';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Ionicons } from '@expo/vector-icons';

interface AnimeCardProps {
  anime: Anime;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = width * 0.85;

export default function AnimeCard({ anime, onPress }: AnimeCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Image 
        source={{ uri: anime.images.jpg.large_image_url || anime.images.jpg.image_url }} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Gradient overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
        style={styles.gradient}
      >
        <RNView style={styles.contentContainer}>
          <Text lightColor="#eee" darkColor="#ccc" style={styles.secondaryLabel}>
            {anime.type} • {anime.status} • {anime.score ? `★ ${anime.score}` : 'N/A'}
          </Text>
          <Text lightColor="#fff" darkColor="#fff" style={styles.primaryText}>{anime.title}</Text>
        
          <Text lightColor="#eee" darkColor="#eee" style={styles.description} numberOfLines={3}>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
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