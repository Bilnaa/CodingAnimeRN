import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { logout } from "@/services/auth.service";
import { Anime, JikanClient } from "@tutkli/jikan-ts";
import { getAllFavorites } from "@/services/favorite.service";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function FavoritesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { user } = useAuth();
  const [animes, setAnimes] = useState<Anime[]>([]);


  const fetchAnimes = async () => {
    const client = new JikanClient()
    const favorites = await getAllFavorites(user!.uid)
    const animes = await Promise.all(favorites.map(async (favorite) => {
      const response = await client.anime.getAnimeById(favorite.animeId)
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
