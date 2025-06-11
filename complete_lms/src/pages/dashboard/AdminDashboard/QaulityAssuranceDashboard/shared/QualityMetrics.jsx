import React from 'react';
import { Box, Grid, Typography, useTheme, LinearProgress } from '@mui/material';
import { 
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

const metricsData = [
  { title: 'Compliance Rate', value: '92%', icon: <CheckCircleIcon />, color: 'success' },
  { title: 'Issues Identified', value: '18', icon: <WarningIcon />, color: 'warning' },
  { title: 'Assessments Sampled', value: '45', icon: <AssessmentIcon />, color: 'info' },
  { title: 'Avg. Resolution Time', value: '3.2 days', icon: <TimelineIcon />, color: 'primary' }
];

const progressData = [
  { label: 'IQA Completion', value: 75 },
  { label: 'EQA Readiness', value: 60 },
  { label: 'Standards Adherence', value: 88 }
];

function QualityMetrics() {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Quality Metrics Overview  
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metricsData.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[1],
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box
                sx={{
                  mr: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: theme.palette[metric.color].light,
                  color: theme.palette[metric.color].main
                }}
              >
                {React.cloneElement(metric.icon, { fontSize: 'medium' })}
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {metric.title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {metric.value}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[1]
        }}
      >
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
          Progress Indicators
        </Typography>
        {progressData.map((item, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">{item.label}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {item.value}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={item.value}
              sx={{
                height: 8,
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4
                }
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default QualityMetrics;