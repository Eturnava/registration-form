import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Alert,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { v4 as uuidv4 } from 'uuid';
import type { Role } from '../../types';
import { getFieldsByRole } from '../../config/formFields';
import DynamicForm from '../../components/forms/DynamicForm';
import { useAppDispatch } from '../../store/hooks';
import { addAdmin, addUser } from '../../store/slices/usersSlice';
import { addCourier } from '../../store/slices/couriersSlice';
import { login } from '../../store/slices/authSlice';

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('admin');
  const [success, setSuccess] = useState(false);

  const fields = getFieldsByRole(role);

  const handleSubmit = (values: Record<string, unknown>) => {
    const id = uuidv4();
    const userData = { ...values, id, role } as Record<string, unknown>;

    switch (role) {
      case 'admin':
        dispatch(addAdmin(userData as any));
        dispatch(login(userData as any));
        navigate('/dashboard/admin');
        break;
      case 'user':
        dispatch(addUser(userData as any));
        dispatch(login(userData as any));
        navigate('/dashboard/user');
        break;
      case 'courier':
        dispatch(addCourier(userData as any));
        dispatch(login(userData as any));
        navigate('/dashboard/courier');
        break;
    }
    setSuccess(true);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
      <Card sx={{ maxWidth: 650, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" textAlign="center" gutterBottom fontWeight={700}>
            Register
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

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Registration successful!
            </Alert>
          )}

          <DynamicForm
            fields={fields}
            onSubmit={handleSubmit}
            initialValues={{ role }}
            submitLabel={`Register as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            title={`${role.charAt(0).toUpperCase() + role.slice(1)} Registration`}
          />

          <Button
            variant="text"
            fullWidth
            onClick={() => navigate('/login')}
            sx={{ mt: 1 }}
          >
            Already have an account? Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;
