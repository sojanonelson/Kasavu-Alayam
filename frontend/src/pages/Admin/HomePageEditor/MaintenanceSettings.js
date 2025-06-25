import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  FormControlLabel, 
  Switch, 
  Typography,
  TextField,
  Paper,
  Stack,
  Snackbar,
  Alert,
  Card,
  Divider,
  useTheme
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import WarningIcon from '@mui/icons-material/Warning';
import ScheduleIcon from '@mui/icons-material/Schedule';
import websiteSettingService from '../../../services/websiteSettingService';

const MaintenanceSettings = ({ settings }) => {
  const theme = useTheme();
  const [underMaintenance, setUnderMaintenance] = useState(settings?.underMaintenance || false);
  const [maintenanceStart, setMaintenanceStart] = useState(settings?.maintenanceTime?.start || null);
  const [maintenanceEnd, setMaintenanceEnd] = useState(settings?.maintenanceTime?.end || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await websiteSettingService.updateMaintenanceStatus({
        underMaintenance,
        maintenanceTimeStart: maintenanceStart,
        maintenanceTimeEnd: maintenanceEnd
      });
      setSnackbarMessage('Maintenance settings saved successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error updating maintenance status:', err);
      setSnackbarMessage('Failed to update settings. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisableMaintenance = async () => {
    setIsSubmitting(true);
    try {
      await websiteSettingService.updateMaintenanceStatus({ underMaintenance: false });
      setUnderMaintenance(false);
      setMaintenanceStart(null);
      setMaintenanceEnd(null);
      setSnackbarMessage('Maintenance mode disabled successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error disabling maintenance:', err);
      setSnackbarMessage('Failed to disable maintenance mode');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card 
      elevation={0} 
      sx={{ 
        p: 4, 
        borderRadius: 2, 
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(to bottom right, #2f0b0b 0%, #1a0404 100%)' 
          : 'linear-gradient(to bottom right, #fff5f5 0%, #ffebee 100%)',
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? '#5c1a1a' : '#ffcdd2'
      }}
    >
      <Box display="flex" alignItems="center" mb={3}>
        <WarningIcon 
          color="error" 
          sx={{ 
            fontSize: 36, 
            mr: 2,
            backgroundColor: theme.palette.mode === 'dark' ? '#310000' : '#ffebee',
            borderRadius: '50%',
            p: 1
          }} 
        />
        <Box>
          <Typography variant="h5" fontWeight={700} color="error.dark">
            Maintenance Mode
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Control your website's maintenance status
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: theme.palette.mode === 'dark' ? '#5c1a1a' : '#ffcdd2', my: 2 }} />
      
      <FormControlLabel
        control={
          <Switch
            checked={underMaintenance}
            onChange={(e) => setUnderMaintenance(e.target.checked)}
            color="error"
            sx={{
              '& .MuiSwitch-thumb': {
                backgroundColor: theme.palette.error.main,
              },
              '& .MuiSwitch-track': {
                backgroundColor: theme.palette.error.light,
              },
            }}
          />
        }
        label={
          <Typography color={underMaintenance ? 'error.main' : 'text.secondary'}>
            {underMaintenance ? 'Maintenance Mode ACTIVE' : 'Enable Maintenance Mode'}
          </Typography>
        }
        sx={{ mb: 3, '& .MuiTypography-root': { fontWeight: underMaintenance ? 600 : 400 } }}
      />
      
      {underMaintenance && (
        <Box 
          sx={{ 
            mb: 3, 
            p: 3, 
            borderRadius: 2, 
            backgroundColor: theme.palette.mode === 'dark' ? '#310000' : '#ffebee',
            borderLeft: `4px solid ${theme.palette.error.main}`
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <ScheduleIcon color="error" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" color="error.main">
              Schedule Maintenance Window
            </Typography>
          </Box>
          
          <Stack spacing={3}>
            <DateTimePicker
              label="Start Time"
              value={maintenanceStart}
              onChange={setMaintenanceStart}
              renderInput={(params) => 
                <TextField 
                  {...params} 
                  fullWidth 
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: theme.palette.error.light,
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.error.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.error.main,
                      },
                    }
                  }}
                />
              }
            />
            
            <DateTimePicker
              label="End Time"
              value={maintenanceEnd}
              onChange={setMaintenanceEnd}
              renderInput={(params) => 
                <TextField 
                  {...params} 
                  fullWidth 
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: theme.palette.error.light,
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.error.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.error.main,
                      },
                    }
                  }}
                />
              }
            />
          </Stack>
        </Box>
      )}
      
      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          color="error"
          sx={{
            flexGrow: 1,
            py: 1.5,
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: `0 0 0 4px ${theme.palette.error.light}`,
              backgroundColor: theme.palette.error.dark
            }
          }}
        >
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </Button>
        
        {underMaintenance && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleDisableMaintenance}
            disabled={isSubmitting}
            sx={{
              py: 1.5,
              borderWidth: 2,
              fontWeight: 600,
              '&:hover': {
                borderWidth: 2,
                backgroundColor: theme.palette.error.light + '30'
              }
            }}
          >
            Disable Maintenance
          </Button>
        )}
      </Box>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{
            backgroundColor: snackbarSeverity === 'error' 
              ? theme.palette.error.dark 
              : theme.palette.success.dark,
            color: theme.palette.common.white
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default MaintenanceSettings;
