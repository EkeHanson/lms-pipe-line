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
  useTheme
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
  TaskAlt
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
  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: selected ? theme.palette.primary.light : theme.palette.background.paper,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main
  }
}));

const AssessmentSamplingInterface = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [verificationDecision, setVerificationDecision] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  // Dummy data
  const learner = {
    id: 1,
    name: 'John Doe',
    avatar: 'JD',
    course: 'Level 3 Diploma in Business Administration',
    assessor: 'Sarah Smith',
    units: [
      { id: 1, title: 'Communication in a Business Environment', status: 'completed' },
      { id: 2, title: 'Principles of Administration', status: 'completed' },
      { id: 3, title: 'Manage Personal Performance', status: 'in-progress' }
    ],
    assessments: [
      { 
        id: 1, 
        unitId: 1, 
        title: 'Business Report', 
        date: '2023-05-10', 
        status: 'assessed',
        feedback: 'John has demonstrated a good understanding of business communication principles. The report is well-structured with appropriate use of business terminology.',
        attachments: ['business_report.pdf', 'feedback.docx']
      },
      { 
        id: 2, 
        unitId: 1, 
        title: 'Presentation', 
        date: '2023-05-12', 
        status: 'assessed',
        feedback: 'Excellent presentation skills demonstrated with clear communication of business concepts.',
        attachments: ['presentation.pptx']
      },
      { 
        id: 3, 
        unitId: 2, 
        title: 'Administration Project', 
        date: '2023-05-15', 
        status: 'assessed',
        feedback: 'Comprehensive project covering all required administrative procedures.',
        attachments: ['project_report.pdf', 'evaluation.docx']
      }
    ]
  };

  const steps = ['Select Sample', 'Review Evidence', 'Verification Decision', 'Complete'];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Submit logic here
      console.log('Verification completed', { verificationDecision, feedback });
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

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Select Assessment to Sample
            </Typography>
            <Typography color="text.secondary" paragraph>
              Choose an assessment from {learner.name}'s portfolio for quality verification
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {learner.assessments.map((assessment) => (
                <Grid item xs={12} key={assessment.id}>
                  <Card 
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderColor: selectedAssessment === assessment.id ? 'primary.main' : 'divider',
                      backgroundColor: selectedAssessment === assessment.id ? 'primary.light' : 'background.paper',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main'
                      }
                    }}
                    onClick={() => setSelectedAssessment(assessment.id)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 36, height: 36 }}>
                        <Description fontSize="small" />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography fontWeight={600}>{assessment.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {learner.units.find(u => u.id === assessment.unitId)?.title}
                        </Typography>
                      </Box>
                      <Chip 
                        label={assessment.status} 
                        size="small" 
                        color={assessment.status === 'assessed' ? 'primary' : 'default'}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Assessed: {assessment.date}
                      </Typography>
                      <Tooltip title="Preview assessment">
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
        const assessment = learner.assessments.find(a => a.id === selectedAssessment);
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Review Assessment Evidence
            </Typography>
            <Typography color="text.secondary" paragraph>
              Carefully examine the assessment evidence and provide your observations
            </Typography>
            
            <Card sx={{ p: 3, mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <Description />
                    </Avatar>
                    <Typography variant="h6">{assessment?.title}</Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Unit
                    </Typography>
                    <Typography>
                      {learner.units.find(u => u.id === assessment?.unitId)?.title}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Assessor Feedback
                    </Typography>
                    <Card variant="outlined" sx={{ p: 2, mt: 1 }}>
                      <Typography>{assessment?.feedback}</Typography>
                    </Card>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Your Observations
                    </Typography>
                    <TextField
                      multiline
                      rows={isMobile ? 4 : 6}
                      fullWidth
                      placeholder="Enter your professional observations about this assessment..."
                      variant="outlined"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Attachments
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {assessment?.attachments.map((file, index) => (
                        <Chip 
                          key={index}
                          label={file}
                          variant="outlined"
                          onDelete={() => {}}
                          deleteIcon={<CloudUpload />}
                          onClick={() => {}}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Verification Decision
            </Typography>
            <Typography color="text.secondary" paragraph>
              Make your quality assurance decision based on the evidence reviewed
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
                        Assessment meets all requirements and standards
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
                        Significant rework needed to meet requirements
                      </Typography>
                    </Box>
                  </Box>
                </DecisionCard>
              </RadioGroup>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Feedback for Assessor
                </Typography>
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide constructive feedback to help improve assessment quality..."
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
        );
      case 3:
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
              Verification Complete
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              The quality verification for {learner.name}'s assessment has been successfully recorded.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              A verification record has been created and the assessor will be notified.
            </Typography>
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
            (activeStep === 0 && !selectedAssessment) || 
            (activeStep === 2 && !verificationDecision)
          }
          endIcon={<ArrowForward />}
          sx={{ minWidth: 180 }}
        >
          {activeStep === steps.length - 1 ? 'Complete Verification' : 'Continue'}
        </Button>
      </Box>
    </Box>
  );
};

export default AssessmentSamplingInterface;