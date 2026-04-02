import { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
import GroupIcon from '@mui/icons-material/Group';
import CourierProfile from './CourierProfile';
import CourierSchedules from './CourierSchedules';
import CourierRequests from './CourierRequests';

const CourierDashboard = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Courier Dashboard
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab icon={<PersonIcon />} iconPosition="start" label="My Profile" />
          <Tab icon={<ScheduleIcon />} iconPosition="start" label="Courier Schedules" />
          <Tab icon={<GroupIcon />} iconPosition="start" label="My Requests" />
        </Tabs>
      </Box>
      {tab === 0 && <CourierProfile />}
      {tab === 1 && <CourierSchedules />}
      {tab === 2 && <CourierRequests />}
    </Box>
  );
};

export default CourierDashboard;
