// src/components/admin/certificateBuilder/CertificatePreview.jsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useCertificate } from '../../../../contexts/CertificateContext';

const CertificatePreview = () => {
  const {
    title,
    recipientName,
    courseName,
    completionDate,
    completionText,
    borderColor,
    borderWidth,
    borderStyle,
    background,
    signatures,
    logos,
    qrCode
  } = useCertificate();

  return (
    <Box>
      <Typography variant="h6" gutterBottom align="center">
        Certificate Preview
      </Typography>
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          minHeight: '400px',
          p: 4,
          background,
          border: `${borderWidth}px ${borderStyle} ${borderColor}`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Certificate Content */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h5">This is to certify that</Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', my: 2 }}>
            {recipientName || 'Recipient Name'}
          </Typography>
          <Typography variant="h5">
            {completionText || 'has successfully completed the course'}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 2 }}>
            {courseName || 'Course Name'}
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="body1">
            Completed on: {completionDate}
          </Typography>
        </Box>
        
        {/* Signatures */}
        {signatures.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 8 }}>
            {signatures.map((signature, index) => (
              <Box key={index} sx={{ textAlign: 'center' }}>
                <Box
                  component="img"
                  src={signature.image}
                  alt={`Signature ${index + 1}`}
                  sx={{ height: 60, mb: 1 }}
                />
                <Typography variant="body2">{signature.name}</Typography>
                <Typography variant="caption">{signature.title}</Typography>
              </Box>
            ))}
          </Box>
        )}
        
        {/* Logos */}
        {logos.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            {logos.map((logo, index) => (
              <Box
                key={index}
                component="img"
                src={logo.image}
                alt={`Logo ${index + 1}`}
                sx={{ height: 50 }}
              />
            ))}
          </Box>
        )}
        
        {/* QR Code */}
        {qrCode && (
          <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}>
            <Box
              component="img"
              src={qrCode}
              alt="Verification QR Code"
              sx={{ width: 80, height: 80 }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default CertificatePreview;