import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import ThemeSwitch from '../components/ThemeSwitch';
import AnimatedButton from '../components/AnimatedButton';
import { clearAllData } from '../services/storage';

const SettingsScreen = () => {
  const { theme } = useTheme();

  const handleClearData = () => {
    Alert.alert(
      'Potwierdzenie',
      'Czy na pewno chcesz wyczyścić wszystkie dane?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Tak',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert('Sukces', 'Dane zostały wyczyszczone');
            } catch (error) {
              Alert.alert('Błąd', 'Nie udało się wyczyścić danych');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>
          Ustawienia
        </Text>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Wygląd
          </Text>
          <ThemeSwitch />
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Dane aplikacji
          </Text>
          <AnimatedButton
            title="Wyczyść wszystkie dane"
            onPress={handleClearData}
            style={[styles.dangerButton, { backgroundColor: '#FF5722' }]}
          />
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Informacje
          </Text>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Wersja aplikacji: 1.0.0
          </Text>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Stworzone na WSEI
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  dangerButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default SettingsScreen;