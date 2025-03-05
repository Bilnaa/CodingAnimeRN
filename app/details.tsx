import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native'; // Utilisez ce hook pour accéder aux paramètres
import { Anime, JikanClient } from '@tutkli/jikan-ts';

export default function TabOneScreen() {
  const route = useRoute<RouteProp<{ params: { animeId: number } }, 'params'>>();
  const animeId = route.params.animeId;

  const [anime, setAnime] = useState<Anime | null>(null);

  useEffect(() => {
    fetchAnimeDetails();
  }, []);

  const fetchAnimeDetails = async () => {
    const client = new JikanClient();
    const response = await client.anime.getAnimeById(animeId);
    setAnime(response.data);

    console.log('Anime details:', response.data);
  }
    

  return (
    <View>
      <Text>{anime?.title}</Text>
    </View>
  );
};
