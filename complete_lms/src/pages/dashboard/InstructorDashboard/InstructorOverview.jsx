import React from 'react';
import {
  Paper, Typography, Box, Grid, Card, CardContent, List, ListItem, ListItemText,
  Divider, Avatar
} from '@mui/material';
import { School, People, Assignment, Quiz, Forum } from '@mui/icons-material';
import { format } from 'date-fns';

const InstructorOverview = ({ instructor, metrics, activities = [] }) => {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar src={instructor.avatar} sx={{ width: 80, height: 80, mr: 3 }} />
          <Box>
            <Typography variant="h4">{instructor.name}</Typography>
            <Typography color="text.secondary">{instructor.department}</Typography>
            <Typography variant="body2">Last login: {format(new Date(instructor.lastLogin), 'MMMM dd, yyyy h:mm a')}</Typography>
          </Box>
        </Box>
        <Typography variant="body1" paragraph>{instructor.bio}</Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <School color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4">{metrics.courses}</Typography>
                    <Typography color="text.secondary">Active Courses</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <People color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4">{metrics.students}</Typography>
                    <Typography color="text.secondary">Enrolled Students</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Assignment color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4">{metrics.pendingTasks}</Typography>
                    <Typography color="text.secondary">Pending Tasks</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Quiz color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4">{metrics.completionRate}%</Typography>
                    <Typography color="text.secondary">Completion Rate</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Forum color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4">{metrics.upcomingEvents}</Typography>
                    <Typography color="text.secondary">Forum Posts</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            <List>
              {activities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemText
                      primary={activity.action}
                      secondary={`${activity.course} • ${format(new Date(activity.date), 'MMM dd, yyyy h:mm a')}`}
                    />
                  </ListItem>
                  {index < activities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InstructorOverview;
