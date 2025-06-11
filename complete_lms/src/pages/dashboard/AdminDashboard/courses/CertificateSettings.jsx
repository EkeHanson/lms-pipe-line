import React, { useState } from 'react';
import {
  Box, Typography, Button, Paper, Divider,
  Grid, TextField, FormControlLabel, Checkbox,
  useTheme, Avatar, IconButton, InputAdornment, MenuItem, useMediaQuery
} from '@mui/material';
import {
  CloudUpload, Delete, Image, Description,
  Edit, Save, AddPhotoAlternate
} from '@mui/icons-material';

const CertificateSettings = ({ courseId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [certificate, setCertificate] = useState({
    enabled: true,
    template: 'default',
    customText: 'Congratulations on completing the course!',
    signature: null,
    signatureName: 'Course Instructor',
    showDate: true,
    showCourseName: true,
    showCompletionHours: true,
    customLogo: null
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCertificate(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setCertificate(prev => ({ ...prev, customLogo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignatureFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setCertificate(prev => ({ ...prev, signature: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setCertificate(prev => ({ ...prev, customLogo: null }));
  };

  const removeSignature = () => {
    setSignatureFile(null);
    setCertificate(prev => ({ ...prev, signature: null }));
  };

  const handleSave = () => {
    console.log('Certificate settings saved:', certificate);
    // API call to save settings
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Typography variant={isMobile ? "h5" : "h4"} sx={{ mb: 3, fontWeight: 600 }}>
        Certificate Settings
      </Typography>
      
      <Paper sx={{ p: isMobile ? 2 : 3, mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={certificate.enabled}
              onChange={handleChange}
              name="enabled"
            />
          }
          label="Enable certificates for this course"
          sx={{ mb: 2 }}
        />
        
        {certificate.enabled && (
          <>
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Certificate Content
            </Typography>
            
            <Grid container spacing={isMobile ? 2 : 3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Template"
                  name="template"
                  value={certificate.template}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  size={isMobile ? "small" : "medium"}
                >
                  <MenuItem value="default">Default</MenuItem>
                  <MenuItem value="modern">Modern</MenuItem>
                  <MenuItem value="elegant">Elegant</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </TextField>
                
                <TextField
                  fullWidth
                  multiline
                  rows={isMobile ? 3 : 4}
                  label="Certificate Text"
                  name="customText"
                  value={certificate.customText}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  size={isMobile ? "small" : "medium"}
                />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Custom Logo (optional)
                  </Typography>
                  {certificate.customLogo ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={certificate.customLogo} 
                        variant="square"
                        sx={{ width: isMobile ? 60 : 100, height: isMobile ? 60 : 100, mr: 2 }}
                      />
                      <IconButton onClick={removeLogo} size={isMobile ? "small" : "medium"}>
                        <Delete color="error" fontSize={isMobile ? "small" : "medium"} />
                      </IconButton>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<AddPhotoAlternate fontSize={isMobile ? "small" : "medium"} />}
                      size={isMobile ? "small" : "medium"}
                    >
                      Upload Logo
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                    </Button>
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={certificate.showCourseName}
                        onChange={handleChange}
                        name="showCourseName"
                        size={isMobile ? "small" : "medium"}
                      />
                    }
                    label="Show course name"
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={certificate.showDate}
                        onChange={handleChange}
                        name="showDate"
                        size={isMobile ? "small" : "medium"}
                      />
                    }
                    label="Show completion date"
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={certificate.showCompletionHours}
                        onChange={handleChange}
                        name="showCompletionHours"
                        size={isMobile ? "small" : "medium"}
                      />
                    }
                    label="Show course hours"
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Signature
                  </Typography>
                  
                  <TextField
                    fullWidth
                    label="Signature Name"
                    name="signatureName"
                    value={certificate.signatureName}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    size={isMobile ? "small" : "medium"}
                  />
                  
                  {certificate.signature ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={certificate.signature} 
                        variant="square"
                        sx={{ 
                          width: isMobile ? 100 : 150, 
                          height: isMobile ? 40 : 60, 
                          mr: 2 
                        }}
                      />
                      <IconButton 
                        onClick={removeSignature} 
                        size={isMobile ? "small" : "medium"}
                      >
                        <Delete color="error" fontSize={isMobile ? "small" : "medium"} />
                      </IconButton>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<Edit fontSize={isMobile ? "small" : "medium"} />}
                      size={isMobile ? "small" : "medium"}
                    >
                      Upload Signature
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleSignatureUpload}
                      />
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 2 : 0
            }}>
              <Button
                variant={previewMode ? 'contained' : 'outlined'}
                onClick={() => setPreviewMode(!previewMode)}
                startIcon={<Image fontSize={isMobile ? "small" : "medium"} />}
                size={isMobile ? "small" : "medium"}
                fullWidth={isMobile}
              >
                {previewMode ? 'Hide Preview' : 'Show Preview'}
              </Button>
              
              <Button
                variant="contained"
                onClick={handleSave}
                startIcon={<Save fontSize={isMobile ? "small" : "medium"} />}
                size={isMobile ? "small" : "medium"}
                fullWidth={isMobile}
                sx={isMobile ? { mt: 1 } : {}}
              >
                Save Settings
              </Button>
            </Box>
            
            {previewMode && (
              <Paper sx={{ 
                mt: 3, 
                p: isMobile ? 2 : 4, 
                textAlign: 'center', 
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Typography variant={isMobile ? "h6" : "h5"} sx={{ mb: 1, fontWeight: 700 }}>
                  Certificate of Completion
                </Typography>
                
                <Typography variant={isMobile ? "body2" : "subtitle1"} sx={{ mb: 3 }}>
                  This is to certify that
                </Typography>
                
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ mb: 3, fontWeight: 600 }}>
                  [Student Name]
                </Typography>
                
                <Typography variant={isMobile ? "body2" : "body1"} sx={{ mb: 3 }}>
                  has successfully completed the course
                </Typography>
                
                {certificate.showCourseName && (
                  <Typography variant={isMobile ? "h6" : "h5"} sx={{ mb: 3, fontWeight: 600 }}>
                    [Course Name]
                  </Typography>
                )}
                
                <Typography variant={isMobile ? "body2" : "body1"} sx={{ mb: 4 }}>
                  {certificate.customText}
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {certificate.showCompletionHours && (
                    <Grid item xs={6}>
                      <Typography variant={isMobile ? "body2" : "body1"}>
                        Total Course Hours:
                      </Typography>
                      <Typography variant={isMobile ? "body2" : "body1"} fontWeight="500">
                        [Hours]
                      </Typography>
                    </Grid>
                  )}
                  
                  {certificate.showDate && (
                    <Grid item xs={6}>
                      <Typography variant={isMobile ? "body2" : "body1"}>
                        Date Completed:
                      </Typography>
                      <Typography variant={isMobile ? "body2" : "body1"} fontWeight="500">
                        [Date]
                      </Typography>
                    </Grid>
                  )}
                </Grid>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mt: 4,
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'center' : 'flex-end',
                  gap: isMobile ? 3 : 0
                }}>
                  <Box sx={{ width: isMobile ? '100%' : '200px' }}>
                    {certificate.signature && (
                      <>
                        <Avatar 
                          src={certificate.signature} 
                          variant="square"
                          sx={{ 
                            width: isMobile ? '120px' : '150px', 
                            height: isMobile ? '40px' : '60px', 
                            mb: 1,
                            mx: isMobile ? 'auto' : 'inherit'
                          }}
                        />
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant={isMobile ? "body2" : "body1"}>
                          {certificate.signatureName}
                        </Typography>
                      </>
                    )}
                  </Box>
                  
                  {certificate.customLogo && (
                    <Box sx={{ 
                      width: isMobile ? '100%' : '200px',
                      mt: isMobile ? 2 : 0
                    }}>
                      <Avatar 
                        src={certificate.customLogo} 
                        variant="square"
                        sx={{ 
                          width: isMobile ? '80px' : '100px', 
                          height: isMobile ? '80px' : '100px',
                          mx: isMobile ? 'auto' : 'inherit'
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Paper>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default CertificateSettings;