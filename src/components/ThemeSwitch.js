import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitch = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const translateX = useRef(new Animated.Value(isDark ? 30 : 0)).current;
  const backgroundColorAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: isDark ? 30 : 0,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundColorAnim, {
        toValue: isDark ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isDark]);

  const backgroundColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E0E0E0', theme.primary],
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>
        Motyw {isDark ? 'ciemny' : 'jasny'}
      </Text>
      
      <TouchableOpacity onPress={toggleTheme} activeOpacity={0.8}>
        <Animated.View
          style={[
            styles.switchContainer,
            { backgroundColor },
          ]}
        >
          <Animated.View
            style={[
              styles.switch,
              {
                transform: [{ translateX }],
                backgroundColor: theme.background,
              },
            ]}
          >
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={20}
              color={isDark ? theme.primary : '#FFA000'}
            />
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  switchContainer: {
    width: 60,
    height: 30,
    borderRadius: 15,
    padding: 2,
    justifyContent: 'center',
  },
  switch: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default ThemeSwitch;
