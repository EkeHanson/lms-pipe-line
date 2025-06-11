import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  Typography,
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormGroup,
  Badge
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  ArrowBack,
  ArrowForward,
  Description,
  Visibility,
  CloudUpload,
  TaskAlt,
  FilterList,
  Download,
  People,
  School
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledStep = styled(Step)(({ theme }) => ({
  '& .MuiStepLabel-root': {
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      padding: 0
    }
  },
  '& .MuiStepLabel-label': {
    fontSize: '0.875rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.75rem'
    }
  }
}));

const DecisionCard = styled(Card)(({ theme, selected }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1, 0),
  border: `1px solid ${selected ? theme.palette.secondary.main : theme.palette.divider}`,
  backgroundColor: selected ? theme.palette.secondary.light : theme.palette.background.paper,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.secondary.main
  }
}));

const EQASamplingInterface = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [verificationDecision, setVerificationDecision] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedAssessments, setSelectedAssessments] = useState([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // Dummy data
  const centers = [
    {
      id: 1,
      name: 'ABC Training Center',
      code: 'AB123',
      assessors: ['Sarah Smith', 'Michael Brown'],
      learners: 24,
      lastVisit: '2023-04-15'
    },
    {
      id: 2,
      name: 'XYZ College',
      code: 'XY456',
      assessors: ['Emily Davis', 'John Wilson'],
      learners: 42,
      lastVisit: '2023-03-28'
    },
    {
      id: 3,
      name: 'Global Skills Institute',
      code: 'GS789',
      assessors: ['Robert Johnson', 'Lisa Chen'],
      learners: 36,
      lastVisit: '2023-05-02'
    }
  ];

  const assessments = [
    { 
      id: 1, 
      centerId: 1,
      title: 'Business Administration L3', 
      date: '2023-05-10', 
      status: 'assessed',
      assessor: 'Sarah Smith',
      learners: 8,
      iqaStatus: 'verified',
      attachments: ['assessment_plan.pdf', 'feedback.docx']
    },
    { 
      id: 2, 
      centerId: 1,
      title: 'Customer Service L2', 
      date: '2023-05-12', 
      status: 'assessed',
      assessor: 'Michael Brown',
      learners: 12,
      iqaStatus: 'pending',
      attachments: ['customer_service_samples.zip']
    },
    { 
      id: 3, 
      centerId: 2,
      title: 'Project Management L4', 
      date: '2023-05-15', 
      status: 'assessed',
      assessor: 'Emily Davis',
      learners: 5,
      iqaStatus: 'verified',
      attachments: ['project_reports.pdf']
    }
  ];

  const steps = ['Select Center', 'Choose Assessments', 'Review Samples', 'Verification Decision', 'Complete'];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Submit logic here
      console.log('Verification completed', { 
        center: selectedCenter,
        assessments: selectedAssessments,
        decision: verificationDecision,
        feedback 
      });
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleDecisionChange = (value) => {
    setVerificationDecision(value);
  };

  const handleAssessmentToggle = (assessmentId) => {
    setSelectedAssessments(prev => 
      prev.includes(assessmentId)
        ? prev.filter(id => id !== assessmentId)
        : [...prev, assessmentId]
    );
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'verified':
        return <Chip label="Verified" color="success" size="small" icon={<CheckCircle />} />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" icon={<Warning />} />;
      case 'not_verified':
        return <Chip label="Not Verified" color="error" size="small" icon={<Error />} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Select Center for Sampling
            </Typography>
            <Typography color="text.secondary" paragraph>
              Choose a center to conduct quality assurance sampling
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {centers.map((center) => (
                <Grid item xs={12} key={center.id}>
                  <Card 
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderColor: selectedCenter === center.id ? 'secondary.main' : 'divider',
                      backgroundColor: selectedCenter === center.id ? 'secondary.light' : 'background.paper',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'secondary.main'
                      }
                    }}
                    onClick={() => setSelectedCenter(center.id)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 36, height: 36 }}>
                        <School fontSize="small" />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography fontWeight={600}>{center.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Center Code: {center.code} • Learners: {center.learners}
                        </Typography>
                      </Box>
                      <Chip 
                        label={`Last visit: ${center.lastVisit}`} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Assessors: {center.assessors.join(', ')}
                      </Typography>
                      <Tooltip title="View center details">
                        <IconButton size="small">
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 1:
        const centerAssessments = assessments.filter(a => a.centerId === selectedCenter);
        return (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Select Assessments to Sample
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<FilterList />}
                onClick={() => setFilterDialogOpen(true)}
              >
                Filter
              </Button>
            </Box>
            <Typography color="text.secondary" paragraph>
              Choose assessments from {centers.find(c => c.id === selectedCenter)?.name} for quality verification
            </Typography>
            
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedAssessments.length > 0 && 
                          selectedAssessments.length < centerAssessments.length
                        }
                        checked={
                          centerAssessments.length > 0 && 
                          selectedAssessments.length === centerAssessments.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAssessments(centerAssessments.map(a => a.id));
                          } else {
                            setSelectedAssessments([]);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>Assessment</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Assessor</TableCell>
                    <TableCell>Learners</TableCell>
                    <TableCell>IQA Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {centerAssessments.map((assessment) => (
                    <TableRow key={assessment.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedAssessments.includes(assessment.id)}
                          onChange={() => handleAssessmentToggle(assessment.id)}
                        />
                      </TableCell>
                      <TableCell>{assessment.title}</TableCell>
                      <TableCell>{assessment.date}</TableCell>
                      <TableCell>{assessment.assessor}</TableCell>
                      <TableCell>{assessment.learners}</TableCell>
                      <TableCell>{getStatusChip(assessment.iqaStatus)}</TableCell>
                      <TableCell>
                        <Tooltip title="Preview assessment">
                          <IconButton size="small">
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Filter Dialog */}
            <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)}>
              <DialogTitle>Filter Assessments</DialogTitle>
              <DialogContent>
                <FormGroup>
                  <FormControlLabel control={<Checkbox />} label="Verified by IQA" />
                  <FormControlLabel control={<Checkbox />} label="Pending IQA" />
                  <FormControlLabel control={<Checkbox />} label="Not Verified" />
                  <FormControlLabel control={<Checkbox />} label="Recent (last 30 days)" />
                </FormGroup>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setFilterDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setFilterDialogOpen(false)} variant="contained">Apply</Button>
              </DialogActions>
            </Dialog>
          </Box>
        );
      case 2:
        const selectedAssessmentData = assessments.filter(a => 
          selectedAssessments.includes(a.id)
        );
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Review Selected Samples
            </Typography>
            <Typography color="text.secondary" paragraph>
              Examine the selected assessments from {centers.find(c => c.id === selectedCenter)?.name}
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {selectedAssessmentData.map((assessment) => (
                <Grid item xs={12} key={assessment.id}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography fontWeight={600}>{assessment.title}</Typography>
                      {getStatusChip(assessment.iqaStatus)}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Assessor: {assessment.assessor} • {assessment.learners} learners • {assessment.date}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Description sx={{ mr: 1, color: 'action.active' }} />
                      <Typography variant="body2">
                        {assessment.attachments.length} document(s) attached
                      </Typography>
                      <Button size="small" sx={{ ml: 'auto' }} startIcon={<Download />}>
                        Download All
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Sampling Notes
              </Typography>
              <TextField
                multiline
                rows={4}
                fullWidth
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Record your observations about these samples..."
                variant="outlined"
              />
            </Box>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Verification Decision
            </Typography>
            <Typography color="text.secondary" paragraph>
              Make your quality assurance decision based on the samples reviewed
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <RadioGroup
                value={verificationDecision}
                onChange={(e) => handleDecisionChange(e.target.value)}
              >
                <DecisionCard 
                  selected={verificationDecision === 'approved'}
                  onClick={() => handleDecisionChange('approved')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircle color="success" sx={{ mr: 2, fontSize: 32 }} />
                    <Box>
                      <Typography fontWeight={600}>Approve</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Assessments meet all requirements and standards
                      </Typography>
                    </Box>
                  </Box>
                </DecisionCard>
                
                <DecisionCard 
                  selected={verificationDecision === 'minor_issues'}
                  onClick={() => handleDecisionChange('minor_issues')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Warning color="warning" sx={{ mr: 2, fontSize: 32 }} />
                    <Box>
                      <Typography fontWeight={600}>Minor Issues</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Requires small adjustments to meet standards
                      </Typography>
                    </Box>
                  </Box>
                </DecisionCard>
                
                <DecisionCard 
                  selected={verificationDecision === 'major_issues'}
                  onClick={() => handleDecisionChange('major_issues')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Error color="error" sx={{ mr: 2, fontSize: 32 }} />
                    <Box>
                      <Typography fontWeight={600}>Major Issues</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Significant concerns requiring immediate action
                      </Typography>
                    </Box>
                  </Box>
                </DecisionCard>
              </RadioGroup>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Feedback for Center
                </Typography>
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide constructive feedback to help improve quality processes..."
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
        );
      case 4:
        const centerName = centers.find(c => c.id === selectedCenter)?.name;
        return (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center',
            p: 4 
          }}>
            <Avatar sx={{ 
              bgcolor: 'success.main', 
              width: 80, 
              height: 80,
              mb: 3
            }}>
              <TaskAlt sx={{ fontSize: 48 }} />
            </Avatar>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Sampling Complete
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              The quality verification for {centerName} has been successfully recorded.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              A verification record has been created and the center will be notified.
            </Typography>
            
            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button variant="outlined" startIcon={<Download />}>
                Download Report
              </Button>
              <Button variant="contained" onClick={() => {
                setActiveStep(0);
                setSelectedCenter(null);
                setSelectedAssessments([]);
                setVerificationDecision('');
                setFeedback('');
              }}>
                New Sampling
              </Button>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      mx: 'auto', 
      p: isMobile ? 2 : 3,
      backgroundColor: 'background.default',
      borderRadius: 2
    }}>
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel
        sx={{ mb: 4 }}
      >
        {steps.map((label) => (
          <StyledStep key={label}>
            <StepLabel>{label}</StepLabel>
          </StyledStep>
        ))}
      </Stepper>
      
      {renderStepContent()}
      
      {activeStep < steps.length - 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 4,
          pt: 2,
          borderTop: `1px solid ${theme.palette.divider}`
        }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            startIcon={<ArrowBack />}
            sx={{ minWidth: 120 }}
          >
            Back
          </Button>
          
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              (activeStep === 0 && !selectedCenter) || 
              (activeStep === 1 && selectedAssessments.length === 0) ||
              (activeStep === 3 && !verificationDecision)
            }
            endIcon={<ArrowForward />}
            sx={{ minWidth: 180 }}
          >
            {activeStep === steps.length - 2 ? 'Complete Verification' : 'Continue'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default EQASamplingInterface;