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
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addCourier, deleteCourier, updateCourier } from '../../store/slices/couriersSlice';
import { removeRequestsByCourier } from '../../store/slices/requestsSlice';
import { getFieldsByRole } from '../../config/formFields';
import DynamicForm from '../../components/forms/DynamicForm';
import WorkingDaysEditor from '../../components/forms/WorkingDaysEditor';
import type { CourierUser, WorkingDays } from '../../types';

const CouriersPanel = () => {
  const dispatch = useAppDispatch();
  const { couriers } = useAppSelector((s) => s.couriers);
  const { requests } = useAppSelector((s) => s.requests);
  const { users } = useAppSelector((s) => s.users);
  const [addOpen, setAddOpen] = useState(false);
  const [editCourier, setEditCourier] = useState<CourierUser | null>(null);
  const [editWorkingDays, setEditWorkingDays] = useState<WorkingDays>({});
  const [viewCourier, setViewCourier] = useState<CourierUser | null>(null);

  const handleAddCourier = (values: Record<string, unknown>) => {
    const id = uuidv4();
    dispatch(addCourier({ ...values, id, role: 'courier' } as any));
    setAddOpen(false);
  };

  const handleDeleteCourier = (id: string) => {
    dispatch(deleteCourier(id));
    dispatch(removeRequestsByCourier(id));
  };

  const handleEditOpen = (courier: CourierUser) => {
    setEditCourier(courier);
    setEditWorkingDays(courier.workingDays || {});
  };

  const handleSaveWorkingDays = () => {
    if (editCourier) {
      dispatch(updateCourier({ ...editCourier, workingDays: editWorkingDays }));
      setEditCourier(null);
    }
  };

  const getCourierRequests = (courierId: string) => {
    return requests.filter((r) => r.courierId === courierId);
  };

  const getRequestingUsers = (courierId: string) => {
    const courierReqs = getCourierRequests(courierId);
    const userIds = [...new Set(courierReqs.map((r) => r.userId))];
    return userIds.map((uid) => {
      const u = users.find((u) => u.id === uid);
      return u ? `${u.firstName} ${u.lastName}` : 'Unknown';
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Couriers ({couriers.length})</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>
          Add Courier
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vehicle</TableCell>
              <TableCell>Working Days</TableCell>
              <TableCell>Requests</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {couriers.map((courier) => (
              <TableRow key={courier.id}>
                <TableCell>
                  <Avatar src={courier.profileImage} sx={{ width: 36, height: 36 }}>
                    {courier.firstName[0]}
                  </Avatar>
                </TableCell>
                <TableCell>{courier.firstName} {courier.lastName}</TableCell>
                <TableCell>{courier.email}</TableCell>
                <TableCell>{courier.vehicle}</TableCell>
                <TableCell>
                  <Chip label={Object.keys(courier.workingDays || {}).length + ' days'} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={getCourierRequests(courier.id).length} size="small" color="primary" />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => setViewCourier(courier)} color="info">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleEditOpen(courier)} color="warning">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteCourier(courier.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {couriers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" py={2}>No couriers registered yet</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Courier</DialogTitle>
        <DialogContent>
          <DynamicForm
            fields={getFieldsByRole('courier')}
            onSubmit={handleAddCourier}
            initialValues={{ role: 'courier' }}
            submitLabel="Add Courier"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editCourier} onClose={() => setEditCourier(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Working Days - {editCourier?.firstName}</DialogTitle>
        <DialogContent>
          <WorkingDaysEditor
            value={editWorkingDays}
            onChange={setEditWorkingDays}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditCourier(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveWorkingDays}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!viewCourier} onClose={() => setViewCourier(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Courier Details - {viewCourier?.firstName}</DialogTitle>
        <DialogContent>
          {viewCourier && (
            <Box sx={{ pt: 1 }}>
              <Typography><strong>Email:</strong> {viewCourier.email}</Typography>
              <Typography><strong>Phone:</strong> {viewCourier.phoneNumber}</Typography>
              <Typography><strong>Vehicle:</strong> {viewCourier.vehicle}</Typography>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2 }}>
                Users who requested this courier:
              </Typography>
              {getRequestingUsers(viewCourier.id).length === 0 ? (
                <Typography color="text.secondary">No requests yet</Typography>
              ) : (
                getRequestingUsers(viewCourier.id).map((name, i) => (
                  <Chip key={i} label={name} sx={{ mr: 0.5, mb: 0.5 }} size="small" />
                ))
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewCourier(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CouriersPanel;
