import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import { supabase } from '../lib/supabase';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const categories = [
  'Food', 'Transport', 'Housing', 'Health', 'Entertainment', 'Utilities', 'Other'
];

export default function AddExpenseScreen() {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddExpense = async () => {
    if (!label || !amount || !category || !date) {
      return Alert.alert('Missing Fields', 'Please fill in all required fields.');
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return Alert.alert('Invalid Amount', 'Amount must be a positive number.');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Alert.alert('Error', 'User not found.');

    const { error } = await supabase.from('expenses').insert([{
      label,
      amount: numericAmount,
      category,
      note,
      date: format(date, 'yyyy-MM-dd'),
      user_id: user.id,
    }]);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    // Checking budget
    const startDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
    const endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');

    const { data: expenseData } = await supabase
      .from('expenses')
      .select('amount')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    const totalSpent = expenseData?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

    const { data: budgetData } = await supabase
      .from('budget')
      .select('amount')
      .eq('user_id', user.id)
      .single();

    if (budgetData) {
      const budget = parseFloat(budgetData.amount);
      const percentUsed = (totalSpent / budget) * 100;

      if (percentUsed >= 100) {
        Toast.show({
          type: 'error',
          text1: 'Budget Exceeded!',
          text2: `You spent $${totalSpent.toFixed(2)} of $${budget.toFixed(2)}.`,
        });
      } else if (percentUsed >= 80) {
        Toast.show({
          type: 'info',
          text1: 'Warning',
          text2: `You've used ${percentUsed.toFixed(0)}% of your monthly budget.`,
        });
      }
    }

    // Resets form
    setLabel('');
    setAmount('');
    setCategory('');
    setNote('');
    setDate(new Date());

    Toast.show({
      type: 'success',
      text1: 'Expense Added!',
      text2: `${label} — $${numericAmount.toFixed(2)}`,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior="padding" style={styles.flex} keyboardVerticalOffset={100}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Add Expense</Text>

          <TextInput
            style={styles.input}
            placeholder="Label"
            value={label}
            onChangeText={setLabel}
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Note (optional)"
            value={note}
            onChangeText={setNote}
          />

          {/* Date Picker */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View pointerEvents="none">
              <TextInput
                style={styles.input}
                placeholder="Select Date"
                value={format(date, 'yyyy-MM-dd')}
                editable={false}
              />
            </View>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          {/* Category Picker */}
          <Text style={styles.pickerLabel}>Select Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              mode="dropdown"
              dropdownIconColor="#333"
            >
              <Picker.Item label="Select Category" value="" />
              {categories.map((cat) => (
                <Picker.Item label={cat} value={cat} key={cat} />
              ))}
            </Picker>
          </View>

          <View style={styles.button}>
            <Button title="Add Expense" onPress={handleAddExpense} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff',
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  button: {
    marginTop: 10,
  },
});




















