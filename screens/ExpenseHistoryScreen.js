import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { format, parseISO } from 'date-fns';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

export default function ExpenseHistoryScreen() {
  const [expenses, setExpenses] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchExpenses();
    const channel = supabase
      .channel('realtime:expenses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => {
        fetchExpenses();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setExpenses(data || []);
  };

  const handleDelete = async (id) => {
    Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('expenses').delete().eq('id', id);
          if (error) {
            Toast.show({ type: 'error', text1: 'Delete failed', text2: error.message });
          } else {
            Toast.show({ type: 'success', text1: 'Deleted successfully' });
            fetchExpenses(); // Refreshes manually
          }
        },
      },
    ]);
  };

  const handleEdit = (expense) => {
    navigation.navigate('EditExpense', { expense });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.rowSpaceBetween}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>${item.amount.toFixed(2)} • {item.category}</Text>
          <Text style={styles.date}>{format(parseISO(item.created_at), 'PPpp')}</Text>
          {item.note && <Text style={styles.note}>Note: {item.note}</Text>}
        </View>
        <View style={styles.icons}>
          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.iconButton}>
            <Ionicons name="create-outline" size={22} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconButton}>
            <Ionicons name="trash-outline" size={22} color="#d11a2a" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No expenses found.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  meta: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  note: {
    fontSize: 13,
    marginTop: 5,
    color: '#555',
  },
  icons: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  iconButton: {
    marginVertical: 4,
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
    color: '#aaa',
  },
});













