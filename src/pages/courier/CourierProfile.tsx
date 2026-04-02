import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  Paper,
  Alert,
  MenuItem,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateCurrentUser } from '../../store/slices/authSlice';
import { updateCourier } from '../../store/slices/couriersSlice';
import ImageUpload from '../../components/forms/ImageUpload';
import WorkingDaysEditor from '../../components/forms/WorkingDaysEditor';
import type { CourierUser, WorkingDays } from '../../types';
import { VEHICLE_OPTIONS } from '../../config/constants';

const CourierProfile = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.auth.currentUser) as CourierUser;

  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [profileImage, setProfileImage] = useState(currentUser?.profileImage || '');
  const [vehicle, setVehicle] = useState(currentUser?.vehicle || '');
  const [workingDays, setWorkingDays] = useState<WorkingDays>(
    currentUser?.workingDays || {}
  );
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    const updated: CourierUser = {
      ...currentUser,
      firstName,
      lastName,
      phoneNumber,
      email,
      profileImage,
      vehicle,
      workingDays,
    };
    dispatch(updateCourier(updated));
    dispatch(updateCurrentUser(updated));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (!currentUser) return null;

  return (
    <Paper sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Personal Information
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Profile updated successfully!
        </Alert>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar src={profileImage} sx={{ width: 80, height: 80 }}>
          {firstName[0]}
        </Avatar>
        <ImageUpload value={profileImage} onChange={setProfileImage} />
      </Box>

      <TextField
        fullWidth
        label="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        margin="normal"
        size="small"
      />
      <TextField
        fullWidth
        label="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        margin="normal"
        size="small"
      />
      <TextField
        fullWidth
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        size="small"
      />
      <TextField
        fullWidth
        label="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        margin="normal"
        size="small"
      />
      <TextField
        fullWidth
        label="PID"
        value={currentUser.pid}
        margin="normal"
        size="small"
        disabled
      />
      <TextField
        fullWidth
        select
        label="Vehicle"
        value={vehicle}
        onChange={(e) => setVehicle(e.target.value)}
        margin="normal"
        size="small"
      >
        {VEHICLE_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      <WorkingDaysEditor value={workingDays} onChange={setWorkingDays} />

      <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
        Save Changes
      </Button>
    </Paper>
  );
};

export default CourierProfile;
