import React from 'react';
import { View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

export default function ExpenseChart({ expenses }) {
  // Total amount is decided by category
  const categoryTotals = expenses.reduce((totals, expense) => {
    const { category, amount } = expense;
    if (!totals[category]) {
      totals[category] = 0;
    }
    totals[category] += amount;
    return totals;
  }, {});

  // Data is formatted for PieChart
  const chartData = Object.keys(categoryTotals).map((category, index) => ({
    name: category,
    amount: categoryTotals[category],
    color: chartColors[index % chartColors.length],
    legendFontColor: '#333',
    legendFontSize: 12,
  }));

  return (
    <View>
      <PieChart
        data={chartData}
        width={Dimensions.get('window').width - 30}
        height={220}
        chartConfig={chartConfig}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 10]}
        absolute
      />
    </View>
  );
}

const chartColors = [
  '#4E79A7',
  '#F28E2B',
  '#E15759',
  '#76B7B2',
  '#59A14F',
  '#EDC948',
  '#B07AA1',
  '#FF9DA7',
];

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(33, 33, 33, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(33, 33, 33, ${opacity})`,
};


