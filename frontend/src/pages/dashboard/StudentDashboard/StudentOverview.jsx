import React from 'react';
import { Box, Paper, Typography, Grid, Card, Avatar, LinearProgress, Button } from '@mui/material';
import { School, CheckCircle, Assignment, Grading, Star } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import dummyData from './dummyData'; 

const StudentOverview = ({ student, metrics, activities, analytics }) => {
  const gradeData = [
    { name: 'Advanced ML', grade: 90 },
    { name: 'Web Dev', grade: 89.5 },
    { name: 'Data Structures', grade: 85 }
  ];

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar src={student.avatar} sx={{ width: 80, height: 80, mr: 3 }} />
          <Box>
            <Typography variant="h5">Welcome back, {student.name}!</Typography>
            <Typography color="text.secondary">{student.department} Major</Typography>
            <Typography variant="body2" color="text.secondary">
              Member since {format(new Date(student.enrollmentDate), 'MMMM yyyy')}
            </Typography>
            <Box display="flex" alignItems="center" mt={1}>
              <Star color="primary" />
              <Typography variant="body2" ml={1}>{student.points} Points (Rank #{dummyData.gamification.leaderboardRank})</Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {[
            { label: 'Enrolled Courses', value: metrics.enrolledCourses, icon: <School fontSize="large" color="primary" /> },
            { label: 'Completed', value: metrics.completedCourses, icon: <CheckCircle fontSize="large" color="primary" /> },
            { label: 'Assignments Due', value: metrics.assignmentsDue, icon: <Assignment fontSize="large" color="primary" /> },
            { label: 'Average Grade', value: `${metrics.averageGrade}%`, icon: <Grading fontSize="large" color="primary" /> }
          ].map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card variant="outlined" sx={{ height: '100%', p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" color="text.secondary">{metric.label}</Typography>
                  {metric.icon}
                </Box>
                <Typography variant="h4">{metric.value}</Typography>
                {metric.label === 'Average Grade' && (
                  <LinearProgress variant="determinate" value={metrics.averageGrade} sx={{ mt: 2, height: 8, borderRadius: 4 }} />
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Course Grades</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="grade" fill="#1976d2" name="Your Grade" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Learning Analytics</Typography>
            <Typography variant="body2" mb={2}>
              Time Spent: {analytics.timeSpent.total} (Weekly: {analytics.timeSpent.weekly})
            </Typography>
            <Typography variant="body2" mb={2}>
              Strengths: {analytics.strengths.join(', ')}
            </Typography>
            <Typography variant="body2" mb={2}>
              Areas to Improve: {analytics.weaknesses.join(', ')}
            </Typography>
            <Button variant="text" sx={{ mt: 1 }}>
              View Detailed Report
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentOverview;