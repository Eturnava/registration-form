import { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import UserProfile from './UserProfile';
import CourierBrowser from './CourierBrowser';

const UserDashboard = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        User Dashboard
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab icon={<PersonIcon />} iconPosition="start" label="My Profile" />
          <Tab icon={<LocalShippingIcon />} iconPosition="start" label="Request Courier" />
        </Tabs>
      </Box>
      {tab === 0 && <UserProfile />}
      {tab === 1 && <CourierBrowser />}
    </Box>
  );
};

export default UserDashboard;
