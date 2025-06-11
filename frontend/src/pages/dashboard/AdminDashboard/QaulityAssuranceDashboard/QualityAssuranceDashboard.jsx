import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useQAAuth } from '../../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LearnerPortfolio from './shared/LearnerPortfolio';
import AssessmentSampling from './IQAManagement/AssessmentSampling';
import IQAReports from './IQAManagement/IQAReports';
import TrainerMonitoring from './IQAManagement/TrainerMonitoring';

// API endpoint for QA metrics
const METRICS_API_URL = '/api/quality-metrics'; // Replace with your actual endpoint

const QualityAssuranceDashboard = () => {
  const {
    canViewPortfolio,
    canCreateSampling,
    canGenerateReports,
    canManageFeedback,
    isIQALead,
    isEQAAuditor,
    user,
    loading,
  } = useQAAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [metrics, setMetrics] = useState({
    complianceRate: 0,
    samplingCompletion: 0,
    verificationCount: 0,
    activeTrainers: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(METRICS_API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        setMetrics(response.data);
      } catch (error) {
        console.error('Fetch metrics error:', error);
        setSnackbar({ open: true, message: 'Failed to fetch quality metrics', severity: 'error' });
      }
    };
    fetchMetrics();
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };



  // Role-based tab configuration
  const tabs = [
    {
      label: 'Learner Portfolios',
      component: <LearnerPortfolio searchTerm={searchTerm} />,
      visible: canViewPortfolio,
    },
    {
      label: 'Assessment Sampling',
      component: <AssessmentSampling searchTerm={searchTerm} />,
      visible: canCreateSampling || isEQAAuditor,
    },
    {
      label: 'IQA Reports',
      component: <IQAReports searchTerm={searchTerm} />,
      visible: canGenerateReports || isEQAAuditor,
    },
    {
      label: 'Trainer Monitoring',
      component: <TrainerMonitoring searchTerm={searchTerm} />,
      visible: canManageFeedback || isEQAAuditor,
    },
  ].filter((tab) => tab.visible);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Quality Assurance Dashboard
        {isEQAAuditor && (
          <Chip
            label="EQA View"
            size="small"
            color="info"
            sx={{ ml: 2 }}
          />
        )}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search across QA data..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 400 }}
        />
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">Compliance Rate</Typography>
              <Typography variant="h4" color="primary">
                {metrics.complianceRate}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Overall assessment compliance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">Sampling Completion</Typography>
              <Typography variant="h4" color="primary">
                {metrics.samplingCompletion}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Progress of sampling plans
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">Verification Count</Typography>
              <Typography variant="h4" color="primary">
                {metrics.verificationCount}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total portfolios verified
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">Active Trainers</Typography>
              <Typography variant="h4" color="primary">
                {metrics.activeTrainers}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Trainers currently active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={3}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
        <Box sx={{ p: 3 }}>
          {tabs[activeTab]?.component || (
            <Typography>No content available for your role.</Typography>
          )}
        </Box>
      </Paper>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        {isIQALead && (
          <Button
            variant="contained"
            onClick={() => navigate('/qa-settings')}
          >
            Manage QA Settings
          </Button>
        )}
        {(isIQALead || isEQAAuditor) && (
          <Button
            variant="outlined"
            onClick={() => navigate('/audit-trail')}
          >
            View Audit Trail
          </Button>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QualityAssuranceDashboard;