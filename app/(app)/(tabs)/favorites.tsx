import { FlatList, SafeAreaView, StyleSheet } from 'react-native';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Anime, JikanClient } from "@tutkli/jikan-ts";
import { useEffect, useState } from "react";
import { useFavoriteStore } from "@/stores/favorite.store";

export default function FavoritesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { favorites } = useFavoriteStore();
  const [animes, setAnimes] = useState<Anime[]>([]);


  const fetchAnimes = async () => {
    const client = new JikanClient()
    const animes = await Promise.all(favorites.map(async (favorite) => {
      const response = await client.anime.getAnimeById(favorite)
      return response.data
    }))
    setAnimes(animes)
  };

  useEffect(() => {
    fetchAnimes()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={animes} renderItem={({ item }) => (
        <Text>{item.title}</Text>
      )} keyExtractor={(item) => item.mal_id.toString()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  }
});
