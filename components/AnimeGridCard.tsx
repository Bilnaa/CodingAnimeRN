import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Text, View } from './Themed';
import { Anime } from '@tutkli/jikan-ts';

interface AnimeGridCardProps {
  anime: Anime;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 64) / 3; // 3 cards per row with padding

export default function AnimeGridCard({ anime, onPress }: AnimeGridCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Image 
        source={{ uri: anime.images.jpg.image_url }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{anime.title}</Text>
        <Text style={styles.subtitle}>
          {anime.type} • {anime.episodes ? `${anime.episodes} eps` : 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: cardWidth * 1.5,
    borderRadius: 8,
    marginBottom: 4,
  },
  textContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
}); 