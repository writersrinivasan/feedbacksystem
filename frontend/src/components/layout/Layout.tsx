import { Box, Container, Paper } from '@mui/material';
import { ReactNode } from 'react';
import { NavBar } from './NavBar';

interface LayoutProps {
  children: ReactNode;
  userType?: string;
  onLogout: () => void;
}

export const Layout = ({ children, userType, onLogout }: LayoutProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar userType={userType} onLogout={onLogout} />
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          {children}
        </Paper>
      </Container>
    </Box>
  );
};
