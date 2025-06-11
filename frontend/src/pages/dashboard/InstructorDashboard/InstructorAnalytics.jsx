
import React, { useState } from 'react';
import {
  Paper, Typography, Box, Grid, Card, CardContent, Button, Table, TableHead, TableRow,
  TableCell, TableBody, Snackbar, Alert
} from '@mui/material';
import { BarChart, Download } from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import dummyData from './dummyData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InstructorAnalytics = ({ analytics = dummyData.analytics, certifications = dummyData.certifications }) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const engagementData = {
    labels: analytics.engagement.map(item => item.course),
    datasets: [
      {
        label: 'Average Time Spent (mins)',
        data: analytics.engagement.map(item => item.averageTimeSpent),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      },
      {
        label: 'Quiz Attempts',
        data: analytics.engagement.map(item => item.quizAttempts),
        backgroundColor: 'rgba(255, 99, 132, 0.6)'
      }
    ]
  };

  const handleExport = () => {
    setSnackbar({ open: true, message: 'Analytics data exported', severity: 'success' });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Analytics</Typography>
        <Button variant="contained" startIcon={<Download />} onClick={handleExport}>
          Export Data
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Engagement Metrics</Typography>
              <Bar
                data={engagementData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Course Engagement' }
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Completion Rates</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course</TableCell>
                    <TableCell>Completed</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Completion Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.completions.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.course}</TableCell>
                      <TableCell>{item.completed}</TableCell>
                      <TableCell>{item.total}</TableCell>
                      <TableCell>{((item.completed / item.total) * 100).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Certifications Issued</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Issued Date</TableCell>
                    <TableCell>Template</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {certifications.map(cert => (
                    <TableRow key={cert.id}>
                      <TableCell>{cert.student}</TableCell>
                      <TableCell>{cert.course}</TableCell>
                      <TableCell>{cert.issued}</TableCell>
                      <TableCell>{cert.template}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default InstructorAnalytics;
