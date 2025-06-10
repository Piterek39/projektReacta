import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import FavoriteItem from '../components/FavoriteItem';
import { getFavorites, removeFavorite } from '../services/storage';

const FavoritesScreen = () => {
  const { theme } = useTheme();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const savedFavorites = await getFavorites();
      setFavorites(savedFavorites);
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się załadować ulubionych');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (id) => {
    try {
      await removeFavorite(id);
      await loadFavorites();
      Alert.alert('Sukces', 'Lokalizacja usunięta z ulubionych');
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się usunąć lokalizacji');
    }
  };

  const renderFavoriteItem = ({ item }) => (
    <FavoriteItem
      item={item}
      onRemove={() => handleRemoveFavorite(item.id)}
    />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        Brak ulubionych lokalizacji
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Ulubione lokalizacje
      </Text>
      
      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FavoritesScreen;