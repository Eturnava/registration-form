import { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import UsersPanel from './UsersPanel';
import CouriersPanel from './CouriersPanel';

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Admin Dashboard
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab icon={<PeopleIcon />} iconPosition="start" label="Users" />
          <Tab icon={<LocalShippingIcon />} iconPosition="start" label="Couriers" />
        </Tabs>
      </Box>
      {tab === 0 && <UsersPanel />}
      {tab === 1 && <CouriersPanel />}
    </Box>
  );
};

export default AdminDashboard;
