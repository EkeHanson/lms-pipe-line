import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText,
  Box, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputLabel, Select, MenuItem,
  Avatar, Badge, Paper, Menu, MenuItem as MenuItemMUI, Chip, LinearProgress, Divider,
  Tabs, Tab, CardMedia, Snackbar, Alert, Tooltip, CircularProgress, Rating, FormControlLabel,
  Checkbox, FormGroup, Accordion, AccordionSummary, AccordionDetails, Fab
} from '@mui/material';
import {
  Menu as MenuIcon, Person, Notifications, Dashboard, School, People, Assignment, Message, Schedule,
  Edit, Delete, Upload, Add, CheckCircle, Search, CalendarToday, Download, MoreVert,
  VideoLibrary, Article, Link, Quiz, Grading, Forum, Event, Settings, Logout, ExpandMore,
  Star, StarBorder, Feedback, PlayCircle, Book, Quiz as QuizIcon, RateReview
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

// Enhanced dummy data for student dashboard
const dummyData = {
  student: {
    name: 'Alex Johnson',
    email: 'alex.johnson@student.edu',
    bio: 'Computer Science Major, Class of 2025',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    department: 'Computer Science',
    lastLogin: '2025-04-20T14:30:00Z',
    enrollmentDate: '2023-09-01'
  },
  metrics: {
    enrolledCourses: 4,
    completedCourses: 2,
    assignmentsDue: 3,
    averageGrade: 86,
    learningHours: 42
  },
  enrolledCourses: [
    { 
      id: 1, 
      title: 'Advanced Machine Learning', 
      instructor: 'Dr. Sarah Johnson',
      category: 'AI', 
      progress: 75,
      thumbnail: 'https://source.unsplash.com/random/300x200?machine+learning',
      nextLesson: '2025-04-22T14:00:00Z',
      assignmentsDue: 2
    },
    { 
      id: 2, 
      title: 'Web Development Fundamentals', 
      instructor: 'Prof. Michael Chen',
      category: 'Web', 
      progress: 92,
      thumbnail: 'https://source.unsplash.com/random/300x200?web+development',
      nextLesson: '2025-04-23T10:00:00Z',
      assignmentsDue: 1
    },
    { 
      id: 3, 
      title: 'Data Structures & Algorithms', 
      instructor: 'Dr. Emily Wilson',
      category: 'CS Core', 
      progress: 60,
      thumbnail: 'https://source.unsplash.com/random/300x200?algorithm',
      nextLesson: '2025-04-24T09:00:00Z',
      assignmentsDue: 0
    }
  ],
  assignments: [
    { 
      id: 1, 
      title: 'Neural Networks Project', 
      course: 'Advanced ML', 
      dueDate: '2025-04-28T23:59:00Z', 
      status: 'submitted',
      grade: 88,
      feedback: 'Excellent work on implementing the CNN architecture!'
    },
    { 
      id: 2, 
      title: 'React Portfolio', 
      course: 'Web Dev', 
      dueDate: '2025-05-05T23:59:00Z', 
      status: 'in-progress',
      grade: null,
      feedback: null
    },
    { 
      id: 3, 
      title: 'Sorting Algorithm Analysis', 
      course: 'Data Structures', 
      dueDate: '2025-05-10T23:59:00Z', 
      status: 'not-started',
      grade: null,
      feedback: null
    }
  ],
  messages: [
    { 
      id: 1, 
      sender: 'Dr. Sarah Johnson', 
      course: 'Advanced ML',
      content: 'Feedback on your Neural Networks project', 
      date: '2025-04-20T10:30:00Z', 
      read: false,
      important: true
    },
    { 
      id: 2, 
      sender: 'System Notification', 
      course: null,
      content: 'New grade posted for Web Dev assignment', 
      date: '2025-04-19T16:15:00Z', 
      read: true,
      important: false
    }
  ],
  activities: [
    { 
      id: 1, 
      action: 'Completed lesson: "Convolutional Networks"', 
      date: '2025-04-20T09:00:00Z',
      course: 'Advanced ML',
      type: 'lesson'
    },
    { 
      id: 2, 
      action: 'Submitted "React Portfolio" assignment', 
      date: '2025-04-19T14:00:00Z',
      course: 'Web Dev',
      type: 'assignment'
    },
    { 
      id: 3, 
      action: 'Started new module: "Trees and Graphs"', 
      date: '2025-04-18T11:30:00Z',
      course: 'Data Structures',
      type: 'module'
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
      title: 'Web Dev Live Coding', 
      date: '2025-04-23T10:00:00Z', 
      duration: 90,
      platform: 'Google Meet', 
      link: 'https://meet.google.com/abc-defg-hij',
      description: 'Building responsive layouts together'
    }
  ],
  grades: [
    { course: 'Advanced ML', assignment: 'Midterm Exam', grade: 92, average: 85 },
    { course: 'Advanced ML', assignment: 'Neural Networks Project', grade: 88, average: 82 },
    { course: 'Web Dev', assignment: 'HTML/CSS Assignment', grade: 95, average: 88 },
    { course: 'Web Dev', assignment: 'React Basics', grade: 84, average: 79 }
  ],
  feedbackHistory: [
    {
      id: 1,
      course: 'Database Systems',
      instructor: 'Prof. David Kim',
      date: '2025-03-15',
      rating: 4,
      comment: 'Great course content but assignments could be more clearly explained'
    },
    {
      id: 2,
      course: 'Software Engineering',
      instructor: 'Dr. Lisa Wong',
      date: '2025-02-28',
      rating: 5,
      comment: 'Excellent instructor and very engaging projects'
    }
  ]
};

// Feedback Form Component
// Feedback Form Component with null checks
const FeedbackForm = ({ open, onClose, type, target }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getTitle = () => {
    if (!type) return 'Submit Feedback';
    
    switch(type) {
      case 'course':
        return `Feedback for ${target?.title || 'this course'}`;
      case 'instructor':
        return `Feedback for ${target?.name || 'the instructor'}`;
      case 'lms':
        return 'General LMS Feedback';
      default:
        return 'Submit Feedback';
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Submitting feedback:', {
        type,
        target,
        rating,
        comment,
        anonymous
      });
      setLoading(false);
      setSuccess(true);
      onClose();
    }, 1500);
  };

  useEffect(() => {
    if (!open) {
      // Reset form when closed
      setRating(0);
      setComment('');
      setAnonymous(false);
      setSuccess(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{getTitle()}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>How would you rate your experience?</Typography>
          <Rating
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            precision={0.5}
            size="large"
            emptyIcon={<StarBorder fontSize="inherit" />}
          />
        </Box>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Your feedback"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          margin="normal"
          placeholder="What did you like? What could be improved?"
        />
        
        <FormControlLabel
          control={
            <Checkbox
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              color="primary"
            />
          }
          label="Submit anonymously"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={!rating || loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Submit Feedback
        </Button>
      </DialogActions>
      
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Thank you for your feedback!
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

// Student Overview Component
const StudentOverview = ({ student, metrics, activities }) => {
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
              <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" color="text.secondary">{metric.label}</Typography>
                  {metric.icon}
                </Box>
                <Typography variant="h4">{metric.value}</Typography>
                {metric.label === 'Average Grade' && (
                  <LinearProgress 
                    variant="determinate" 
                    value={metrics.averageGrade} 
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
            <Typography variant="h6" gutterBottom>Course Grades</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={gradeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
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
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            <List dense>
              {activities.map(activity => (
                <ListItem key={activity.id} sx={{ py: 1 }}>
                  <ListItemIcon>
                    {activity.type === 'lesson' ? <PlayCircle color="primary" /> : 
                     activity.type === 'assignment' ? <Assignment color="secondary" /> : 
                     <Book color="action" />}
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
      </Grid>
    </Box>
  );
};

// Course List Component with Feedback Option
const StudentCourseList = ({ courses }) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState(null);
  const [feedbackType, setFeedbackType] = useState('course');

// When opening course feedback
const handleFeedbackClick = (course, type) => {
  setFeedbackTarget(course || { title: 'this course' }); // Provide fallback
  setFeedbackType(type || 'course'); // Provide fallback
  setFeedbackOpen(true);
};

// When opening general LMS feedback
const handleGeneralFeedback = () => {
  setFeedbackTarget({ title: 'Learning Management System' });
  setFeedbackType('lms');
  setFeedbackOpen(true);
};

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">My Courses</Typography>
        <Button variant="outlined" startIcon={<Search />}>
          Find New Courses
        </Button>
      </Box>

      <Grid container spacing={3}>
        {courses.map(course => (
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
                <Typography variant="body2" color="text.secondary" paragraph>
                  Instructor: {course.instructor}
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <LinearProgress 
                    variant="determinate" 
                    value={course.progress} 
                    sx={{ width: '100%', mr: 2, height: 8 }} 
                  />
                  <Typography variant="body2">{course.progress}%</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">
                    {course.assignmentsDue} {course.assignmentsDue === 1 ? 'assignment' : 'assignments'} due
                  </Typography>
                  <Typography variant="body2">
                    Next: {format(new Date(course.nextLesson), 'MMM dd')}
                  </Typography>
                </Box>
              </CardContent>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  size="small" 
                  startIcon={<PlayCircle />}
                  href={`/course/${course.id}`}
                >
                  Continue
                </Button>
                <Button 
                  size="small" 
                  startIcon={<RateReview />}
                  onClick={() => handleFeedbackClick(course, 'course')}
                >
                  Feedback
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <FeedbackForm
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        type={feedbackType}
        target={feedbackTarget}
      />
    </Paper>
  );
};

// Assignments Component
const StudentAssignments = ({ assignments }) => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Assignments</Typography>
      
      <Tabs value={0} sx={{ mb: 3 }}>
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
          {assignments.map(assignment => (
            <TableRow key={assignment.id} hover>
              <TableCell>{assignment.title}</TableCell>
              <TableCell>{assignment.course}</TableCell>
              <TableCell>
                {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <Chip 
                  label={
                    assignment.status === 'submitted' ? 'Submitted' :
                    assignment.status === 'in-progress' ? 'In Progress' : 'Not Started'
                  } 
                  color={
                    assignment.status === 'submitted' ? 'success' :
                    assignment.status === 'in-progress' ? 'warning' : 'default'
                  } 
                  size="small" 
                />
              </TableCell>
              <TableCell>
                {assignment.grade ? `${assignment.grade}%` : '-'}
              </TableCell>
              <TableCell>
                <Button 
                  size="small"
                  onClick={() => setSelectedAssignment(assignment)}
                >
                  {assignment.status === 'submitted' ? 'View Feedback' : 'Start'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedAssignment && (
        <Dialog 
          open={!!selectedAssignment} 
          onClose={() => setSelectedAssignment(null)} 
          fullWidth 
          maxWidth="sm"
        >
          <DialogTitle>{selectedAssignment.title}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Course</Typography>
                <Typography>{selectedAssignment.course}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Due Date</Typography>
                <Typography>
                  {format(new Date(selectedAssignment.dueDate), 'MMMM dd, yyyy h:mm a')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Status</Typography>
                <Chip 
                  label={
                    selectedAssignment.status === 'submitted' ? 'Submitted' :
                    selectedAssignment.status === 'in-progress' ? 'In Progress' : 'Not Started'
                  } 
                  color={
                    selectedAssignment.status === 'submitted' ? 'success' :
                    selectedAssignment.status === 'in-progress' ? 'warning' : 'default'
                  } 
                  sx={{ mb: 2 }}
                />
              </Grid>
              {selectedAssignment.grade && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Grade & Feedback</Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="h6" sx={{ mr: 2 }}>
                        {selectedAssignment.grade}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={selectedAssignment.grade} 
                        sx={{ flexGrow: 1, height: 8 }} 
                      />
                    </Box>
                    <Typography>
                      {selectedAssignment.feedback || 'No additional feedback provided.'}
                    </Typography>
                  </Paper>
                </Grid>
              )}
              <Grid item xs={12}>
                <Button variant="contained" fullWidth startIcon={<Download />}>
                  Download Assignment Instructions
                </Button>
              </Grid>
              {selectedAssignment.status === 'submitted' && (
                <Grid item xs={12}>
                  <Button variant="outlined" fullWidth startIcon={<Download />}>
                    Download Your Submission
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

// Feedback History Component
const FeedbackHistory = ({ feedback }) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState(null);
  const [feedbackType, setFeedbackType] = useState('lms');

  const handleGeneralFeedback = () => {
    setFeedbackTarget({
      title: 'Learning Management System',
      name: 'LMS Team'
    });
    setFeedbackType('lms');
    setFeedbackOpen(true);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Your Feedback</Typography>
        <Button 
          variant="contained" 
          startIcon={<Feedback />}
          onClick={handleGeneralFeedback}
        >
          General LMS Feedback
        </Button>
      </Box>

      {feedback.length > 0 ? (
        <List>
          {feedback.map(item => (
            <Accordion key={item.id} elevation={0}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                  <Rating value={item.rating} precision={0.5} readOnly sx={{ mr: 2 }} />
                  <Typography sx={{ flexGrow: 1 }}>
                    {item.course} • {format(new Date(item.date), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography paragraph>{item.comment}</Typography>
                <Button size="small" startIcon={<Edit />}>
                  Edit Feedback
                </Button>
              </AccordionDetails>
            </Accordion>
          ))}
        </List>
      ) : (
        <Box textAlign="center" py={4}>
          <Feedback fontSize="large" color="action" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            You haven't submitted any feedback yet
          </Typography>
          <Typography color="text.secondary" paragraph>
            Your feedback helps improve the learning experience for everyone
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<RateReview />}
            onClick={handleGeneralFeedback}
          >
            Share Your Feedback
          </Button>
        </Box>
      )}

      <FeedbackForm
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        type={feedbackType}
        target={feedbackTarget}
      />
    </Paper>
  );
};

// Main Student Dashboard Component
const StudentDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [profileOpen, setProfileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const unreadCount = dummyData.messages.filter(msg => !msg.read).length;

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: <Dashboard /> },
    { id: 'courses', label: 'My Courses', icon: <School /> },
    { id: 'assignments', label: 'Assignments', icon: <Assignment /> },
    { id: 'messages', label: 'Messages', icon: <Message /> },
    { id: 'schedule', label: 'Schedule', icon: <Schedule /> },
    { id: 'feedback', label: 'Feedback', icon: <Feedback /> }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <StudentOverview
            student={dummyData.student}
            metrics={dummyData.metrics}
            activities={dummyData.activities}
          />
        );
      case 'courses':
        return <StudentCourseList courses={dummyData.enrolledCourses} />;
      case 'assignments':
        return <StudentAssignments assignments={dummyData.assignments} />;
      case 'messages':
        return (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>Messages</Typography>
            <Typography>Messages functionality would go here</Typography>
          </Paper>
        );
      case 'schedule':
        return (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>Schedule</Typography>
            <Typography>Calendar and schedule view would go here</Typography>
          </Paper>
        );
      case 'feedback':
        return <FeedbackHistory feedback={dummyData.feedbackHistory} />;
      default:
        return null;
    }
  };

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
              Student Dashboard
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
                <Avatar src={dummyData.student.avatar} sx={{ width: 32, height: 32 }} />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                color="inherit"
              >
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications />
                </Badge>
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
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItemMUI dense disabled>
            <Typography variant="subtitle1">Notifications</Typography>
          </MenuItemMUI>
          {dummyData.messages.slice(0, 3).map(msg => (
            <MenuItemMUI 
              key={msg.id} 
              onClick={() => {
                setActiveSection('messages');
                setAnchorEl(null);
              }}
              sx={{
                borderLeft: msg.important ? '3px solid' + theme.palette.error.main : 'none',
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
              setAnchorEl(null);
            }}
            sx={{ justifyContent: 'center' }}
          >
            <Typography color="primary">View All Notifications</Typography>
          </MenuItemMUI>
        </Menu>

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
        <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar 
                    src={dummyData.student.avatar} 
                    sx={{ width: 120, height: 120, mb: 2 }}
                  />
                  <Button variant="outlined" startIcon={<Upload />}>
                    Change Photo
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={dummyData.student.name}
                  margin="normal"
                  disabled
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={dummyData.student.email}
                  margin="normal"
                  disabled
                />
                <TextField
                  fullWidth
                  label="Department"
                  value={dummyData.student.department}
                  margin="normal"
                  disabled
                />
                <TextField
                  fullWidth
                  label="Bio"
                  multiline
                  rows={4}
                  value={dummyData.student.bio}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setProfileOpen(false)}>Cancel</Button>
            <Button variant="contained">Save Changes</Button>
          </DialogActions>
        </Dialog>

        {/* Floating Feedback Button */}
        <Fab
          color="primary"
          aria-label="feedback"
          sx={{ 
            position: 'fixed',
            bottom: 32,
            right: 32,
            display: { xs: 'none', md: 'flex' }
          }}
          onClick={() => {
            setFeedbackTarget({
              title: 'Learning Management System',
              name: 'LMS Team'
            });
            setFeedbackType('lms');
            setFeedbackOpen(true);
          }}
        >
          <Feedback />
        </Fab>
      </Box>
    </Box>
  );
};

export default StudentDashboard;