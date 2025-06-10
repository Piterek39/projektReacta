import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorites';
const SETTINGS_KEY = 'settings';

export const getFavorites = async () => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const addFavorite = async (location) => {
  try {
    const favorites = await getFavorites();
    const newFavorite = {
      id: Date.now().toString(),
      ...location,
      addedAt: new Date().toISOString(),
    };
    
    const updatedFavorites = [...favorites, newFavorite];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    
    return newFavorite;
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

export const removeFavorite = async (id) => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([FAVORITES_KEY, SETTINGS_KEY]);
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

export const getSettings = async () => {
  try {
    const settings = await AsyncStorage.getItem(SETTINGS_KEY);
    return settings ? JSON.parse(settings) : {};
  } catch (error) {
    console.error('Error getting settings:', error);
    return {};
  }
};

export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};