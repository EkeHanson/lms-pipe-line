import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Paper,
  useTheme,
  Chip,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  AccessTime as PendingIcon
} from '@mui/icons-material';

const statusIcons = {
  completed: <CheckCircleIcon color="success" />,
  error: <ErrorIcon color="error" />,
  warning: <WarningIcon color="warning" />,
  pending: <PendingIcon color="disabled" />
};

const ProgressTracker = ({ 
  steps = [], 
  activeStep = 0,
  orientation = 'vertical',
  showProgress = true,
  showStatusChips = true
}) => {
  const theme = useTheme();

  const calculateProgress = () => {
    if (steps.length === 0) return 0;
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    return (completedSteps / steps.length) * 100;
  };

  const getStepIcon = (status) => {
    return statusIcons[status] || statusIcons.pending;
  };

  return (
    <Box sx={{ width: '100%' }}>
      {showProgress && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={calculateProgress()} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {Math.round(calculateProgress())}%
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
        </>
      )}

      <Stepper 
        activeStep={activeStep} 
        orientation={orientation}
        sx={{
          '& .MuiStepLabel-iconContainer': {
            paddingRight: orientation === 'horizontal' ? 0 : 2
          }
        }}
      >
        {steps.map((step, index) => (
          <Step key={step.label} completed={step.status === 'completed'}>
            <StepLabel
              optional={
                step.description && (
                  <Typography variant="caption" color="text.secondary">
                    {step.description}
                  </Typography>
                )
              }
              icon={showStatusChips ? null : getStepIcon(step.status)}
              sx={{
                '& .MuiStepLabel-label': {
                  display: 'flex',
                  alignItems: 'center'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {showStatusChips && (
                  <Chip
                    icon={getStepIcon(step.status)}
                    label={step.status}
                    size="small"
                    sx={{ 
                      mr: 1,
                      textTransform: 'capitalize',
                      ...(step.status === 'completed' && {
                        backgroundColor: theme.palette.success.light,
                        color: theme.palette.success.dark
                      }),
                      ...(step.status === 'error' && {
                        backgroundColor: theme.palette.error.light,
                        color: theme.palette.error.dark
                      }),
                      ...(step.status === 'warning' && {
                        backgroundColor: theme.palette.warning.light,
                        color: theme.palette.warning.dark
                      }),
                      ...(step.status === 'pending' && {
                        backgroundColor: theme.palette.grey[300],
                        color: theme.palette.grey[700]
                      })
                    }}
                  />
                )}
                {step.label}
              </Box>
            </StepLabel>
            {orientation === 'vertical' && (
              <StepContent>
                {step.content && (
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      backgroundColor: theme.palette.background.paper 
                    }}
                  >
                    {step.content}
                  </Paper>
                )}
                {step.actions && (
                  <Box sx={{ mb: 2 }}>
                    {step.actions}
                  </Box>
                )}
              </StepContent>
            )}
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

// Default props for the component
ProgressTracker.defaultProps = {
  steps: [
    {
      label: 'Step 1',
      description: 'Description for step 1',
      status: 'completed',
      content: <Typography>Step 1 content goes here</Typography>
    },
    {
      label: 'Step 2',
      description: 'Description for step 2',
      status: 'pending',
      content: <Typography>Step 2 content goes here</Typography>
    },
    {
      label: 'Step 3',
      description: 'Description for step 3',
      status: 'pending',
      content: <Typography>Step 3 content goes here</Typography>
    }
  ],
  activeStep: 1
};

export default ProgressTracker;