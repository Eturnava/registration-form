import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import type { DayOfWeek } from '../../types';

const dayLabels: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

const CourierRequests = () => {
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const { requests } = useAppSelector((s) => s.requests);
  const { users } = useAppSelector((s) => s.users);

  const myRequests = currentUser
    ? requests.filter((r) => r.courierId === currentUser.id)
    : [];

  const uniqueUserCount = new Set(myRequests.map((r) => r.userId)).size;

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={700} color="primary">
            {myRequests.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Requests
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={700} color="secondary">
            {uniqueUserCount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Unique Users
          </Typography>
        </Paper>
      </Box>

      <Typography variant="h6" gutterBottom>
        Request Details
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Day</TableCell>
              <TableCell>Time Slot</TableCell>
              <TableCell>Requested At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {myRequests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{getUserName(req.userId)}</TableCell>
                <TableCell>
                  <Chip label={dayLabels[req.day]} size="small" />
                </TableCell>
                <TableCell>
                  {req.startHours} - {req.endHours}
                </TableCell>
                <TableCell>
                  {new Date(req.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {myRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="text.secondary" py={2}>
                    No requests received yet
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CourierRequests;
