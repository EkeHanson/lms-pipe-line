import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Grid, Paper, TextField, Divider, Tabs, Tab, useTheme, Card,
  CardContent, LinearProgress, Chip, Avatar, List, ListItem, CircularProgress,
  ListItemAvatar, ListItemText, IconButton, Stack, useMediaQuery, ListItemSecondaryAction,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl,
  InputLabel, Snackbar, Alert, TextareaAutosize, Checkbox, FormControlLabel
} from '@mui/material';
import {
  Add, Search, FilterList, People,Download,Upload ,
  School, CheckCircle, TrendingUp, Warning,
  Star, Category, AccessTime, Menu as MenuIcon, 
  Assignment as AssignmentIcon, Quiz, Grading, Close
} from '@mui/icons-material';
import CourseList from './CourseList';
import CourseContentManagement from './CourseContentManagement';
import { useNavigate } from 'react-router-dom';
import { coursesAPI, assessmentAPI } from '../../../../config';
import { format } from 'date-fns';
import Papa from 'papaparse';

const CourseManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [courseStats, setCourseStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Assessment management state
  const [openAssessmentDialog, setOpenAssessmentDialog] = useState(false);
  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [currentCourseForAssessment, setCurrentCourseForAssessment] = useState(null);
  const [assessmentForm, setAssessmentForm] = useState({
    title: '',
    description: '',
    assessment_type: 'quiz',
    status: 'draft',
    passing_score: 70,
    max_attempts: 1,
    time_limit: 30,
    shuffle_questions: false,
    show_correct_answers: false,
    due_date: '',
    course: null,
    questions: [],
    rubric: []
  });
  const [bulkFile, setBulkFile] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);

  const assessmentTypes = ['quiz', 'assignment', 'peer_assessment', 'certification_exam'];
  const statusOptions = ['draft', 'published', 'active', 'inactive'];

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [statsRes, coursesRes, assessmentsRes] = await Promise.all([
          fetchCourseStats(),
          coursesAPI.getCourses(),
          assessmentAPI.getAssessments()
        ]);

        setCourseStats(statsRes);
        setCourses(coursesRes.data.results);
        setAssessments(assessmentsRes.data.results);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchCourseStats = async () => {
    try {
      const [coursesRes, enrollmentsRes, mostPopularRes, leastPopularRes, categoriesRes] = await Promise.all([
        coursesAPI.getCourses(),
        coursesAPI.getAllEnrollments(),
        coursesAPI.getMostPopularCourse(),
        coursesAPI.getLeastPopularCourse(),
        coursesAPI.getCategories()
      ]);

      const totalCourses = coursesRes.data.count;
      const totalEnrollments = enrollmentsRes.data.count;

      const mostPopularCourse = mostPopularRes.data ? {
        id: mostPopularRes.data.id,
        title: mostPopularRes.data.title,
        enrollments: mostPopularRes.data.enrollment_count || 0,
        instructor: mostPopularRes.data.instructor || "No instructor assigned"
      } : {
        title: "No courses available",
        enrollments: 0,
        instructor: "No instructor assigned"
      };

      const leastPopularCourse = leastPopularRes.data ? {
        id: leastPopularRes.data.id,
        title: leastPopularRes.data.title,
        enrollments: leastPopularRes.data.enrollment_count || 0,
        instructor: leastPopularRes.data.instructor || "No instructor assigned"
      } : {
        title: "No courses available",
        enrollments: 0,
        instructor: "No instructor assigned"
      };

      const completedCourses = enrollmentsRes.data.results.filter(e => e.completed).length;
      const averageCompletionRate = totalEnrollments > 0 
        ? Math.round((completedCourses / totalEnrollments) * 100) 
        : 0;

      const categories = categoriesRes.data.results.map(cat => ({
        name: cat.name,
        count: cat.course_count || 0
      }));

      return {
        totalCourses,
        totalEnrollments,
        mostPopularCourse,
        leastPopularCourse,
        completedCourses,
        ongoingCourses: totalEnrollments - completedCourses,
        averageCompletionRate,
        categories,
        noEnrollmentCourses: 0,
        recentCourses: [],
        averageRating: 0,
        attentionNeeded: []
      };
    } catch (err) {
      throw err;
    }
  };

  const handleOpenAssessmentDialog = (course = null) => {
    setCurrentCourseForAssessment(course);
    setAssessmentForm({
      ...assessmentForm,
      course: course?.id || null,
      questions: [],
      rubric: []
    });
    setOpenAssessmentDialog(true);
  };

  const handleCloseAssessmentDialog = () => {
    setOpenAssessmentDialog(false);
    setCurrentCourseForAssessment(null);
  };

  const handleAssessmentFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAssessmentForm({
      ...assessmentForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const addQuestionRow = () => {
    const newQuestion = { 
      type: 'mcq', 
      text: '', 
      options: ['', '', '', ''], 
      correctAnswer: '',
      points: 1
    };
    setAssessmentForm({
      ...assessmentForm,
      questions: [...assessmentForm.questions, newQuestion]
    });
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...assessmentForm.questions];
    updatedQuestions[index][field] = value;
    setAssessmentForm({
      ...assessmentForm,
      questions: updatedQuestions
    });
  };

  const updateQuestionOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...assessmentForm.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setAssessmentForm({
      ...assessmentForm,
      questions: updatedQuestions
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...assessmentForm.questions];
    updatedQuestions.splice(index, 1);
    setAssessmentForm({
      ...assessmentForm,
      questions: updatedQuestions
    });
  };

  const addRubricRow = () => {
    setAssessmentForm({
      ...assessmentForm,
      rubric: [...assessmentForm.rubric, { criterion: '', weight: 0 }]
    });
  };

  const updateRubric = (index, field, value) => {
    const updatedRubric = [...assessmentForm.rubric];
    updatedRubric[index][field] = value;
    setAssessmentForm({
      ...assessmentForm,
      rubric: updatedRubric
    });
  };

  const removeRubric = (index) => {
    const updatedRubric = [...assessmentForm.rubric];
    updatedRubric.splice(index, 1);
    setAssessmentForm({
      ...assessmentForm,
      rubric: updatedRubric
    });
  };

  const handleCreateAssessment = async () => {
    try {
      if (!assessmentForm.title || !assessmentForm.course) {
        throw new Error('Title and course selection are required');
      }

      if (assessmentForm.assessment_type === 'quiz' && assessmentForm.questions.length === 0) {
        throw new Error('Quizzes must have at least one question');
      }

      // Prepare the data for API
      const assessmentData = {
        title: assessmentForm.title,
        description: assessmentForm.description,
        assessment_type: assessmentForm.assessment_type,
        status: assessmentForm.status,
        passing_score: assessmentForm.passing_score,
        max_attempts: assessmentForm.max_attempts,
        time_limit: assessmentForm.time_limit,
        shuffle_questions: assessmentForm.shuffle_questions,
        show_correct_answers: assessmentForm.show_correct_answers,
        due_date: assessmentForm.due_date || null,
        course: assessmentForm.course,
        questions: assessmentForm.questions,
        rubric: assessmentForm.rubric
      };

      const response = await assessmentAPI.createAssessment(assessmentData);

      setAssessments([response.data, ...assessments]);
      setSnackbar({
        open: true,
        message: 'Assessment created successfully!',
        severity: 'success'
      });
      handleCloseAssessmentDialog();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message || 'Failed to create assessment',
        severity: 'error'
      });
    }
  };

  const handleBulkUpload = () => {
    if (!bulkFile) {
      setSnackbar({ open: true, message: 'Please select a file', severity: 'error' });
      return;
    }
    
    Papa.parse(bulkFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        try {
          const createdAssessments = [];
          
          for (const row of result.data) {
            try {
              const questions = row.questions ? JSON.parse(row.questions) : [];
              const rubric = row.rubric ? JSON.parse(row.rubric) : [];
              
              const assessmentData = {
                title: row.title || 'Untitled Assessment',
                description: row.description || '',
                assessment_type: row.assessment_type || 'quiz',
                status: statusOptions.includes(row.status) ? row.status : 'draft',
                passing_score: row.passing_score ? parseInt(row.passing_score) : 70,
                max_attempts: row.max_attempts ? parseInt(row.max_attempts) : 1,
                time_limit: row.time_limit ? parseInt(row.time_limit) : null,
                shuffle_questions: row.shuffle_questions === 'true',
                show_correct_answers: row.show_correct_answers === 'true',
                due_date: row.due_date || null,
                course: row.course_id || assessmentForm.course,
                questions,
                rubric
              };

              const response = await assessmentAPI.createAssessment(assessmentData);
              createdAssessments.push(response.data);
            } catch (error) {
              console.error('Error creating assessment from row:', row, error);
            }
          }

          setAssessments([...createdAssessments, ...assessments]);
          setOpenBulkDialog(false);
          setBulkFile(null);
          setSnackbar({
            open: true,
            message: `Successfully created ${createdAssessments.length} assessments`,
            severity: 'success'
          });
        } catch (error) {
          setSnackbar({
            open: true,
            message: 'Error processing bulk upload',
            severity: 'error'
          });
        }
      },
      error: () => {
        setSnackbar({
          open: true,
          message: 'Error parsing CSV file',
          severity: 'error'
        });
      }
    });
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        title: 'Sample Quiz',
        description: 'A sample quiz assessment',
        assessment_type: 'quiz',
        status: 'draft',
        passing_score: 70,
        max_attempts: 1,
        time_limit: 30,
        shuffle_questions: 'true',
        show_correct_answers: 'false',
        due_date: '2025-06-15T23:59:00',
        course_id: currentCourseForAssessment?.id || '',
        questions: JSON.stringify([
          { 
            type: 'mcq', 
            text: 'What is 2+2?', 
            options: ['2', '3', '4', '5'], 
            correctAnswer: '4',
            points: 1
          }
        ]),
        rubric: JSON.stringify([])
      },
      {
        title: 'Sample Assignment',
        description: 'A sample assignment with rubric',
        assessment_type: 'assignment',
        status: 'draft',
        passing_score: 70,
        max_attempts: 1,
        time_limit: '',
        shuffle_questions: 'false',
        show_correct_answers: 'false',
        due_date: '2025-07-10T23:59:00',
        course_id: currentCourseForAssessment?.id || '',
        questions: JSON.stringify([]),
        rubric: JSON.stringify([
          { criterion: 'Code Quality', weight: 50 },
          { criterion: 'Functionality', weight: 50 }
        ])
      }
    ];
    
    const csv = Papa.unparse(templateData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'assessment_template.csv';
    link.click();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const StatCard = ({ icon, title, value, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction={isMobile ? "column" : "row"} alignItems="center" spacing={2}>
          <Avatar sx={{
            bgcolor: `${color}.light`,
            color: `${color}.dark`,
            ...(isMobile && { mb: 1 })
          }}>
            {icon}
          </Avatar>
          <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
            <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
            <Typography variant={isMobile ? "h6" : "h5"}>
              {loading ? 'Loading...' : value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  const handleAddCourse = () => {
    navigate('/admin/courses/new');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const renderOverview = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
          <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>
            Retry
          </Button>
        </Box>
      );
    }

    if (!courseStats) {
      return null;
    }

    return (
      <>
        {/* Quick Stats Section */}
        <Grid container spacing={isMobile ? 1 : 3} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={6} md={6} lg={3}>
            <StatCard
              icon={<School />}
              title="Total Courses"
              value={courseStats.totalCourses}
              color="primary"
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={3}>
            <StatCard
              icon={<People />}
              title="Enrollments"
              value={courseStats.totalEnrollments}
              color="secondary"
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={3}>
            <StatCard
              icon={<CheckCircle />}
              title="Completed"
              value={courseStats.completedCourses}
              color="success"
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={3}>
            <StatCard
              icon={<TrendingUp />}
              title="Completion %"
              value={`${courseStats.averageCompletionRate}%`}
              color="info"
            />
          </Grid>
        </Grid>

        {/* Detailed Stats Section */}
        <Grid container spacing={isMobile ? 1 : 3} sx={{ mb: 3 }}>
          {/* Most Popular Course */}
          {courseStats.mostPopularCourse && (
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }} onClick={() => navigate(`/admin/course-details/${courseStats.mostPopularCourse.id}`)}>
                <CardContent>
                  <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Star color="warning" sx={{ mr: 1 }} /> Most Popular
                  </Typography>
                  <Typography variant={isMobile ? "h6" : "h5"}>
                    {courseStats.mostPopularCourse?.title || 'No popular course'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Instructor: {courseStats.mostPopularCourse?.instructor || 'Unknown'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <People color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {courseStats.mostPopularCourse?.enrollments ?? 0} enrollments
                    </Typography>
                  </Box>
                  <Button 
                    variant="outlined" 
                    startIcon={<Quiz />} 
                    sx={{ mt: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenAssessmentDialog(courseStats.mostPopularCourse);
                    }}
                  >
                    Add Assessment
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Least Popular Course */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }} onClick={() => navigate(`/admin/course-details/${courseStats.leastPopularCourse.id}`)}>
              <CardContent>
                <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Warning color="error" sx={{ mr: 1 }} /> Least Popular
                </Typography>
                <Typography variant={isMobile ? "h6" : "h5"}>{courseStats.leastPopularCourse.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Instructor: {courseStats.leastPopularCourse.instructor}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <People color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">{courseStats.leastPopularCourse.enrollments} enrollments</Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  startIcon={<Quiz />} 
                  sx={{ mt: 2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenAssessmentDialog(courseStats.leastPopularCourse);
                  }}
                >
                  Add Assessment
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Categories Distribution */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Category sx={{ mr: 1, color: 'purple' }} /> Categories
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {courseStats.categories.map((category) => (
                    <Box key={category.name} sx={{ mb: 1 }}>
                      <Typography variant="body2">{category.name} ({category.count})</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(category.count / courseStats.totalCourses) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Assessments */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Grading sx={{ mr: 1, color: 'blue' }} /> Recent Assessments
                </Typography>
                  <List dense>
                    {assessments.map((assessment) => {
                      const course = courses.find(c => c.id === assessment.course);
                      return (
                        <ListItem key={assessment.id} button onClick={() => navigate(`/admin/assessments/${assessment.id}`)}>
                          <ListItemAvatar>
                            <Avatar sx={{
                              bgcolor: assessment.status === 'active' ? 'success.light' : 
                                      assessment.status === 'published' ? 'warning.light' : 'secondary.light'
                            }}>
                              {assessment.assessment_type === 'quiz' ? <Quiz /> : 
                              assessment.assessment_type === 'assignment' ? <AssignmentIcon /> : 
                              assessment.assessment_type === 'exam' ? <School /> : <Grading />}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={assessment.title}
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.primary">
                                  {course?.title || 'No course'}
                                </Typography>
                                {` — ${assessment.assessment_type} (${assessment.status})`}
                              </>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => navigate(`/admin/assessments/${assessment.id}`)}>
                              <MenuIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                    {assessments.length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                        No assessments found
                      </Typography>
                    )}
                  </List>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    startIcon={<Add />}
                    onClick={() => handleOpenAssessmentDialog()}
                    sx={{ mt: 1 }}
                  >
                    Create Assessment
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<Upload />}
                    onClick={() => setOpenBulkDialog(true)}
                    sx={{ mt: 1 }}
                  >
                    Bulk Upload
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Courses List Section */}
        <Paper sx={{ mb: 3 }}>
          <Divider />
          <CourseList isMobile={isMobile} onAddAssessment={handleOpenAssessmentDialog} />
        </Paper>
      </>
    );
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Box sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        mb: 3,
        gap: isMobile ? 2 : 0
      }}>
        <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }}>
          Course Management
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<Quiz />}
            onClick={() => handleOpenAssessmentDialog()}
            fullWidth={isMobile}
            size={isMobile ? "small" : "medium"}
            sx={{ mr: 1 }}
          >
            {isMobile ? 'New Assessment' : 'Create Assessment'}
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddCourse}
            fullWidth={isMobile}
            size={isMobile ? "small" : "medium"}
          >
            {isMobile ? 'New Course' : 'Add New Course'}
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Overview" icon={<School />} iconPosition="start" />
          <Tab label="Content Management" icon={<AssignmentIcon />} iconPosition="start" />
        </Tabs>
        <Divider />
        <Box sx={{ p: isMobile ? 1 : 3 }}>
          {activeTab === 0 && renderOverview()}
          {activeTab === 1 && <CourseContentManagement />}
        </Box>
      </Paper>

      {/* Assessment Creation Dialog */}
      <Dialog 
        open={openAssessmentDialog} 
        onClose={handleCloseAssessmentDialog} 
        fullWidth 
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle>
          {currentCourseForAssessment 
            ? `Create Assessment for ${currentCourseForAssessment.title}`
            : 'Create New Assessment'}
          <IconButton
            aria-label="close"
            onClick={handleCloseAssessmentDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Assessment Title"
                name="title"
                value={assessmentForm.title}
                onChange={handleAssessmentFormChange}
                margin="normal"
                required
              />
              
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Assessment Type</InputLabel>
                <Select
                  name="assessment_type"
                  value={assessmentForm.assessment_type}
                  onChange={(e) => {
                    handleAssessmentFormChange(e);
                    // Reset questions and rubric when type changes
                    setAssessmentForm(prev => ({
                      ...prev,
                      assessment_type: e.target.value,
                      questions: [],
                      rubric: []
                    }));
                  }}
                  label="Assessment Type"
                >
                  {assessmentTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={assessmentForm.status}
                  onChange={handleAssessmentFormChange}
                  label="Status"
                >
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {!currentCourseForAssessment && (
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Course</InputLabel>
                  <Select
                    name="course"
                    value={assessmentForm.course}
                    onChange={handleAssessmentFormChange}
                    label="Course"
                  >
                    {courses.map(course => (
                      <MenuItem key={course.id} value={course.id}>{course.title}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <TextField
                fullWidth
                label="Passing Score (%)"
                name="passing_score"
                type="number"
                value={assessmentForm.passing_score}
                onChange={handleAssessmentFormChange}
                margin="normal"
                inputProps={{ min: 0, max: 100 }}
              />

              <TextField
                fullWidth
                label="Max Attempts"
                name="max_attempts"
                type="number"
                value={assessmentForm.max_attempts}
                onChange={handleAssessmentFormChange}
                margin="normal"
                inputProps={{ min: 1 }}
              />

              <TextField
                fullWidth
                label="Time Limit (minutes)"
                name="time_limit"
                type="number"
                value={assessmentForm.time_limit}
                onChange={handleAssessmentFormChange}
                margin="normal"
                inputProps={{ min: 1 }}
                disabled={assessmentForm.assessment_type !== 'quiz'}
              />

              <TextField
                fullWidth
                label="Due Date"
                name="due_date"
                type="datetime-local"
                value={assessmentForm.due_date}
                onChange={handleAssessmentFormChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="shuffle_questions"
                    checked={assessmentForm.shuffle_questions}
                    onChange={handleAssessmentFormChange}
                  />
                }
                label="Shuffle Questions"
                sx={{ mt: 1 }}
                disabled={assessmentForm.assessment_type !== 'quiz'}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="show_correct_answers"
                    checked={assessmentForm.show_correct_answers}
                    onChange={handleAssessmentFormChange}
                  />
                }
                label="Show Correct Answers After Submission"
                disabled={assessmentForm.assessment_type !== 'quiz'}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={assessmentForm.description}
                onChange={handleAssessmentFormChange}
                margin="normal"
                multiline
                rows={4}
              />

              {/* Questions Section (for quizzes) */}
              {assessmentForm.assessment_type === 'quiz' && (
                <>
                  <Typography variant="h6" mt={2}>Questions</Typography>
                  {assessmentForm.questions.map((question, index) => (
                    <Box key={index} sx={{ 
                      mb: 2, 
                      p: 2, 
                      border: '1px solid #ddd', 
                      borderRadius: 1,
                      position: 'relative'
                    }}>
                      <IconButton
                        size="small"
                        onClick={() => removeQuestion(index)}
                        sx={{
                          position: 'absolute',
                          right: 8,
                          top: 8,
                          color: theme.palette.error.main
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                      
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Question Type</InputLabel>
                        <Select
                          value={question.type}
                          onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                          label="Question Type"
                        >
                          <MenuItem value="mcq">Multiple Choice</MenuItem>
                          <MenuItem value="true_false">True/False</MenuItem>
                          <MenuItem value="short_answer">Short Answer</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        fullWidth
                        label="Question Text"
                        value={question.text}
                        onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                        margin="normal"
                      />

                      <TextField
                        fullWidth
                        label="Points"
                        type="number"
                        value={question.points}
                        onChange={(e) => updateQuestion(index, 'points', parseInt(e.target.value) || 1)}
                        margin="normal"
                        inputProps={{ min: 1 }}
                      />

                      {question.type === 'mcq' && (
                        <>
                          {question.options.map((option, optIndex) => (
                            <TextField
                              key={optIndex}
                              fullWidth
                              label={`Option ${optIndex + 1}`}
                              value={option}
                              onChange={(e) => updateQuestionOption(index, optIndex, e.target.value)}
                              margin="normal"
                            />
                          ))}
                          <FormControl fullWidth margin="normal">
                            <InputLabel>Correct Answer</InputLabel>
                            <Select
                              value={question.correctAnswer}
                              onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                              label="Correct Answer"
                            >
                              {question.options.map((option, optIndex) => (
                                <MenuItem key={optIndex} value={option}>
                                  Option {optIndex + 1}: {option || '[empty]'}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </>
                      )}

                      {question.type === 'true_false' && (
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Correct Answer</InputLabel>
                          <Select
                            value={question.correctAnswer}
                            onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                            label="Correct Answer"
                          >
                            <MenuItem value="true">True</MenuItem>
                            <MenuItem value="false">False</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    </Box>
                  ))}
                  <Button 
                    onClick={addQuestionRow} 
                    startIcon={<Add />}
                    variant="outlined"
                  >
                    Add Question
                  </Button>
                </>
              )}

              {/* Rubric Section (for non-quiz assessments) */}
              {assessmentForm.assessment_type !== 'quiz' && (
                <>
                  <Typography variant="h6" mt={2}>Rubric</Typography>
                  {assessmentForm.rubric.map((item, index) => (
                    <Box key={index} sx={{ 
                      mb: 2, 
                      p: 2, 
                      border: '1px solid #ddd', 
                      borderRadius: 1,
                      position: 'relative'
                    }}>
                      <IconButton
                        size="small"
                        onClick={() => removeRubric(index)}
                        sx={{
                          position: 'absolute',
                          right: 8,
                          top: 8,
                          color: theme.palette.error.main
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                      
                      <TextField
                        fullWidth
                        label="Criterion"
                        value={item.criterion}
                        onChange={(e) => updateRubric(index, 'criterion', e.target.value)}
                        margin="normal"
                      />
                      
                      <TextField
                        fullWidth
                        label="Weight (%)"
                        type="number"
                        value={item.weight}
                        onChange={(e) => updateRubric(index, 'weight', parseInt(e.target.value) || 0)}
                        margin="normal"
                        inputProps={{ min: 0, max: 100 }}
                      />
                    </Box>
                  ))}
                  <Button 
                    onClick={addRubricRow} 
                    startIcon={<Add />}
                    variant="outlined"
                  >
                    Add Rubric Criterion
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssessmentDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateAssessment}
            disabled={!assessmentForm.title || !assessmentForm.course || 
              (assessmentForm.assessment_type === 'quiz' && assessmentForm.questions.length === 0)}
          >
            Create Assessment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog open={openBulkDialog} onClose={() => setOpenBulkDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Bulk Upload Assessments</DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={2}>
            Upload a CSV file with assessment data. The file should include columns for:
          </Typography>
          <Typography variant="body2" component="div" sx={{ mb: 2 }}>
            <ul>
              <li>title (required)</li>
              <li>description</li>
              <li>assessment_type (quiz, assignment, peer_assessment, certification_exam)</li>
              <li>status (draft, published, active)</li>
              <li>passing_score (number)</li>
              <li>max_attempts (number)</li>
              <li>time_limit (number, minutes - for quizzes only)</li>
              <li>shuffle_questions (true/false - for quizzes only)</li>
              <li>show_correct_answers (true/false - for quizzes only)</li>
              <li>due_date (YYYY-MM-DDTHH:MM:SS)</li>
              <li>course_id (required unless creating for a specific course)</li>
              <li>questions (JSON string - for quizzes)</li>
              <li>rubric (JSON string - for non-quiz assessments)</li>
            </ul>
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={downloadTemplate}
            sx={{ mb: 2 }}
          >
            Download Template
          </Button>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setBulkFile(e.target.files[0])}
            style={{ marginBottom: '16px', display: 'block' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleBulkUpload}
            disabled={!bulkFile}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseManagement;