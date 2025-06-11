import React, { useState } from 'react';
import { Paper, Typography, Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, LinearProgress } from '@mui/material';
import { Download } from '@mui/icons-material';
import { format } from 'date-fns';

const StudentAssignments = ({ assignments }) => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const filteredAssignments = assignments.filter(assignment => {
    if (tabValue === 0) return assignment.status === 'not-started' || assignment.status === 'in-progress';
    if (tabValue === 1) return assignment.status === 'submitted';
    if (tabValue === 2) return assignment.grade !== null;
    return true;
  });

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Assignments</Typography>
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Upcoming" />
        <Tab label="Submitted" />
        <Tab label="Graded" />
      </Tabs>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Course</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Grade</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAssignments.map(assignment => (
            <TableRow key={assignment.id} hover>
              <TableCell>{assignment.title}</TableCell>
              <TableCell>{assignment.course}</TableCell>
              <TableCell>{format(new Date(assignment.dueDate), 'MMM dd, yyyy')}</TableCell>
              <TableCell>
                <Chip
                  label={assignment.status === 'submitted' ? 'Submitted' : assignment.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                  color={assignment.status === 'submitted' ? 'success' : assignment.status === 'in-progress' ? 'warning' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>{assignment.grade ? `${assignment.grade}%` : '-'}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => setSelectedAssignment(assignment)}>
                  {assignment.status === 'submitted' ? 'View Feedback' : 'Start'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedAssignment && (
        <Dialog open={!!selectedAssignment} onClose={() => setSelectedAssignment(null)} fullWidth maxWidth="sm">
          <DialogTitle>{selectedAssignment.title}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Course</Typography>
                <Typography>{selectedAssignment.course}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Due Date</Typography>
                <Typography>{format(new Date(selectedAssignment.dueDate), 'MMMM dd, yyyy h:mm a')}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Status</Typography>
                <Chip
                  label={selectedAssignment.status === 'submitted' ? 'Submitted' : selectedAssignment.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                  color={selectedAssignment.status === 'submitted' ? 'success' : selectedAssignment.status === 'in-progress' ? 'warning' : 'default'}
                  sx={{ mb: 2 }}
                />
              </Grid>
              {selectedAssignment.grade && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Grade & Feedback</Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="h6" sx={{ mr: 2 }}>{selectedAssignment.grade}%</Typography>
                      <LinearProgress variant="determinate" value={selectedAssignment.grade} sx={{ flexGrow: 1, height: 8 }} />
                    </Box>
                    <Typography>{selectedAssignment.feedback || 'No additional feedback provided.'}</Typography>
                  </Paper>
                </Grid>
              )}
              <Grid item xs={12}>
                <Button variant="contained" fullWidth startIcon={<Download />}>
                  Download Instructions
                </Button>
              </Grid>
              {selectedAssignment.status === 'submitted' && (
                <Grid item xs={12}>
                  <Button variant="outlined" fullWidth startIcon={<Download />}>
                    Download Submission
                  </Button>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedAssignment(null)}>Close</Button>
            {selectedAssignment.status !== 'submitted' && (
              <Button variant="contained" href={`/assignment/${selectedAssignment.id}`}>
                {selectedAssignment.status === 'in-progress' ? 'Continue' : 'Start'} Assignment
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </Paper>
  );
};

export default StudentAssignments;