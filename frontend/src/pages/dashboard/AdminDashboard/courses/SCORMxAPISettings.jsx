import React, { useState } from 'react';
import {  
  Box, Typography, Button, Paper, Divider,
  Grid, TextField, FormControl, InputLabel,
  Select, MenuItem, Chip, useTheme, Alert, Checkbox, InputAdornment,
  Collapse, IconButton, FormControlLabel, Switch, LinearProgress,
  useMediaQuery
} from '@mui/material';
import {  
  CloudUpload, Delete, Close, Info, CheckCircle, Save
} from '@mui/icons-material';

const SCORMxAPISettings = ({ courseId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [settings, setSettings] = useState({
    enabled: false,
    standard: 'scorm12',
    version: '1.2',
    completionThreshold: 80,
    scoreThreshold: 70,
    tracking: {
      completion: true,
      score: true,
      time: true,
      progress: true
    },
    package: null,
    packageName: ''
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [successAlert, setSuccessAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name in settings.tracking) {
      setSettings(prev => ({
        ...prev,
        tracking: {
          ...prev.tracking,
          [name]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleStandardChange = (e) => {
    const standard = e.target.value;
    setSettings(prev => ({
      ...prev,
      standard,
      version: standard === 'scorm12' ? '1.2' : standard === 'scorm2004' ? '4th' : '1.0.0'
    }));
  };

  const handlePackageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    setUploadError(null);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setSettings(prev => ({
            ...prev,
            package: file,
            packageName: file.name
          }));
          setSuccessAlert(true);
          setTimeout(() => setSuccessAlert(false), 5000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const removePackage = () => {
    setSettings(prev => ({
      ...prev,
      package: null,
      packageName: ''
    }));
  };

  const handleSave = () => {
    console.log('SCORM/xAPI settings saved:', settings);
    // API call to save settings
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ mb: 3, fontWeight: 600 }}>
        SCORM/xAPI Settings
      </Typography>
      
      <Paper sx={{ p: isMobile ? 2 : 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.enabled}
              onChange={handleChange}
              name="enabled"
              color="primary"
            />
          }
          label="Enable SCORM/xAPI tracking"
          sx={{ mb: 2 }}
          labelPlacement={isMobile ? 'end' : 'start'}
        />
        
        {settings.enabled && (
          <>
            <Divider sx={{ my: 3 }} />
            
            <Grid container spacing={isMobile ? 1 : 3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Standard</InputLabel>
                  <Select
                    value={settings.standard}
                    onChange={handleStandardChange}
                    label="Standard"
                    size={isMobile ? 'small' : 'medium'}
                  >
                    <MenuItem value="scorm12">SCORM 1.2</MenuItem>
                    <MenuItem value="scorm2004">SCORM 2004</MenuItem>
                    <MenuItem value="xapi">xAPI (Tin Can)</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Version"
                  value={settings.version}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 3 }}
                  size={isMobile ? 'small' : 'medium'}
                />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Tracking Options
                  </Typography>
                  
                  <Grid container spacing={1}>
                    <Grid item xs={6} sm={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={settings.tracking.completion}
                            onChange={handleChange}
                            name="completion"
                            size={isMobile ? 'small' : 'medium'}
                          />
                        }
                        label="Completion"
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={settings.tracking.score}
                            onChange={handleChange}
                            name="score"
                            size={isMobile ? 'small' : 'medium'}
                          />
                        }
                        label="Score"
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={settings.tracking.time}
                            onChange={handleChange}
                            name="time"
                            size={isMobile ? 'small' : 'medium'}
                          />
                        }
                        label="Time spent"
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={settings.tracking.progress}
                            onChange={handleChange}
                            name="progress"
                            size={isMobile ? 'small' : 'medium'}
                          />
                        }
                        label="Progress"
                      />
                    </Grid>
                  </Grid>
                </Box>
                
                <TextField
                  fullWidth
                  type="number"
                  label="Completion Threshold (%)"
                  name="completionThreshold"
                  value={settings.completionThreshold}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  sx={{ mb: 2 }}
                  size={isMobile ? 'small' : 'medium'}
                />
                
                <TextField
                  fullWidth
                  type="number"
                  label="Passing Score Threshold (%)"
                  name="scoreThreshold"
                  value={settings.scoreThreshold}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  size={isMobile ? 'small' : 'medium'}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    SCORM/xAPI Package
                  </Typography>
                  
                  {settings.package ? (
                    <Box>
                      <Chip
                        label={settings.packageName}
                        onDelete={removePackage}
                        deleteIcon={<Delete />}
                        variant="outlined"
                        sx={{ mb: 1 }}
                        size={isMobile ? 'small' : 'medium'}
                      />
                      <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                        Package uploaded successfully
                      </Typography>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUpload />}
                      disabled={uploading}
                      size={isMobile ? 'small' : 'medium'}
                      fullWidth={isMobile}
                    >
                      Upload Package
                      <input
                        type="file"
                        hidden
                        accept=".zip,.pif"
                        onChange={handlePackageUpload}
                      />
                    </Button>
                  )}
                  
                  {uploading && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={uploadProgress} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption">
                        Uploading: {uploadProgress}%
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                <Alert severity="info" icon={<Info />} sx={{ mb: 2 }}>
                  <Typography variant={isMobile ? 'caption' : 'body2'}>
                    <strong>SCORM 1.2/2004:</strong> Upload a .zip file containing your SCORM package
                  </Typography>
                  <Typography variant={isMobile ? 'caption' : 'body2'} sx={{ mt: 1 }}>
                    <strong>xAPI:</strong> Configure your LRS endpoint in system settings
                  </Typography>
                </Alert>
                
                <Collapse in={uploadError}>
                  <Alert 
                    severity="error" 
                    action={
                      <IconButton
                        size="small"
                        onClick={() => setUploadError(null)}
                      >
                        <Close fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    {uploadError}
                  </Alert>
                </Collapse>
                
                <Collapse in={successAlert}>
                  <Alert 
                    severity="success" 
                    icon={<CheckCircle />}
                    onClose={() => setSuccessAlert(false)}
                    sx={{ mb: 2 }}
                  >
                    Package uploaded successfully!
                  </Alert>
                </Collapse>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={uploading}
                startIcon={<Save />}
                size={isMobile ? 'small' : 'medium'}
                fullWidth={isMobile}
              >
                Save Settings
              </Button>
            </Box>
          </>
        )}
      </Paper>
      
      {!settings.enabled && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          SCORM/xAPI tracking is currently disabled. Enable it to configure settings.
        </Alert>
      )}
    </Box>
  );
};

export default SCORMxAPISettings;