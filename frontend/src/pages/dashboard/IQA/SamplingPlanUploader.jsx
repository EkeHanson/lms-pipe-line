import React, { useState, useRef } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Divider, FormControl,
  InputLabel, Select, MenuItem, Chip, Avatar, Grid, FormGroup,
  FormControlLabel, Checkbox, CircularProgress, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions, List, ListItem,
  ListItemText, Badge, IconButton, Tooltip, Stack
} from '@mui/material';
import {
  Upload as UploadIcon, Description, Cancel, Person, School,
  CalendarToday, History, Visibility, Download, Groups, List as ListIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const SamplingPlanUploader = () => {
  // Form state
  const [planName, setPlanName] = useState('');
  const [planType, setPlanType] = useState('initial');
  const [dueDate, setDueDate] = useState(null);
  const [qualification, setQualification] = useState('');
  const [planFile, setPlanFile] = useState(null);
  const [selectedAssessors, setSelectedAssessors] = useState([]);
  const [selectedLearners, setSelectedLearners] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  // New feature states
  const [previewOpen, setPreviewOpen] = useState(false);
  const [versionHistory, setVersionHistory] = useState([]);
  const [bulkSelectOpen, setBulkSelectOpen] = useState(false);
  const [createdPlansOpen, setCreatedPlansOpen] = useState(false); // New state for plans dialog
  const [createdPlans, setCreatedPlans] = useState([]); // New state for storing created plans
  const fileInputRef = useRef(null);

  // Dummy data
  const qualifications = [
    'Level 2 Certificate in Business',
    'Level 3 Diploma in Business Administration', 
    'Level 4 Diploma in Business Management'
  ];

  const assessors = [
    { id: 1, name: 'Sarah Smith' },
    { id: 2, name: 'Michael Brown' },
    { id: 3, name: 'Emily Davis' }
  ];

  const learners = [
    { id: 1, name: 'John Doe', course: 'Level 3 Diploma' },
    { id: 2, name: 'Jane Smith', course: 'Level 2 Certificate' },
    // ...more learners (50+ in real implementation)
  ];

  // Template download links with multiple format options
  const templates = [
    { 
      name: 'Initial Verification Template', 
      formats: [
        { type: 'CSV', url: '/templates/initial.csv' },
        { type: 'PDF', url: '/templates/initial.pdf' },
        { type: 'Word', url: '/templates/initial.docx' }
      ]
    },
    { 
      name: 'Interim Sampling Template', 
      formats: [
        { type: 'CSV', url: '/templates/interim.csv' },
        { type: 'PDF', url: '/templates/interim.pdf' },
        { type: 'Word', url: '/templates/interim.docx' }
      ]
    },
    { 
      name: 'Summative Assessment Template', 
      formats: [
        { type: 'CSV', url: '/templates/summative.csv' },
        { type: 'PDF', url: '/templates/summative.pdf' },
        { type: 'Word', url: '/templates/summative.docx' }
      ]
    }
  ];

  // Handle file upload with preview capability
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || 
                file.type.includes('wordprocessingml'))) {
      setPlanFile(file);
      // Auto-open preview for PDFs
      if (file.type === 'application/pdf') {
        setPreviewOpen(true);
      }
    } else {
      alert('Please upload a PDF or Word document');
    }
  };

  // Preview document in new tab
  const handlePreview = (file) => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    }
  };

  // Version control functions
  const saveNewVersion = (plan) => {
    if (plan.file) {
      const newVersion = {
        id: versionHistory.length + 1,
        timestamp: new Date().toISOString(),
        filename: plan.file.name,
        uploadedBy: 'Current User' // Would be real user in production
      };
      setVersionHistory([newVersion, ...versionHistory]);
    }
  };

  // Save new plan to created plans
  const saveNewPlan = () => {
    if (planName && qualification && planFile) {
      const newPlan = {
        id: createdPlans.length + 1,
        name: planName,
        type: planType,
        qualification: qualification,
        dueDate: dueDate,
        file: planFile,
        assessors: selectedAssessors,
        learners: selectedLearners,
        timestamp: new Date().toISOString()
      };
      setCreatedPlans([newPlan, ...createdPlans]);
    }
  };

  // Bulk selection functions
  const handleBulkLearnerSelect = (selectionType) => {
    switch (selectionType) {
      case 'all':
        setSelectedLearners(learners.map(l => l.id));
        break;
      case 'none':
        setSelectedLearners([]);
        break;
      case 'level3':
        setSelectedLearners(learners.filter(l => l.course.includes('Level 3')).map(l => l.id));
        break;
      default:
        break;
    }
    setBulkSelectOpen(false);
  };

  // Submit with version tracking and plan saving
  const handleSubmit = async () => {
    if (!planName || !qualification || !planFile) {
      setSubmitStatus({ type: 'error', message: 'Please fill all required fields' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newPlan = {
        name: planName,
        type: planType,
        qualification: qualification,
        dueDate: dueDate,
        file: planFile,
        assessors: selectedAssessors,
        learners: selectedLearners
      };
      saveNewVersion(newPlan);
      saveNewPlan();
      setSubmitStatus({ type: 'success', message: 'Sampling plan uploaded successfully' });
      resetForm();
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Upload failed: ' + error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setPlanName('');
    setPlanType('initial');
    setDueDate(null);
    setQualification('');
    setPlanFile(null);
    setSelectedAssessors([]);
    setSelectedLearners([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Toggle assessor selection
  const handleAssessorToggle = (assessorId) => {
    setSelectedAssessors(prev => 
      prev.includes(assessorId)
        ? prev.filter(id => id !== assessorId)
        : [...prev, assessorId]
    );
  };

  // Toggle learner selection
  const handleLearnerToggle = (learnerId) => {
    setSelectedLearners(prev => 
      prev.includes(learnerId)
        ? prev.filter(id => id !== learnerId)
        : [...prev, learnerId]
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          IQA Sampling Plan Management
          <Button 
            variant="outlined" 
            startIcon={<History />}
            sx={{ ml: 2 }}
            onClick={() => setVersionHistory(prev => [
              {
                id: prev.length + 1,
                timestamp: new Date().toISOString(),
                filename: 'plan_v2.pdf',
                uploadedBy: 'John IQA'
              },
              ...prev
            ])}
          >
            Version History ({versionHistory.length})
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<ListIcon />}
            sx={{ ml: 2 }}
            onClick={() => setCreatedPlansOpen(true)}
          >
            Created Plans ({createdPlans.length})
          </Button>
        </Typography>

        {submitStatus && (
          <Alert severity={submitStatus.type} sx={{ mb: 3 }}>
            {submitStatus.message}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Main Form Column */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Create New Sampling Plan
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Plan Name *"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    sx={{ mb: 3 }}
                  />
                  
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Plan Type *</InputLabel>
                    <Select
                      value={planType}
                      label="Plan Type *"
                      onChange={(e) => setPlanType(e.target.value)}
                    >
                      <MenuItem value="initial">Initial Verification</MenuItem>
                      <MenuItem value="interim">Interim Sampling</MenuItem>
                      <MenuItem value="summative">Summative Sampling</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <DatePicker
                    label="Completion Due Date"
                    value={dueDate}
                    onChange={setDueDate}
                    renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 3 }} />}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Qualification *</InputLabel>
                    <Select
                      value={qualification}
                      label="Qualification *"
                      onChange={(e) => setQualification(e.target.value)}
                    >
                      {qualifications.map((qual, index) => (
                        <MenuItem key={index} value={qual}>{qual}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Box sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadIcon />}
                      >
                        Upload Plan *
                        <input
                          type="file"
                          hidden
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          ref={fileInputRef}
                        />
                      </Button>
                      
                      {planFile && (
                        <>
                          <Button
                            variant="outlined"
                            startIcon={<Visibility />}
                            onClick={() => handlePreview(planFile)}
                          >
                            Preview
                          </Button>
                          <IconButton onClick={() => setPlanFile(null)}>
                            <Cancel color="error" />
                          </IconButton>
                        </>
                      )}
                    </Stack>
                    
                    {planFile && (
                      <Chip
                        label={planFile.name}
                        onDelete={() => setPlanFile(null)}
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Download Templates:
                    </Typography>
                    {templates.map(template => (
                      <Box key={template.name} sx={{ mb: 2 }}>
                        <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                          {template.name}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          {template.formats.map(format => (
                            <Button
                              key={format.type}
                              variant="outlined"
                              size="small"
                              startIcon={<Download />}
                              href={format.url}
                              download
                            >
                              {format.type}
                            </Button>
                          ))}
                        </Stack>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" gutterBottom>
                    Tag Assessors
                  </Typography>
                </Stack>
                <FormGroup row sx={{ gap: 2 }}>
                  {assessors.map((assessor) => (
                    <FormControlLabel
                      key={assessor.id}
                      control={
                        <Checkbox
                          checked={selectedAssessors.includes(assessor.id)}
                          onChange={() => handleAssessorToggle(assessor.id)}
                        />
                      }
                      label={assessor.name}
                    />
                  ))}
                </FormGroup>
              </Box>
              
              <Box>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" gutterBottom>
                    Tag Learners
                  </Typography>
                  <Button
                    startIcon={<Groups />}
                    onClick={() => setBulkSelectOpen(true)}
                  >
                    Bulk Select
                  </Button>
                </Stack>
                <FormGroup row sx={{ gap: 2, maxHeight: 200, overflow: 'auto' }}>
                  {learners.slice(0, 10).map((learner) => (
                    <FormControlLabel
                      key={learner.id}
                      control={
                        <Checkbox
                          checked={selectedLearners.includes(learner.id)}
                          onChange={() => handleLearnerToggle(learner.id)}
                        />
                      }
                      label={`${learner.name} (${learner.course})`}
                    />
                  ))}
                </FormGroup>
                <Typography variant="caption">
                  Showing 10 of {learners.length} learners
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <UploadIcon />
                    )
                  }
                  onClick={handleSubmit}
                  disabled={isSubmitting || !planName || !qualification || !planFile}
                >
                  {isSubmitting ? 'Uploading...' : 'Submit Plan'}
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* Preview Column */}
          {/* <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Plan Preview
              </Typography>
              {planFile ? (
                <Box sx={{ 
                  border: '1px dashed #ccc',
                  p: 2,
                  textAlign: 'center',
                  minHeight: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <Description sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography>{planFile.name}</Typography>
                  <Typography variant="caption" display="block">
                    {planFile.size / 1000} KB
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={() => handlePreview(planFile)}
                    sx={{ mt: 2 }}
                  >
                    Open Full Preview
                  </Button>
                </Box>
              ) : (
                <Box sx={{ 
                  border: '1px dashed #ccc',
                  p: 4,
                  textAlign: 'center',
                  minHeight: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <Description sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">
                    No document uploaded yet
                  </Typography>
                </Box>
              )}
            </Paper>
            
            {versionHistory.length > 0 && (
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Version History
                </Typography>
                <List dense>
                  {versionHistory.slice(0, 3).map(version => (
                    <ListItem key={version.id}>
                      <ListItemText
                        primary={version.filename}
                        secondary={`${new Date(version.timestamp).toLocaleString()} • ${version.uploadedBy}`}
                      />
                      <IconButton edge="end">
                        <Download fontSize="small" />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
                {versionHistory.length > 3 && (
                  <Button fullWidth sx={{ mt: 1 }}>
                    View All {versionHistory.length} Versions
                  </Button>
                )}
              </Paper>
            )}
          </Grid> */}
        </Grid>
        
        {/* Bulk Select Dialog */}
        <Dialog open={bulkSelectOpen} onClose={() => setBulkSelectOpen(false)}>
          <DialogTitle>Bulk Learner Selection</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => handleBulkLearnerSelect('all')}
              >
                Select All Learners
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => handleBulkLearnerSelect('none')}
              >
                Deselect All
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => handleBulkLearnerSelect('level3')}
              >
                Select Only Level 3 Learners
              </Button>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBulkSelectOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Created Plans Dialog */}
        <Dialog open={createdPlansOpen} onClose={() => setCreatedPlansOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Created Sampling Plans</DialogTitle>
          <DialogContent>
            {createdPlans.length > 0 ? (
              <List dense>
                {createdPlans.map(plan => (
                  <ListItem key={plan.id} secondaryAction={
                    <IconButton edge="end" onClick={() => handlePreview(plan.file)}>
                      <Visibility fontSize="small" />
                    </IconButton>
                  }>
                    <ListItemText
                      primary={plan.name}
                      secondary={
                        <>
                          Type: {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}<br />
                          Qualification: {plan.qualification}<br />
                          Created: {new Date(plan.timestamp).toLocaleString()}<br />
                          File: {plan.file.name}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">
                No plans have been created yet.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreatedPlansOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default SamplingPlanUploader;