import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const FavoriteItem = ({ item, onRemove }) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleRemove = () => {
    Alert.alert(
      'Usuń z ulubionych',
      `Czy na pewno chcesz usunąć ${item.name} z ulubionych?`,
      [
        { text: 'Anuluj', style: 'cancel' },
        { text: 'Usuń', style: 'destructive', onPress: onRemove },
      ]
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.card, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.country, { color: theme.textSecondary }]}>
            {item.country}
          </Text>
          <Text style={[styles.temperature, { color: theme.primary }]}>
            {item.temperature}°C
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.removeButton, { backgroundColor: '#FF5722' }]}
            onPress={handleRemove}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  country: {
    fontSize: 14,
    marginBottom: 8,
  },
  temperature: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
  },
  removeButton: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FavoriteItem;