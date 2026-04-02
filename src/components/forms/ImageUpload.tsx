import { useState } from 'react';
import { Button, Avatar, Box, CircularProgress, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadImage } from '../../services/cloudinary';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  error?: string;
}

const ImageUpload = ({ value, onChange, error }: ImageUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setUploadError('');

    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
        setUploadError('');
      };
      reader.readAsDataURL(file);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 1 }}>
      <Avatar src={value} sx={{ width: 64, height: 64 }} />
      <Box>
        <Button
          variant="outlined"
          component="label"
          startIcon={loading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
          disabled={loading}
          size="small"
        >
          {loading ? 'Uploading...' : 'Upload Image'}
          <input type="file" hidden accept="image/*" onChange={handleFileChange} />
        </Button>
        {uploadError && (
          <Typography variant="caption" color="warning.main" display="block">
            {uploadError}
          </Typography>
        )}
        {error && (
          <Typography variant="caption" color="error" display="block">
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ImageUpload;
