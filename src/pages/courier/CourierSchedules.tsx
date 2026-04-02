import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
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

const CourierSchedules = () => {
  const { couriers } = useAppSelector((s) => s.couriers);
  const currentUser = useAppSelector((s) => s.auth.currentUser);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        All Courier Schedules
      </Typography>

      <Grid container spacing={2}>
        {couriers.map((courier) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={courier.id}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                border: courier.id === currentUser?.id ? '2px solid' : undefined,
                borderColor: courier.id === currentUser?.id ? 'primary.main' : undefined,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Avatar src={courier.profileImage} sx={{ width: 48, height: 48 }}>
                    <LocalShippingIcon />
                  </Avatar>
                  <Box>
                    <Typography fontWeight={600}>
                      {courier.firstName} {courier.lastName}
                      {courier.id === currentUser?.id && ' (You)'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {courier.vehicle}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="subtitle2" gutterBottom>
                  Schedule:
                </Typography>
                {Object.keys(courier.workingDays || {}).length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No schedule set
                  </Typography>
                ) : (
                  Object.entries(courier.workingDays || {}).map(([day, hours]) => (
                    <Typography key={day} variant="body2" color="text.secondary">
                      {dayLabels[day as DayOfWeek]}: {hours.startHours} - {hours.endHours}
                    </Typography>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
        {couriers.length === 0 && (
          <Grid size={12}>
            <Typography color="text.secondary" textAlign="center" py={4}>
              No couriers registered yet
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CourierSchedules;
