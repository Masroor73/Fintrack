import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/DashboardScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import ExpenseHistoryScreen from '../screens/ExpenseHistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BudgetScreen from '../screens/BudgetScreen';
import EditExpenseScreen from '../screens/EditExpenseScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Dashboard':
              iconName = 'home-outline';
              break;
            case 'Add':
              iconName = 'add-circle-outline';
              break;
            case 'History':
              iconName = 'time-outline';
              break;
            case 'Settings':
              iconName = 'settings-outline';
              break;
            case 'Budget':
              iconName = 'wallet-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Add" component={AddExpenseScreen} />
      <Tab.Screen name="History" component={ExpenseHistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      
      {/* Screen hidden that is used for editing expenses */}
      <Tab.Screen
        name="EditExpense"
        component={EditExpenseScreen}
        options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
      />
    </Tab.Navigator>
  );
}





