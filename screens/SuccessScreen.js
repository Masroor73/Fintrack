import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function SuccessScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>Account Created!</Text>
      <Text style={styles.message}>Welcome to FinTrack. You're all set to start tracking your finances.</Text>

      <Button title="Continue to App" onPress={() => navigation.replace('MainTabs')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center'
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
});


