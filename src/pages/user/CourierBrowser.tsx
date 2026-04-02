import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Grid,
  Paper,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addRequest } from '../../store/slices/requestsSlice';
import type { CourierUser, DayOfWeek } from '../../types';
import { TIME_SLOTS } from '../../config/constants';
import { doTimeSlotsOverlap } from '../../utils/timeUtils';

const dayLabels: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

const CourierBrowser = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const { couriers } = useAppSelector((s) => s.couriers);
  const { requests } = useAppSelector((s) => s.requests);

  const [selectedCourier, setSelectedCourier] = useState<CourierUser | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | ''>('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getCourierBookedSlots = (courierId: string, day: DayOfWeek) => {
    return requests.filter((r) => r.courierId === courierId && r.day === day);
  };

  const getUserRequests = () => {
    if (!currentUser) return [];
    return requests.filter((r) => r.userId === currentUser.id);
  };

  const isTimeSlotBooked = (courierId: string, day: DayOfWeek, start: string, end: string) => {
    const bookedSlots = getCourierBookedSlots(courierId, day);
    return bookedSlots.some((slot) =>
      doTimeSlotsOverlap(start, end, slot.startHours, slot.endHours)
    );
  };

  const doesOverlapWithUserRequests = (day: DayOfWeek, start: string, end: string) => {
    const userReqs = getUserRequests();
    return userReqs
      .filter((r) => r.day === day)
      .some((r) => doTimeSlotsOverlap(start, end, r.startHours, r.endHours));
  };

  const getAvailableTimeSlots = (courierId: string, day: DayOfWeek) => {
    const courier = couriers.find((c) => c.id === courierId);
    if (!courier || !courier.workingDays[day]) return [];

    const workHours = courier.workingDays[day]!;
    return TIME_SLOTS.filter((time) => {
      const timeMin = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
      const startMin =
        parseInt(workHours.startHours.split(':')[0]) * 60 +
        parseInt(workHours.startHours.split(':')[1]);
      const endMin =
        parseInt(workHours.endHours.split(':')[0]) * 60 +
        parseInt(workHours.endHours.split(':')[1]);
      return timeMin >= startMin && timeMin < endMin;
    });
  };

  const handleRequest = () => {
    if (!selectedCourier || !selectedDay || !startTime || !endTime || !currentUser) {
      setError('Please fill all fields');
      return;
    }

    if (startTime >= endTime) {
      setError('Start time must be before end time');
      return;
    }

    if (isTimeSlotBooked(selectedCourier.id, selectedDay, startTime, endTime)) {
      setError('This time slot is already booked for this courier');
      return;
    }

    if (doesOverlapWithUserRequests(selectedDay, startTime, endTime)) {
      setError('This time slot overlaps with your existing request');
      return;
    }

    dispatch(
      addRequest({
        id: uuidv4(),
        userId: currentUser.id,
        courierId: selectedCourier.id,
        day: selectedDay,
        startHours: startTime,
        endHours: endTime,
        createdAt: new Date().toISOString(),
      })
    );

    setSuccess(`Successfully requested ${selectedCourier.firstName} for ${dayLabels[selectedDay]} ${startTime}-${endTime}`);
    setError('');
    setSelectedDay('');
    setStartTime('');
    setEndTime('');
  };

  const myRequests = getUserRequests();

  return (
    <Box>
      {myRequests.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            My Requests ({myRequests.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {myRequests.map((req) => {
              const courier = couriers.find((c) => c.id === req.courierId);
              return (
                <Chip
                  key={req.id}
                  label={`${courier?.firstName || 'Unknown'} - ${dayLabels[req.day]} ${req.startHours}-${req.endHours}`}
                  color="primary"
                  variant="outlined"
                />
              );
            })}
          </Box>
        </Paper>
      )}

      <Typography variant="h6" gutterBottom>
        Available Couriers
      </Typography>

      <Grid container spacing={2}>
        {couriers.map((courier) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={courier.id}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Avatar src={courier.profileImage} sx={{ width: 48, height: 48 }}>
                    <LocalShippingIcon />
                  </Avatar>
                  <Box>
                    <Typography fontWeight={600}>
                      {courier.firstName} {courier.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {courier.vehicle}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="subtitle2" gutterBottom>
                  Working Schedule:
                </Typography>
                {Object.entries(courier.workingDays || {}).map(([day, hours]) => (
                  <Typography key={day} variant="body2" color="text.secondary">
                    {dayLabels[day as DayOfWeek]}: {hours.startHours} - {hours.endHours}
                  </Typography>
                ))}
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 1.5 }}
                  onClick={() => {
                    setSelectedCourier(courier);
                    setError('');
                    setSuccess('');
                  }}
                >
                  Request Courier
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {couriers.length === 0 && (
          <Grid size={12}>
            <Typography color="text.secondary" textAlign="center" py={4}>
              No couriers available
            </Typography>
          </Grid>
        )}
      </Grid>

      <Dialog
        open={!!selectedCourier}
        onClose={() => setSelectedCourier(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Request {selectedCourier?.firstName} {selectedCourier?.lastName}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2, mt: 1 }}>
              {success}
            </Alert>
          )}

          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Day</InputLabel>
            <Select
              value={selectedDay}
              label="Day"
              onChange={(e) => {
                setSelectedDay(e.target.value as DayOfWeek);
                setStartTime('');
                setEndTime('');
              }}
            >
              {selectedCourier &&
                Object.keys(selectedCourier.workingDays || {}).map((day) => (
                  <MenuItem key={day} value={day}>
                    {dayLabels[day as DayOfWeek]}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {selectedDay && selectedCourier && (
            <>
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel>Start Time</InputLabel>
                <Select
                  value={startTime}
                  label="Start Time"
                  onChange={(e) => setStartTime(e.target.value)}
                >
                  {getAvailableTimeSlots(selectedCourier.id, selectedDay).map((t) => {
                    const booked = isTimeSlotBooked(
                      selectedCourier.id,
                      selectedDay,
                      t,
                      TIME_SLOTS[TIME_SLOTS.indexOf(t) + 1] || '23:59'
                    );
                    return (
                      <MenuItem key={t} value={t} disabled={booked}>
                        {t} {booked ? '(booked)' : ''}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" size="small">
                <InputLabel>End Time</InputLabel>
                <Select
                  value={endTime}
                  label="End Time"
                  onChange={(e) => setEndTime(e.target.value)}
                >
                  {getAvailableTimeSlots(selectedCourier.id, selectedDay)
                    .filter((t) => t > startTime)
                    .map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              {selectedDay &&
                getCourierBookedSlots(selectedCourier.id, selectedDay).length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Already booked slots:
                    </Typography>
                    {getCourierBookedSlots(selectedCourier.id, selectedDay).map((slot) => (
                      <Chip
                        key={slot.id}
                        label={`${slot.startHours}-${slot.endHours}`}
                        size="small"
                        color="error"
                        variant="outlined"
                        sx={{ ml: 0.5 }}
                      />
                    ))}
                  </Box>
                )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedCourier(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleRequest}>
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourierBrowser;
