import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Grid, Paper, TextField, Divider, Tabs, Tab, useTheme, Card,
  CardContent, LinearProgress, Chip, Avatar, List, ListItem, CircularProgress,
  ListItemAvatar, ListItemText, IconButton, Stack, useMediaQuery, ListItemSecondaryAction,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl,
  InputLabel, Snackbar, Alert, TextareaAutosize, Checkbox, FormControlLabel,
  Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Add, Search, FilterList, People,
  School, CheckCircle, TrendingUp, Warning,
  Star, Category, AccessTime, Menu as MenuIcon, 
  Assignment as AssignmentIcon, Quiz, Grading, Close,
  Edit, Delete, Download, Upload
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
  const [openSubmissionsDialog, setOpenSubmissionsDialog] = useState(false);
  const [currentCourseForAssessment, setCurrentCourseForAssessment] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
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
  const [editAssessment, setEditAssessment] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [assessmentTabValue, setAssessmentTabValue] = useState(0);

  const assessmentTypes = ['quiz', 'assignment', 'peer_assessment', 'certification_exam'];
  const statusOptions = ['draft', 'published', 'active', 'inactive'];

  // Filter assessments based on tab selection
  const filteredAssessments = assessments.filter(assessment => {
    if (assessmentTabValue === 0) return assessment.status === 'active';
    if (assessmentTabValue === 1) return assessment.status === 'published' && new Date(assessment.due_date) > new Date();
    if (assessmentTabValue === 2) return assessment.status === 'inactive';
    if (assessmentTabValue === 3) return assessment.status === 'draft';
    return true;
  });

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

  const handleOpenAssessmentDialog = (course = null, assessment = null) => {
    setCurrentCourseForAssessment(course);
    if (assessment) {
      setEditAssessment(assessment);
      setAssessmentForm({
        title: assessment.title,
        description: assessment.description,
        assessment_type: assessment.assessment_type,
        status: assessment.status,
        passing_score: assessment.passing_score,
        max_attempts: assessment.max_attempts,
        time_limit: assessment.time_limit,
        shuffle_questions: assessment.shuffle_questions,
        show_correct_answers: assessment.show_correct_answers,
        due_date: assessment.due_date,
        course: assessment.course,
        questions: assessment.questions || [],
        rubric: assessment.rubric || []
      });
    } else {
      setAssessmentForm({
        ...assessmentForm,
        course: course?.id || null
      });
    }
    setOpenAssessmentDialog(true);
  };

  const handleCloseAssessmentDialog = () => {
    setOpenAssessmentDialog(false);
    setCurrentCourseForAssessment(null);
    setEditAssessment(null);
    setAssessmentForm({
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
  };

  const handleAssessmentFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAssessmentForm({
      ...assessmentForm,
      [name]: type === 'checkbox' ? checked : value
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

      const response = editAssessment 
        ? await assessmentAPI.updateAssessment(editAssessment.id, assessmentForm)
        : await assessmentAPI.createAssessment(assessmentForm);

      if (editAssessment) {
        setAssessments(assessments.map(a => a.id === editAssessment.id ? response.data : a));
      } else {
        setAssessments([response.data, ...assessments]);
      }

      setSnackbar({
        open: true,
        message: `Assessment ${editAssessment ? 'updated' : 'created'} successfully!`,
        severity: 'success'
      });
      handleCloseAssessmentDialog();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message || `Failed to ${editAssessment ? 'update' : 'create'} assessment`,
        severity: 'error'
      });
    }
  };

  const handleDeleteAssessment = async (id) => {
    try {
      await assessmentAPI.deleteAssessment(id);
      setAssessments(assessments.filter(a => a.id !== id));
      setSnackbar({
        open: true,
        message: 'Assessment deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message || 'Failed to delete assessment',
        severity: 'error'
      });
    }
  };

  const handleViewSubmissions = (assessment) => {
    if (assessment.status === 'draft') {
      setSnackbar({
        open: true,
        message: 'Cannot grade draft assessments',
        severity: 'warning'
      });
      return;
    }
    setSelectedAssessment(assessment);
    setOpenSubmissionsDialog(true);
  };

  const handleGrade = async (isAutoGraded = false) => {
    try {
      if (isAutoGraded) {
        const response = await assessmentAPI.autoGradeSubmission(selectedAssessment.id, selectedAssessment.submissions[0].id);
        setSnackbar({
          open: true,
          message: 'Quiz auto-graded successfully',
          severity: 'success'
        });
      } else {
        if (!grade) {
          throw new Error('Score is required for grading');
        }
        
        await assessmentAPI.gradeSubmission(
          selectedAssessment.id,
          selectedAssessment.submissions[0].id,
          { score: grade, feedback }
        );
        
        setSnackbar({
          open: true,
          message: 'Grade submitted successfully',
          severity: 'success'
        });
        setGrade('');
        setFeedback('');
      }
      
      // Refresh assessment data
      const updatedAssessment = await assessmentAPI.getAssessment(selectedAssessment.id);
      setSelectedAssessment(updatedAssessment.data);
      setAssessments(assessments.map(a => a.id === selectedAssessment.id ? updatedAssessment.data : a));
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message || 'Failed to grade submission',
        severity: 'error'
      });
    }
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

  const addRubricRow = () => {
    setAssessmentForm({
      ...assessmentForm,
      rubric: [...assessmentForm.rubric, { criterion: '', weight: 0 }]
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...assessmentForm.questions];
    updatedQuestions[index][field] = value;
    setAssessmentForm({
      ...assessmentForm,
      questions: updatedQuestions
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...assessmentForm.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setAssessmentForm({
      ...assessmentForm,
      questions: updatedQuestions
    });
  };

  const handleCorrectAnswerChange = (questionIndex, value) => {
    const updatedQuestions = [...assessmentForm.questions];
    updatedQuestions[questionIndex].correctAnswer = value;
    setAssessmentForm({
      ...assessmentForm,
      questions: updatedQuestions
    });
  };

  const handleRubricChange = (index, field, value) => {
    const updatedRubric = [...assessmentForm.rubric];
    updatedRubric[index][field] = field === 'weight' ? parseInt(value) || 0 : value;
    setAssessmentForm({
      ...assessmentForm,
      rubric: updatedRubric
    });
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) {
      setSnackbar({
        open: true,
        message: 'Please select a file',
        severity: 'error'
      });
      return;
    }

    try {
      Papa.parse(bulkFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (result) => {
          const newAssessments = [];
          for (const row of result.data) {
            try {
              const questions = row.questions ? JSON.parse(row.questions) : [];
              const rubric = row.rubric ? JSON.parse(row.rubric) : [];
              const status = statusOptions.includes(row.status) ? row.status : 'draft';
              
              const assessmentData = {
                title: row.title || 'Untitled',
                course: row.course || null,
                assessment_type: row.assessment_type || 'quiz',
                due_date: row.due_date || new Date().toISOString(),
                time_limit: row.time_limit ? parseInt(row.time_limit, 10) : null,
                status,
                questions,
                rubric
              };

              const response = await assessmentAPI.createAssessment(assessmentData);
              newAssessments.push(response.data);
            } catch (err) {
              console.error('Error creating assessment from row:', row, err);
            }
          }

          setAssessments([...newAssessments, ...assessments]);
          setOpenBulkDialog(false);
          setBulkFile(null);
          setSnackbar({
            open: true,
            message: `${newAssessments.length} assessments created from file`,
            severity: 'success'
          });
        },
        error: (error) => {
          throw new Error(`Error parsing file: ${error.message}`);
        }
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Error processing bulk upload',
        severity: 'error'
      });
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        title: 'Sample Quiz',
        course: '1', // Course ID
        assessment_type: 'quiz',
        due_date: '2025-06-15T23:59:00',
        time_limit: 60,
        status: 'active',
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
        course: '1', // Course ID
        assessment_type: 'assignment',
        due_date: '2025-07-10T23:59:00',
        time_limit: '',
        status: 'published',
        questions: JSON.stringify([]),
        rubric: JSON.stringify([
          { criterion: 'Code Quality', weight: 60 },
          { criterion: 'Functionality', weight: 40 }
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderAssessmentManagement = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Assessments</Typography>
        <Box display="flex" gap={2}>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={() => handleOpenAssessmentDialog()}
          >
            Create Assessment
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Upload />} 
            onClick={() => setOpenBulkDialog(true)}
          >
            Bulk Upload
          </Button>
        </Box>
      </Box>

      <Tabs 
        value={assessmentTabValue} 
        onChange={(e, newValue) => setAssessmentTabValue(newValue)} 
        sx={{ mb: 3 }}
      >
        <Tab label="Active" />
        <Tab label="Upcoming" />
        <Tab label="Completed" />
        <Tab label="Draft" />
      </Tabs>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Course</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Submissions</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAssessments.map(assessment => {
            const course = courses.find(c => c.id === assessment.course);
            return (
              <TableRow key={assessment.id} hover>
                <TableCell>{assessment.title}</TableCell>
                <TableCell>{assessment.assessment_type}</TableCell>
                <TableCell>{course?.title || 'No course'}</TableCell>
                <TableCell>
                  {assessment.due_date ? format(new Date(assessment.due_date), 'MMM dd, yyyy') : 'No due date'}
                </TableCell>
                <TableCell>
                  {assessment.submissions_count || 0} / {assessment.graded_count || 0} graded
                </TableCell>
                <TableCell>
                  <Chip
                    label={assessment.status}
                    color={
                      assessment.status === 'active' ? 'primary' :
                      assessment.status === 'published' ? 'warning' :
                      assessment.status === 'inactive' ? 'default' :
                      'secondary'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<Grading />}
                    onClick={() => handleViewSubmissions(assessment)}
                    disabled={assessment.status === 'draft'}
                  >
                    Grade
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() => {
                      const course = courses.find(c => c.id === assessment.course);
                      handleOpenAssessmentDialog(course, assessment);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteAssessment(assessment.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
          {filteredAssessments.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No assessments found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );

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

        {renderAssessmentManagement()}

        {/* Courses List Section */}
        <Paper sx={{ mb: 3, mt: 3 }}>
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
            onClick={() => navigate('/admin/courses/new')}
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

      {/* Assessment Creation/Edit Dialog */}
      <Dialog open={openAssessmentDialog} onClose={handleCloseAssessmentDialog} fullWidth maxWidth="md">
        <DialogTitle>
          {editAssessment ? 'Edit Assessment' : 'Create New Assessment'}
          {currentCourseForAssessment && ` for ${currentCourseForAssessment.title}`}
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
                  onChange={handleAssessmentFormChange}
                  label="Assessment Type"
                >
                  {assessmentTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Time Limit (minutes)"
                name="time_limit"
                type="number"
                value={assessmentForm.time_limit}
                onChange={handleAssessmentFormChange}
                margin="normal"
                inputProps={{ min: 1 }}
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
                sx={{ mt: 2 }}
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
              />

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
            </Grid>

            {/* Questions Section */}
            {assessmentForm.assessment_type === 'quiz' && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Questions
                  <Button 
                    size="small" 
                    startIcon={<Add />} 
                    onClick={addQuestionRow}
                    sx={{ ml: 2 }}
                  >
                    Add Question
                  </Button>
                </Typography>
                
                {assessmentForm.questions.map((question, qIndex) => (
                  <Paper key={qIndex} elevation={2} sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Question Type</InputLabel>
                          <Select
                            value={question.type}
                            onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                            label="Question Type"
                          >
                            <MenuItem value="mcq">Multiple Choice</MenuItem>
                            <MenuItem value="true_false">True/False</MenuItem>
                            <MenuItem value="short_answer">Short Answer</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Question Text"
                          value={question.text}
                          onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                          margin="normal"
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Points"
                          type="number"
                          value={question.points}
                          onChange={(e) => handleQuestionChange(qIndex, 'points', parseInt(e.target.value) || 0)}
                          margin="normal"
                          inputProps={{ min: 1 }}
                        />
                      </Grid>

                      {question.type === 'mcq' && (
                        <>
                          {question.options.map((option, oIndex) => (
                            <Grid item xs={12} sm={6} key={oIndex}>
                              <TextField
                                fullWidth
                                label={`Option ${oIndex + 1}`}
                                value={option}
                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                margin="normal"
                              />
                            </Grid>
                          ))}
                          <Grid item xs={12}>
                            <FormControl fullWidth margin="normal">
                              <InputLabel>Correct Answer</InputLabel>
                              <Select
                                value={question.correctAnswer}
                                onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                                label="Correct Answer"
                              >
                                {question.options.map((option, oIndex) => (
                                  <MenuItem key={oIndex} value={option}>
                                    {option || `Option ${oIndex + 1}`}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </>
                      )}

                      {question.type === 'true_false' && (
                        <Grid item xs={12}>
                          <FormControl fullWidth margin="normal">
                            <InputLabel>Correct Answer</InputLabel>
                            <Select
                              value={question.correctAnswer}
                              onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                              label="Correct Answer"
                            >
                              <MenuItem value="True">True</MenuItem>
                              <MenuItem value="False">False</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                ))}
              </Grid>
            )}

            {/* Rubric Section */}
            {assessmentForm.assessment_type !== 'quiz' && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Rubric
                  <Button 
                    size="small" 
                    startIcon={<Add />} 
                    onClick={addRubricRow}
                    sx={{ ml: 2 }}
                  >
                    Add Rubric Item
                  </Button>
                </Typography>
                
                {assessmentForm.rubric.map((item, rIndex) => (
                  <Paper key={rIndex} elevation={2} sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <TextField
                          fullWidth
                          label="Criterion"
                          value={item.criterion}
                          onChange={(e) => handleRubricChange(rIndex, 'criterion', e.target.value)}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Weight (%)"
                          type="number"
                          value={item.weight}
                          onChange={(e) => handleRubricChange(rIndex, 'weight', e.target.value)}
                          margin="normal"
                          inputProps={{ min: 0, max: 100 }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssessmentDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateAssessment}
            disabled={
              !assessmentForm.title || 
              !assessmentForm.course ||
              (assessmentForm.assessment_type === 'quiz' && assessmentForm.questions.length === 0)
            }
          >
            {editAssessment ? 'Update' : 'Create'} Assessment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog open={openBulkDialog} onClose={() => setOpenBulkDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Bulk Upload Assessments</DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={2}>
            Upload a CSV file with columns: title, course (ID), assessment_type, due_date (YYYY-MM-DDTHH:MM:SS), 
            time_limit (minutes, optional), status, questions (JSON, optional), rubric (JSON, optional).
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

      {/* Submissions Dialog */}
      {selectedAssessment && (
        <Dialog open={openSubmissionsDialog} onClose={() => setOpenSubmissionsDialog(false)} fullWidth maxWidth="md">
          <DialogTitle>
            {selectedAssessment.title} - Submissions
            <Typography variant="subtitle1" color="text.secondary">
              {courses.find(c => c.id === selectedAssessment.course)?.title || 'No course'} • 
              Due: {selectedAssessment.due_date ? format(new Date(selectedAssessment.due_date), 'MMM dd, yyyy') : 'No due date'}
              {selectedAssessment.time_limit && ` • Time Limit: ${selectedAssessment.time_limit} min`} • 
              Status: {selectedAssessment.status}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>Submission Statistics</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2">Total Submissions</Typography>
                    <Typography variant="h4">{selectedAssessment.submissions_count || 0}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2">Graded</Typography>
                    <Typography variant="h4">{selectedAssessment.graded_count || 0}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2">Average Score</Typography>
                    <Typography variant="h4">
                      {selectedAssessment.average_score ? `${selectedAssessment.average_score}%` : 'N/A'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {selectedAssessment.rubric?.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom>Rubric</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Criterion</TableCell>
                      <TableCell>Weight</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedAssessment.rubric.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.criterion}</TableCell>
                        <TableCell>{item.weight}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}

            {selectedAssessment.questions?.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom mt={3}>Questions</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Question</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Points</TableCell>
                      <TableCell>Correct Answer</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedAssessment.questions.map((q, index) => (
                      <TableRow key={index}>
                        <TableCell>{q.text}</TableCell>
                        <TableCell>
                          {q.type === 'mcq' ? 'Multiple Choice' : 
                           q.type === 'true_false' ? 'True/False' : 
                           'Short Answer'}
                        </TableCell>
                        <TableCell>{q.points}</TableCell>
                        <TableCell>
                          {q.type === 'mcq' ? q.correctAnswer : 
                           q.type === 'true_false' ? q.correctAnswer : 
                           'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}

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
                {selectedAssessment.submissions?.length > 0 ? (
                  selectedAssessment.submissions.map(submission => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar src={submission.user.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
                          <Typography>{submission.user.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {submission.submitted_at ? format(new Date(submission.submitted_at), 'MMM dd, yyyy') : 'Not submitted'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={submission.status}
                          color={
                            submission.status === 'submitted' ? 'primary' :
                            submission.status === 'graded' ? 'success' :
                            submission.status === 'late' ? 'warning' : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {submission.score !== null ? `${submission.score}%` : '-'}
                      </TableCell>
                      <TableCell>
                        {submission.feedback || '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => {
                            setGrade(submission.score || '');
                            setFeedback(submission.feedback || '');
                          }}
                        >
                          {selectedAssessment.assessment_type === 'quiz' ? 'Auto-Grade' : 'Grade'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No submissions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {selectedAssessment.assessment_type !== 'quiz' && (
              <Box mt={3}>
                <Typography variant="h6" gutterBottom>Grade Submission</Typography>
                <TextField
                  label="Score (%)"
                  type="number"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  margin="normal"
                  sx={{ mr: 2 }}
                  inputProps={{ min: 0, max: 100 }}
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
                <Button
                  variant="contained"
                  onClick={() => handleGrade(false)}
                  sx={{ mt: 2 }}
                  disabled={!grade}
                >
                  Submit Grade
                </Button>
              </Box>
            )}

            {selectedAssessment.assessment_type === 'quiz' && (
              <Button
                variant="contained"
                onClick={() => handleGrade(true)}
                sx={{ mt: 2 }}
              >
                Auto-Grade All
              </Button>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSubmissionsDialog(false)}>Close</Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => {
                assessmentAPI.downloadSubmissions(selectedAssessment.id)
                  .then(response => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `submissions_${selectedAssessment.title}.zip`);
                    document.body.appendChild(link);
                    link.click();
                  })
                  .catch(err => {
                    setSnackbar({
                      open: true,
                      message: err.response?.data?.message || err.message || 'Failed to download submissions',
                      severity: 'error'
                    });
                  });
              }}
            >
              Download All
            </Button>
          </DialogActions>
        </Dialog>
      )}

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