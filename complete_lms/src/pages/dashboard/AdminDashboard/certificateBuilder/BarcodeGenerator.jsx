// BarcodeGenerator.jsx
import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const BarcodeGenerator = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        QR/Barcode Generator
      </Typography>
      <TextField
        fullWidth
        label="Verification Data"
        variant="outlined"
        margin="normal"
      />
      <Button variant="contained" sx={{ mt: 2 }}>
        Generate QR Code
      </Button>
    </Box>
  );
};

export default BarcodeGenerator; // Make sure this is present