// screens/BudgetScreen.js

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useFocusEffect } from '@react-navigation/native';
import { format } from 'date-fns';

export default function BudgetScreen() {
  const [budget, setBudget] = useState('');
  const [inputBudget, setInputBudget] = useState('');

  const currentMonth = format(new Date(), 'MMMM yyyy');

  const fetchBudget = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('budgets')
      .select('amount')
      .eq('user_id', user.id)
      .eq('month', currentMonth)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      Alert.alert('Error', error.message);
      return;
    }

    setBudget(data?.amount?.toFixed(2) || '0.00');
  };

  const updateBudget = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Alert.alert('Error', 'User not found');

    const numericAmount = parseFloat(inputBudget);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return Alert.alert('Invalid Input', 'Please enter a valid amount.');
    }

    const { error } = await supabase.from('budgets').insert([
      {
        user_id: user.id,
        amount: numericAmount,
        month: currentMonth,
      },
    ]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setInputBudget('');
      fetchBudget(); // Refresh budget immediately
      Alert.alert('Success', 'Budget updated!');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBudget();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Monthly Budget</Text>
      <Text style={styles.label}>Current Budget: ${budget ? budget : 'Loading...'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter new budget"
        value={inputBudget}
        onChangeText={setInputBudget}
        keyboardType="numeric"
      />

      <Button title="Update Budget" onPress={updateBudget} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
    color: 'green',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
});








