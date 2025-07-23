import { Box, Typography, Paper, Grid, Divider } from '@mui/material';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return null;

  return (
    <Box p={3}>
      <Grid container spacing={3} maxWidth="lg">
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>👤 Profile Information</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography><strong>Email:</strong> {user.email}</Typography>
            <Typography><strong>Role:</strong> {user.role}</Typography>
            <Typography><strong>Name:</strong> {user.profile?.firstName} {user.profile?.lastName}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>📋 Getting Started</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography>✅ Fill out your basic financial details</Typography>
            <Typography>✅ Build your investment portfolio</Typography>
            <Typography>✅ Generate your retirement plan</Typography>
            <Typography>✅ Track your projections and summary</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
