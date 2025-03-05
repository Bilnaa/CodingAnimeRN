import { collection, query, getDocs, where, deleteDoc, doc, addDoc } from "@firebase/firestore";
import { db } from "@/config/firebase.config";

export const addFavorite = async (userId: string, animeId: number) => {
  try {
    const favoriteQuery = query(
      collection(db, "favorite"),
      where("userId", "==", userId),
      where("animeId", "==", animeId)
    );

    const querySnapshot = await getDocs(favoriteQuery);

    if (!querySnapshot.empty) {
      return { success: false, message: "Favorite already exists" };
    }

    const docRef = await addDoc(collection(db, "favorite"), {
      userId,
      animeId,
      createdAt: new Date(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding favorite:", error);
    return { success: false, message: "Failed to add favorite" };
  }
};

export const getAllFavorites = async (userId: string) => {
  try {
    const favoritesQuery = query(collection(db, "favorite"), where("userId", "==", userId));
    const querySnapshot = await getDocs(favoritesQuery);

    const favorites: { id: string; userId: string; animeId: number }[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as { userId: string; animeId: number }),
    }));

    return favorites;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};


export const getFavoriteById = async (userId: string, animeId: number) => {
  try {
    const favoriteQuery = query(
      collection(db, "favorite"),
      where("userId", "==", userId),
      where("animeId", "==", animeId)
    );

    const querySnapshot = await getDocs(favoriteQuery);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching favorite:", error);
    return null;
  }
};

export const removeFavorite = async (userId: string, animeId: number) => {
  try {
    const favoriteQuery = query(
      collection(db, "favorite"),
      where("userId", "==", userId),
      where("animeId", "==", animeId)
    );

    const querySnapshot = await getDocs(favoriteQuery);

    if (!querySnapshot.empty) {
      const favoriteDoc = querySnapshot.docs[0];
      await deleteDoc(doc(db, "favorite", favoriteDoc.id));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error removing favorite:", error);
    return false;
  }
};