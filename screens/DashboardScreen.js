import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import { PieChart } from 'react-native-gifted-charts';
import { format } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';

export default function DashboardScreen() {
  const [expenses, setExpenses] = useState([]);
  const [userEmail, setUserEmail] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [])
  );

  useEffect(() => {
    const channel = supabase
      .channel('realtime:expenses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, fetchExpenses)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchExpenses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserEmail(user?.email || '');

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setExpenses(data || []);
    }
  };

  const groupedData = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const chartData = Object.entries(groupedData).map(([category, amount]) => ({
    value: amount,
    label: category,
    text: `$${amount}`,
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome back!</Text>
      <Text style={styles.email}>Logged in as {userEmail}</Text>

      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          donut
          showText
          textColor="#fff"
          radius={100}
          innerRadius={60}
          centerLabelComponent={() => (
            <Text style={styles.chartCenter}>
              Total{'\n'}${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
            </Text>
          )}
        />
      ) : (
        <Text style={styles.noData}>No expenses yet.</Text>
      )}

      <Text style={styles.subheading}>Recent Expenses</Text>
      {expenses.slice(0, 5).map((expense) => (
        <View key={expense.id} style={styles.card}>
          <Text style={styles.expenseTitle}>${expense.amount.toFixed(2)} • {expense.category}</Text>
          <Text style={styles.expenseDate}>
            {format(new Date(expense.created_at), 'PPpp')}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  email: {
    color: '#666',
    marginBottom: 20,
  },
  chartCenter: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginVertical: 20,
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  expenseDate: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
});




















