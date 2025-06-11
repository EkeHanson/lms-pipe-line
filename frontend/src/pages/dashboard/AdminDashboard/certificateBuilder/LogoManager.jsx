// src/components/admin/certificateBuilder/LogoManager.jsx
import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Divider, 
  IconButton, 
  Grid,
  Paper
} from '@mui/material';
import { useCertificate } from '../../../../contexts/CertificateContext';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const LogoManager = () => {
  const { logos, addLogo } = useCertificate();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newLogo = {
          id: Date.now(),
          url: reader.result,
          position: 'top-right' // default position
        };
        addLogo(newLogo);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = (id) => {
    // You'll need to add removeLogo to your context
    // removeLogo(id);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Logo Manager
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Add up to 3 logos to your certificate
      </Typography>
      
      <Button
        fullWidth
        variant="outlined"
        startIcon={<AddPhotoAlternateIcon />}
        onClick={() => fileInputRef.current.click()}
        disabled={logos.length >= 3}
        sx={{ mb: 2 }}
      >
        Add Logo
      </Button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      <Grid container spacing={2}>
        {logos.map((logo) => (
          <Grid item xs={4} key={logo.id}>
            <Paper elevation={2} sx={{ p: 1, position: 'relative' }}>
              <Box
                component="img"
                src={logo.url}
                alt="Logo"
                sx={{
                  width: '100%',
                  height: 60,
                  objectFit: 'contain'
                }}
              />
              <IconButton
                size="small"
                color="error"
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: 'background.paper'
                }}
                onClick={() => handleRemoveLogo(logo.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LogoManager; // Make sure this default export exists