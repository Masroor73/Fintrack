import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

export default function ExpenseItemCard({ expense, onDelete }) {
  const navigation = useNavigation();

  const handleEdit = () => {
    navigation.navigate('EditExpense', { expense });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('expenses')
              .delete()
              .eq('id', expense.id);

            if (error) {
              console.error('Delete failed:', error);
              Alert.alert('Error', 'Failed to delete expense.');
            } else {
              onDelete && onDelete(); // Refresh is triggered
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleEdit}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>{expense.label}</Text>
          <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
          <Text style={styles.date}>{expense.date}</Text>
          <Text style={styles.category}>{expense.category}</Text>
          {expense.note && <Text style={styles.note}>Note: {expense.note}</Text>}
        </View>

        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  amount: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 4,
  },
  date: {
    color: '#777',
    marginTop: 4,
  },
  category: {
    fontSize: 14,
    color: '#555',
  },
  note: {
    fontStyle: 'italic',
    color: '#444',
    marginTop: 4,
  },
  deleteBtn: {
    marginLeft: 12,
    padding: 4,
  },
  deleteText: {
    fontSize: 18,
    color: '#ff3b30',
  },
});

