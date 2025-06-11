import React, { useState } from 'react';
import {
  Box,  Card,  CardContent,  Typography,
  Grid,  Button,  Divider,  Drawer,  List,  ListItem,
  ListItemButton,  ListItemIcon,
  ListItemText,  IconButton,
  Avatar,  Menu,  MenuItem,
  Collapse,  Paper,  Badge,  useTheme,  styled,LinearProgress
} from '@mui/material';
import {
  Checklist,  People,  Assignment,  Comment,
  Upload,  Assessment,  LibraryBooks,  GppGood,
  Notifications,  AccountCircle,
  Settings,  Logout,  Menu as MenuIcon,  ExpandMore,  ExpandLess,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { PieChart } from '@mui/x-charts/PieChart';

// Import child components
import LearnerPortfolioBrowser from './LearnerPortfolioBrowser';
import AssessmentSamplingInterface from './AssessmentSamplingInterface';
import IQAFeedbackForm from './IQAFeedbackForm';
import SamplingPlanUploader from './SamplingPlanUploader';
import VerificationRecordsTable from './VerificationRecordsTable';
import ReportsGenerator from './ReportsGenerator';
import QualityStandards from './QualityStandards';

// Styled components
const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: `1px solid ${theme.palette.grey[200]}`,
  boxShadow: theme.shadows[4],
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 3),
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
  '&:hover': {
    background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  },
}));

const SidebarDrawer = styled(Drawer)(({ theme }) => ({
  width: 240,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 240,
    background: `linear-gradient(180deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
    borderRight: `1px solid ${theme.palette.grey[200]}`,
    paddingTop: theme.spacing(2),
  },
}));

const ContentCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  padding: theme.spacing(3),
  border: `1px solid ${theme.palette.grey[200]}`,
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
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
  },
}));

// Standards Section Component
const IQAStandardsSection = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h5" fontWeight="600" gutterBottom>
      Quality Standards
    </Typography>
    <QualityStandards />
  </Box>
);

const IQADashboard = () => {
  const theme = useTheme();
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [adminName, setAdminName] = useState('IQA Admin');
  const isMenuOpen = Boolean(anchorEl);

  // Dummy data
  const stats = {
    learnersToReview: 12,
    assessmentsPending: 8,
    samplingPlansDue: 3,
    overdueTasks: 2,
  };

  const recentActivities = [
    { id: 1, action: 'Reviewed portfolio', date: '2 hours ago', user: 'John Doe', status: 'completed' },
    { id: 2, action: 'Uploaded sampling plan', date: '1 day ago', user: 'Q2 Plan', status: 'completed' },
    { id: 3, action: 'Feedback to assessor', date: '2 days ago', user: 'Sarah Smith', status: 'completed' },
    { id: 4, action: 'Verification needed', date: 'Due tomorrow', user: 'Emily Wilson', status: 'pending' },
  ];

  const priorityTasks = [
    { id: 1, title: 'Complete Q2 sampling plan', due: 'Due in 2 days', priority: 'high', progress: 60 },
    { id: 2, title: 'Review assessor feedback', due: 'Due in 3 days', priority: 'medium', progress: 30 },
    { id: 3, title: 'Prepare EQA documentation', due: 'Due in 5 days', priority: 'low', progress: 10 },
  ];

  const iqaProcess = [
    {
      title: 'Understand Awarding Body Requirements',
      details: [
        'Review relevant qualification standards and specifications.',
        'Familiarize yourself with the assessment criteria and EQA expectations.',
        'Stay updated on any changes in policies or procedures.',
      ],
    },
    {
      title: 'Plan Assessments',
      details: [
        'Develop a sampling plan for assessments.',
        'Identify key learners and assessors to review.',
        'Schedule IQA activities to align with EQA deadlines.',
      ],
    },
    {
      title: 'Conduct Sampling',
      details: [
        'Review learner portfolios and assessment evidence.',
        'Ensure consistency and fairness in grading.',
        'Document findings and compliance levels.',
      ],
    },
    {
      title: 'Provide Feedback',
      details: [
        'Share constructive feedback with assessors.',
        'Address any non-compliance issues promptly.',
        'Support professional development for assessors.',
      ],
    },
    {
      title: 'Prepare for EQA',
      details: [
        'Compile verification records and reports.',
        'Ensure all documentation is audit-ready.',
        'Coordinate with EQA for site visits or reviews.',
      ],
    },
  ];

  // Handlers
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleToolsToggle = () => {
    setToolsOpen(!toolsOpen);
  };

  const handleProfileMenuOpen = (event) => {
    if (isAuthenticated) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setAdminName('IQA Admin');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminName('');
    setActiveView('dashboard');
    handleMenuClose();
  };

  const menuId = 'profile-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          background: `linear-gradient(180deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
          border: `1px solid ${theme.palette.grey[200]}`,
        },
      }}
    >
      <MenuItem onClick={handleMenuClose}>
        <Avatar sx={{ mr: 2, width: 24, height: 24 }}>{adminName.charAt(0)}</Avatar>
        My Profile
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Settings sx={{ mr: 2 }} />
        Settings
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <Logout sx={{ mr: 2 }} />
        Logout
      </MenuItem>
    </Menu>
  );

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
                Welcome to IQA Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your Internal Quality Assurance activities{adminName ? `, ${adminName}` : ''}
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
          { label: 'Learners to Review', value: stats.learnersToReview, icon: <People />, view: 'portfolio', color: 'primary' },
          { label: 'Assessments Pending', value: stats.assessmentsPending, icon: <Assignment />, view: 'sampling', color: 'secondary' },
          { label: 'Sampling Plans Due', value: stats.samplingPlansDue, icon: <Checklist />, view: 'plans', color: 'info' },
          { label: 'Overdue Tasks', value: stats.overdueTasks, icon: <Notifications />, view: 'records', color: 'warning' },
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
      <ContentCard sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="600" gutterBottom>
            Quick Actions
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { icon: <Checklist />, label: 'Sample Work', view: 'sampling' },
              { icon: <Upload />, label: 'Upload Plan', view: 'plans' },
              { icon: <Comment />, label: 'Provide Feedback', view: 'feedback' },
              { icon: <Assessment />, label: 'Generate Report', view: 'reports' },
              { icon: <LibraryBooks />, label: 'View Standards', view: 'standards' },
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
        </CardContent>
      </ContentCard>

      {/* Activity & Process Section */}
      <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 2 }}>
        Activity & Progress
      </Typography>
      <ContentCard>
        <CardContent>
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
                        if (activity.action.includes('portfolio')) setActiveView('portfolio');
                        if (activity.action.includes('plan')) setActiveView('plans');
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
                        {activity.date} • {activity.user}
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
                        { id: 0, value: 65, label: 'Completed', color: theme.palette.success.main },
                        { id: 1, value: 35, label: 'Pending', color: theme.palette.grey[300] },
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
                    65%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overall Progress
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ mt: 3 }}>
            IQA Process
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box component="ol" sx={{ pl: 3, '& li': { mb: 3 } }}>
            {iqaProcess.map((step, index) => (
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
        </CardContent>
      </ContentCard>
    </Box>
  );

  const renderView = () => {
    if (!isAuthenticated && activeView !== 'dashboard') {
      setActiveView('dashboard');
    }
    switch (activeView) {
      case 'portfolio':
        return isAuthenticated ? <LearnerPortfolioBrowser /> : renderDashboard();
      case 'sampling':
        return isAuthenticated ? <AssessmentSamplingInterface /> : renderDashboard();
      case 'feedback':
        return isAuthenticated ? <IQAFeedbackForm /> : renderDashboard();
      case 'plans':
        return isAuthenticated ? <SamplingPlanUploader /> : renderDashboard();
      case 'records':
        return isAuthenticated ? <VerificationRecordsTable /> : renderDashboard();
      case 'reports':
        return isAuthenticated ? <ReportsGenerator /> : renderDashboard();
      case 'standards':
        return isAuthenticated ? <IQAStandardsSection /> : renderDashboard();
      default:
        return renderDashboard();
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.grey[50] }}>
      {/* Sidebar */}
      <SidebarDrawer
        variant={sidebarOpen ? 'temporary' : 'permanent'}
        open={sidebarOpen}
        onClose={toggleSidebar}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: sidebarOpen ? 'block' : 'none', sm: 'block' },
          '& .MuiDrawer-paper': { width: { xs: '80%', sm: 240 }, maxWidth: 240 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <Typography variant="h6" fontWeight="600">
            IQA Dashboard
          </Typography>
          <IconButton sx={{ ml: 'auto', display: { sm: 'none' } }} onClick={toggleSidebar} aria-label="Close sidebar">
            <MenuIcon />
          </IconButton>
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
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}20 0%, ${theme.palette.primary.main}10 100%)`,
                  borderRight: `4px solid ${theme.palette.primary.main}`,
                },
              }}
            >
              <ListItemIcon>
                <Checklist />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          {isAuthenticated && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  selected={activeView === 'portfolio'}
                  onClick={() => setActiveView('portfolio')}
                  aria-label="Portfolio"
                  sx={{
                    borderRadius: '0 12px 12px 0',
                    '&.Mui-selected': {
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}20 0%, ${theme.palette.primary.main}10 100%)`,
                      borderRight: `4px solid ${theme.palette.primary.main}`,
                    },
                  }}
                >
                  <ListItemIcon>
                    <People />
                  </ListItemIcon>
                  <ListItemText primary="Portfolio" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={handleToolsToggle} aria-label="Toggle IQA Tools">
                  <ListItemIcon>
                    <Assignment />
                  </ListItemIcon>
                  <ListItemText primary="IQA Tools" />
                  {toolsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={toolsOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {[
                    { label: 'Sampling', view: 'sampling', icon: <Checklist /> },
                    { label: 'Feedback', view: 'feedback', icon: <Comment /> },
                    { label: 'Plans', view: 'plans', icon: <Upload /> },
                    { label: 'Records', view: 'records', icon: <Assessment /> },
                    { label: 'Reports', view: 'reports', icon: <LibraryBooks /> },
                  ].map((tool) => (
                    <ListItem key={tool.view} disablePadding sx={{ pl: 4 }}>
                      <ListItemButton
                        selected={activeView === tool.view}
                        onClick={() => setActiveView(tool.view)}
                        aria-label={tool.label}
                        sx={{
                          borderRadius: '0 12px 12px 0',
                          '&.Mui-selected': {
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}20 0%, ${theme.palette.primary.main}10 100%)`,
                            borderRight: `4px solid ${theme.palette.primary.main}`,
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
              <ListItem disablePadding>
                <ListItemButton
                  selected={activeView === 'standards'}
                  onClick={() => setActiveView('standards')}
                  aria-label="Standards"
                  sx={{
                    borderRadius: '0 12px 12px 0',
                    '&.Mui-selected': {
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}20 0%, ${theme.palette.primary.main}10 100%)`,
                      borderRight: `4px solid ${theme.palette.primary.main}`,
                    },
                  }}
                >
                  <ListItemIcon>
                    <GppGood />
                  </ListItemIcon>
                  <ListItemText primary="Standards" />
                </ListItemButton>
              </ListItem>
            </>
          )}
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
            <ListItemButton
              onClick={handleProfileMenuOpen}
              aria-label="Profile"
              aria-controls={isMenuOpen ? menuId : undefined}
              aria-expanded={isMenuOpen ? 'true' : 'false'}
              disabled={!isAuthenticated}
            >
              <ListItemIcon>
                <Avatar sx={{ width: 24, height: 24 }}>{adminName ? adminName.charAt(0) : 'I'}</Avatar>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="600">
                    {adminName || 'Guest'}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <StyledButton
              fullWidth
              startIcon={isAuthenticated ? <Logout /> : <AccountCircle />}
              onClick={isAuthenticated ? handleLogout : handleLogin}
              aria-label={isAuthenticated ? 'Logout' : 'Login'}
            >
              {isAuthenticated ? 'Logout' : 'Login'}
            </StyledButton>
          </ListItem>
        </List>
      </SidebarDrawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <IconButton
          sx={{ display: { xs: 'block', sm: 'none' }, mb: 2 }}
          onClick={toggleSidebar}
          aria-label="Open sidebar"
        >
          <MenuIcon />
        </IconButton>
        {renderView()}
      </Box>
      {renderMenu}
    </Box>
  );
};

export default IQADashboard;