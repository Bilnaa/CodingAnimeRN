import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Text, View } from './Themed';
import { Anime } from '@tutkli/jikan-ts';
import Colors from '../constants/Colors';
import { useColorScheme } from './useColorScheme';

interface AnimeGridCardProps {
  anime: Anime;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 64) / 3; // 3 cards per row with padding

export default function AnimeGridCard({ anime, onPress }: AnimeGridCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          borderColor: colors.cardBorder,
          backgroundColor: colors.card,
          shadowColor: colorScheme === 'light' ? 'rgba(0,0,0,0.1)' : 'transparent'
        }
      ]} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: anime.images.jpg.image_url }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={[styles.textContainer, { backgroundColor: 'transparent' }]}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {anime.title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
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
    borderRadius: 12,
    borderWidth: 0.5,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: cardWidth * 1.5,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  textContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
}); 