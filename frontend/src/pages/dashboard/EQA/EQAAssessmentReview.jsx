import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
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
  Download,
  TaskAlt,
  PictureAsPdf,
  InsertDriveFile,
  Comment,
  ExpandMore
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

const EQAAssessmentReview = ({ onBack }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [verificationDecision, setVerificationDecision] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Dummy data
  const assessment = {
    id: 1, 
    title: 'Business Report Assessment', 
    date: '2023-05-10', 
    status: 'assessed',
    learner: {
      id: 1,
      name: 'John Doe',
      avatar: 'JD',
      course: 'Level 3 Diploma in Business Administration',
      center: 'ABC Training Center'
    },
    assessor: 'Sarah Smith',
    iqa: 'Michael Brown',
    feedback: 'John has demonstrated a good understanding of business communication principles. The report is well-structured with appropriate use of business terminology.',
    criteria: [
      { 
        id: '1.1', 
        description: 'Understand effective communication', 
        status: 'met', 
        assessorNotes: 'Good understanding demonstrated',
        iqaNotes: 'Agree with assessor judgment',
        evidence: 'Page 3 of report'
      },
      { 
        id: '1.2', 
        description: 'Use appropriate communication methods', 
        status: 'met', 
        assessorNotes: 'Used email and report appropriately',
        iqaNotes: 'Evidence could be stronger',
        evidence: 'Email samples provided'
      },
      { 
        id: '1.3', 
        description: 'Overcome communication barriers', 
        status: 'not_met', 
        assessorNotes: 'Needs more examples of overcoming barriers',
        iqaNotes: 'Assessor judgment correct',
        evidence: 'Missing examples'
      }
    ],
    attachments: [
      { id: 1, name: 'business_report.pdf', type: 'application/pdf', size: 1200000 },
      { id: 2, name: 'feedback.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 80000 }
    ],
    iqaDecision: {
      outcome: 'minor_issues',
      notes: 'Overall good assessment but needs more evidence for criterion 1.3',
      date: '2023-05-12'
    }
  };

  const steps = ['Select Evidence', 'Review Assessment', 'Verification Decision', 'Complete'];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Submit logic here
      console.log('EQA verification completed', { 
        verificationDecision, 
        feedback,
        assessmentId: assessment.id 
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

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Select Evidence to Review
            </Typography>
            <Typography color="text.secondary" paragraph>
              Choose assessment evidence from {assessment.learner.name}'s portfolio
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {assessment.attachments.map((file) => (
                <Grid item xs={12} key={file.id}>
                  <Card 
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderColor: selectedFile?.id === file.id ? 'primary.main' : 'divider',
                      backgroundColor: selectedFile?.id === file.id ? 'primary.light' : 'background.paper',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main'
                      }
                    }}
                    onClick={() => handleFileSelect(file)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ 
                        bgcolor: file.type.includes('pdf') ? 'error.main' : 'info.main', 
                        mr: 2, 
                        width: 36, 
                        height: 36 
                      }}>
                        {file.type.includes('pdf') ? <PictureAsPdf /> : <InsertDriveFile />}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography fontWeight={600}>{file.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {(file.size / 1024).toFixed(1)} KB
                        </Typography>
                      </Box>
                      <Tooltip title="Preview evidence">
                        <IconButton size="small" onClick={(e) => {
                          e.stopPropagation();
                          console.log('Preview file:', file.id);
                        }}>
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
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Review Assessment Details
            </Typography>
            <Typography color="text.secondary" paragraph>
              Carefully examine the assessment evidence and IQA verification
            </Typography>
            
            <Card sx={{ p: 3, mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Learner
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Avatar sx={{ mr: 2 }}>{assessment.learner.avatar}</Avatar>
                      <Box>
                        <Typography>{assessment.learner.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {assessment.learner.course}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {assessment.learner.center}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Assessor Feedback
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                      <Typography>{assessment.feedback}</Typography>
                    </Paper>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      IQA Verification
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                      <Box sx={{ mb: 1 }}>
                        <Chip 
                          label={assessment.iqaDecision.outcome.replace('_', ' ')} 
                          color={
                            assessment.iqaDecision.outcome === 'approved' ? 'success' :
                            assessment.iqaDecision.outcome === 'minor_issues' ? 'warning' : 'error'
                          } 
                          size="small"
                        />
                      </Box>
                      <Typography>{assessment.iqaDecision.notes}</Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Verified by {assessment.iqa} on {assessment.iqaDecision.date}
                      </Typography>
                    </Paper>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Assessment Criteria
                    </Typography>
                    {assessment.criteria.map(criterion => (
                      <Accordion key={criterion.id} sx={{ mb: 1 }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Box sx={{ 
                              width: 24, 
                              height: 24, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              mr: 2
                            }}>
                              {criterion.status === 'met' ? 
                                <CheckCircle color="success" fontSize="small" /> : 
                                <Error color="error" fontSize="small" />}
                            </Box>
                            <Typography sx={{ flexGrow: 1 }}>{criterion.id}: {criterion.description}</Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <List dense>
                            <ListItem>
                              <ListItemText
                                primary="Assessor Notes"
                                secondary={criterion.assessorNotes}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText
                                primary="IQA Notes"
                                secondary={criterion.iqaNotes}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText
                                primary="Evidence Location"
                                secondary={criterion.evidence}
                              />
                            </ListItem>
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                  
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
                </Grid>
              </Grid>
            </Card>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              EQA Verification Decision
            </Typography>
            <Typography color="text.secondary" paragraph>
              Make your external quality assurance decision based on the evidence reviewed
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
                  Feedback for Center
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
              EQA Verification Complete
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              The external quality verification for {assessment.learner.name}'s assessment has been successfully recorded.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              A verification record has been created and the center will be notified.
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Tooltip title="Back to assessments">
          <IconButton onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
        </Tooltip>
        <Typography variant="h4">EQA Assessment Review</Typography>
      </Box>
      
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
            (activeStep === 0 && !selectedFile) || 
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

export default EQAAssessmentReview;