import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ variant = "permanent", open, onClose, drawerWidth = 240 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = JSON.parse(localStorage.getItem('user'))?.role ;
   const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Basics Form', path: '/basics' },
    { label: 'Investment Form', path: '/investments' },
    { label: 'Financial Plan', path: '/financial-plan' },
  ];
  
  if (role === 'admin') {
    navItems.push({ label: 'Admin Panel', path: '/admin' });
  }
  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: variant === "permanent" ? 'none' : 'block', sm: 'block' },
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap>Dashboard</Typography>
      </Toolbar>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (onClose) onClose();
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;