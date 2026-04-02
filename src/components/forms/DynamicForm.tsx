import { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import type { FormFieldConfig, Address, WorkingDays, ValidationError } from '../../types';
import { validateForm } from '../../utils/validation';
import ImageUpload from './ImageUpload';
import MapPicker from './MapPicker';
import WorkingDaysEditor from './WorkingDaysEditor';

interface DynamicFormProps {
  fields: FormFieldConfig[];
  onSubmit: (values: Record<string, unknown>) => void;
  initialValues?: Record<string, unknown>;
  submitLabel?: string;
  title?: string;
}

const DynamicForm = ({
  fields,
  onSubmit,
  initialValues = {},
  submitLabel = 'Submit',
  title,
}: DynamicFormProps) => {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const defaults: Record<string, unknown> = {};
    fields.forEach((field) => {
      if (field.type === 'map') {
        defaults[field.name] = { lat: 0, lng: 0 };
      } else if (field.type === 'workingDays') {
        defaults[field.name] = {};
      } else {
        defaults[field.name] = '';
      }
    });
    return { ...defaults, ...initialValues };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  const handleChange = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const validationErrors: ValidationError[] = validateForm(fields, values);

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    setErrors({});
    onSubmit(values);
  };

  const renderField = (field: FormFieldConfig) => {
    const value = values[field.name];
    const error = errors[field.name];

    switch (field.type) {
      case 'hidden':
        return null;

      case 'image':
        return (
          <ImageUpload
            key={field.name}
            value={(value as string) || ''}
            onChange={(url) => handleChange(field.name, url)}
            error={error}
          />
        );

      case 'map':
        return (
          <MapPicker
            key={field.name}
            value={(value as Address) || { lat: 0, lng: 0 }}
            onChange={(addr) => handleChange(field.name, addr)}
            error={error}
          />
        );

      case 'workingDays':
        return (
          <WorkingDaysEditor
            key={field.name}
            value={(value as WorkingDays) || {}}
            onChange={(wd) => handleChange(field.name, wd)}
            error={error}
          />
        );

      case 'select':
        return (
          <TextField
            key={field.name}
            select
            fullWidth
            label={field.label}
            value={(value as string) || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            error={!!error}
            helperText={error}
            margin="normal"
            size="small"
            required={field.required}
          >
            {(field.options || []).map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        );

      default:
        return (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            type={field.type === 'tel' ? 'tel' : field.type}
            value={(value as string) || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            error={!!error}
            helperText={error}
            margin="normal"
            size="small"
            required={field.required}
          />
        );
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto' }}>
      {title && (
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          {title}
        </Typography>
      )}

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      {fields.map(renderField)}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        sx={{ mt: 3, mb: 2 }}
      >
        {submitLabel}
      </Button>
    </Box>
  );
};

export default DynamicForm;
