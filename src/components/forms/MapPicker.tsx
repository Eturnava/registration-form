import { Box, Typography, TextField } from '@mui/material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import type { Address } from '../../types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

interface MapPickerProps {
  value: Address;
  onChange: (address: Address) => void;
  error?: string;
}

function LocationMarker({
  position,
  onPositionChange,
}: {
  position: Address;
  onPositionChange: (addr: Address) => void;
}) {
  useMapEvents({
    click(e) {
      onPositionChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  if (position.lat === 0 && position.lng === 0) return null;
  return <Marker position={[position.lat, position.lng]} />;
}

const MapPicker = ({ value, onChange, error }: MapPickerProps) => {
  return (
    <Box sx={{ my: 1 }}>
      <Typography variant="subtitle2" gutterBottom>
        Select Location (Click on map)
      </Typography>
      <Box sx={{ height: 300, borderRadius: 1, overflow: 'hidden', border: '1px solid #ccc' }}>
        <MapContainer
          center={[41.7151, 44.8271]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={value} onPositionChange={onChange} />
        </MapContainer>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
        <TextField
          label="Latitude"
          value={value.lat || ''}
          size="small"
          slotProps={{ input: { readOnly: true } }}
          fullWidth
        />
        <TextField
          label="Longitude"
          value={value.lng || ''}
          size="small"
          slotProps={{ input: { readOnly: true } }}
          fullWidth
        />
      </Box>
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default MapPicker;
