import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Box, Typography, Button, TextField, Switch, FormControlLabel, Paper } from '@mui/material';
import websiteSettingService from '../../services/websiteSettingService';
import CarouselManager from './HomePageEditor/CarouselManager';
import ContactInfoForm from './HomePageEditor/ContactInfoForm';
import MaintenanceSettings from './HomePageEditor/MaintenanceSettings';
import { DateTimePicker } from '@mui/x-date-pickers';

const WebsiteSettings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!loading) return <Typography>Loading settings...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <span>Kasavu Aalayam Website Settings</span>
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Carousel" />
        <Tab label="Contact Info" />
        <Tab label="Maintenance" />
      </Tabs>
      
      <Box sx={{ p: 2 }}>
        {tabValue === 0 && <CarouselManager images={settings?.carouselImages || []} />}
        {tabValue === 1 && <ContactInfoForm contact={settings?.contact || {}} />}
        {tabValue === 2 && <MaintenanceSettings settings={settings} />}
      </Box>
    </Paper>
  );
};

export default WebsiteSettings;