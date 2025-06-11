import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText,
  Box, Avatar, Badge, Menu, MenuItem as MenuItemMUI, Chip, Divider, Fab, Snackbar, Alert,Button 
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, School, Assignment, Message, Schedule, Feedback, Settings, Logout,
  Notifications, Search, Person, RateReview, Star, Book, ShoppingCart, Favorite, Help,  
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import StudentOverview from './StudentOverview';
import StudentCourseList from './StudentCourseList';
import StudentAssignments from './StudentAssignments';
import StudentMessages from './StudentMessages';
import StudentSchedule from './StudentSchedule';
import StudentFeedback from './StudentFeedback';
import StudentProfile from './StudentProfile';
import StudentCartWishlist from './StudentCartWishlist';
import StudentSearch from './StudentSearch';
import StudentSupport from './StudentSupport';
import StudentGamification from './StudentGamification'; 
import dummyData from './dummyData'; 
import AITutor from './AITutor';
import { format } from 'date-fns';

const StudentDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [profileOpen, setProfileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('lms');
  const [feedbackTarget, setFeedbackTarget] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });


  const unreadCount = dummyData.messages.filter(msg => !msg.read).length;

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: <Dashboard /> },
    { id: 'courses', label: 'My Courses', icon: <School /> },
    { id: 'assignments', label: 'Assignments', icon: <Assignment /> },
    { id: 'messages', label: 'Messages', icon: <Message /> },
    { id: 'schedule', label: 'Schedule', icon: <Schedule /> },
    { id: 'feedback', label: 'Feedback', icon: <Feedback /> },
    { id: 'cart-wishlist', label: 'Cart & Wishlist', icon: <ShoppingCart /> },
    { id: 'search', label: 'Search Courses', icon: <Search /> },
    { id: 'support', label: 'Support', icon: <Help /> },
    { id: 'gamification', label: 'Achievements', icon: <Star /> },
    { id: 'ai-tutor', label: 'AI Tutor', icon: <Book /> }
  ];

  const handleFeedbackClick = (target, type) => {
    setFeedbackTarget(target || { title: 'Learning Management System' });
    setFeedbackType(type || 'lms');
    setFeedbackOpen(true);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <StudentOverview student={dummyData.student} metrics={dummyData.metrics} activities={dummyData.activities} analytics={dummyData.analytics} />;
      case 'courses':
        return <StudentCourseList onFeedback={handleFeedbackClick} />;
      case 'assignments':
        return <StudentAssignments assignments={dummyData.assignments} />;
      case 'messages':
        return <StudentMessages messages={dummyData.messages} />;
      case 'schedule':
        return <StudentSchedule schedules={dummyData.schedules} />;
      case 'feedback':
        return <StudentFeedback feedback={dummyData.feedbackHistory} onFeedback={handleFeedbackClick} />;
      case 'cart-wishlist':
        return <StudentCartWishlist cart={dummyData.cart} wishlist={dummyData.wishlist} paymentHistory={dummyData.paymentHistory} />;
      case 'search':
        return <StudentSearch />;
      case 'support':
        return <StudentSupport />;
      case 'gamification':
        return <StudentGamification gamification={dummyData.gamification} />;
      case 'ai-tutor':
        return <AITutor />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? drawerOpen : true}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: isMobile ? '100%' : 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isMobile ? '100%' : 240,
            boxSizing: 'border-box',
            bgcolor: theme.palette.primary.main,
            color: '#fff',
            borderRight: 'none'
          }
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
          <School sx={{ fontSize: 32, mr: 1 }} />
          <Typography variant="h6" noWrap component="div">
            EduConnect
          </Typography>
        </Toolbar>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <List>
          {navigationItems.map(item => (
            <ListItem
              button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                if (isMobile) setDrawerOpen(false);
              }}
              sx={{
                bgcolor: activeSection === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                mb: 0.5
              }}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: '40px' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
              {item.id === 'messages' && unreadCount > 0 && (
                <Chip label={unreadCount} size="small" color="error" sx={{ ml: 1 }} />
              )}
            </ListItem>
          ))}
        </List>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Logout />}
            sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)', '&:hover': { borderColor: 'rgba(255,255,255,0.4)' } }}
            onClick={() => showSnackbar('Logged out successfully', 'success')}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box flexGrow={1}>
        {/* Top Navigation Bar */}
        <AppBar position="fixed" sx={{ bgcolor: '#fff', color: '#000', boxShadow: 1, zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            {isMobile && (
              <IconButton edge="start" onClick={() => setDrawerOpen(true)} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Student Dashboard
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton
                size="large"
                color="inherit"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ mr: 1 }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                onClick={() => setProfileOpen(true)}
              >
                <Avatar src={dummyData.student.avatar} sx={{ width: 32, height: 32 }} />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                color="inherit"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Notifications Menu */}
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItemMUI dense disabled>
            <Typography variant="subtitle1">Notifications</Typography>
          </MenuItemMUI>
          {dummyData.messages.slice(0, 3).map(msg => (
            <MenuItemMUI
              key={msg.id}
              onClick={() => {
                setActiveSection('messages');
                setAnchorEl(null);
              }}
              sx={{
                borderLeft: msg.important ? '3px solid' + theme.palette.error.main : 'none',
                bgcolor: !msg.read ? theme.palette.action.selected : 'inherit'
              }}
            >
              <ListItemIcon>
                <Message color={!msg.read ? 'primary' : 'action'} />
              </ListItemIcon>
              <ListItemText
                primary={msg.sender}
                secondary={
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '300px'
                    }}
                  >
                    {msg.content}
                  </Typography>
                }
              />
            </MenuItemMUI>
          ))}
          <MenuItemMUI
            onClick={() => {
              setActiveSection('messages');
              setAnchorEl(null);
            }}
            sx={{ justifyContent: 'center' }}
          >
            <Typography color="primary">View All Notifications</Typography>
          </MenuItemMUI>
        </Menu>

        {/* Content Area */}
        <Box sx={{
          p: isMobile ? 2 : 4,
          maxWidth: '1400px',
          mx: 'auto',
          mt: '64px'
        }}>
          {renderContent()}
        </Box>

        {/* Profile Modal */}
        <StudentProfile
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          student={dummyData.student}
          onSave={() => showSnackbar('Profile updated successfully', 'success')}
        />

        {/* Feedback Modal */}
        <StudentFeedback
          open={feedbackOpen}
          onClose={() => setFeedbackOpen(false)}
          type={feedbackType}
          target={feedbackTarget}
          onSubmit={() => showSnackbar('Feedback submitted successfully', 'success')}
        />

        {/* Floating Feedback Button */}
        <Fab
          color="primary"
          aria-label="feedback"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            display: { xs: 'none', md: 'flex' }
          }}
          onClick={() => handleFeedbackClick(null, 'lms')}
        >
          <Feedback />
        </Fab>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default StudentDashboard;