// src/components/admin/certificateBuilder/ExportOptions.jsx
import React from 'react';
import { Box, Typography, Button, Divider, MenuItem, TextField, Grid } from '@mui/material';
import { useCertificate } from '../../../../contexts/CertificateContext';

const ExportOptions = () => {
  const { title, recipientName } = useCertificate();

  const exportFormats = [
    { value: 'png', label: 'PNG (High Quality)' },
    { value: 'jpeg', label: 'JPEG (High Quality)' },
    { value: 'pdf', label: 'PDF Document' },
  ];

  const handleExport = (format) => {
    console.log(`Exporting as ${format} for ${recipientName}`);
    // Implement actual export logic here
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Export Options
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <TextField
        select
        fullWidth
        label="Export Format"
        defaultValue="png"
        variant="outlined"
        sx={{ mb: 2 }}
      >
        {exportFormats.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => handleExport('png')}
          >
            Export as PNG
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={() => handleExport('jpeg')}
          >
            Export as JPEG
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={() => handleExport('pdf')}
          >
            Export as PDF
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Current certificate: {title}
        </Typography>
      </Box>
    </Box>
  );
};

export default ExportOptions; // This is the crucial default export