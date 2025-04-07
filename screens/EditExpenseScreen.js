import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import Toast from 'react-native-toast-message';

export default function EditExpenseScreen({ route }) {
  const navigation = useNavigation();
  const { expense } = route.params;

  const [label, setLabel] = useState(expense.label);
  const [amount, setAmount] = useState(expense.amount.toString());
  const [category, setCategory] = useState(expense.category);
  const [note, setNote] = useState(expense.note || '');

  const handleUpdate = async () => {
    if (!label || !amount || !category) {
      Alert.alert('Missing fields', 'Please fill out all required fields.');
      return;
    }

    const { error } = await supabase
      .from('expenses')
      .update({
        label,
        amount: parseFloat(amount),
        category,
        note,
      })
      .eq('id', expense.id);

    if (error) {
      Toast.show({ type: 'error', text1: 'Update Failed', text2: error.message });
    } else {
      Toast.show({ type: 'success', text1: 'Expense updated successfully!' });
      navigation.goBack();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Expense</Text>

      <TextInput
        style={styles.input}
        value={label}
        onChangeText={setLabel}
        placeholder="Label"
      />

      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        placeholder="Amount"
      />

      <Text style={styles.label}>Select Category:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="Food" value="Food" />
          <Picker.Item label="Transport" value="Transport" />
          <Picker.Item label="Housing" value="Housing" />
          <Picker.Item label="Health" value="Health" />
          <Picker.Item label="Entertainment" value="Entertainment" />
          <Picker.Item label="Utilities" value="Utilities" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        value={note}
        onChangeText={setNote}
        placeholder="Optional note"
      />

      <TouchableOpacity onPress={handleUpdate} style={styles.button}>
        <Text style={styles.buttonText}>Update Expense</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});







