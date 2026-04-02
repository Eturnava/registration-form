import { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Avatar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addUser, deleteUser } from '../../store/slices/usersSlice';
import { removeRequestsByUser } from '../../store/slices/requestsSlice';
import { getFieldsByRole } from '../../config/formFields';
import DynamicForm from '../../components/forms/DynamicForm';
import type { RegularUser } from '../../types';

const UsersPanel = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((s) => s.users);
  const { requests } = useAppSelector((s) => s.requests);
  const { couriers } = useAppSelector((s) => s.couriers);
  const [addOpen, setAddOpen] = useState(false);
  const [viewUser, setViewUser] = useState<RegularUser | null>(null);

  const handleAddUser = (values: Record<string, unknown>) => {
    const id = uuidv4();
    dispatch(addUser({ ...values, id, role: 'user' } as any));
    setAddOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    dispatch(deleteUser(id));
    dispatch(removeRequestsByUser(id));
  };

  const getUserRequests = (userId: string) => {
    return requests.filter((r) => r.userId === userId);
  };

  const getCourierName = (courierId: string) => {
    const c = couriers.find((c) => c.id === courierId);
    return c ? `${c.firstName} ${c.lastName}` : 'Unknown';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Users ({users.length})</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>
          Add User
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>PID</TableCell>
              <TableCell>Requests</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar src={user.profileImage} sx={{ width: 36, height: 36 }}>
                    {user.firstName[0]}
                  </Avatar>
                </TableCell>
                <TableCell>{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.pid}</TableCell>
                <TableCell>
                  <Chip label={getUserRequests(user.id).length} size="small" color="primary" />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => setViewUser(user)} color="info">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteUser(user.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" py={2}>No users registered yet</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <DynamicForm
            fields={getFieldsByRole('user')}
            onSubmit={handleAddUser}
            initialValues={{ role: 'user' }}
            submitLabel="Add User"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewUser} onClose={() => setViewUser(null)} maxWidth="sm" fullWidth>
        <DialogTitle>User Details - {viewUser?.firstName} {viewUser?.lastName}</DialogTitle>
        <DialogContent>
          {viewUser && (
            <Box sx={{ pt: 1 }}>
              <Typography><strong>Email:</strong> {viewUser.email}</Typography>
              <Typography><strong>Phone:</strong> {viewUser.phoneNumber}</Typography>
              <Typography><strong>PID:</strong> {viewUser.pid}</Typography>
              <Typography>
                <strong>Address:</strong> Lat: {viewUser.address?.lat}, Lng: {viewUser.address?.lng}
              </Typography>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2 }}>
                Requested Couriers:
              </Typography>
              {getUserRequests(viewUser.id).length === 0 ? (
                <Typography color="text.secondary">No requests</Typography>
              ) : (
                getUserRequests(viewUser.id).map((req) => (
                  <Chip
                    key={req.id}
                    label={`${getCourierName(req.courierId)} - ${req.day} ${req.startHours}-${req.endHours}`}
                    sx={{ mr: 0.5, mb: 0.5 }}
                    size="small"
                  />
                ))
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewUser(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPanel;
