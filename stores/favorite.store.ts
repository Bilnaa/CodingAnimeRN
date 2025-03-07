import { create } from "zustand/react";
import { getAllFavorites } from "@/services/favorite.service";

interface FavoriteStore {
  favorites: number[];
  setFavorite: (animes: number[]) => void;
  addFavorite: (animeId: number) => void;
  removeFavorite: (animeId: number) => void;
  loadFavorites: (userId: string) => Promise<void>
}

export const useFavoriteStore = create<FavoriteStore>((set) => ({
  favorites: [],
  setFavorite: (favorites) => set({ favorites }),
  addFavorite: (animeId) => set((state) => ({ favorites: [...state.favorites, animeId] })),
  removeFavorite: (animeId) =>
    set((state) => ({ favorites: state.favorites.filter((id) => id !== animeId) })),
  loadFavorites: async (userId: string) => {
    const animes = await getAllFavorites(userId);
    set({ favorites: animes.map((favorite) => favorite.animeId) });
  }
}));
