import React, { useState } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const FinancialPlanForm = () => {
  const [form, setForm] = useState({
    currentAge: 25,
    retirementAge: 60,
    endAge: 70,
    currentSavings: 0,
    monthlyInvestment: 33333,
    stepUpRate: 0.05,
    inflationRate: 0.06,
    desiredMonthlyPostRetirementAmount: 50000,
    assetAllocations: [
      { return: 0.128, tax: 0, share: 1.0 }
    ]
  });

  const [projection, setProjection] = useState([]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const submit = async () => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/finance/calculate',
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      console.log('Projection:', res.data.data);
      
      if (res.data?.data && Array.isArray(res.data.data)) {
        setProjection(res.data.data);
      } else {
        setProjection([]); // fallback
        alert('No projection data received from API');
      }
    } catch (err) {
      console.error(err);
      alert('Error calculating plan');
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>Financial Planning Form</Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}><TextField label="Current Age" fullWidth type="number" value={form.currentAge} onChange={e => handleChange('currentAge', e.target.value)} /></Grid>
        <Grid item xs={4}><TextField label="Retirement Age" fullWidth type="number" value={form.retirementAge} onChange={e => handleChange('retirementAge', e.target.value)} /></Grid>
        <Grid item xs={4}><TextField label="End Age" fullWidth type="number" value={form.endAge} onChange={e => handleChange('endAge', e.target.value)} /></Grid>

        <Grid item xs={6}><TextField label="Current Savings" fullWidth type="number" value={form.currentSavings} onChange={e => handleChange('currentSavings', e.target.value)} /></Grid>
        <Grid item xs={6}><TextField label="Monthly Investment" fullWidth type="number" value={form.monthlyInvestment} onChange={e => handleChange('monthlyInvestment', e.target.value)} /></Grid>

        <Grid item xs={6}><TextField label="Step-Up Rate (0.05 = 5%)" fullWidth type="number" value={form.stepUpRate} onChange={e => handleChange('stepUpRate', e.target.value)} /></Grid>
        <Grid item xs={6}><TextField label="Inflation Rate (0.06 = 6%)" fullWidth type="number" value={form.inflationRate} onChange={e => handleChange('inflationRate', e.target.value)} /></Grid>

        <Grid item xs={12}><TextField label="Post Retirement Monthly Need" fullWidth type="number" value={form.desiredMonthlyPostRetirementAmount} onChange={e => handleChange('desiredMonthlyPostRetirementAmount', e.target.value)} /></Grid>
      </Grid>

      <Button variant="contained" sx={{ mt: 3 }} onClick={submit}>Calculate Plan</Button>

      {projection.length > 0 && (
        <Box mt={5}>
          <Typography variant="h6">Projection Table</Typography>
          <table border="1" cellPadding={8} style={{ marginTop: 10, width: '100%', textAlign: 'center' }}>
            <thead>
              <tr>
                <th>Age</th>
                <th>Starting</th>
                <th>Added</th>
                <th>Expenses</th>
                <th>Ending</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projection.map((row, index) => (
                <tr key={index}>
                  <td>{row.age}</td>
                  <td>₹{Math.round(row.starting).toLocaleString()}</td>
                  <td>₹{Math.round(row.additional).toLocaleString()}</td>
                  <td>₹{Math.round(row.expenses).toLocaleString()}</td>
                  <td>₹{Math.round(row.ending).toLocaleString()}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Typography variant="h6" mt={5}>Projection Chart</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projection}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${Math.round(value).toLocaleString()}`} />
              <Line type="monotone" dataKey="ending" stroke="#1976d2" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default FinancialPlanForm;