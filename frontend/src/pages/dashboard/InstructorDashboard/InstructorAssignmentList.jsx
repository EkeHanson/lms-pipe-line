
import React, { useState } from 'react';
import {
  Paper, Typography, Box, Button, Table, TableHead, TableRow, TableCell, TableBody,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, IconButton, TextField,
  Snackbar, Alert, Tabs, Tab, Grid, Avatar
} from '@mui/material';
import { Add, Grading, Edit, Delete, Download } from '@mui/icons-material';
import { format } from 'date-fns';
import dummyData from './dummyData';

const InstructorAssignmentList = ({ assignments = dummyData.assignments }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });


  console.log("YEAH")
  const handleViewSubmissions = (assignment) => {
    setSelectedAssignment(assignment);
    setOpenDialog(true);
  };

  const handleGrade = (student) => {
    console.log('Grading for:', student, { grade, feedback });
    setSnackbar({ open: true, message: 'Grade submitted', severity: 'success' });
    setGrade('');
    setFeedback('');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Assignments</Typography>
        <Button variant="contained" startIcon={<Add />}>Create Assignment</Button>
      </Box>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Active" />
        <Tab label="Upcoming" />
        <Tab label="Completed" />
      </Tabs>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Course</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Submissions</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assignments.map(assignment => (
            <TableRow key={assignment.id} hover>
              <TableCell>{assignment.title}</TableCell>
              <TableCell>{assignment.course}</TableCell>
              <TableCell>{format(new Date(assignment.dueDate), 'MMM dd, yyyy')}</TableCell>
              <TableCell>{assignment.submissions} / {assignment.graded} graded</TableCell>
              <TableCell>
                <Chip
                  label={new Date(assignment.dueDate) > new Date() ? 'Active' : 'Closed'}
                  color={new Date(assignment.dueDate) > new Date() ? 'primary' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Button
                  size="small"
                  startIcon={<Grading />}
                  onClick={() => handleViewSubmissions(assignment)}
                >
                  Grade
                </Button>
                <IconButton size="small"><Edit /></IconButton>
                <IconButton size="small"><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedAssignment && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
          <DialogTitle>
            {selectedAssignment.title} - Submissions
            <Typography variant="subtitle1" color="text.secondary">
              {selectedAssignment.course} • Due: {format(new Date(selectedAssignment.dueDate), 'MMM dd, yyyy')}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>Submission Statistics</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2">Total Submissions</Typography>
                    <Typography variant="h4">{selectedAssignment.submissions}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2">Graded</Typography>
                    <Typography variant="h4">{selectedAssignment.graded}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2">Average Score</Typography>
                    <Typography variant="h4">{selectedAssignment.averageScore}%</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            <Typography variant="h6" gutterBottom>Rubric</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Criterion</TableCell>
                  <TableCell>Weight</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedAssignment.rubric.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.criterion}</TableCell>
                    <TableCell>{item.weight}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Typography variant="h6" gutterBottom mt={3}>Student Submissions</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Submitted On</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Feedback</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dummyData.students.map(student => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar src={student.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
                        <Typography>{student.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{format(new Date(student.lastActivity), 'MMM dd')}</TableCell>
                    <TableCell>
                      <Chip
                        label={Math.random() > 0.3 ? 'Submitted' : 'Pending'}
                        color={Math.random() > 0.3 ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{Math.random() > 0.3 ? `${Math.floor(Math.random() * 30) + 70}%` : '-'}</TableCell>
                    <TableCell>{Math.random() > 0.5 ? 'Good work!' : ''}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => handleGrade(student)}>Grade</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Box mt={3}>
              <Typography variant="h6" gutterBottom>Grade Submission</Typography>
              <TextField
                label="Score (%)"
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                margin="normal"
                sx={{ mr: 2 }}
              />
              <TextField
                label="Feedback"
                multiline
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                fullWidth
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
            <Button variant="contained" startIcon={<Download />}>Download All</Button>
          </DialogActions>
        </Dialog>
      )}

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

export default InstructorAssignmentList;
