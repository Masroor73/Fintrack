import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function SettingsScreen() {
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('Logout Error', error.message);
  };

  const handleEmailChange = async () => {
    if (!newEmail) return Alert.alert('Error', 'Email cannot be empty.');
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Success', 'Email updated!');
    setNewEmail('');
  };

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 6)
      return Alert.alert('Error', 'Password must be at least 6 characters.');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Success', 'Password updated!');
    setNewPassword('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior="padding" style={styles.flex} keyboardVerticalOffset={80}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Settings</Text>

          <Text style={styles.label}>Update Email</Text>
          <TextInput
            value={newEmail}
            onChangeText={setNewEmail}
            placeholder="Enter new email"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <View style={styles.buttonContainer}>
            <Button title="Update Email" onPress={handleEmailChange} />
          </View>

          <Text style={[styles.label, { marginTop: 30 }]}>Update Password</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            style={styles.input}
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
            <Button title="Update Password" onPress={handlePasswordChange} />
          </View>

          <View style={styles.logoutButton}>
            <Button title="Logout" onPress={handleLogout} color="#d9534f" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  flex: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#111',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 40,
  },
});












