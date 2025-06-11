import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Paper, TextField, MenuItem, Button, IconButton,
  FormControl, InputLabel, Select, FormControlLabel, Checkbox, CircularProgress,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Tabs, Tab,
  Divider, List, ListItem, ListItemText
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Grading as GradingIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { coursesAPI, assessmentAPI } from '../../../config';
import AssessmentQuestionManager from './AssessmentQuestionManager';
import AssessmentQuestionList from './AssessmentQuestionList';

// Create query client instance outside components
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Wrapper component that provides QueryClient context
const AssessmentManagerWrapper = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AssessmentManager />
    </QueryClientProvider>
  );
};

// View Assessment Dialog Component
const ViewAssessmentDialog = ({ assessment, open, onClose, courseMap, assessmentTypes }) => {
  // Function to safely get the course name
  const getCourseName = () => {
    if (assessment.course?.title) {
      return assessment.course.title;
    }
    if (assessment.course_id && courseMap[assessment.course_id]) {
      return courseMap[assessment.course_id];
    }
    if (assessment.course?.id && courseMap[assessment.course.id]) {
      return courseMap[assessment.course.id];
    }
    return 'Unknown Course';
  };

  // Function to safely format the due date
  const formatDueDate = () => {
    try {
      return format(new Date(assessment.due_date), 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'No due date';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>{assessment.title}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {getCourseName()} • Due: {formatDueDate()}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>Details</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Type</Typography>
            <Typography>
              {assessmentTypes.find((type) => type.value === assessment.assessment_type)?.label || assessment.assessment_type}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Status</Typography>
            <Chip
              label={assessment.status === 'published' ? 
                (new Date(assessment.due_date) > new Date() ? 'Active' : 'Closed') : 'Draft'}
              color={assessment.status === 'published' && new Date(assessment.due_date) > new Date() ? 'primary' : 'default'}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Passing Score (%)</Typography>
            <Typography>{assessment.passing_score}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Max Attempts</Typography>
            <Typography>{assessment.max_attempts === 0 ? 'Unlimited' : assessment.max_attempts}</Typography>
          </Grid>
          {assessment.time_limit && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Time Limit (minutes)</Typography>
              <Typography>{assessment.time_limit}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">Description</Typography>
            <Typography>{assessment.description || 'No description provided'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">Instructions</Typography>
            <Typography>{assessment.instructions || 'No instructions provided'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Shuffle Questions</Typography>
            <Typography>{assessment.shuffle_questions ? 'Yes' : 'No'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Show Correct Answers</Typography>
            <Typography>{assessment.show_correct_answers ? 'Yes' : 'No'}</Typography>
          </Grid>
        </Grid>

        <AssessmentQuestionList 
          questions={assessment.questions || []}
          rubrics={assessment.rubrics || []}
          assessmentType={assessment.assessment_type}
        />

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Attachments</Typography>
        {assessment.attachments?.length > 0 ? (
          <List>
            {assessment.attachments.map((attachment, index) => (
              <ListItem key={attachment.id || index}>
                <ListItemText
                  primary={attachment.name}
                  secondary={attachment.description || 'No description'}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary">No attachments added.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Assessment Manager Component
const AssessmentManager = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editAssessmentId, setEditAssessmentId] = useState(null);
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    assessment_type: 'quiz',
    description: '',
    due_date: dayjs().add(7, 'day'),
    time_limit: '',
    passing_score: 70,
    max_attempts: 1,
    shuffle_questions: false,
    show_correct_answers: false,
    instructions: '',
    status: 'draft',
  });
  const [questions, setQuestions] = useState([]);
  const [rubrics, setRubrics] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [validationErrors, setValidationErrors] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', id: null });
  const [tabValue, setTabValue] = useState(0);
  const [viewAssessment, setViewAssessment] = useState(null);

  const { data: coursesData, isLoading: coursesLoading, error: coursesError } = useQuery({
    queryKey: ['instructorCourses'],
    queryFn: () => coursesAPI.getCourses({ instructor: 'me' }),
  });

  const { data: assessmentsData, isLoading: assessmentsLoading, error: assessmentsError } = useQuery({
    queryKey: ['assessments'],
    queryFn: () => assessmentAPI.getAssessments({ instructor: 'me' }),
  });

  const { data: assessmentDetails, isLoading: assessmentDetailsLoading } = useQuery({
    queryKey: ['assessment', editAssessmentId],
    queryFn: () => assessmentAPI.getAssessment(editAssessmentId),
    enabled: !!editAssessmentId,
  });

  const createAssessmentMutation = useMutation({
    mutationFn: async (data) => {
      const assessmentData = {
        ...data,
        course_id: parseInt(data.course_id),
        due_date: data.due_date.toISOString(),
        time_limit: data.time_limit ? parseInt(data.time_limit) : null,
        passing_score: parseInt(data.passing_score),
        max_attempts: parseInt(data.max_attempts),
      };
      const assessmentResponse = await assessmentAPI.createAssessment(assessmentData);
      const assessmentId = assessmentResponse.data.id;

      // Create questions
      for (const [index, question] of questions.entries()) {
        const questionData = {
          question_type: question.question_type,
          text: question.text,
          points: question.points,
          explanation: question.explanation || '',
          order: index,
        };
        const questionResponse = await assessmentAPI.createQuestion(assessmentId, questionData);
        const questionId = questionResponse.data.id;

        // Create options for MCQ or True/False questions
        if (question.options && ['mcq', 'true_false'].includes(question.question_type)) {
          for (const [optIndex, option] of question.options.entries()) {
            const optionData = {
              text: option.text,
              is_correct: option.is_correct,
              order: optIndex,
            };
            await assessmentAPI.createQuestionOption(assessmentId, questionId, optionData);
          }
        }
      }

      // Create rubrics
      for (const [index, rubric] of rubrics.entries()) {
        const rubricData = {
          criterion: rubric.criterion,
          description: rubric.description || '',
          weight: rubric.weight,
          order: index,
        };
        await assessmentAPI.createRubric(assessmentId, rubricData);
      }

      // Upload attachments
      for (const attachment of attachments) {
        const formData = new FormData();
        formData.append('file', attachment.file);
        formData.append('name', attachment.name);
        formData.append('description', attachment.description || '');
        await assessmentAPI.uploadAttachment(assessmentId, formData);
      }

      return assessmentResponse.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['assessments']);
      setSnackbar({
        open: true,
        message: `Assessment "${data.title}" created successfully`,
        severity: 'success',
      });
      resetForm();
    },
    onError: (error) => {
      console.error('API Error:', error.response?.data || error.message);
      let errorMessage = 'Failed to create assessment';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).flat().join('; ');
      } else if (error.message) {
        errorMessage = error.message.replace(/^API Error: \d{3}\s/, '');
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    },
  });

  const updateAssessmentMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const assessmentData = {
        ...data,
        course_id: parseInt(data.course_id),
        due_date: data.due_date.toISOString(),
        time_limit: data.time_limit ? parseInt(data.time_limit) : null,
        passing_score: parseInt(data.passing_score),
        max_attempts: parseInt(data.max_attempts),
      };

      // Update assessment metadata
      await assessmentAPI.updateAssessment(id, assessmentData);

      // Get current server state
      const currentAssessment = await assessmentAPI.getAssessment(id);
      const serverQuestions = currentAssessment.data.questions || [];
      const serverRubrics = currentAssessment.data.rubrics || [];

      // Handle questions
      const questionPromises = questions.map(async (question, index) => {
        const questionData = {
          question_type: question.question_type,
          text: question.text,
          points: question.points,
          explanation: question.explanation || '',
          order: index,
        };

        let questionId;
        if (question.id) {
          // Update existing question
          await assessmentAPI.updateQuestion(id, question.id, questionData);
          questionId = question.id;
        } else {
          // Create new question
          const questionResponse = await assessmentAPI.createQuestion(id, questionData);
          questionId = questionResponse.data.id;
        }

        // Handle options
        if (question.options && ['mcq', 'true_false'].includes(question.question_type)) {
          const currentOptions = serverQuestions.find(q => q.id === question.id)?.options || [];
          const optionPromises = question.options.map(async (option, optIndex) => {
            const optionData = {
              text: option.text,
              is_correct: option.is_correct,
              order: optIndex,
            };
            if (option.id) {
              // Update existing option
              await assessmentAPI.updateQuestionOption(id, questionId, option.id, optionData);
            } else {
              // Create new option
              await assessmentAPI.createQuestionOption(id, questionId, optionData);
            }
          });

          // Delete removed options
          const optionsToDelete = currentOptions.filter(
            serverOpt => !question.options.some(clientOpt => clientOpt.id === serverOpt.id)
          );
          const deleteOptionPromises = optionsToDelete.map(option =>
            assessmentAPI.deleteQuestionOption(id, questionId, option.id)
          );

          await Promise.all([...optionPromises, ...deleteOptionPromises]);
        }
      });

      // Delete removed questions
      const questionsToDelete = serverQuestions.filter(
        serverQ => !questions.some(clientQ => clientQ.id === serverQ.id)
      );
      const questionDeletePromises = questionsToDelete.map(question =>
        assessmentAPI.deleteQuestion(id, question.id)
      );

      // Handle rubrics
      const rubricPromises = rubrics.map(async (rubric, index) => {
        const rubricData = {
          criterion: rubric.criterion,
          description: rubric.description || '',
          weight: rubric.weight,
          order: index,
        };
        if (rubric.id) {
          // Update existing rubric
          await assessmentAPI.updateRubric(id, rubric.id, rubricData);
        } else {
          // Create new rubric
          await assessmentAPI.createRubric(id, rubricData);
        }
      });

      // Delete removed rubrics
      const rubricsToDelete = serverRubrics.filter(
        serverR => !rubrics.some(clientR => clientR.id === serverR.id)
      );
      const rubricDeletePromises = rubricsToDelete.map(rubric =>
        assessmentAPI.deleteRubric(id, rubric.id)
      );

      // Handle attachments
      const attachmentPromises = attachments
        .filter(attachment => !attachment.id) // Only upload new attachments
        .map(async (attachment) => {
          const formData = new FormData();
          formData.append('file', attachment.file);
          formData.append('name', attachment.name);
          formData.append('description', attachment.description || '');
          await assessmentAPI.uploadAttachment(id, formData);
        });

      // Execute all operations
      await Promise.all([
        ...questionPromises,
        ...questionDeletePromises,
        ...rubricPromises,
        ...rubricDeletePromises,
        ...attachmentPromises,
      ]);

      // Return updated assessment
      const updatedAssessment = await assessmentAPI.getAssessment(id);
      return updatedAssessment.data;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries(['assessments']);
      await queryClient.cancelQueries(['assessment', variables.id]);

      const previousAssessment = queryClient.getQueryData(['assessment', variables.id]);
      const previousAssessments = queryClient.getQueryData(['assessments']);

      // Optimistic update
      const optimisticAssessment = {
        ...previousAssessment,
        ...variables.data,
        questions,
        rubrics,
        attachments,
      };

      if (previousAssessment) {
        queryClient.setQueryData(['assessment', variables.id], optimisticAssessment);
      }

      if (previousAssessments) {
        queryClient.setQueryData(['assessments'], {
          ...previousAssessments,
          data: {
            ...previousAssessments.data,
            results: previousAssessments.data.results.map(assessment =>
              assessment.id === variables.id
                ? { ...assessment, ...variables.data }
                : assessment
            ),
          },
        });
      }

      return { previousAssessment, previousAssessments };
    },
    onError: (error, variables, context) => {
      // Revert optimistic updates
      if (context?.previousAssessment) {
        queryClient.setQueryData(['assessment', variables.id], context.previousAssessment);
      }
      if (context?.previousAssessments) {
        queryClient.setQueryData(['assessments'], context.previousAssessments);
      }

      let errorMessage = 'Failed to update assessment';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).flat().join('; ');
      } else if (error.message) {
        errorMessage = error.message.replace(/^API Error: \d{3}\s/, '');
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['assessments']);
      queryClient.invalidateQueries(['assessment', data.id]);
      setSnackbar({
        open: true,
        message: `Assessment "${data.title}" updated successfully`,
        severity: 'success',
      });
      resetForm();
    },
  });

  const deleteAssessmentMutation = useMutation({
    mutationFn: (id) => assessmentAPI.deleteAssessment(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['assessments']);
      setSnackbar({
        open: true,
        message: 'Assessment deleted successfully',
        severity: 'success',
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: 'Failed to delete assessment',
        severity: 'error',
      });
    },
  });

  const resetForm = () => {
    setShowCreateForm(false);
    setEditAssessmentId(null);
    setFormData({
      course_id: '',
      title: '',
      assessment_type: 'quiz',
      description: '',
      due_date: dayjs().add(7, 'day'),
      time_limit: '',
      passing_score: 70,
      max_attempts: 1,
      shuffle_questions: false,
      show_correct_answers: false,
      instructions: '',
      status: 'draft',
    });
    setQuestions([]);
    setRubrics([]);
    setAttachments([]);
    setValidationErrors({});
  };

  const validateForm = () => {
    const errors = {};
    const errorMessages = [];

    if (!formData.course_id) {
      errors.course_id = 'Course is required';
      errorMessages.push('Course is required');
    }
    if (!formData.title) {
      errors.title = 'Title is required';
      errorMessages.push('Title is required');
    }
    if (!formData.due_date) {
      errors.due_date = 'Due date is required';
      errorMessages.push('Due date is required');
    }
    if (formData.passing_score < 0 || formData.passing_score > 100) {
      errors.passing_score = 'Passing score must be between 0 and 100';
      errorMessages.push('Passing score must be between 0 and 100');
    }
    if (formData.max_attempts < 0) {
      errors.max_attempts = 'Max attempts cannot be negative';
      errorMessages.push('Max attempts cannot be negative');
    }
    if (formData.time_limit && formData.time_limit < 0) {
      errors.time_limit = 'Time limit cannot be negative';
      errorMessages.push('Time limit cannot be negative');
    }

    if (formData.assessment_type === 'quiz' && questions.length === 0) {
      errors.questions = 'At least one question is required';
      errorMessages.push('At least one question is required');
    }
    for (const [index, question] of questions.entries()) {
      if (!question.text) {
        errors['question_' + index + '_text'] = 'Question text is required';
        errorMessages.push('Question ' + (index + 1) + ': Text is required');
      }
      if (!question.points || question.points < 1) {
        errors['question_' + index + '_points'] = 'Points must be at least 1';
        errorMessages.push('Question ' + (index + 1) + ': Points must be at least 1');
      }
      if (question.question_type === 'mcq' && question.options.length < 2) {
        errors['question_' + index + '_options'] = 'At least two options are required for MCQ';
        errorMessages.push('Question ' + (index + 1) + ': At least two options are required for MCQ');
      }
      if (question.question_type === 'mcq' && !question.options.some((opt) => opt.is_correct)) {
        errors['question_' + index + '_correct'] = 'At least one correct option is required';
        errorMessages.push('Question ' + (index + 1) + ': At least one correct option is required');
      }
      for (const [optIndex, option] of question.options.entries()) {
        if (!option.text) {
          errors['question_' + index + '_option_' + optIndex] = 'Option text is required';
          errorMessages.push('Question ' + (index + 1) + ', Option ' + (optIndex + 1) + ': Text is required');
        }
      }
    }

    for (const [index, rubric] of rubrics.entries()) {
      if (!rubric.criterion) {
        errors['rubric_' + index + '_criterion'] = 'Criterion is required';
        errorMessages.push('Rubric ' + (index + 1) + ': Criterion is required');
      }
      if (!rubric.weight || rubric.weight < 1 || rubric.weight > 100) {
        errors['rubric_' + index + '_weight'] = 'Weight must be between 1 and 100';
        errorMessages.push('Rubric ' + (index + 1) + ': Weight must be between 1 and 100');
      }
    }

    setValidationErrors(errors);
    return { isValid: Object.keys(errors).length === 0, errorMessages };
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleAttachmentChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAttachments((prev) => [
        ...prev,
        { file, name: file.name, description: '' },
      ]);
    }
  };

  const updateAttachment = (index, field, value) => {
    setAttachments((prev) =>
      prev.map((att, i) => (i === index ? { ...att, [field]: value } : att))
    );
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (status) => {
    setFormData((prev) => ({ ...prev, status }));
    setConfirmDialog({ open: true, action: status });
  };

  const confirmSubmit = () => {
    const { isValid, errorMessages } = validateForm();
    if (isValid) {
      if (editAssessmentId) {
        updateAssessmentMutation.mutate({ id: editAssessmentId, data: formData });
      } else {
        createAssessmentMutation.mutate(formData);
      }
    } else {
      setSnackbar({
        open: true,
        message: `Please fix the following errors:\n- ${errorMessages.join('\n- ')}`,
        severity: 'error',
      });
    }
    setConfirmDialog({ open: false, action: '', id: null });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleViewSubmissions = (assessment) => {
    navigate(`/instructor/assessments/${assessment.id}/submissions`);
  };

  const handleViewAssessment = (assessment) => {
    setViewAssessment(assessment);
  };

  const handleEditAssessment = (assessment) => {
    setEditAssessmentId(assessment.id);
    setFormData({
      course_id: String(assessment.course?.id || ''),
      title: assessment.title,
      assessment_type: assessment.assessment_type,
      description: assessment.description || '',
      due_date: dayjs(assessment.due_date),
      time_limit: assessment.time_limit || '',
      passing_score: assessment.passing_score,
      max_attempts: assessment.max_attempts,
      shuffle_questions: assessment.shuffle_questions,
      show_correct_answers: assessment.show_correct_answers,
      instructions: assessment.instructions || '',
      status: assessment.status,
    });
    setQuestions(assessment.questions || []);
    setRubrics(assessment.rubrics || []);
    setAttachments(
      assessment.attachments?.map((att) => ({
        file: null,
        name: att.name,
        description: att.description || '',
      })) || []
    );
    setShowCreateForm(true);
  };

  const handleDeleteAssessment = (id) => {
    setConfirmDialog({
      open: true,
      action: 'delete',
      id,
    });
  };

  const confirmDelete = () => {
    deleteAssessmentMutation.mutate(confirmDialog.id);
    setConfirmDialog({ open: false, action: '', id: null });
  };

  const assessmentTypes = [
    { value: 'quiz', label: 'Quiz' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'peer_assessment', label: 'Peer Assessment' },
    { value: 'certification_exam', label: 'Certification Exam' },
  ];

  const filteredAssessments = assessmentsData?.data.results?.filter((assessment) => {
    const now = new Date();
    const dueDate = new Date(assessment.due_date);
    if (tabValue === 0) return dueDate > now && assessment.status === 'published';
    if (tabValue === 1) return dueDate > now && assessment.status === 'draft';
    if (tabValue === 2) return dueDate <= now || assessment.status === 'closed';
    return true;
  }) || [];

  const courseMap = coursesData?.data.results?.reduce((map, course) => {
    map[course.id] = course.title;
    map[String(course.id)] = course.title;
    map[`course_${course.id}`] = course;
    return map;
  }, {}) || {};

  if (coursesLoading || assessmentsLoading || assessmentDetailsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (coursesError || assessmentsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading data: {coursesError?.message || assessmentsError?.message}
        </Alert>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Assessments</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              if (showCreateForm && editAssessmentId) {
                resetForm();
              }
              setShowCreateForm(!showCreateForm);
            }}
          >
            {showCreateForm ? 'Hide Form' : 'Create Assessment'}
          </Button>
        </Box>

        {showCreateForm && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {editAssessmentId ? 'Edit Assessment' : 'Create New Assessment'}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!validationErrors.course_id}>
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={formData.course_id}
                    onChange={(e) => handleFormChange('course_id', e.target.value)}
                    label="Course"
                  >
                    {coursesData?.data.results?.map((course) => (
                      <MenuItem key={course.id} value={String(course.id)}>
                        {course.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  required
                  error={!!validationErrors.title}
                  helperText={validationErrors.title}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!validationErrors.assessment_type}>
                  <InputLabel>Assessment Type</InputLabel>
                  <Select
                    value={formData.assessment_type}
                    onChange={(e) => handleFormChange('assessment_type', e.target.value)}
                    label="Assessment Type"
                  >
                    {assessmentTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {validationErrors.assessment_type && (
                    <Typography color="error" variant="caption">
                      {validationErrors.assessment_type}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Due Date"
                  value={formData.due_date}
                  onChange={(value) => handleFormChange('due_date', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      error={!!validationErrors.due_date}
                      helperText={validationErrors.due_date}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Time Limit (minutes)"
                  type="number"
                  value={formData.time_limit}
                  onChange={(e) => handleFormChange('time_limit', e.target.value)}
                  inputProps={{ min: 0 }}
                  error={!!validationErrors.time_limit}
                  helperText={validationErrors.time_limit}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Passing Score (%)"
                  type="number"
                  value={formData.passing_score}
                  onChange={(e) => handleFormChange('passing_score', e.target.value)}
                  inputProps={{ min: 0, max: 100 }}
                  required
                  error={!!validationErrors.passing_score}
                  helperText={validationErrors.passing_score}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Max Attempts"
                  type="number"
                  value={formData.max_attempts}
                  onChange={(e) => handleFormChange('max_attempts', e.target.value)}
                  inputProps={{ min: 0 }}
                  required
                  error={!!validationErrors.max_attempts}
                  helperText={validationErrors.max_attempts}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Instructions"
                  value={formData.instructions}
                  onChange={(e) => handleFormChange('instructions', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.shuffle_questions}
                      onChange={(e) => handleFormChange('shuffle_questions', e.target.checked)}
                    />
                  }
                  label="Shuffle Questions"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.show_correct_answers}
                      onChange={(e) => handleFormChange('show_correct_answers', e.target.checked)}
                    />
                  }
                  label="Show Correct Answers"
                />
              </Grid>
              
              {/* Integrated AssessmentQuestionManager component */}
              <Grid item xs={12}>
                <AssessmentQuestionManager
                  assessmentId={editAssessmentId}
                  assessmentType={formData.assessment_type}
                  initialQuestions={questions}
                  initialRubrics={rubrics}
                  onQuestionsChange={setQuestions}
                  onRubricsChange={setRubrics}
                  readOnly={false}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Attachments</Typography>
                <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                  Upload File
                  <input type="file" hidden onChange={handleAttachmentChange} />
                </Button>
                {attachments.map((attachment, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TextField
                      label="File Name"
                      value={attachment.name}
                      onChange={(e) => updateAttachment(index, 'name', e.target.value)}
                      sx={{ mr: 2, flex: 1 }}
                    />
                    <TextField
                      label="Description"
                      value={attachment.description}
                      onChange={(e) => updateAttachment(index, 'description', e.target.value)}
                      sx={{ mr: 2, flex: 1 }}
                    />
                    <IconButton onClick={() => removeAttachment(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button onClick={resetForm}>Cancel</Button>
                  <Button
                    variant="contained"
                    onClick={() => handleSubmit('draft')}
                    disabled={createAssessmentMutation.isLoading || updateAssessmentMutation.isLoading}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSubmit('published')}
                    disabled={createAssessmentMutation.isLoading || updateAssessmentMutation.isLoading}
                  >
                    Publish
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        <Paper sx={{ p: 3, mb: 4 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
            <Tab label="Active" />
            <Tab label="Drafts" />
            <Tab label="Closed" />
          </Tabs>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAssessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell>{assessment.title}</TableCell>
                    <TableCell>{assessment.course?.title || courseMap[assessment.course_id] || courseMap[String(assessment.course_id)] || 
                      'Unknown'}
                    </TableCell>
                    <TableCell>
                      {assessmentTypes.find((type) => type.value === assessment.assessment_type)?.label || assessment.assessment_type}
                    </TableCell>
                    <TableCell>{format(new Date(assessment.due_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <Chip
                        label={assessment.status === 'published' ? (new Date(assessment.due_date) > new Date() ? 'Active' : 'Closed') : 'Draft'}
                        color={assessment.status === 'published' && new Date(assessment.due_date) > new Date() ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleViewAssessment(assessment)} title="View">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleEditAssessment(assessment)} title="Edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleViewSubmissions(assessment)} title="View Submissions">
                        <GradingIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteAssessment(assessment.id)} title="Delete" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, action: '', id: null })}>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent>
            <Typography>
              {confirmDialog.action === 'delete'
                ? 'Are you sure you want to delete this assessment?'
                : `Are you sure you want to save this assessment as ${confirmDialog.action}?`}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialog({ open: false, action: '', id: null })}>Cancel</Button>
            <Button
              onClick={confirmDialog.action === 'delete' ? confirmDelete : confirmSubmit}
              color="primary"
              disabled={createAssessmentMutation.isLoading || updateAssessmentMutation.isLoading || deleteAssessmentMutation.isLoading}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {viewAssessment && (
          <ViewAssessmentDialog
            assessment={viewAssessment}
            open={!!viewAssessment}
            onClose={() => setViewAssessment(null)}
            courseMap={courseMap}
            assessmentTypes={assessmentTypes}
          />
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default AssessmentManagerWrapper;