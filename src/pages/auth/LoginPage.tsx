import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import type { Role, AppUser } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login } from '../../store/slices/authSlice';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { admins, users } = useAppSelector((s) => s.users);
  const { couriers } = useAppSelector((s) => s.couriers);

  const [role, setRole] = useState<Role>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let allUsers: AppUser[] = [];
    if (role === 'admin') allUsers = admins;
    else if (role === 'user') allUsers = users;
    else if (role === 'courier') allUsers = couriers;

    const found = allUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      setError('Invalid email or password');
      return;
    }

    dispatch(login(found));
    navigate(`/dashboard/${role}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
      }}
    >
      <Card sx={{ maxWidth: 450, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" textAlign="center" gutterBottom fontWeight={700}>
            Login
          </Typography>
          <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
            Select your role and sign in
          </Typography>

          <ToggleButtonGroup
            value={role}
            exclusive
            onChange={(_, val) => val && setRole(val)}
            fullWidth
            sx={{ mb: 3 }}
          >
            <ToggleButton value="admin">
              <AdminPanelSettingsIcon sx={{ mr: 0.5 }} /> Admin
            </ToggleButton>
            <ToggleButton value="user">
              <PersonIcon sx={{ mr: 0.5 }} /> User
            </ToggleButton>
            <ToggleButton value="courier">
              <LocalShippingIcon sx={{ mr: 0.5 }} /> Courier
            </ToggleButton>
          </ToggleButtonGroup>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2, mb: 1 }}
            >
              Login as {role.charAt(0).toUpperCase() + role.slice(1)}
            </Button>
            <Button
              variant="text"
              fullWidth
              onClick={() => navigate('/register')}
            >
              Don't have an account? Register
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
