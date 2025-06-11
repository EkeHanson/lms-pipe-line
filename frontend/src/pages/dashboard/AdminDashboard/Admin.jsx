import CourseView from './courses/CourseView';
import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, AppBar, Toolbar, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, CssBaseline, Typography, IconButton, Avatar, Divider, Badge, 
  useTheme, useMediaQuery, Menu, MenuItem, Tooltip
} from '@mui/material';
import {
  Dashboard as DashboardIcon, People as UsersIcon, Security as SecurityIcon,
  AttachMoney as FinanceIcon, CalendarToday as ScheduleIcon, Campaign as AdvertIcon,
  Notifications as NotificationsIcon, Settings as SettingsIcon, Logout as LogoutIcon,
  Analytics as AnalyticsIcon, NotificationsActive as AlertsIcon, Assessment as ReportsIcon,
  Computer as SystemSettingsIcon, Web as WebsiteIcon, Groups as GroupsIcon,
  Payment as PaymentIcon, Checklist as ChecklistIcon, School as SchoolIcon,
  Forum as ForumIcon, Menu as MenuIcon, Close as CloseIcon
} from '@mui/icons-material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import ChoiceModal from './ChoiceModal'; 
import AdminDashboard from './AdminDashboard';
import AdminFinancialDashboard from './AdminFinancialDashboard';
import AdminUserManagement from './AdminUserManagement';
import SecurityComplianceDashboard from './SecurityComplianceDashboard';
import ContentUsageDashboard from './ContentUsageDashboard';
import NotificationsDashboard from './NotificationsDashboard';
import CommunicationHub from './CommunicationHub';
import ReportsDashboard from './ReportsDashboard';
import AdminProfileSettings from './AdminProfileSettings';
import PaymentSettings from './PaymentSettings';
import WebsiteNotificationSettings from './WebsiteNotificationSettings';
import WebsiteSettings from './WebsiteSettings';
import QualityDashbaord from './QaulityAssuranceDashboard/QualityDashbaord';
import CourseManagement from './courses/CourseManagement';
import CourseDetailPage from './courses/CourseDetailPage';
import CourseForm from './courses/CourseForm';
import ScheduleManagement from './ScheduleManagement';
import Messaging from './Messaging';
import LearnerProfile from './LearnerProfile';
import Advertorial from './Advertorial/Advertorial';
import CertificateBuilderMain from './certificateBuilder/CertificateBuilderMain';
import UserGroupsManagement from './UserGroupsManagement';
import axios from 'axios';
import { API_BASE_URL, CMVP_SITE_URL, CMVP_API_URL } from '../../../config';

const drawerWidth = 280;
const collapsedDrawerWidth = 60;

function Admin() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const settingsOpen = Boolean(anchorEl);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleCertificateIconClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setError(null);
  };

  const handleNavigateToBuilder = () => {
    navigate('/admin/builder');
    handleCloseModal();
  };

  const handleGenerateToken = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);
  
      const payload = {
        token: token,
        user_email: "ekenehanson@gmail.com",
        expires_at: expiresAt.toISOString(),
      };
  
      const response = await axios.post(
        `${CMVP_API_URL}/api/accounts/auth/api/register-token/`,
        payload
      );
  
      if (response.status === 201) {
        const magic_link = `${CMVP_SITE_URL}/MagicLoginPage?token=${token}`;
        window.open(magic_link, '_blank');
      } else {
        setError('Failed to generate token');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', name: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/admin/courses', name: 'Course Management', icon: <SchoolIcon /> }, 
    { path: '/admin/users', name: 'User Management', icon: <UsersIcon /> },
    { path: '/admin/quality-assurance', name: 'Quality Assurance', icon: <ChecklistIcon /> },
    { path: '/admin/finance', name: 'Financial Dashboard', icon: <FinanceIcon /> },
    { path: '/admin/security-info', name: 'Security & Compliance', icon: <SecurityIcon /> },   
    { path: '/admin/analytics', name: 'Content & Analytics', icon: <AnalyticsIcon /> },
    { path: '/admin/alerts', name: 'Notifications & Alerts', icon: <AlertsIcon /> },
    { path: '/admin/communication', name: 'Communication Hub', icon: <ForumIcon /> },
    { path: '/admin/reports', name: 'Custom Reports', icon: <ReportsIcon /> },
    { path: '/admin/groups', name: 'User Groups', icon: <GroupsIcon /> },
  ];

  const settingsMenuItems = [
    { 
      name: 'System Settings', 
      icon: <SystemSettingsIcon sx={{ mr: 2 }} />, 
      onClick: () => console.log('System Settings clicked')
    },
    { 
      name: 'Website Settings', 
      icon: <WebsiteIcon sx={{ mr: 2 }} />, 
      onClick: () => {
        navigate('/admin/website-settings');
        handleSettingsClose();
      }
    },
    { 
      name: 'Website Notification', 
      icon: <NotificationsIcon sx={{ mr: 2 }} />, 
      onClick: () => {
        navigate('/admin/website-notifications');
        handleSettingsClose();
      }
    },
    { 
      name: 'Setup Payment Information', 
      icon: <PaymentIcon sx={{ mr: 2 }} />, 
      onClick: () => {
        navigate('/admin/payment-settings');
        handleSettingsClose();
      }
    },
    { 
      name: 'Logout', 
      icon: <LogoutIcon sx={{ mr: 2 }} />, 
      onClick: () => {
        handleLogout();
        handleSettingsClose();
      }
    }
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isCollapsed && !isMobile ? 'center' : 'space-between',
        p: theme.spacing(2),
        height: '64px'
      }}>
        {!isCollapsed && (
          <Typography variant="h6" sx={{ fontWeight: 700, ml: 1 }}>
            Admin Console
          </Typography>
        )}
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            {isCollapsed ? <MenuIcon /> : <CloseIcon />}
          </IconButton>
        )}
      </Box>
      
      <Divider />
      
      <List sx={{ px: isCollapsed && !isMobile ? 0 : 0.5, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <Tooltip title={isCollapsed && !isMobile ? item.name : ''} placement="right" key={item.path}>
            <ListItem 
              disablePadding
              sx={{
                backgroundColor: location.pathname === item.path ? 
                  theme.palette.action.selected : 'transparent',
                mb: 0.5
              }}
            >
              <ListItemButton 
                component={Link} 
                to={item.path}
                sx={{
                  py: 1.5,
                  px: isCollapsed && !isMobile ? 1.5 : 2,
                  justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  },
                  minHeight: '48px'
                }}
                onClick={() => isMobile && setMobileOpen(false)}
              >
                <ListItemIcon sx={{ 
                  minWidth: isCollapsed && !isMobile ? 'auto' : 40,
                  mr: isCollapsed && !isMobile ? 0 : 2,
                  justifyContent: 'center',
                  color: 'inherit'
                }}>
                  {item.icon}
                </ListItemIcon>
                {(!isCollapsed || isMobile) && (
                  <ListItemText 
                    primary={item.name} 
                    primaryTypographyProps={{ 
                      fontWeight: 500,
                      fontSize: '0.9rem'
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />
      
      <List sx={{ px: isCollapsed && !isMobile ? 0 : 0.5 }}>
        <Tooltip title={isCollapsed && !isMobile ? 'Logout' : ''} placement="right">
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                py: 1.5,
                px: isCollapsed && !isMobile ? 1.5 : 2,
                justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
                '&:hover': {
                    backgroundColor: theme.palette.action.hover
                },
                minHeight: '48px'
              }}
              onClick={() => {
                handleLogout();
                isMobile && setMobileOpen(false);
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: isCollapsed && !isMobile ? 'auto' : 40,
                mr: isCollapsed && !isMobile ? 0 : 2,
                justifyContent: 'center',
                color: 'inherit'
              }}>
                <LogoutIcon />
              </ListItemIcon>
              {(!isCollapsed || isMobile) && (
                <ListItemText 
                  primary="Logout" 
                  primaryTypographyProps={{ 
                    fontWeight: 500,
                    fontSize: '0.9rem'
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100%' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`,
          width: isMobile ? '100%' : `calc(100% - ${isCollapsed ? collapsedDrawerWidth : drawerWidth}px)`,
          left: isMobile ? 0 : (isCollapsed ? collapsedDrawerWidth : drawerWidth),
        }}
      > 
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography 
            variant={isMobile ? 'h6' : 'h6'} 
            noWrap 
            component="div" 
            sx={{ flexGrow: 1, fontWeight: 700, fontSize: isMobile ? '1.1rem' : '1.25rem' }}
          >
            Admin Portal
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 0.5 : 1 }}>
            <Tooltip title="Certificate Options">
              <IconButton 
                onClick={handleCertificateIconClick}
                size="small"
                color="inherit"
                aria-label="certificate-options"
                sx={{
                  color: location.pathname === '/admin/builder' ? 
                    theme.palette.primary.main : 'inherit'
                }}
              >
                <EmojiEventsIcon fontSize={isMobile ? 'small' : 'medium'} />
              </IconButton>    
            </Tooltip>
            <Tooltip title="Advert Management">
              <IconButton 
                component={Link}
                to="/admin/advertorial"
                size="small"
                color="inherit"
                aria-label="advert-management"
                sx={{
                  color: location.pathname === '/admin/advertorial' ? 
                    theme.palette.primary.main : 'inherit'
                }}
              >
                <AdvertIcon fontSize={isMobile ? 'small' : 'medium'} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Schedule Management">
              <IconButton 
                component={Link}
                to="/admin/schedule"
                size="small"
                color="inherit"
                aria-label="schedule"
                sx={{
                  color: location.pathname === '/admin/schedule' ? 
                    theme.palette.primary.main : 'inherit'
                }}
              >
                <ScheduleIcon fontSize={isMobile ? 'small' : 'medium'} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Communication Hub">
              <IconButton 
                component={Link}
                to="/admin/communication"
                size="small"
                color="inherit"
                aria-label="communication"
                sx={{
                  color: location.pathname === '/admin/communication' ? 
                    theme.palette.primary.main : 'inherit'
                }}
              >
                <ForumIcon fontSize={isMobile ? 'small' : 'medium'} />
              </IconButton>
            </Tooltip>
            
            <IconButton 
              size="small"
              color="inherit"
              onClick={handleSettingsClick}
              aria-controls={settingsOpen ? 'settings-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={settingsOpen ? 'true' : undefined}
            >
              <SettingsIcon fontSize={isMobile ? 'small' : 'medium'} />
            </IconButton>

            <Menu
              id="settings-menu"
              anchorEl={anchorEl}
              open={settingsOpen}
              onClose={handleSettingsClose}
              MenuListProps={{
                'aria-labelledby': 'settings-button',
              }}
              PaperProps={{
                elevation: 2,
                sx: {
                  mt: 1.5,
                  minWidth: isMobile ? 200 : 250,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  '& .MuiMenuItem-root': {
                    py: isMobile ? 1 : 1.5,
                    px: 2,
                    fontSize: isMobile ? '0.85rem' : '0.95rem',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      transform: 'translateX(4px)',
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {settingsMenuItems.map((item) => (
                <MenuItem 
                  key={item.name}
                  onClick={() => {
                    item.onClick();
                    handleSettingsClose();
                  }}
                >
                  {item.icon}
                  {item.name}
                </MenuItem>
              ))}
            </Menu>

            <IconButton 
              component={Link} 
              to="/admin/profile" 
              size="small"
              color="inherit"
            >
              <Avatar 
                alt="Admin User" 
                src="/path-to-avatar.jpg" 
                sx={{ width: isMobile ? 28 : 32, height: isMobile ? 28 : 32 }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: isMobile ? drawerWidth : isCollapsed ? collapsedDrawerWidth : drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isMobile ? drawerWidth : isCollapsed ? collapsedDrawerWidth : drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.default,
            borderRight: `1px solid ${theme.palette.divider}`,
            overflowX: 'hidden',
            transition: theme.transitions.create(['width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: isMobile ? '100%' : `calc(100% - ${isCollapsed ? collapsedDrawerWidth : drawerWidth}px)`,
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        <Box
          sx={{
            flex: 1,
            backgroundColor: theme.palette.background.paper,
            p: isMobile ? 1 : 2,
            overflowY: 'auto',
            width: '100%'
          }}
        >
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/finance" element={<AdminFinancialDashboard />} />
            <Route path="/users" element={<AdminUserManagement />} />
            <Route path="/security-info" element={<SecurityComplianceDashboard />} />
            <Route path="/analytics" element={<ContentUsageDashboard />} />
            <Route path="/alerts" element={<NotificationsDashboard />} />
            <Route path="/communication" element={<CommunicationHub />} />
            <Route path="/reports" element={<ReportsDashboard />} />
            <Route path="/profile" element={<AdminProfileSettings />} />
            <Route path="/payment-settings" element={<PaymentSettings />} />
            <Route path="/website-notifications" element={<WebsiteNotificationSettings />} />
            <Route path="/website-settings" element={<WebsiteSettings />} />
            {/* <Route path="/quality-assurance" element={<QualityDashbaord />} /> */}
            <Route path="/quality-assurance" element={<QualityDashbaord />} />
            {/* <Route path="/quality-assurance" element={<QualityAssurance />} /> */}
            <Route path="/courses" element={<CourseManagement />} />
            <Route path="/courses/new" element={<CourseForm />} />
            <Route path="/courses/edit/:id" element={<CourseForm />} />
            <Route path="/courses/view/:id" element={<CourseView />} />
            <Route path="/schedule" element={<ScheduleManagement />} />
            <Route path="/messaging" element={<Messaging />} /> 
            <Route path="/advertorial" element={<Advertorial />} />
            <Route path="/groups" element={<UserGroupsManagement />} />
            <Route path="/learner-profile/:id" element={<LearnerProfile />} />
            <Route path="/builder" element={<CertificateBuilderMain />} />
            <Route path="/course-details/:id" element={<CourseDetailPage />} />
          </Routes>
        </Box>
      </Box>

      <ChoiceModal
        open={modalOpen}
        onClose={handleCloseModal}
        onNavigateToBuilder={handleNavigateToBuilder}
        onGenerateToken={handleGenerateToken}
      />
    </Box>
  );
}

export default Admin;