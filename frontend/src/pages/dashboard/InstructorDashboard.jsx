import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText,
  Box, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputLabel, Select, MenuItem,
  Avatar, Badge, Paper, Menu, MenuItem as MenuItemMUI, Chip, LinearProgress, Divider,
  Tabs, Tab, CardMedia, Snackbar, Alert, Tooltip, CircularProgress
} from '@mui/material';
import {
  Menu as MenuIcon, Person, Notifications, Dashboard, School, People, Assignment, Message, Schedule,
  Edit, Delete, Upload, Add, CheckCircle, Search, CalendarToday, Download, MoreVert,
  VideoLibrary, Article, Link, Quiz, Grading, Forum, Event, Settings, Logout
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { format } from 'date-fns';
import CourseForm from './AdminDashboard/courses/CourseForm.jsx';
import ModuleForm from './ModuleForm.jsx';

// Enhanced dummy data with more realistic structure
const dummyData = {
  instructor: {
    name: 'Dr. Sarah Johnson',
    email: 's.johnson@university.edu',
    bio: 'Professor of Computer Science with 10+ years experience in AI and Machine Learning',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    department: 'Computer Science',
    lastLogin: '2025-04-20T14:30:00Z'
  },
  metrics: {
    courses: 5,
    students: 128,
    pendingTasks: 12,
    completionRate: 82,
    upcomingEvents: 3
  },
  courses: [
    { 
      id: 1, 
      title: 'Advanced Machine Learning', 
      category: 'AI', 
      status: 'Published', 
      students: 42,
      thumbnail: 'https://source.unsplash.com/random/300x200?machine+learning',
      lastUpdated: '2025-04-18'
    },
    { 
      id: 2, 
      title: 'Web Development Fundamentals', 
      category: 'Web', 
      status: 'Published', 
      students: 36,
      thumbnail: 'https://source.unsplash.com/random/300x200?web+development',
      lastUpdated: '2025-04-15'
    },
    { 
      id: 3, 
      title: 'Data Structures & Algorithms', 
      category: 'CS Core', 
      status: 'Published', 
      students: 50,
      thumbnail: 'https://source.unsplash.com/random/300x200?algorithm',
      lastUpdated: '2025-04-10'
    }
  ],
  students: [
    { 
      id: 1, 
      name: 'Alice Chen', 
      email: 'alice.chen@student.edu', 
      progress: 88, 
      lastActivity: '2025-04-20T09:15:00Z',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      course: 'Advanced ML'
    },
    { 
      id: 2, 
      name: 'Bob Wilson', 
      email: 'bob.wilson@student.edu', 
      progress: 65, 
      lastActivity: '2025-04-19T14:30:00Z',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      course: 'Web Dev'
    },
    { 
      id: 3, 
      name: 'Carlos Ruiz', 
      email: 'c.ruiz@student.edu', 
      progress: 92, 
      lastActivity: '2025-04-20T16:45:00Z',
      avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
      course: 'Data Structures'
    }
  ],
  assignments: [
    { 
      id: 1, 
      title: 'Neural Networks Project', 
      course: 'Advanced ML', 
      dueDate: '2025-04-28T23:59:00Z', 
      submissions: 28,
      graded: 15,
      averageScore: 82
    },
    { 
      id: 2, 
      title: 'React Portfolio', 
      course: 'Web Dev', 
      dueDate: '2025-05-05T23:59:00Z', 
      submissions: 12,
      graded: 5,
      averageScore: 76
    }
  ],
  messages: [
    { 
      id: 1, 
      sender: 'Alice Chen', 
      course: 'Advanced ML',
      content: 'Question about the backpropagation assignment', 
      date: '2025-04-20T10:30:00Z', 
      read: false,
      urgent: true
    },
    { 
      id: 2, 
      sender: 'Teaching Assistant', 
      course: 'Web Dev',
      content: 'Reminder: Office hours moved to Thursday', 
      date: '2025-04-19T16:15:00Z', 
      read: true,
      urgent: false
    }
  ],
  activities: [
    { 
      id: 1, 
      action: 'Posted new lecture: "Convolutional Networks"', 
      date: '2025-04-20T09:00:00Z',
      course: 'Advanced ML',
      type: 'lecture'
    },
    { 
      id: 2, 
      action: 'Graded assignments for Web Dev class', 
      date: '2025-04-19T14:00:00Z',
      course: 'Web Dev',
      type: 'grading'
    },
    { 
      id: 3, 
      action: 'Updated syllabus for Data Structures', 
      date: '2025-04-18T11:30:00Z',
      course: 'Data Structures',
      type: 'update'
    }
  ],
  schedules: [
    { 
      id: 1, 
      title: 'ML Office Hours', 
      date: '2025-04-22T14:00:00Z', 
      duration: 60,
      platform: 'Zoom', 
      link: 'https://zoom.us/j/123456789',
      description: 'Q&A session for upcoming project'
    },
    { 
      id: 2, 
      title: 'Department Meeting', 
      date: '2025-04-24T10:00:00Z', 
      duration: 90,
      platform: 'Campus', 
      location: 'CS Building Room 305',
      description: 'Curriculum planning for next semester'
    }
  ],
  materials: [
    { id: 1, title: 'Lecture 5 Slides', type: 'slides', course: 'Advanced ML', date: '2025-04-15', downloads: 42 },
    { id: 2, title: 'Assignment 3 Template', type: 'document', course: 'Web Dev', date: '2025-04-10', downloads: 36 },
    { id: 3, title: 'Algorithm Visualizations', type: 'video', course: 'Data Structures', date: '2025-04-05', downloads: 28 }
  ]
};

// Status chip component
const StatusChip = ({ status }) => {
  const colorMap = {
    Published: 'success',
    Draft: 'warning',
    Archived: 'error'
  };
  return <Chip label={status} color={colorMap[status] || 'default'} size="small" />;
};

// Enhanced Instructor Overview Component
const InstructorOverview = ({ instructor, metrics, activities }) => (
  <Box>
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar src={instructor.avatar} sx={{ width: 80, height: 80, mr: 3 }} />
        <Box>
          <Typography variant="h5">Welcome back, {instructor.name}!</Typography>
          <Typography color="text.secondary">{instructor.department} Department</Typography>
          <Typography variant="body2" color="text.secondary">
            Last login: {format(new Date(instructor.lastLogin), 'MMM dd, yyyy h:mm a')}
          </Typography>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {[
          { label: 'Active Courses', value: metrics.courses, icon: <School fontSize="large" color="primary" /> },
          { label: 'Total Students', value: metrics.students, icon: <People fontSize="large" color="primary" /> },
          { label: 'Completion Rate', value: `${metrics.completionRate}%`, icon: <CheckCircle fontSize="large" color="primary" /> },
          { label: 'Upcoming Events', value: metrics.upcomingEvents, icon: <Event fontSize="large" color="primary" /> }
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" color="text.secondary">{metric.label}</Typography>
                {metric.icon}
              </Box>
              <Typography variant="h4">{metric.value}</Typography>
              {metric.label === 'Completion Rate' && (
                <LinearProgress 
                  variant="determinate" 
                  value={metrics.completionRate} 
                  sx={{ mt: 2, height: 8, borderRadius: 4 }} 
                />
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>

    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>Recent Activity</Typography>
          <List dense>
            {activities.map(activity => (
              <ListItem key={activity.id} sx={{ py: 1 }}>
                <ListItemIcon>
                  {activity.type === 'lecture' ? <VideoLibrary color="primary" /> : 
                   activity.type === 'grading' ? <Grading color="secondary" /> : 
                   <Edit color="action" />}
                </ListItemIcon>
                <ListItemText
                  primary={activity.action}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {activity.course}
                      </Typography>
                      {` — ${format(new Date(activity.date), 'MMM dd, h:mm a')}`}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
          <Button variant="text" endIcon={<MoreVert />} sx={{ mt: 1 }}>
            View All Activity
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>Pending Tasks</Typography>
          <Box mb={2}>
            <Typography variant="subtitle2">Assignments to Grade</Typography>
            <LinearProgress variant="determinate" value={60} sx={{ height: 8, borderRadius: 4, mb: 1 }} />
            <Typography variant="body2" color="text.secondary">7 of 12 completed</Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle2">Student Questions</Typography>
            <LinearProgress variant="determinate" value={30} sx={{ height: 8, borderRadius: 4, mb: 1 }} />
            <Typography variant="body2" color="text.secondary">3 of 10 answered</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">Course Updates</Typography>
            <LinearProgress variant="determinate" value={80} sx={{ height: 8, borderRadius: 4, mb: 1 }} />
            <Typography variant="body2" color="text.secondary">4 of 5 completed</Typography>
          </Box>
          <Button variant="contained" fullWidth sx={{ mt: 2 }}>
            View All Tasks
          </Button>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

// Enhanced Course List Component
const InstructorCourseList = ({ courses, onAddCourse, onEditCourse, onDeleteCourse }) => {
  const [openCourseForm, setOpenCourseForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

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
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
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
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openCourseForm} 
        onClose={() => setOpenCourseForm(false)} 
        fullWidth 
        maxWidth="md"
      >
        <DialogTitle>{selectedCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
        <DialogContent>
          <CourseForm 
            course={selectedCourse} 
            onSubmit={() => setOpenCourseForm(false)} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCourseForm(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

// Enhanced Material Upload Component
const InstructorMaterialUpload = ({ courseId }) => {
  const [open, setOpen] = useState(false);
  const [materialType, setMaterialType] = useState('file');
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Uploading:', { courseId, title, materialType, file, url, course });
      setLoading(false);
      setOpen(false);
      setFile(null);
      setUrl('');
      setTitle('');
      setCourse('');
      setSnackbarOpen(true);
    }, 1500);
  };

  return (
    <Box>
      <Button 
        variant="contained" 
        startIcon={<Upload />} 
        onClick={() => setOpen(true)} 
        fullWidth
        sx={{ mb: 3 }}
      >
        Upload New Material
      </Button>
      
      <Typography variant="h6" gutterBottom>Course Materials</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Course</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Downloads</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dummyData.materials.map(material => (
            <TableRow key={material.id}>
              <TableCell>{material.title}</TableCell>
              <TableCell>
                <Chip 
                  label={material.type} 
                  size="small" 
                  icon={
                    material.type === 'video' ? <VideoLibrary fontSize="small" /> :
                    material.type === 'document' ? <Article fontSize="small" /> :
                    <Link fontSize="small" />
                  }
                />
              </TableCell>
              <TableCell>{material.course}</TableCell>
              <TableCell>{material.date}</TableCell>
              <TableCell>{material.downloads}</TableCell>
              <TableCell>
                <IconButton size="small"><Download fontSize="small" /></IconButton>
                <IconButton size="small"><Edit fontSize="small" /></IconButton>
                <IconButton size="small"><Delete fontSize="small" /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Upload New Course Material</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Material Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Course</InputLabel>
              <Select
                fullWidth
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
              >
                {dummyData.courses.map(c => (
                  <MenuItem key={c.id} value={c.title}>{c.title}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Material Type</InputLabel>
              <Select
                fullWidth
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                required
              >
                <MenuItem value="file">
                  <ListItemIcon><Article /></ListItemIcon>
                  <ListItemText>File (PDF, Word, Video)</ListItemText>
                </MenuItem>
                <MenuItem value="url">
                  <ListItemIcon><Link /></ListItemIcon>
                  <ListItemText>URL Link</ListItemText>
                </MenuItem>
              </Select>
            </Grid>
            {materialType === 'file' ? (
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<Upload />}
                >
                  Upload File
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx,.mp4,.mov,.ppt,.pptx"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </Button>
                {file && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected: {file.name}
                  </Typography>
                )}
              </Grid>
            ) : (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            disabled={!title || !course || (materialType === 'file' ? !file : !url) || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Material uploaded successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Enhanced Student Progress Component
const InstructorStudentProgress = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Student Progress</Typography>
        <TextField
          placeholder="Search students..."
          variant="outlined"
          size="small"
          InputProps={{ startAdornment: <Search /> }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell>Course</TableCell>
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
              <TableCell>
                {format(new Date(student.lastActivity), 'MMM dd, h:mm a')}
              </TableCell>
              <TableCell>
                <Button 
                  size="small" 
                  onClick={() => setSelectedStudent(student)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedStudent && (
        <Dialog 
          open={!!selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
          fullWidth 
          maxWidth="sm"
        >
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
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Last Activity</Typography>
                  <Typography>
                    {format(new Date(selectedStudent.lastActivity), 'MMMM dd, yyyy h:mm a')}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedStudent(null)}>Close</Button>
            <Button variant="contained" startIcon={<Message />}>
              Send Message
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Paper>
  );
};

// Enhanced Assignment List Component
const InstructorAssignmentList = ({ assignments }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleViewSubmissions = (assignment) => {
    setSelectedAssignment(assignment);
    setOpenDialog(true);
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
              <TableCell>
                {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                {assignment.submissions} / {assignment.graded} graded
              </TableCell>
              <TableCell>
                <Chip 
                  label={
                    new Date(assignment.dueDate) > new Date() ? 'Active' : 'Closed'
                  } 
                  color={
                    new Date(assignment.dueDate) > new Date() ? 'primary' : 'default'
                  } 
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
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)} 
          fullWidth 
          maxWidth="md"
        >
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

            <Typography variant="h6" gutterBottom>Student Submissions</Typography>
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
                    <TableCell>
                      {format(new Date(student.lastActivity), 'MMM dd')}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={Math.random() > 0.3 ? 'Submitted' : 'Pending'} 
                        color={Math.random() > 0.3 ? 'success' : 'warning'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      {Math.random() > 0.3 ? `${Math.floor(Math.random() * 30) + 70}%` : '-'}
                    </TableCell>
                    <TableCell>
                      {Math.random() > 0.5 ? 'Good work!' : ''}
                    </TableCell>
                    <TableCell>
                      <Button size="small">Grade</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
            <Button variant="contained">Download All</Button>
          </DialogActions>
        </Dialog>
      )}
    </Paper>
  );
};

// Enhanced Messages Component
const InstructorMessages = ({ messages }) => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const unreadCount = messages.filter(msg => !msg.read).length;

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    // Mark as read when opened
    message.read = true;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Typography variant="h5" mr={2}>Messages</Typography>
        <Badge badgeContent={unreadCount} color="error">
          <Message />
        </Badge>
      </Box>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab value="inbox" label="Inbox" />
        <Tab value="sent" label="Sent" />
        <Tab value="drafts" label="Drafts" />
      </Tabs>

      <Grid container spacing={3}>
        <Grid item xs={12} md={selectedMessage ? 5 : 12}>
          <Paper variant="outlined" sx={{ height: '500px', overflow: 'auto' }}>
            <List>
              {messages.map(msg => (
                <ListItem 
                  key={msg.id} 
                  button 
                  selected={selectedMessage?.id === msg.id}
                  onClick={() => handleViewMessage(msg)}
                  sx={{
                    borderLeft: msg.urgent ? '4px solid #f44336' : '4px solid transparent',
                    bgcolor: !msg.read ? 'action.hover' : 'inherit'
                  }}
                >
                  <ListItemIcon>
                    {msg.read ? <Message color="action" /> : <Message color="primary" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <>
                        <Typography component="span" fontWeight={!msg.read ? 'bold' : 'normal'}>
                          {msg.sender}
                        </Typography>
                        {msg.urgent && (
                          <Chip label="URGENT" size="small" color="error" sx={{ ml: 1 }} />
                        )}
                      </>
                    }
                    secondary={
                      <>
                        <Typography 
                          component="span" 
                          variant="body2" 
                          color={!msg.read ? 'text.primary' : 'text.secondary'}
                          sx={{
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {msg.content}
                        </Typography>
                        <Typography 
                          component="span" 
                          variant="caption" 
                          color="text.secondary"
                        >
                          {format(new Date(msg.date), 'MMM dd, h:mm a')} • {msg.course}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {selectedMessage && (
          <Grid item xs={12} md={7}>
            <Paper variant="outlined" sx={{ p: 3, height: '500px', display: 'flex', flexDirection: 'column' }}>
              <Box mb={3}>
                <Typography variant="h6">{selectedMessage.sender}</Typography>
                <Typography color="text.secondary" gutterBottom>
                  {format(new Date(selectedMessage.date), 'MMMM dd, yyyy h:mm a')}
                </Typography>
                <Chip label={selectedMessage.course} size="small" sx={{ mb: 2 }} />
                <Typography paragraph>{selectedMessage.content}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>Reply</Typography>
              <TextField
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                sx={{ flexGrow: 1, mb: 2 }}
              />
              <Box display="flex" justifyContent="flex-end">
                <Button variant="outlined" sx={{ mr: 2 }}>Save Draft</Button>
                <Button variant="contained">Send Reply</Button>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

// Enhanced Schedule Component
const InstructorSchedule = ({ schedules }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const upcomingEvents = schedules.filter(event => new Date(event.date) > new Date());
  const pastEvents = schedules.filter(event => new Date(event.date) <= new Date());

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Schedule</Typography>
        <Button variant="contained" startIcon={<Add />}>Add Event</Button>
      </Box>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab value="upcoming" label={`Upcoming (${upcomingEvents.length})`} />
        <Tab value="past" label={`Past (${pastEvents.length})`} />
      </Tabs>

      <Grid container spacing={2}>
        {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).map(event => (
          <Grid item xs={12} sm={6} key={event.id}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" gutterBottom>{event.title}</Typography>
                  <Chip 
                    label={activeTab === 'upcoming' ? 'Upcoming' : 'Completed'} 
                    color={activeTab === 'upcoming' ? 'primary' : 'default'} 
                    size="small" 
                  />
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <CalendarToday fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {format(new Date(event.date), 'MMMM dd, yyyy')} • {event.time}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {event.description}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Chip 
                    label={event.platform} 
                    icon={event.platform === 'Zoom' ? <VideoLibrary fontSize="small" /> : <Event fontSize="small" />}
                    size="small" 
                  />
                  <Button 
                    size="small" 
                    onClick={() => handleViewEvent(event)}
                  >
                    Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedEvent && (
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)} 
          fullWidth 
          maxWidth="sm"
        >
          <DialogTitle>{selectedEvent.title}</DialogTitle>
          <DialogContent>
            <Box mb={2}>
              <Typography variant="subtitle2">Date & Time</Typography>
              <Typography>
                {format(new Date(selectedEvent.date), 'EEEE, MMMM dd, yyyy')} • {selectedEvent.time}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle2">Duration</Typography>
              <Typography>{selectedEvent.duration} minutes</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle2">Location/Platform</Typography>
              <Typography>
                {selectedEvent.platform === 'Campus' ? 
                  selectedEvent.location : 
                  <a href={selectedEvent.link} target="_blank" rel="noopener noreferrer">
                    {selectedEvent.platform} Link
                  </a>
                }
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle2">Description</Typography>
              <Typography>{selectedEvent.description}</Typography>
            </Box>
            {selectedEvent.platform === 'Zoom' && (
              <Button 
                variant="contained" 
                fullWidth 
                startIcon={<VideoLibrary />}
                href={selectedEvent.link}
                target="_blank"
              >
                Join Zoom Meeting
              </Button>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
            <Button variant="contained" startIcon={<Edit />}>Edit</Button>
          </DialogActions>
        </Dialog>
      )}
    </Paper>
  );
};

// Enhanced Profile Modal Component
const ProfileModal = ({ instructor, open, onClose }) => {
  const [bio, setBio] = useState(instructor.bio);
  const [avatar, setAvatar] = useState(instructor.avatar);
  const [tempAvatar, setTempAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Saving profile:', { bio, avatar });
      if (tempAvatar) {
        setAvatar(URL.createObjectURL(tempAvatar));
      }
      setLoading(false);
      setSnackbarOpen(true);
      onClose();
    }, 1500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempAvatar(file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Profile Settings</DialogTitle>
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ px: 3 }}>
        <Tab value="profile" label="Profile" />
        <Tab value="account" label="Account" />
        <Tab value="notifications" label="Notifications" />
      </Tabs>
      <DialogContent>
        {activeTab === 'profile' && (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar 
                  src={tempAvatar ? URL.createObjectURL(tempAvatar) : avatar} 
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <Button 
                  variant="outlined" 
                  component="label"
                  startIcon={<Upload />}
                >
                  Upload Photo
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>
                {tempAvatar && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    {tempAvatar.name}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Full Name"
                value={instructor.name}
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Email"
                value={instructor.email}
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Department"
                value={instructor.department}
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                margin="normal"
              />
            </Grid>
          </Grid>
        )}
        {activeTab === 'account' && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>Account Security</Typography>
            <Button variant="outlined" sx={{ mr: 2 }}>Change Password</Button>
            <Button variant="outlined">Two-Factor Authentication</Button>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Connected Accounts</Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar src="https://cdn-icons-png.flaticon.com/512/281/281764.png" sx={{ width: 32, height: 32, mr: 2 }} />
              <Typography>Google</Typography>
              <Chip label="Connected" color="success" size="small" sx={{ ml: 'auto' }} />
            </Box>
          </Box>
        )}
        {activeTab === 'notifications' && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>Notification Preferences</Typography>
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked />} label="Email notifications" />
              <FormControlLabel control={<Checkbox defaultChecked />} label="Assignment submissions" />
              <FormControlLabel control={<Checkbox defaultChecked />} label="Student messages" />
              <FormControlLabel control={<Checkbox />} label="Course announcements" />
            </FormGroup>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </DialogActions>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

// Main Dashboard Component
const InstructorDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [profileOpen, setProfileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const unreadCount = dummyData.messages.filter(msg => !msg.read).length;

  const handleAddCourse = () => console.log('Adding new course');
  const handleEditCourse = (course) => console.log('Editing course:', course);
  const handleDeleteCourse = (courseId) => console.log('Deleting course:', courseId);

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: <Dashboard /> },
    { id: 'courses', label: 'Courses', icon: <School /> },
    { id: 'students', label: 'Students', icon: <People /> },
    { id: 'assignments', label: 'Assignments', icon: <Assignment /> },
    { id: 'messages', label: 'Messages', icon: <Message /> },
    { id: 'schedule', label: 'Schedule', icon: <Schedule /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <InstructorOverview
            instructor={dummyData.instructor}
            metrics={dummyData.metrics}
            activities={dummyData.activities}
          />
        );
      case 'courses':
        return (
          <>
            <InstructorCourseList
              courses={dummyData.courses}
              onAddCourse={handleAddCourse}
              onEditCourse={handleEditCourse}
              onDeleteCourse={handleDeleteCourse}
            />
            <InstructorMaterialUpload courseId={1} />
          </>
        );
      case 'students':
        return <InstructorStudentProgress students={dummyData.students} />;
      case 'assignments':
        return <InstructorAssignmentList assignments={dummyData.assignments} />;
      case 'messages':
        return <InstructorMessages messages={dummyData.messages} />;
      case 'schedule':
        return <InstructorSchedule schedules={dummyData.schedules} />;
      case 'settings':
        return (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>Settings</Typography>
            <Typography>Dashboard settings and preferences will go here.</Typography>
          </Paper>
        );
      default:
        return null;
    }
  };

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItemMUI onClick={() => { setProfileOpen(true); handleMenuClose(); }}>
        <IconButton size="large" color="inherit">
          <Person />
        </IconButton>
        <Typography>Profile</Typography>
      </MenuItemMUI>
      <MenuItemMUI onClick={() => { setActiveSection('messages'); handleMenuClose(); }}>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={unreadCount} color="error">
            <Message />
          </Badge>
        </IconButton>
        <Typography>Messages</Typography>
      </MenuItemMUI>
      <MenuItemMUI onClick={() => { setActiveSection('schedule'); handleMenuClose(); }}>
        <IconButton size="large" color="inherit">
          <Schedule />
        </IconButton>
        <Typography>Schedule</Typography>
      </MenuItemMUI>
    </Menu>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? drawerOpen : true}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: isMobile ? '100%' : 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': { 
            width: isMobile ? '100%' : 240, 
            boxSizing: 'border-box', 
            bgcolor: theme.palette.primary.main, 
            color: '#fff',
            borderRight: 'none'
          }
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
          <School sx={{ fontSize: 32, mr: 1 }} />
          <Typography variant="h6" noWrap component="div">
            EduConnect
          </Typography>
        </Toolbar>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <List>
          {navigationItems.map(item => (
            <ListItem
              button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                if (isMobile) setDrawerOpen(false);
              }}
              sx={{
                bgcolor: activeSection === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                mb: 0.5
              }}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: '40px' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
              {item.id === 'messages' && unreadCount > 0 && (
                <Chip label={unreadCount} size="small" color="error" sx={{ ml: 1 }} />
              )}
            </ListItem>
          ))}
        </List>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Button 
            variant="outlined" 
            fullWidth 
            startIcon={<Logout />}
            sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)', '&:hover': { borderColor: 'rgba(255,255,255,0.4)' } }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box flexGrow={1}>
        {/* Top Navigation Bar */}
        <AppBar position="fixed" sx={{ bgcolor: '#fff', color: '#000', boxShadow: 1, zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            {isMobile && (
              <IconButton edge="start" onClick={() => setDrawerOpen(true)} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Instructor Dashboard
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton 
                size="large" 
                color="inherit"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ mr: 1 }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              <IconButton 
                size="large" 
                edge="end"
                onClick={() => setProfileOpen(true)}
              >
                <Avatar src={dummyData.instructor.avatar} sx={{ width: 32, height: 32 }} />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={(e) => setMobileMoreAnchorEl(e.currentTarget)}
                color="inherit"
              >
                <MoreVert />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Notifications Menu */}
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          id="primary-search-account-menu"
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItemMUI dense disabled>
            <Typography variant="subtitle1">Notifications</Typography>
          </MenuItemMUI>
          {dummyData.messages.slice(0, 3).map(msg => (
            <MenuItemMUI 
              key={msg.id} 
              onClick={() => {
                setActiveSection('messages');
                handleMenuClose();
              }}
              sx={{
                borderLeft: msg.urgent ? '3px solid' + theme.palette.error.main : 'none',
                bgcolor: !msg.read ? theme.palette.action.selected : 'inherit'
              }}
            >
              <ListItemIcon>
                <Message color={!msg.read ? 'primary' : 'action'} />
              </ListItemIcon>
              <ListItemText
                primary={msg.sender}
                secondary={
                  <Typography 
                    variant="body2" 
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '300px'
                    }}
                  >
                    {msg.content}
                  </Typography>
                }
              />
            </MenuItemMUI>
          ))}
          <MenuItemMUI 
            onClick={() => {
              setActiveSection('messages');
              handleMenuClose();
            }}
            sx={{ justifyContent: 'center' }}
          >
            <Typography color="primary">View All Notifications</Typography>
          </MenuItemMUI>
        </Menu>

        {renderMobileMenu}

        {/* Content Area */}
        <Box sx={{ 
          p: isMobile ? 2 : 4, 
          maxWidth: '1400px', 
          mx: 'auto',
          mt: '64px' // Offset for fixed AppBar
        }}>
          {renderContent()}
        </Box>

        {/* Profile Modal */}
        <ProfileModal
          instructor={dummyData.instructor}
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
        />
      </Box>
    </Box>
  );
};

export default InstructorDashboard;


