import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import WeatherCard from '../components/WeatherCard';
import AnimatedButton from '../components/AnimatedButton';
import { getWeatherData } from '../services/weatherApi';
import { getCurrentLocation } from '../utils/helpers';
import { getFavorites, addFavorite, removeFavorite } from '../services/storage';

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadWeatherData();
  }, []);

  // Ładowanie ulubionych za każdym razem gdy ekran zyskuje focus
  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      const location = await getCurrentLocation();
      const weatherData = await getWeatherData(location.latitude, location.longitude);
      setWeather(weatherData);
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się pobrać danych pogodowych');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const savedFavorites = await getFavorites();
      setFavorites(savedFavorites);
    } catch (error) {
      console.error('Błąd ładowania ulubionych:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWeatherData();
    await loadFavorites();
    setRefreshing(false);
  };

  // Sprawdź czy lokalizacja jest już w ulubionych
  const isLocationFavorite = (location) => {
    if (!location || !favorites) return false;
    return favorites.some(fav => 
      fav.name === location.name && 
      fav.country === location.country
    );
  };

  // Znajdź ID ulubionej lokalizacji
  const getFavoriteId = (location) => {
    if (!location || !favorites) return null;
    const favorite = favorites.find(fav => 
      fav.name === location.name && 
      fav.country === location.country
    );
    return favorite ? favorite.id : null;
  };

  const handleToggleFavorite = async () => {
    if (!weather) return;

    const isFavorite = isLocationFavorite(weather);
    
    try {
      if (isFavorite) {
        // Usuń z ulubionych
        const favoriteId = getFavoriteId(weather);
        if (favoriteId) {
          await removeFavorite(favoriteId);
          Alert.alert('Sukces', `${weather.name} usunięta z ulubionych`);
        }
      } else {
        // Dodaj do ulubionych
        const locationData = {
          id: Date.now().toString(),
          name: weather.name,
          country: weather.country,
          latitude: weather.coords.lat,
          longitude: weather.coords.lon,
          temperature: weather.temperature,
          description: weather.description,
          icon: weather.icon,
          humidity: weather.humidity,
          pressure: weather.pressure,
          windSpeed: weather.windSpeed,
          addedAt: new Date().toISOString(),
        };

        await addFavorite(locationData);
        Alert.alert('Sukces', `${weather.name} dodana do ulubionych`);
      }
      
      // Odśwież listę ulubionych
      await loadFavorites();
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się zaktualizować ulubionych');
    }
  };

  // Renderowanie miniaturek ulubionych (pierwsze 4)
  const renderFavoritesPreview = () => {
    const previewFavorites = favorites.slice(0, 4);
    
    if (previewFavorites.length === 0) return null;

    return (
      <View style={[styles.favoritesPreview, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.favoritesHeader}>
          <Text style={[styles.favoritesTitle, { color: theme.text }]}>
            Szybki dostęp
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Favorites')}
            style={styles.viewAllButton}
          >
            <Text style={[styles.viewAllText, { color: theme.primary }]}>
              Zobacz wszystkie ({favorites.length})
            </Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.favoritesScrollView}
        >
          {previewFavorites.map((favorite) => (
            <TouchableOpacity
              key={favorite.id}
              style={[styles.favoritePreviewItem, { backgroundColor: theme.background }]}
              onPress={() => loadFavoriteWeather(favorite)}
            >
              <Text style={[styles.favoritePreviewName, { color: theme.text }]}>
                {favorite.name}
              </Text>
              <Text style={[styles.favoritePreviewTemp, { color: theme.primary }]}>
                {favorite.temperature}°C
              </Text>
              <Text style={[styles.favoritePreviewDesc, { color: theme.textSecondary }]}>
                {favorite.description}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Ładowanie pogody dla ulubionej lokalizacji
  const loadFavoriteWeather = async (favorite) => {
    try {
      setLoading(true);
      const weatherData = await getWeatherData(favorite.latitude, favorite.longitude);
      setWeather(weatherData);
      
      // Aktualizacja danych ulubionej lokalizacji po załadowaniu świeżych danych
      const updatedFavorite = {
        ...favorite,
        temperature: weatherData.temperature,
        description: weatherData.description,
        icon: weatherData.icon,
        humidity: weatherData.humidity,
        pressure: weatherData.pressure,
        windSpeed: weatherData.windSpeed,
        lastUpdated: new Date().toISOString(),
      };
      
      try {
        await removeFavorite(favorite.id);
        await addFavorite(updatedFavorite);
        await loadFavorites();
      } catch (updateError) {
        console.log('Nie udało się zaktualizować danych ulubionej lokalizacji');
      }
      
      Alert.alert('Załadowano', `Aktualna pogoda dla ${favorite.name}`);
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się pobrać danych pogodowych dla tej lokalizacji');
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = isLocationFavorite(weather);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={[styles.title, { color: theme.text }]}>
          Aktualna pogoda
        </Text>
        
        {weather && (
          <WeatherCard weather={weather} loading={loading} />
        )}

        <AnimatedButton
          title={isFavorite ? "Usuń z ulubionych 💔" : "Dodaj do ulubionych ❤️"}
          onPress={handleToggleFavorite}
          style={[
            styles.button, 
            { 
              backgroundColor: isFavorite ? theme.error : theme.primary 
            }
          ]}
        />

        {/* Sekcja szybkiego dostępu do ulubionych */}
        {renderFavoritesPreview()}

        {/* Przycisk do pełnego widoku ulubionych */}
        {favorites.length > 4 && (
          <TouchableOpacity
            style={[styles.fullFavoritesButton, { backgroundColor: theme.secondary }]}
            onPress={() => navigation.navigate('Favorites')}
          >
            <Text style={[styles.fullFavoritesText, { color: theme.text }]}>
              Zobacz wszystkie ulubione ({favorites.length})
            </Text>
          </TouchableOpacity>
        )}

        {/* Informacja o liczbie ulubionych */}
        <Text style={[styles.statsText, { color: theme.textSecondary }]}>
          Masz {favorites.length} {favorites.length === 1 ? 'ulubioną lokalizację' : 'ulubionych lokalizacji'}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  favoritesPreview: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  favoritesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  favoritesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllButton: {
    padding: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  favoritesScrollView: {
    paddingRight: 16,
  },
  favoritePreviewItem: {
    width: 120,
    padding: 12,
    marginRight: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  favoritePreviewName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  favoritePreviewTemp: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  favoritePreviewDesc: {
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  fullFavoritesButton: {
    marginTop: 16,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  fullFavoritesText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
});

export default HomeScreen;