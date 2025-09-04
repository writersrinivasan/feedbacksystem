import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { Menu as MenuIcon, Dashboard, Feedback, Assessment, Person, ExitToApp } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavBarProps {
  userType?: string;
  onLogout: () => void;
}

export const NavBar = ({ userType, onLogout }: NavBarProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
      allowedUsers: ['student', 'teacher', 'admin']
    },
    {
      text: 'Submit Feedback',
      icon: <Feedback />,
      path: '/submit-feedback',
      allowedUsers: ['student']
    },
    {
      text: 'View Reports',
      icon: <Assessment />,
      path: '/reports',
      allowedUsers: ['teacher', 'admin']
    },
    {
      text: 'Profile',
      icon: <Person />,
      path: '/profile',
      allowedUsers: ['student', 'teacher', 'admin']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.allowedUsers.includes(userType || '')
  );

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FAS-MBBS
          </Typography>
          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {filteredMenuItems.map((item) => (
              <ListItem 
                button 
                key={item.text}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem button onClick={onLogout}>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};
