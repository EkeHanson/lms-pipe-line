
import React, { useState } from 'react';
import {
  Paper, Typography, Box, Button, Table, TableHead, TableRow, TableCell, TableBody,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Chip,Select,MenuItem,
  Snackbar, Alert, FormControlLabel, Checkbox 
} from '@mui/material';
import { Add, Edit, Delete, Forum, PushPin} from '@mui/icons-material';
import { format } from 'date-fns';
import dummyData from './dummyData';

const InstructorForums = ({ forums = dummyData.forums }) => {
  const [open, setOpen] = useState(false);
  const [selectedForum, setSelectedForum] = useState(null);
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [pinned, setPinned] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleOpen = (forum = null) => {
    setSelectedForum(forum);
    setTitle(forum?.title || '');
    setCourse(forum?.course || '');
    setPinned(forum?.pinned || false);
    setOpen(true);
  };

  const handleSubmit = () => {
    setTimeout(() => {
      console.log('Saving forum:', { title, course, pinned });
      setOpen(false);
      setSnackbar({ open: true, message: 'Forum saved successfully', severity: 'success' });
    }, 1000);
  };

  const handleDelete = (id) => {
    console.log('Deleting forum:', id);
    setSnackbar({ open: true, message: 'Forum deleted successfully', severity: 'success' });
  };

  const handlePinToggle = (id) => {
    console.log('Toggling pin for forum:', id);
    setSnackbar({ open: true, message: 'Forum pin toggled', severity: 'success' });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Discussion Forums</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Create Forum
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Course</TableCell>
            <TableCell>Posts</TableCell>
            <TableCell>Last Activity</TableCell>
            <TableCell>Pinned</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {forums.map(forum => (
            <TableRow key={forum.id}>
              <TableCell>{forum.title}</TableCell>
              <TableCell>{forum.course}</TableCell>
              <TableCell>{forum.posts}</TableCell>
              <TableCell>{format(new Date(forum.lastActivity), 'MMM dd, yyyy h:mm a')}</TableCell>
              <TableCell>
                <Chip
                  label={forum.pinned ? 'Pinned' : 'Unpinned'}
                  color={forum.pinned ? 'primary' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpen(forum)}><Edit /></IconButton>
                <IconButton onClick={() => handleDelete(forum.id)}><Delete /></IconButton>
                <IconButton onClick={() => handlePinToggle(forum.id)}>
                  <PushPin color={forum.pinned ? 'primary' : 'inherit'} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{selectedForum ? 'Edit Forum' : 'Create Forum'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Forum Title"
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
          <FormControlLabel
            control={<Checkbox checked={pinned} onChange={(e) => setPinned(e.target.checked)} />}
            label="Pin Forum"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!title || !course}
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

export default InstructorForums;
