// === File: Certificate.jsx ===
import React, { useContext } from 'react';
import { CertificateContext } from '../../../contexts/CertificateContext';
import { Box, Paper, Typography } from '@mui/material';
import BarcodeGenerator from './BarcodeGenerator';
import DraggableElement from '../UI/DraggableElement';

// Import template images
import classicTemplate from '../../../assets/templates/classic.jpg';
import modernTemplate from '../../../assets/templates/modern.jpg';
import elegantTemplate from '../../../assets/templates/elegant.png';
import minimalTemplate from '../../../assets/templates/minimal.jpg';

const Certificate = () => {
  const { certificate } = useContext(CertificateContext);
  const { 
    title, 
    recipientName, 
    courseName, 
    completionText,
    date, 
    signatures, 
    logos, 
    barcodeData,
    template = 'classic', 
    templateImage,
    borderColor = '#f1c40f',
    borderWidth = '15px',
    borderStyle = 'solid'
  } = certificate;

  // Map template IDs to their image files
  const templateImages = {
    classic: classicTemplate,
    modern: modernTemplate,
    elegant: elegantTemplate,
    minimal: minimalTemplate
  };

  // Use custom template if available, otherwise use predefined
  const backgroundImage = templateImage || templateImages[template];

  return (
    <Paper 
      elevation={3}
      sx={{
        width: '100%',
        maxWidth: '1000px',
        aspectRatio: '4/3',
        position: 'relative',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderColor,
        borderWidth,
        borderStyle,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        mx: 'auto',
        my: 2
      }}
    >
      <Typography 
        variant="h3" 
        component="h1" 
        sx={{ 
          fontWeight: 700,
          color: 'text.primary',
          mb: 2,
          textAlign: 'center'
        }}
      >
        {title}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
        This is to certify that
      </Typography>
      
      <Typography 
        variant="h2" 
        component="h2" 
        sx={{ 
          fontWeight: 600,
          color: 'primary.main',
          mb: 2,
          textAlign: 'center'
        }}
      >
        {recipientName || "[Recipient Name]"}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
        {completionText || "has successfully completed the course"}
      </Typography>
      
      <Typography 
        variant="h4" 
        component="h3" 
        sx={{ 
          fontWeight: 500,
          color: 'text.secondary',
          mb: 2,
          textAlign: 'center'
        }}
      >
        {courseName || "[Course Name]"}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center' }}>
        on this {date}
      </Typography>
      
      <Box 
        sx={{ 
          display: 'flex',
          justifyContent: 'space-around',
          width: '100%',
          mt: 'auto',
          position: 'relative',
          height: '120px'
        }}
      >
        {signatures.map((sig, index) => (
          <DraggableElement 
            key={index} 
            id={`signature-${index}`} 
            defaultPosition={sig.position}
            bounds="parent"
          >
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <Box 
                component="img"
                src={sig.image} 
                alt="Signature" 
                sx={{ 
                  width: '120px', 
                  height: 'auto',
                  mb: 1
                }}
              />
              <Typography variant="body2">{sig.name || "[Name]"}</Typography>
              <Typography variant="caption">{sig.date || "[Date]"}</Typography>
            </Box>
          </DraggableElement>
        ))}
      </Box>

      {/* Logos */}
      {logos.map((logo, index) => (
        <DraggableElement 
          key={`logo-${index}`} 
          id={`logo-${index}`} 
          defaultPosition={logo?.position || { x: 50, y: 50 }}
          bounds="parent"
        >
          <Box 
            component="img"
            src={logo?.image} 
            alt={`Logo ${index + 1}`}
            sx={{
              width: '100px',
              height: 'auto',
            }}
          />
        </DraggableElement>
      ))}

      {/* Barcode */}
      <Box sx={{ 
        position: 'absolute',
        bottom: 16,
        right: 16
      }}>
        <BarcodeGenerator data={barcodeData} />
      </Box>
    </Paper>
  );
};

export default Certificate;