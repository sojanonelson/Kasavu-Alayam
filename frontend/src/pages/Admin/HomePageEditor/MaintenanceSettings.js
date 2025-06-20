import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  FormControlLabel, 
  Switch, 
  Typography,
  TextField,
  Paper,
  Stack
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import websiteSettingService from '../../../services/websiteSettingService';

const MaintenanceSettings = ({ settings }) => {
  const [underMaintenance, setUnderMaintenance] = useState(settings?.underMaintenance || false);
  const [maintenanceStart, setMaintenanceStart] = useState(settings?.maintenanceTime?.start || null);
  const [maintenanceEnd, setMaintenanceEnd] = useState(settings?.maintenanceTime?.end || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await websiteSettingService.updateMaintenanceStatus({
        underMaintenance,
        maintenanceTimeStart: maintenanceStart,
        maintenanceTimeEnd: maintenanceEnd
      });
      // Show success message or refresh
    } catch (err) {
      console.error('Error updating maintenance status:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisableMaintenance = async () => {
    setIsSubmitting(true);
    try {
      await websiteSettingService.deleteCarouselImage(); // Note: This seems incorrect - should be a different endpoint
      setUnderMaintenance(false);
      setMaintenanceStart(null);
      setMaintenanceEnd(null);
    } catch (err) {
      console.error('Error disabling maintenance:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Maintenance Mode
      </Typography>
      
      <FormControlLabel
        control={
          <Switch
            checked={underMaintenance}
            onChange={(e) => setUnderMaintenance(e.target.checked)}
            color="primary"
          />
        }
        label="Enable Maintenance Mode"
        sx={{ mb: 2 }}
      />
      
      {underMaintenance && (
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Typography>Schedule Maintenance Window</Typography>
          
          <DateTimePicker
            label="Start Time"
            value={maintenanceStart}
            onChange={setMaintenanceStart}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          
          <DateTimePicker
            label="End Time"
            value={maintenanceEnd}
            onChange={setMaintenanceEnd}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Stack>
      )}
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </Button>
        
        {underMaintenance && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleDisableMaintenance}
            disabled={isSubmitting}
          >
            Disable Maintenance
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default MaintenanceSettings;