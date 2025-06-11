// src/components/admin/certificateBuilder/CertificateTemplateSelector.jsx
import React from 'react';
import { Box, Typography, Grid, Button, Divider } from '@mui/material';
import { useCertificate } from '../../../../contexts/CertificateContext';

const templates = [
  { id: 1, name: 'Classic', thumbnail: '../../../../assets/templates/classic.png'},
  { id: 2, name: 'Modern', thumbnail: '../../../../assets/templates/modern.png'},
  { id: 3, name: 'Elegant', thumbnail: '../../../../assets/templates/elegant.png'},
  { id: 4, name: 'Minimal', thumbnail: '../../../../assets/templates/minimal.png'},
];

const CertificateTemplateSelector = () => {
  const { setTemplate } = useCertificate();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Template
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={2}>
        {templates.map((template) => (
          <Grid item xs={6} key={template.id}>
            <Button
              fullWidth
              onClick={() => setTemplate(template.id)}
              sx={{
                p: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                src={template.thumbnail}
                alt={template.name}
                sx={{
                  width: '100%',
                  height: 120,
                  objectFit: 'cover',
                  mb: 1,
                  borderRadius: 1,
                }}
              />
              <Typography variant="body2">{template.name}</Typography>
            </Button>
          </Grid>
        ))}
      </Grid>
      
      <Button
        fullWidth
        variant="outlined"
        sx={{ mt: 2 }}
        component="label"
      >
        Upload Custom Template
        <input type="file" hidden accept="image/*" />
      </Button>
    </Box>
  );
};

export default CertificateTemplateSelector;