import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import Dashboard from "./pages/Dashboard.js";
import InvestmentForm from './pages/InvestmentForm.js';
import Box from '@mui/material/Box';
import Sidebar from './component/Sidebar.js';
import Header from './component/Header.js';
import Footer from './component/Footer.js';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import FinancialPlanForm from './pages/FinancialPlanForm';
import BasicsForm from './pages/BasicsForm.js';
import AdminPanel from './pages/AdminPanel.js';


const drawerWidth = 240;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar: permanent on smUp, temporary on xs */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar"
      >
        <Sidebar
          variant={isSmUp ? "permanent" : "temporary"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          drawerWidth={drawerWidth}
        />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Header>
          {!isSmUp && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Header>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 1, sm: 3 },
            mt: 8,
            maxWidth: { xs: '100%', sm: 700 },
            mx: "auto",
            width: "100%",
          }}
        >
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

function ProtectedRoute({ children }) {
  const userId = localStorage.getItem('userId');
  const location = useLocation();
  if (!userId) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  const userId = localStorage.getItem('userId');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/investments"
          element={
            <ProtectedRoute>
              <Layout><InvestmentForm userId={userId} /></Layout>
            </ProtectedRoute>
          }
        />
        <Route path='/basics' element={
          <ProtectedRoute>
            <Layout><BasicsForm userId={userId} /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/financial-plan" element={
          <ProtectedRoute>
            <Layout><FinancialPlanForm /></Layout>
          </ProtectedRoute>
          } />
          <Route path="/admin" element={
          <ProtectedRoute>
            <Layout><AdminPanel /></Layout>
          </ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
