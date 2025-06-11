
import React, { useState } from 'react';
import {
  Paper, Typography, Box, FormControlLabel, Checkbox, Button, Snackbar, Alert
} from '@mui/material';
import dummyData from './dummyData';

const InstructorSettings = ({ compliance = dummyData.compliance }) => {
  const [settings, setSettings] = useState({
    gdprConsent: compliance.gdprConsent,
    recordingsConsent: compliance.recordingsConsent
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSettings({ ...settings, [name]: checked });
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    setSnackbar({ open: true, message: 'Settings saved successfully', severity: 'success' });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Settings</Typography>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>Data Privacy & Compliance</Typography>
        <FormControlLabel
          control={
            <Checkbox
              name="gdprConsent"
              checked={settings.gdprConsent}
              onChange={handleChange}
              color="primary"
            />
          }
          label="Consent to GDPR data processing"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="recordingsConsent"
              checked={settings.recordingsConsent}
              onChange={handleChange}
              color="primary"
            />
          }
          label="Allow session recordings"
        />
      </Box>
      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={handleSave}
      >
        Save Settings
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default InstructorSettings;
