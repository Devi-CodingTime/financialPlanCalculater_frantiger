import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';

const InvestmentForm = () => {
  const [form, setForm] = useState({
    totalInvestmentsPerMonth: 0,
    safeAssetProportion: 0,
    stockMarketAssetProportion: 100,
    stepUpSavings: 5,
    safeAssets: {
      vpf: { percentage: 0 },
      fixedDeposit: { percentage: 0 },
      governmentBills: { percentage: 0 },
      gold: { percentage: 0 },
      corporateBonds: { percentage: 0 }
    },
    stockMarketAssets: {
      largecapMutualFund: { percentage: 0 },
      directStocks: { percentage: 0 },
      smallcapMutualFund: { percentage: 0 }
    }
  });

  useEffect(() => {
    axios.get('http://localhost:8000/api/financeData/retrieve', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      if (res.data?.investments) {
        setForm(prev => ({ ...prev, ...res.data.investments }));
      }
    });
  }, []);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const handleNestedChange = (group, field, value) => {
    setForm(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: {
          ...prev[group][field],
          percentage: parseFloat(value) || 0
        }
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/financeData/save', { investments: form }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Investment data saved');
    } catch (err) {
      console.error(err);
      alert('Error saving data');
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>Investment Form</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}><TextField label="Monthly Investments" type="number" fullWidth value={form.totalInvestmentsPerMonth} onChange={e => handleChange('totalInvestmentsPerMonth', e.target.value)} /></Grid>
        <Grid item xs={6}><TextField label="Step-Up Savings %" type="number" fullWidth value={form.stepUpSavings} onChange={e => handleChange('stepUpSavings', e.target.value)} /></Grid>
        <Grid item xs={6}><TextField label="Safe Asset Proportion %" type="number" fullWidth value={form.safeAssetProportion} onChange={e => handleChange('safeAssetProportion', e.target.value)} /></Grid>
        <Grid item xs={6}><TextField label="Stock Market Proportion %" type="number" fullWidth value={form.stockMarketAssetProportion} onChange={e => handleChange('stockMarketAssetProportion', e.target.value)} /></Grid>

        <Grid item xs={12}><Typography variant="subtitle1">Safe Assets</Typography></Grid>
        {Object.keys(form.safeAssets).map((asset) => (
          <Grid item xs={4} key={asset}>
            <TextField label={`${asset} %`} type="number" fullWidth value={form.safeAssets[asset].percentage} onChange={e => handleNestedChange('safeAssets', asset, e.target.value)} />
          </Grid>
        ))}

        <Grid item xs={12}><Typography variant="subtitle1">Stock Market Assets</Typography></Grid>
        {Object.keys(form.stockMarketAssets).map((asset) => (
          <Grid item xs={4} key={asset}>
            <TextField label={`${asset} %`} type="number" fullWidth value={form.stockMarketAssets[asset].percentage} onChange={e => handleNestedChange('stockMarketAssets', asset, e.target.value)} />
          </Grid>
        ))}
      </Grid>

      <Button variant="contained" sx={{ mt: 3 }} onClick={handleSubmit}>Save Investments</Button>
    </Box>
  );
};

export default InvestmentForm;
