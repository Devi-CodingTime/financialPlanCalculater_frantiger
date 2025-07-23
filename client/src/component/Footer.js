import { Box, Typography } from '@mui/material';

const Footer = () => (
  <Box sx={{ py: 2, textAlign: 'center', bgcolor: 'background.paper', mt: 'auto' }}>
    <Typography variant="body2" color="text.secondary">
      &copy; {new Date().getFullYear()} Financial Planning App
    </Typography>
  </Box>
);

export default Footer;
