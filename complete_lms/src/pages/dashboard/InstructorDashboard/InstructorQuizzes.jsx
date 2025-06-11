
import React, { useState } from 'react';
import {
  Paper, Typography, Box, Button, Table, TableHead, TableRow, TableCell, TableBody,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem,
  Chip, IconButton, Snackbar, Alert
} from '@mui/material';
import { Add, Edit, Delete, Quiz } from '@mui/icons-material';
import { format } from 'date-fns';
import dummyData from './dummyData';

const InstructorQuizzes = ({ quizzes = dummyData.quizzes }) => {
  const [open, setOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [questions, setQuestions] = useState(0);
  const [timeLimit, setTimeLimit] = useState(0);
  const [attempts, setAttempts] = useState(1);
  const [status, setStatus] = useState('Draft');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleOpen = (quiz = null) => {
    setSelectedQuiz(quiz);
    setTitle(quiz?.title || '');
    setCourse(quiz?.course || '');
    setQuestions(quiz?.questions || 0);
    setTimeLimit(quiz?.timeLimit || 0);
    setAttempts(quiz?.attemptsAllowed || 1);
    setStatus(quiz?.status || 'Draft');
    setOpen(true);
  };

  const handleSubmit = () => {
    setTimeout(() => {
      console.log('Saving quiz:', { title, course, questions, timeLimit, attempts, status });
      setOpen(false);
      setSnackbar({ open: true, message: 'Quiz saved successfully', severity: 'success' });
    }, 1000);
  };

  const handleDelete = (id) => {
    console.log('Deleting quiz:', id);
    setSnackbar({ open: true, message: 'Quiz deleted successfully', severity: 'success' });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Quizzes</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Create Quiz
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Course</TableCell>
            <TableCell>Questions</TableCell>
            <TableCell>Time Limit</TableCell>
            <TableCell>Attempts</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {quizzes.map(quiz => (
            <TableRow key={quiz.id}>
              <TableCell>{quiz.title}</TableCell>
              <TableCell>{quiz.course}</TableCell>
              <TableCell>{quiz.questions}</TableCell>
              <TableCell>{quiz.timeLimit} mins</TableCell>
              <TableCell>{quiz.attemptsAllowed}</TableCell>
              <TableCell>
                <Chip label={quiz.status} color={quiz.status === 'Published' ? 'success' : 'warning'} size="small" />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpen(quiz)}><Edit /></IconButton>
                <IconButton onClick={() => handleDelete(quiz.id)}><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{selectedQuiz ? 'Edit Quiz' : 'Create Quiz'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />
          <Select
            fullWidth
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            displayEmpty
            margin="normal"
            sx={{ mt: 2 }}
          >
            <MenuItem value="" disabled>Select Course</MenuItem>
            {dummyData.courses.map(c => (
              <MenuItem key={c.id} value={c.title}>{c.title}</MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            label="Number of Questions"
            type="number"
            value={questions}
            onChange={(e) => setQuestions(Number(e.target.value))}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Time Limit (minutes)"
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Attempts Allowed"
            type="number"
            value={attempts}
            onChange={(e) => setAttempts(Number(e.target.value))}
            margin="normal"
            required
          />
          <Select
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            margin="normal"
            sx={{ mt: 2 }}
          >
            <MenuItem value="Draft">Draft</MenuItem>
            <MenuItem value="Published">Published</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!title || !course || !questions || !timeLimit || !attempts}
          >
            Save
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

export default InstructorQuizzes;
