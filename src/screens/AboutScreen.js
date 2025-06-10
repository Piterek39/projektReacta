import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const AboutScreen = () => {
  const { theme } = useTheme();

  const authors = [
    {
      name: 'Piotr Dudek',
      role: 'Developer',
      email: 'piotr.dudek@microsoft.wsei.edu.pl',
      avatar: require('../../assets/images/avatar1.png'),
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>
          O aplikacji
        </Text>

        <View style={[styles.appInfo, { backgroundColor: theme.card }]}>
          <Text style={[styles.appName, { color: theme.primary }]}>
            WeatherMood
          </Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            Aplikacja pogodowa z obsługą motywów i zapisywaniem 
            ulubionych lokalizacji. Stworzona w ramach projektu 
            na WSEI.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Autor
        </Text>

        {authors.map((author, index) => (
          <View
            key={index}
            style={[styles.authorCard, { backgroundColor: theme.card }]}
          >
            <Image source={author.avatar} style={styles.avatar} />
            <View style={styles.authorInfo}>
              <Text style={[styles.authorName, { color: theme.text }]}>
                {author.name}
              </Text>
              <Text style={[styles.authorRole, { color: theme.primary }]}>
                {author.role}
              </Text>
              <Text style={[styles.authorEmail, { color: theme.textSecondary }]}>
                {author.email}
              </Text>
            </View>
          </View>
        ))}

        <View style={[styles.footer, { backgroundColor: theme.card }]}>
          <Image
            source={require('../../assets/images/wsei-logo.png')}
            style={styles.wseiLogo}
          />
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Projekt wykonany na WSEI
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
  appInfo: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  authorCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  authorRole: {
    fontSize: 14,
    marginBottom: 4,
  },
  authorEmail: {
    fontSize: 12,
  },
  footer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  wseiLogo: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default AboutScreen;