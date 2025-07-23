import React, { useState } from 'react';
import { Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import axios from 'axios';

const BasicsForm = () => {
  const [basics, setBasics] = useState({
    currentAge: 25,
    retirementAge: 60,
    wishToLiveTill: 80,
    inflation: 6
  });

  const [incomeSources, setIncomeSources] = useState([
    { name: '', amount: 0, frequency: 'monthly' }
  ]);

  const [expenses, setExpenses] = useState([
    { name: '', amount: 0, category: 'Needs' }
  ]);

  const handleBasicChange = (key, value) => {
    setBasics(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const handleIncomeChange = (index, key, value) => {
    const updated = [...incomeSources];
    updated[index][key] = key === 'amount' ? parseFloat(value) || 0 : value;
    setIncomeSources(updated);
  };

  const handleExpenseChange = (index, key, value) => {
    const updated = [...expenses];
    updated[index][key] = key === 'amount' ? parseFloat(value) || 0 : value;
    setExpenses(updated);
  };

  const addIncome = () => setIncomeSources([...incomeSources, { name: '', amount: 0, frequency: 'monthly' }]);
  const removeIncome = (index) => setIncomeSources(incomeSources.filter((_, i) => i !== index));

  const addExpense = () => setExpenses([...expenses, { name: '', amount: 0, category: 'Needs' }]);
  const removeExpense = (index) => setExpenses(expenses.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const totalYearlyIncome = incomeSources.reduce((sum, i) => sum + (i.frequency === 'monthly' ? i.amount * 12 : i.amount), 0);
    const totalYearlyExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    const payload = {
      basics,
      income: { sources: incomeSources, totalYearlyIncome },
      expenses: {
        monthly: expenses.filter(e => e.category === 'Needs'),
        yearly: expenses.filter(e => e.category !== 'Needs'),
        totalYearlyExpense,
        monthlyExcess: (totalYearlyIncome / 12) - expenses.filter(e => e.category === 'Needs').reduce((sum, e) => sum + e.amount, 0),
        yearlyExcess: totalYearlyIncome - totalYearlyExpense
      }
    };

    try {
      const res = await axios.post('http://localhost:8000/api/financeData/save', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Data saved successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to save data');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>Basic Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={3}><TextField label="Current Age" fullWidth type="number" value={basics.currentAge} onChange={e => handleBasicChange('currentAge', e.target.value)} /></Grid>
        <Grid item xs={3}><TextField label="Retirement Age" fullWidth type="number" value={basics.retirementAge} onChange={e => handleBasicChange('retirementAge', e.target.value)} /></Grid>
        <Grid item xs={3}><TextField label="Wish to Live Till" fullWidth type="number" value={basics.wishToLiveTill} onChange={e => handleBasicChange('wishToLiveTill', e.target.value)} /></Grid>
        <Grid item xs={3}><TextField label="Inflation (%)" fullWidth type="number" value={basics.inflation} onChange={e => handleBasicChange('inflation', e.target.value)} /></Grid>
      </Grid>

      <Typography variant="h6" mt={4}>Income Sources</Typography>
      {incomeSources.map((inc, i) => (
        <Grid container spacing={2} key={i} alignItems="center">
          <Grid item xs={4}><TextField label="Source" fullWidth value={inc.name} onChange={e => handleIncomeChange(i, 'name', e.target.value)} /></Grid>
          <Grid item xs={3}><TextField label="Amount" fullWidth type="number" value={inc.amount} onChange={e => handleIncomeChange(i, 'amount', e.target.value)} /></Grid>
          <Grid item xs={3}><TextField label="Frequency" fullWidth value={inc.frequency} onChange={e => handleIncomeChange(i, 'frequency', e.target.value)} /></Grid>
          <Grid item xs={2}>
            <IconButton onClick={() => removeIncome(i)}><RemoveCircle /></IconButton>
          </Grid>
        </Grid>
      ))}
      <Button startIcon={<AddCircle />} onClick={addIncome}>Add Income Source</Button>

      <Typography variant="h6" mt={4}>Expenses</Typography>
      {expenses.map((exp, i) => (
        <Grid container spacing={2} key={i} alignItems="center">
          <Grid item xs={4}><TextField label="Expense" fullWidth value={exp.name} onChange={e => handleExpenseChange(i, 'name', e.target.value)} /></Grid>
          <Grid item xs={3}><TextField label="Amount" fullWidth type="number" value={exp.amount} onChange={e => handleExpenseChange(i, 'amount', e.target.value)} /></Grid>
          <Grid item xs={3}><TextField label="Category" fullWidth value={exp.category} onChange={e => handleExpenseChange(i, 'category', e.target.value)} /></Grid>
          <Grid item xs={2}>
            <IconButton onClick={() => removeExpense(i)}><RemoveCircle /></IconButton>
          </Grid>
        </Grid>
      ))}
      <Button startIcon={<AddCircle />} onClick={addExpense}>Add Expense</Button>

      <Button variant="contained" sx={{ mt: 4 }} onClick={handleSubmit}>Save All Data</Button>
    </Box>
  );
};

export default BasicsForm;
