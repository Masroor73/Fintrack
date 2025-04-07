import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

export default function BudgetTrackerScreen() {
  const [budgetData, setBudgetData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMonthlyBudgets = async () => {
    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;

    const { data: budgets } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id);

    const { data: expenses } = await supabase
      .from('expenses')
      .select('amount, date')
      .eq('user_id', user.id);

    setBudgetData(budgets || []);
    setExpenseData(expenses || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMonthlyBudgets();
  }, []);

  const getMonthlyStats = () => {
    const stats = {};
    for (let budget of budgetData) {
      const month = budget.month;
      stats[month] = {
        budget: budget.amount,
        expenses: 0,
      };
    }

    for (let expense of expenseData) {
      const month = format(new Date(expense.date), 'yyyy-MM');
      if (!stats[month]) stats[month] = { budget: 0, expenses: 0 };
      stats[month].expenses += expense.amount;
    }

    return stats;
  };

  const stats = getMonthlyStats();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Budget Tracker</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : Object.keys(stats).length === 0 ? (
        <Text style={styles.emptyText}>No budget history found.</Text>
      ) : (
        <ScrollView style={{ width: '100%' }}>
          {Object.entries(stats).map(([month, value]) => (
            <View key={month} style={styles.card}>
              <Text style={styles.month}>{month}</Text>
              <Text style={styles.label}>
                Budget: {value.budget.toFixed(2)}
              </Text>
              <Text style={styles.label}>
                Expenses: {value.expenses.toFixed(2)}
              </Text>
              <Text
                style={[
                  styles.label,
                  { color: value.expenses > value.budget ? 'red' : 'green' },
                ]}
              >
                Remaining: {(value.budget - value.expenses).toFixed(2)}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#f3f3f3',
    padding: 14,
    marginVertical: 8,
    borderRadius: 8,
  },
  month: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
  },
});



