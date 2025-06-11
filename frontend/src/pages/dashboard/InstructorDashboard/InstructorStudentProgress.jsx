import React, { useState } from 'react';
import {
  Paper, Typography, Box, TextField, Table, TableHead, TableRow, TableCell, TableBody,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Avatar, LinearProgress,
  Snackbar, Alert, Grid, Select, MenuItem, IconButton
} from '@mui/material';
import { Search, Message, Add, Delete, Feedback } from '@mui/icons-material';
import { format } from 'date-fns';
import dummyData from './dummyData';

const InstructorStudentProgress = ({ students = dummyData.students }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', course: '', group: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [message, setMessage] = useState('');

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    console.log('Adding student:', newStudent);
    setOpenAddDialog(false);
    setNewStudent({ name: '', email: '', course: '', group: '' });
    setSnackbar({ open: true, message: 'Student added successfully', severity: 'success' });
  };

  const handleRemoveStudent = (id) => {
    console.log('Removing student:', id);
    setSnackbar({ open: true, message: 'Student removed successfully', severity: 'success' });
  };

  const handleSendFeedback = () => {
    if (feedback.trim()) {
      console.log(`Feedback for ${selectedStudent.name}:`, feedback);
      setSnackbar({ open: true, message: 'Feedback sent successfully', severity: 'success' });
      setFeedback('');
      setOpenFeedbackModal(false);
    } else {
      setSnackbar({ open: true, message: 'Feedback cannot be empty', severity: 'error' });
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log(`Message to ${selectedStudent.name}:`, message);
      setSnackbar({ open: true, message: 'Message sent successfully', severity: 'success' });
      setMessage('');
      setOpenMessageModal(false);
    } else {
      setSnackbar({ open: true, message: 'Message cannot be empty', severity: 'error' });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Student Progress</Typography>
        <Box display="flex" gap={2}>
          <TextField
            placeholder="Search students..."
            variant="outlined"
            size="small"
            InputProps={{ startAdornment: <Search /> }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenAddDialog(true)}>
            Add Student
          </Button>
        </Box>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell>Course</TableCell>
            <TableCell>Group</TableCell>
            <TableCell>Progress</TableCell>
            <TableCell>Last Activity</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredStudents.map(student => (
            <TableRow key={student.id} hover>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <Avatar src={student.avatar} sx={{ width: 40, height: 40, mr: 2 }} />
                  <Box>
                    <Typography>{student.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{student.email}</Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>{student.course}</TableCell>
              <TableCell>{student.group}</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <LinearProgress
                    variant="determinate"
                    value={student.progress}
                    sx={{ width: '100%', mr: 2, height: 8 }}
                  />
                  <Typography>{student.progress}%</Typography>
                </Box>
              </TableCell>
              <TableCell>{format(new Date(student.lastActivity), 'MMM dd, h:mm a')}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => setSelectedStudent(student)}>View Details</Button>
                <IconButton size="small" onClick={() => handleRemoveStudent(student.id)}><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedStudent && (
        <Dialog open={!!selectedStudent} onClose={() => setSelectedStudent(null)} fullWidth maxWidth="sm">
          <DialogTitle>Student Details</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Avatar src={selectedStudent.avatar} sx={{ width: 80, height: 80, mb: 2 }} />
              <Typography variant="h6">{selectedStudent.name}</Typography>
              <Typography color="text.secondary">{selectedStudent.email}</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Course</Typography>
                  <Typography>{selectedStudent.course}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Group</Typography>
                  <Typography>{selectedStudent.group}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Progress</Typography>
                  <Box display="flex" alignItems="center">
                    <LinearProgress
                      variant="determinate"
                      value={selectedStudent.progress}
                      sx={{ width: '100%', mr: 2, height: 8 }}
                    />
                    <Typography>{selectedStudent.progress}%</Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Last Activity</Typography>
                  <Typography>{format(new Date(selectedStudent.lastActivity), 'MMMM dd, yyyy h:mm a')}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedStudent(null)}>Close</Button>
            <Button
              variant="contained"
              startIcon={<Feedback />}
              onClick={() => setOpenFeedbackModal(true)}
            >
              Provide Feedback
            </Button>
            <Button
              variant="contained"
              startIcon={<Message />}
              onClick={() => setOpenMessageModal(true)}
            >
              Send Message
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Feedback Modal */}
      <Dialog open={openFeedbackModal} onClose={() => setOpenFeedbackModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Provide Feedback for {selectedStudent?.name}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Enter feedback for the student..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFeedbackModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSendFeedback}
            disabled={!feedback.trim()}
          >
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>

      {/* Messaging Modal */}
      <Dialog open={openMessageModal} onClose={() => setOpenMessageModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Send Message to {selectedStudent?.name}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Enter your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMessageModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Student</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            value={newStudent.email}
            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
            margin="normal"
            required
          />
          <Select
            fullWidth
            value={newStudent.course}
            onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
            displayEmpty
            margin="normal"
            sx={{ mt: 2 }}
          >
            <MenuItem value="" disabled>Select Course</MenuItem>
            {dummyData.courses.map(c => (
              <MenuItem key={c.id} value={c.title}>{c.title}</MenuItem>
            ))}
          </Select>
          <Select
            fullWidth
            value={newStudent.group}
            onChange={(e) => setNewStudent({ ...newStudent, group: e.target.value })}
            displayEmpty
            margin="normal"
            sx={{ mt: 2 }}
          >
            <MenuItem value="" disabled>Select Group</MenuItem>
            <MenuItem value="Group A">Group A</MenuItem>
            <MenuItem value="Group B">Group B</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddStudent}
            disabled={!newStudent.name || !newStudent.email || !newStudent.course || !newStudent.group}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

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

export default InstructorStudentProgress;