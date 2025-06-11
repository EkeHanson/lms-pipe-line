
import React, { useState } from 'react';
import {
  Paper, Typography, Box, Button, Grid, Card, CardMedia, CardContent, TextField, Select, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, IconButton, Snackbar, Alert, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import { Add, Edit, Delete, FileCopy, Feedback,Search,People } from '@mui/icons-material';
import { format } from 'date-fns';
import dummyData from './dummyData';
import CourseForm from './CourseForm';
import ModuleForm from './ModuleForm';

const StatusChip = ({ status }) => {
  const colorMap = {
    Published: 'success',
    Draft: 'warning',
    Archived: 'error'
  };
  return <Chip label={status} color={colorMap[status] || 'default'} size="small" />;
};

const InstructorCourseList = ({ courses = dummyData.courses, onAddCourse, onEditCourse, onDeleteCourse, onFeedback }) => {
  const [openCourseForm, setOpenCourseForm] = useState(false);
  const [openModuleForm, setOpenModuleForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseForModules, setSelectedCourseForModules] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || course.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setOpenCourseForm(true);
  };

  const handleModules = (course) => {
    setSelectedCourseForModules(course);
  };

  const handleClone = (course) => {
    console.log('Cloning course:', course.id);
    setSnackbar({ open: true, message: 'Course cloned successfully', severity: 'success' });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">My Courses</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => {
          setSelectedCourse(null);
          setOpenCourseForm(true);
        }}>
          New Course
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          placeholder="Search courses..."
          variant="outlined"
          size="small"
          InputProps={{ startAdornment: <Search /> }}
          sx={{ flexGrow: 1 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="all">All Statuses</MenuItem>
          <MenuItem value="Published">Published</MenuItem>
          <MenuItem value="Draft">Draft</MenuItem>
          <MenuItem value="Archived">Archived</MenuItem>
        </Select>
      </Box>

      <Grid container spacing={3}>
        {filteredCourses.map(course => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image={course.thumbnail}
                alt={course.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {course.title}
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Chip label={course.category} size="small" />
                  <StatusChip status={course.status} />
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Last updated: {format(new Date(course.lastUpdated), 'MMM dd, yyyy')}
                </Typography>
                <Box display="flex" alignItems="center">
                  <People fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">{course.students} students enrolled</Typography>
                </Box>
              </CardContent>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => handleEdit(course)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  startIcon={<Delete />}
                  color="error"
                  onClick={() => onDeleteCourse(course.id)}
                >
                  Delete
                </Button>
                <Button
                  size="small"
                  startIcon={<FileCopy />}
                  onClick={() => handleClone(course)}
                >
                  Clone
                </Button>
                <Button
                  size="small"
                  startIcon={<Feedback />}
                  onClick={() => onFeedback(course, 'course')}
                >
                  Feedback
                </Button>
              </Box>
              <Box sx={{ p: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleModules(course)}
                >
                  Manage Modules
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openCourseForm} onClose={() => setOpenCourseForm(false)} fullWidth maxWidth="md">
        <DialogTitle>{selectedCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
        <DialogContent>
          <CourseForm
            course={selectedCourse}
            onSubmit={() => {
              setOpenCourseForm(false);
              setSnackbar({ open: true, message: 'Course saved successfully', severity: 'success' });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCourseForm(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!selectedCourseForModules} onClose={() => setSelectedCourseForModules(null)} fullWidth maxWidth="md">
        <DialogTitle>Manage Modules for {selectedCourseForModules?.title}</DialogTitle>
        <DialogContent>
          <Box mb={3}>
            <Typography variant="h6">Modules</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Order</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedCourseForModules?.modules.map(module => (
                  <TableRow key={module.id}>
                    <TableCell>{module.title}</TableCell>
                    <TableCell>{module.order}</TableCell>
                    <TableCell>
                      <IconButton><Edit /></IconButton>
                      <IconButton><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <ModuleForm
            onSubmit={() => {
              setSnackbar({ open: true, message: 'Module saved successfully', severity: 'success' });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedCourseForModules(null)}>Close</Button>
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

export default InstructorCourseList;
