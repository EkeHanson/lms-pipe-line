// src/components/admin/certificateBuilder/CertificateBuilderMain.jsx
import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import CertificateTemplateSelector from './CertificateTemplateSelector';
import CertificateDesignPanel from './CertificateDesignPanel';
import SignatureManager from './SignatureManager';
import LogoManager from './LogoManager';
import BarcodeGenerator from './BarcodeGenerator';
import ExportOptions from './ExportOptions';
import BulkGenerator from './BulkGenerator';
import CertificatePreview from './CertificatePreview';
import './styles.css';

const CertificateBuilderMain = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Certificate Builder
      </Typography>
      
      <Grid container spacing={3}>
        {/* Left Panel - Controls */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <CertificateTemplateSelector />
          </Paper>
          
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <CertificateDesignPanel />
          </Paper>
          
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <SignatureManager />
          </Paper>
          
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <LogoManager />
          </Paper>
          
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <BarcodeGenerator />
          </Paper>
        </Grid>
        
        {/* Middle Panel - Preview */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, mb: 3, height: '100%' }}>
            <CertificatePreview />
          </Paper>
        </Grid>
        
        {/* Right Panel - Export & Bulk */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <ExportOptions />
          </Paper>
          
          <Paper elevation={3} sx={{ p: 2 }}>
            <BulkGenerator />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CertificateBuilderMain;