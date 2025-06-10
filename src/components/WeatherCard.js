import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useTheme } from '../context/ThemeContext';

const WeatherCard = ({ weather, loading }) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (!loading && weather) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, weather]);

  const getWeatherAnimation = (icon) => {
    if (icon.includes('01')) return require('../../assets/animations/weather-sunny.json');
    if (icon.includes('09') || icon.includes('10')) return require('../../assets/animations/weather-rainy.json');
    return require('../../assets/animations/weather-sunny.json');
  };

  if (loading) {
    return (
      <View style={[styles.card, styles.loadingCard, { backgroundColor: theme.card }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Ładowanie pogody...
        </Text>
      </View>
    );
  }

  if (!weather) return null;

  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: theme.card },
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.cityName, { color: theme.text }]}>
          {weather.name}, {weather.country}
        </Text>
      </View>

      <View style={styles.mainInfo}>
        <View style={styles.temperatureSection}>
          <Text style={[styles.temperature, { color: theme.primary }]}>
            {weather.temperature}°C
          </Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {weather.description}
          </Text>
        </View>

        <View style={styles.animationSection}>
          <LottieView
            source={getWeatherAnimation(weather.icon)}
            autoPlay
            loop
            style={styles.weatherAnimation}
          />
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
            Wilgotność
          </Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>
            {weather.humidity}%
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
            Ciśnienie
          </Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>
            {weather.pressure} hPa
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
            Wiatr
          </Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>
            {weather.windSpeed} m/s
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  loadingCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  temperatureSection: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  animationSection: {
    flex: 1,
    alignItems: 'center',
  },
  weatherAnimation: {
    width: 100,
    height: 100,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WeatherCard;