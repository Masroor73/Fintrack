// screens/BudgetScreen.js

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useFocusEffect } from '@react-navigation/native';

export default function BudgetScreen() {
  const [currentBudget, setCurrentBudget] = useState(null);
  const [newBudget, setNewBudget] = useState('');
  const [userId, setUserId] = useState(null);

  // Refetch when tab is focused
  useFocusEffect(
    useCallback(() => {
      fetchBudget();
    }, [])
  );

  const fetchBudget = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert('Error', 'Failed to get user');
      return;
    }

    setUserId(user.id);

    const { data, error } = await supabase
      .from('budget')
      .select('amount')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // Not found code: still fine
      Alert.alert('Error', error.message);
      return;
    }

    if (data) {
      setCurrentBudget(parseFloat(data.amount));
    } else {
      setCurrentBudget(0);
    }
  };

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid budget amount.');
      return;
    }

    // Try updating first
    const { error: updateError } = await supabase
      .from('budget')
      .update({ amount })
      .eq('user_id', userId);

    if (updateError) {
      // If no row to update, insert
      const { error: insertError } = await supabase
        .from('budget')
        .insert({ user_id: userId, amount });

      if (insertError) {
        Alert.alert('Error', insertError.message);
        return;
      }
    }

    setNewBudget('');
    fetchBudget(); // Refresh current budget
    Alert.alert('Success', 'Budget updated successfully!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Budget</Text>
      <Text style={styles.currentBudget}>
        Current Budget: $
        {currentBudget !== null ? currentBudget.toFixed(2) : 'Loading...'}
      </Text>

      <TextInput
        style={styles.input}
        value={newBudget}
        onChangeText={setNewBudget}
        placeholder="Enter new budget"
        keyboardType="numeric"
      />

      <Button title="Update Budget" onPress={handleUpdateBudget} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  currentBudget: {
    fontSize: 18,
    color: 'green',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
});







