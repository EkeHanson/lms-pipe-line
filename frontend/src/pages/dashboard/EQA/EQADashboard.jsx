import React, { useState, useEffect } from 'react';
import {  Box,  Card,  CardContent,  Typography,  Grid,
  Button,  Paper,  Divider,  List,  ListItem,
  ListItemAvatar,  Avatar,  ListItemText,  IconButton,  Tooltip,ListItemIcon ,
  LinearProgress,  Tabs,  Tab,  Badge,  Chip,ListItemButton ,Collapse,
  useTheme,  styled} from '@mui/material';
import {GppGood,  School,  People,  Assignment ,
  Checklist,  Notifications,  AccountCircle,  Settings,
  Logout,  Menu as MenuIcon,  ExpandMore,  ExpandLess,
  Description,  Download,  CalendarToday,  Warning,
  CheckCircle,  Error as ErrorIcon} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { PieChart } from '@mui/x-charts/PieChart';

// Child components (to be implemented)
import EQALearnerPortfolioViewer from './EQALearnerPortfolioViewer';
import EQAAssessmentReview from './EQAAssessmentReview';
import EQAFeedbackForm from './EQAFeedbackForm';
import EQAVerificationRecords from './EQAVerificationRecords';
import EQACenterReports from './EQACenterReports';

// Styled components
const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[4],
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 3),
  background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
  color: theme.palette.common.white,
  '&:hover': {
    background: `linear-gradient(90deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
  }
}));

const StatusIndicator = styled('div')(({ status, theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '&:before': {
    content: '""',
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    marginRight: '8px',
    backgroundColor:
      status === 'completed'
        ? theme.palette.success.main
        : status === 'in-progress'
        ? theme.palette.warning.main
        : theme.palette.error.main,
  }
}));

const EQADashboard = () => {
  const theme = useTheme();
  const [activeView, setActiveView] = useState('dashboard');
  const [toolsOpen, setToolsOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [eqaName, setEqaName] = useState('EQA Officer');
  const [activeTab, setActiveTab] = useState(0);

  // Dummy data for EQA
  const stats = {
    centersToReview: 5,
    assessmentsPending: 23,
    samplingRequired: 12,
    overdueTasks: 3,
  };

  const recentActivities = [
    { id: 1, action: 'Reviewed center', date: '2 hours ago', center: 'ABC Training', status: 'completed' },
    { id: 2, action: 'Requested evidence', date: '1 day ago', center: 'XYZ College', status: 'completed' },
    { id: 3, action: 'Submitted feedback', date: '2 days ago', center: 'Global Skills', status: 'completed' },
    { id: 4, action: 'Verification needed', date: 'Due tomorrow', center: 'City Academy', status: 'pending' },
  ];

  const priorityTasks = [
    { id: 1, title: 'Complete Q2 sampling for ABC Training', due: 'Due in 2 days', priority: 'high', progress: 60 },
    { id: 2, title: 'Review assessor feedback at XYZ College', due: 'Due in 3 days', priority: 'medium', progress: 30 },
    { id: 3, title: 'Prepare annual EQA report', due: 'Due in 5 days', priority: 'low', progress: 10 },
  ];

  const eqaProcess = [
    {
      title: 'Understand Awarding Body Requirements',
      details: [
        'Review qualification standards and specifications.',
        'Familiarize yourself with assessment criteria and center expectations.',
        'Stay updated on any changes in policies or procedures.',
      ],
    },
    {
      title: 'Plan Center Visits',
      details: [
        'Schedule visits to centers based on risk assessment.',
        'Prepare sampling plans for assessments.',
        'Coordinate with center staff for documentation access.',
      ],
    },
    {
      title: 'Conduct Sampling',
      details: [
        'Review learner portfolios and assessment evidence.',
        'Verify internal quality assurance processes.',
        'Document findings and compliance levels.',
      ],
    },
    {
      title: 'Provide Feedback',
      details: [
        'Share constructive feedback with center staff.',
        'Address any non-compliance issues.',
        'Recommend improvements to quality processes.',
      ],
    },
    {
      title: 'Submit Reports',
      details: [
        'Compile verification records and reports.',
        'Submit documentation to awarding body.',
        'Follow up on any required actions.',
      ],
    },
  ];

  const renderDashboard = () => (
    <Box sx={{ p: 3 }}>
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard sx={{ mb: 3 }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" fontWeight="600">
                Welcome to EQA Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your External Quality Assurance activities{eqaName ? `, ${eqaName}` : ''}
              </Typography>
            </Box>
            <IconButton aria-label="Notifications">
              <Badge badgeContent={stats.overdueTasks} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </CardContent>
        </GlassCard>
      </motion.div>

      {/* Metrics Section */}
      <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 2 }}>
        Key Metrics
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Centers to Review', value: stats.centersToReview, icon: <School />, view: 'centers', color: 'secondary' },
          { label: 'Assessments Pending', value: stats.assessmentsPending, icon: <Assignment />, view: 'assessments', color: 'primary' },
          { label: 'Sampling Required', value: stats.samplingRequired, icon: <Checklist />, view: 'sampling', color: 'info' },
          { label: 'Overdue Tasks', value: stats.overdueTasks, icon: <Warning />, view: 'tasks', color: 'warning' },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <GlassCard
                onClick={() => setActiveView(stat.view)}
                sx={{ background: `linear-gradient(135deg, ${theme.palette[stat.color].main}80 0%, ${theme.palette[stat.color].dark}80 100%)` }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    {React.cloneElement(stat.icon, { sx: { fontSize: 40, opacity: 0.7 } })}
                  </Box>
                  <Typography variant="h4" fontWeight="600">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {stat.label}
                  </Typography>
                  <StyledButton size="small" sx={{ mt: 2 }} aria-label={`View ${stat.label}`}>
                    View
                  </StyledButton>
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Tasks & Actions Section */}
      <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 2 }}>
        Tasks & Actions
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
          Quick Actions
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { icon: <Checklist />, label: 'Review Assessments', view: 'assessments' },
            { icon: <People />, label: 'View Centers', view: 'centers' },
            { icon: <Description />, label: 'Provide Feedback', view: 'feedback' },
            { icon: <Download />, label: 'Generate Report', view: 'reports' },
            { icon: <CalendarToday />, label: 'Plan Visit', view: 'visits' },
          ].map((action, index) => (
            <Grid item xs={6} sm={4} key={index}>
              <StyledButton
                fullWidth
                startIcon={action.icon}
                onClick={() => setActiveView(action.view)}
                aria-label={action.label}
              >
                {action.label}
              </StyledButton>
            </Grid>
          ))}
        </Grid>
        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
          Priority Tasks
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {priorityTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                p: 2,
                mb: 2,
                borderRadius: '8px',
                backgroundColor: theme.palette.grey[50],
                borderLeft: `4px solid ${
                  task.priority === 'high'
                    ? theme.palette.error.main
                    : task.priority === 'medium'
                    ? theme.palette.warning.main
                    : theme.palette.success.main
                }`,
              }}
            >
              <Typography variant="subtitle2">{task.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {task.due}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={task.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        backgroundColor:
                          task.priority === 'high'
                            ? theme.palette.error.main
                            : task.priority === 'medium'
                            ? theme.palette.warning.main
                            : theme.palette.success.main,
                      },
                    }}
                  />
                </Box>
                <Typography variant="body2">{task.progress}%</Typography>
              </Box>
            </Box>
          </motion.div>
        ))}
      </Paper>

      {/* Activity & Process Section */}
      <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 2 }}>
        Activity & Progress
      </Typography>
      <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Recent Activity
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
              {recentActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: '8px',
                      backgroundColor: theme.palette.grey[50],
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: theme.palette.grey[100],
                      },
                    }}
                    onClick={() => {
                      if (activity.action.includes('center')) setActiveView('centers');
                      if (activity.action.includes('feedback')) setActiveView('feedback');
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <StatusIndicator status={activity.status}>
                        <Typography variant="body2" color="text.secondary">
                          {activity.status === 'completed' ? 'Completed' : 'Pending'}
                        </Typography>
                      </StatusIndicator>
                    </Box>
                    <Typography variant="body1">{activity.action}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activity.date} • {activity.center}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Verification Progress
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: 45, label: 'Completed', color: theme.palette.success.main },
                      { id: 1, value: 55, label: 'Pending', color: theme.palette.grey[300] },
                    ],
                    innerRadius: 50,
                    outerRadius: 80,
                    paddingAngle: 5,
                    cornerRadius: 5,
                  },
                ]}
                width={200}
                height={200}
                slotProps={{
                  legend: { hidden: true },
                }}
              />
              <Box sx={{ position: 'absolute', textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="600">
                  45%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Overall Progress
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ mt: 3 }}>
          EQA Process
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box component="ol" sx={{ pl: 3, '& li': { mb: 3 } }}>
          {eqaProcess.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <li>
                <Typography variant="subtitle2" fontWeight="600">
                  {step.title}
                </Typography>
                {step.details.map((detail, idx) => (
                  <Typography key={idx} variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    • {detail}
                  </Typography>
                ))}
              </li>
            </motion.div>
          ))}
        </Box>
      </Paper>
    </Box>
  );

  const renderView = () => {
    switch (activeView) {
      case 'centers':
        return <EQALearnerPortfolioViewer />;
      case 'assessments':
        return <EQAAssessmentReview />;
      case 'feedback':
        return <EQAFeedbackForm />;
      case 'sampling':
        return <EQAVerificationRecords />;
      case 'reports':
        return <EQACenterReports />;
      case 'dashboard':
      default:
        return renderDashboard();
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.grey[50] }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          flexShrink: 0,
          background: `linear-gradient(180deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
          borderRight: `1px solid ${theme.palette.grey[200]}`,
          p: 2,
          display: { xs: 'none', sm: 'block' }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <Typography variant="h6" fontWeight="600">
            EQA Dashboard
          </Typography>
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              selected={activeView === 'dashboard'}
              onClick={() => setActiveView('dashboard')}
              aria-label="Dashboard"
              sx={{
                borderRadius: '0 12px 12px 0',
                '&.Mui-selected': {
                  background: `linear-gradient(90deg, ${theme.palette.secondary.main}20 0%, ${theme.palette.secondary.main}10 100%)`,
                  borderRight: `4px solid ${theme.palette.secondary.main}`,
                },
              }}
            >
              <ListItemIcon>
                <GppGood />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton
              selected={activeView === 'centers'}
              onClick={() => setActiveView('centers')}
              aria-label="Centers"
              sx={{
                borderRadius: '0 12px 12px 0',
                '&.Mui-selected': {
                  background: `linear-gradient(90deg, ${theme.palette.secondary.main}20 0%, ${theme.palette.secondary.main}10 100%)`,
                  borderRight: `4px solid ${theme.palette.secondary.main}`,
                },
              }}
            >
              <ListItemIcon>
                <School />
              </ListItemIcon>
              <ListItemText primary="Centers" />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton onClick={() => setToolsOpen(!toolsOpen)} aria-label="Toggle EQA Tools">
              <ListItemIcon>
                <Assignment />
              </ListItemIcon>
              <ListItemText primary="EQA Tools" />
              {toolsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          
          <Collapse in={toolsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {[
                { label: 'Assessments', view: 'assessments', icon: <Checklist /> },
                { label: 'Feedback', view: 'feedback', icon: <Description /> },
                { label: 'Sampling', view: 'sampling', icon: <People /> },
                { label: 'Reports', view: 'reports', icon: <Download /> },
              ].map((tool) => (
                <ListItem key={tool.view} disablePadding sx={{ pl: 4 }}>
                  <ListItemButton
                    selected={activeView === tool.view}
                    onClick={() => setActiveView(tool.view)}
                    aria-label={tool.label}
                    sx={{
                      borderRadius: '0 12px 12px 0',
                      '&.Mui-selected': {
                        background: `linear-gradient(90deg, ${theme.palette.secondary.main}20 0%, ${theme.palette.secondary.main}10 100%)`,
                        borderRight: `4px solid ${theme.palette.secondary.main}`,
                      },
                    }}
                  >
                    <ListItemIcon>
                      {tool.icon}
                    </ListItemIcon>
                    <ListItemText primary={tool.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>
        
        <Box sx={{ flexGrow: 1 }} />
        <Divider />
        <List>
          <ListItem
            sx={{
              borderRadius: '0 12px 12px 0',
              '&:hover': {
                backgroundColor: theme.palette.grey[200],
              },
            }}
          >
            <ListItemButton>
              <ListItemIcon>
                <Avatar sx={{ width: 24, height: 24 }}>{eqaName ? eqaName.charAt(0) : 'E'}</Avatar>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="600">
                    {eqaName || 'EQA Officer'}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <StyledButton
              fullWidth
              startIcon={<Logout />}
              onClick={() => setIsAuthenticated(false)}
              aria-label="Logout"
            >
              Logout
            </StyledButton>
          </ListItem>
        </List>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <IconButton
          sx={{ display: { xs: 'block', sm: 'none' }, mb: 2 }}
          aria-label="Open sidebar"
        >
          <MenuIcon />
        </IconButton>
        {renderView()}
      </Box>
    </Box>
  );
};

export default EQADashboard;