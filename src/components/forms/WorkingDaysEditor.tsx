import { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Typography,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { DayOfWeek, WorkingDays, WorkingHours } from '../../types';
import { DAYS_OF_WEEK, TIME_SLOTS } from '../../config/constants';

interface WorkingDaysEditorProps {
  value: WorkingDays;
  onChange: (workingDays: WorkingDays) => void;
  error?: string;
  disabledDays?: DayOfWeek[];
}

const dayLabels: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

const WorkingDaysEditor = ({ value, onChange, error, disabledDays }: WorkingDaysEditorProps) => {
  const selectedDays = Object.keys(value) as DayOfWeek[];
  const availableDays = DAYS_OF_WEEK.filter(
    (d) => !selectedDays.includes(d) && !(disabledDays || []).includes(d)
  );

  const [pendingDay, setPendingDay] = useState<DayOfWeek | ''>('');

  const handleAddDay = () => {
    if (!pendingDay) return;
    const updated: WorkingDays = {
      ...value,
      [pendingDay]: { startHours: '09:00', endHours: '18:00' },
    };
    onChange(updated);
    setPendingDay('');
  };

  const handleRemoveDay = (day: DayOfWeek) => {
    const updated = { ...value };
    delete updated[day];
    onChange(updated);
  };

  const handleTimeChange = (
    day: DayOfWeek,
    field: keyof WorkingHours,
    time: string
  ) => {
    const updated: WorkingDays = {
      ...value,
      [day]: { ...value[day]!, [field]: time },
    };
    onChange(updated);
  };

  return (
    <Box sx={{ my: 1 }}>
      <Typography variant="subtitle2" gutterBottom>
        Working Days (minimum 5)
      </Typography>

      {selectedDays.map((day) => (
        <Paper key={day} variant="outlined" sx={{ p: 1.5, mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ minWidth: 100, fontWeight: 500 }}>{dayLabels[day]}</Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Start</InputLabel>
            <Select
              value={value[day]?.startHours || ''}
              label="Start"
              onChange={(e) => handleTimeChange(day, 'startHours', e.target.value)}
            >
              {TIME_SLOTS.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>End</InputLabel>
            <Select
              value={value[day]?.endHours || ''}
              label="End"
              onChange={(e) => handleTimeChange(day, 'endHours', e.target.value)}
            >
              {TIME_SLOTS.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton color="error" onClick={() => handleRemoveDay(day)} size="small">
            <DeleteIcon />
          </IconButton>
        </Paper>
      ))}

      {availableDays.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Add Day</InputLabel>
            <Select
              value={pendingDay}
              label="Add Day"
              onChange={(e) => setPendingDay(e.target.value as DayOfWeek)}
            >
              {availableDays.map((d) => (
                <MenuItem key={d} value={d}>
                  {dayLabels[d]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddDay}
            disabled={!pendingDay}
          >
            Add
          </Button>
        </Box>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default WorkingDaysEditor;
