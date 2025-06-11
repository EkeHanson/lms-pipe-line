import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, Button, Paper, Grid, IconButton, Badge } from '@mui/material';
import { Forum as ForumIcon, Email as EmailIcon, CalendarToday as CalendarIcon, Flag as FlagIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import Messaging from './Messaging';
import Schedule from './ScheduleManagement';
import { messagingAPI, forumAPI, moderationAPI } from '../../../config';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ForumManager from './ForumManager';
import ModerationQueue from './ModerationQueue';

const CommunicationHub = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({
    unreadMessages: 0,
    upcomingEvents: 0,
    activeForums: 0,
    pendingModeration: 0
  });

  // Fetch communication hub statistics
  const fetchStats = async () => {
    try {
      const [messageStats, scheduleStats, forumStats, moderationStats] = await Promise.all([
        messagingAPI.getUnreadCount(),
        messagingAPI.getTotalMessages(),
        forumAPI.getForumStats(),
        moderationAPI.getPendingCount()
      ]);

      setStats({
        unreadMessages: messageStats.data.count || 0,
        upcomingEvents: scheduleStats.data.total_schedules || 0,
        activeForums: forumStats.data.active_forums || 0,
        pendingModeration: moderationStats.data.count || 0
      });
    } catch (error) {
      enqueueSnackbar('Failed to load communication statistics', { variant: 'error' });
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    // Set up interval for periodic stats refresh
    const interval = setInterval(fetchStats, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h3" gutterBottom>
          Communication Hub
        </Typography>

        {/* Overview Dashboard */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Overview</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                <Badge badgeContent={stats.unreadMessages} color="error">
                  <EmailIcon color="primary" />
                </Badge>
                <Typography variant="subtitle1">Unread Messages</Typography>
                <Typography variant="h6">{stats.unreadMessages}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                <Badge badgeContent={stats.upcomingEvents} color="primary">
                  <CalendarIcon color="primary" />
                </Badge>
                <Typography variant="subtitle1">Upcoming Events</Typography>
                <Typography variant="h6">{stats.upcomingEvents}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                <Badge badgeContent={stats.activeForums} color="secondary">
                  <ForumIcon color="primary" />
                </Badge>
                <Typography variant="subtitle1">Active Forums</Typography>
                <Typography variant="h6">{stats.activeForums}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                <Badge badgeContent={stats.pendingModeration} color="warning">
                  <FlagIcon color="primary" />
                </Badge>
                <Typography variant="subtitle1">Pending Moderation</Typography>
                <Typography variant="h6">{stats.pendingModeration}</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs Navigation */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          <Tab
            label="Messages"
            icon={<Badge badgeContent={stats.unreadMessages} color="error"><EmailIcon /></Badge>}
            iconPosition="start"
          />
          <Tab
            label="Schedules"
            icon={<Badge badgeContent={stats.upcomingEvents} color="primary"><CalendarIcon /></Badge>}
            iconPosition="start"
          />
          <Tab
            label="Forums"
            icon={<Badge badgeContent={stats.activeForums} color="secondary"><ForumIcon /></Badge>}
            iconPosition="start"
          />
          <Tab
            label="Moderation"
            icon={<Badge badgeContent={stats.pendingModeration} color="warning"><FlagIcon /></Badge>}
            iconPosition="start"
          />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && <Messaging />}
          {activeTab === 1 && <Schedule />}
          {activeTab === 2 && <ForumManager />}
          {activeTab === 3 && <ModerationQueue />}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default CommunicationHub;