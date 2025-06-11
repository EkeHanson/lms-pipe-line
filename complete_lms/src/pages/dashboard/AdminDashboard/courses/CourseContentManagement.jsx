import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, Button, IconButton,
  TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  Tabs, Tab, Autocomplete, Chip, Snackbar, Alert, useTheme, useMediaQuery,
  CircularProgress, Divider
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Assignment as AssignmentIcon,
  Quiz as QuizIcon, Grading as GradingIcon, QuestionAnswer as QuestionIcon, QuestionAnswer as QuestionAnswerIcon,
  Save as SaveIcon, Close as CloseIcon, Search as SearchIcon, Reorder as ReorderIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, coursesAPI } from '../../../../config';

const CourseContentManagement = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  // Tab-specific error states
  const [questionBankError, setQuestionBankError] = useState(null);
  const [assessmentError, setAssessmentError] = useState(null);
  const [rubricError, setRubricError] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const [faqError, setFaqError] = useState(null);

  // State for Question Banks
  const [questionBanks, setQuestionBanks] = useState([]);
  const [questionBankDialog, setQuestionBankDialog] = useState({ open: false, mode: 'create', data: {}, error: '' });
  const [questionBankPagination, setQuestionBankPagination] = useState({ count: 0, currentPage: 1, rowsPerPage: 10 });

  // State for Quizzes/Assignments
  const [assessments, setAssessments] = useState([]);
  const [assessmentDialog, setAssessmentDialog] = useState({ open: false, mode: 'create', data: {} });
  const [assessmentPagination, setAssessmentPagination] = useState({ count: 0, currentPage: 1, rowsPerPage: 10 });

  // State for Grading Rubrics
  const [rubrics, setRubrics] = useState([]);
  const [rubricDialog, setRubricDialog] = useState({ open: false, mode: 'create', data: {}, error: '' });
  const [rubricPagination, setRubricPagination] = useState({ count: 0, currentPage: 1, rowsPerPage: 10 });

  // State for Moderation
  const [submissions, setSubmissions] = useState([]);
  const [moderationDialog, setModerationDialog] = useState({ open: false, data: {} });
  const [submissionPagination, setSubmissionPagination] = useState({ count: 0, currentPage: 1, rowsPerPage: 10 });

  // State for FAQs
  const [faqs, setFaqs] = useState([]);
  const [faqDialog, setFaqDialog] = useState({ open: false, mode: 'create', data: {} });
  const [faqPagination, setFaqPagination] = useState({ count: 0, currentPage: 1, rowsPerPage: 10 });

  // Fetch courses for dropdowns
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await coursesAPI.getCourses({ page_size: 100 });
      setCourses(response.data.results || []);
      if (response.data.results?.length > 0) {
        setSelectedCourseId(response.data.results[0].id);
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to fetch courses', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch modules for the selected course
  const fetchModules = async () => {
    if (!selectedCourseId) {
      setModules([]);
      setSelectedModuleId(null);
      return;
    }

    setLoading(true);
    try {
      const response = await coursesAPI.getModules(selectedCourseId, {
        page_size: 100,
      });
      setModules(response.data.results || []);
      if (response.data.results?.length > 0) {
        setSelectedModuleId(response.data.results[0].id);
      } else {
        setSelectedModuleId(null);
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to fetch modules', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch question banks
  const fetchQuestionBanks = async () => {
    setLoading(true);
    setQuestionBankError(null);
    try {
      const response = await coursesAPI.getQuestionBanks({
        params: { page: questionBankPagination.currentPage, page_size: questionBankPagination.rowsPerPage }
      });
      setQuestionBanks(response.data.results || []);
      setQuestionBankPagination(prev => ({ ...prev, count: response.data.count || 0 }));
    } catch (err) {
      setQuestionBankError('Failed to fetch question banks');
    } finally {
      setLoading(false);
    }
  };

  // Fetch assessments (quizzes/assignments)
  const fetchAssessments = async () => {
    if (!selectedCourseId || !selectedModuleId) {
      setAssessments([]);
      setAssessmentPagination(prev => ({ ...prev, count: 0 }));
      return;
    }

    setLoading(true);
    setAssessmentError(null);
    try {
      const response = await coursesAPI.getLessons(selectedCourseId, selectedModuleId, {
        page: assessmentPagination.currentPage,
        page_size: assessmentPagination.rowsPerPage,
        lesson_type: 'quiz,assignment'
      });
      setAssessments(response.data.results || []);
      setAssessmentPagination(prev => ({ ...prev, count: response.data.count || 0 }));
    } catch (err) {
      setAssessmentError('Failed to fetch assessments');
      setSnackbar({ open: true, message: 'Failed to fetch assessments', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch grading rubrics
  const fetchRubrics = async () => {
    setLoading(true);
    setRubricError(null);
    try {
      const response = await coursesAPI.getRubrics({
        params: { page: rubricPagination.currentPage, page_size: rubricPagination.rowsPerPage }
      });
      setRubrics(response.data.results || []);
      setRubricPagination(prev => ({ ...prev, count: response.data.count || 0 }));
    } catch (err) {
      setRubricError('Failed to fetch rubrics');
    } finally {
      setLoading(false);
    }
  };

  // Fetch submissions for moderation
  const fetchSubmissions = async () => {
    setLoading(true);
    setSubmissionError(null);
    try {
      const response = await coursesAPI.getSubmissions({
        params: { page: submissionPagination.currentPage, page_size: submissionPagination.rowsPerPage }
      });
      setSubmissions(response.data.results || []);
      setSubmissionPagination(prev => ({ ...prev, count: response.data.count || 0 }));
    } catch (err) {
      setSubmissionError('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch FAQs for the selected course
  const fetchFAQs = async () => {
    if (!selectedCourseId) {
      setFaqs([]);
      setFaqError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setFaqError(null);
    try {
      const response = await coursesAPI.getFAQs(selectedCourseId, {
        page: faqPagination.currentPage,
        page_size: faqPagination.rowsPerPage
      });
      //console.log('Fetched FAQs:', response.data);
      const results = response.data.results || [];
      setFaqs(results);
      setFaqPagination(prev => ({
        ...prev,
        count: response.data.count || 0
      }));
    } catch (err) {
      console.error('Failed to fetch FAQs:', err);
      setFaqError('Failed to fetch FAQs');
      setFaqs([]);
      setSnackbar({ open: true, message: 'Failed to fetch FAQs', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Handle question bank CRUD
  const handleQuestionBankSave = async () => {
    const { mode, data } = questionBankDialog;
    try {
      if (mode === 'create') {
        await coursesAPI.createQuestionBank(data);
        setSnackbar({ open: true, message: 'Question bank created', severity: 'success' });
      } else {
        await coursesAPI.updateQuestionBank(data.id, data);
        setSnackbar({ open: true, message: 'Question bank updated', severity: 'success' });
      }
      fetchQuestionBanks();
      setQuestionBankDialog({ open: false, mode: 'create', data: {}, error: '' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to save question bank', severity: 'error' });
    }
  };

  const handleQuestionBankDelete = async (id) => {
    try {
      await coursesAPI.deleteQuestionBank(id);
      fetchQuestionBanks();
      setSnackbar({ open: true, message: 'Question bank deleted', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete question bank', severity: 'error' });
    }
  };

  // Handle assessment CRUD
  const handleAssessmentSave = async () => {
    const { mode, data } = assessmentDialog;
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));
      if (mode === 'create') {
        await coursesAPI.createLesson(data.course_id, data.module_id, formData);
        setSnackbar({ open: true, message: 'Assessment created', severity: 'success' });
      } else {
        await coursesAPI.updateLesson(data.course_id, data.module_id, data.id, formData);
        setSnackbar({ open: true, message: 'Assessment updated', severity: 'success' });
      }
      fetchAssessments();
      setAssessmentDialog({ open: false, mode: 'create', data: {} });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to save assessment', severity: 'error' });
    }
  };

  const handleAssessmentDelete = async (assessment) => {
    try {
      await coursesAPI.deleteLesson(assessment.course_id, assessment.module_id, assessment.id);
      fetchAssessments();
      setSnackbar({ open: true, message: 'Assessment deleted', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete assessment', severity: 'error' });
    }
  };

  // Handle rubric CRUD
  const handleRubricSave = async () => {
    const { mode, data } = rubricDialog;
    try {
      if (mode === 'create') {
        await coursesAPI.createRubric(data);
        setSnackbar({ open: true, message: 'Rubric created', severity: 'success' });
      } else {
        await coursesAPI.updateRubric(data.id, data);
        setSnackbar({ open: true, message: 'Rubric updated', severity: 'success' });
      }
      fetchRubrics();
      setRubricDialog({ open: false, mode: 'create', data: {}, error: '' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to save rubric', severity: 'error' });
    }
  };

  const handleRubricDelete = async (id) => {
    try {
      await coursesAPI.deleteRubric(id);
      fetchRubrics();
      setSnackbar({ open: true, message: 'Rubric deleted', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete rubric', severity: 'error' });
    }
  };

  // Handle submission moderation
  const handleSubmissionSave = async () => {
    const { data } = moderationDialog;
    try {
      await coursesAPI.updateSubmission(data.id, { grade: data.grade, feedback: data.feedback });
      fetchSubmissions();
      setModerationDialog({ open: false, data: {} });
      setSnackbar({ open: true, message: 'Submission updated', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update submission', severity: 'error' });
    }
  };

  // Handle FAQ CRUD operations
  const handleFaqSave = async () => {
    const { mode, data } = faqDialog;
    if (!selectedCourseId) {
      setSnackbar({ open: true, message: 'Please select a course first', severity: 'error' });
      return;
    }

    try {
      if (mode === 'create') {
        await coursesAPI.createFAQ(selectedCourseId, { ...data, course_id: selectedCourseId });
        setSnackbar({ open: true, message: 'FAQ created', severity: 'success' });
      } else {
        await coursesAPI.updateFAQ(selectedCourseId, data.id, data);
        setSnackbar({ open: true, message: 'FAQ updated', severity: 'success' });
      }
      fetchFAQs();
      setFaqDialog({ open: false, mode: 'create', data: {} });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to save FAQ', severity: 'error' });
    }
  };

  const handleFaqDelete = async (id) => {
    if (!selectedCourseId) return;

    try {
      await coursesAPI.deleteFAQ(selectedCourseId, id);
      fetchFAQs();
      setSnackbar({ open: true, message: 'FAQ deleted', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete FAQ', severity: 'error' });
    }
  };

  const handleFaqReorder = async () => {
    if (!selectedCourseId) return;

    try {
      const currentOrder = faqs.map(faq => ({ id: faq.id, order: faq.order }));
      const newOrder = [...currentOrder]
        .sort((a, b) => a.order - b.order)
        .map((faq, index) => ({ id: faq.id, order: index + 1 }));
      await coursesAPI.reorderFAQs(selectedCourseId, { faqs: newOrder });
      fetchFAQs();
      setSnackbar({ open: true, message: 'FAQs reordered successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to reorder FAQs', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Pagination handlers
  const handlePageChange = (pagination, setPagination) => (event, newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage + 1 }));
  };

  const handleRowsPerPageChange = (pagination, setPagination) => (event) => {
    setPagination(prev => ({ ...prev, rowsPerPage: parseInt(event.target.value, 10), currentPage: 1 }));
  };

  // Render tab content
  const renderQuestionBanks = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Question Banks</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setQuestionBankDialog({ open: true, mode: 'create', data: {}, error: '' })}>
          Add Question Bank
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Questions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} align="center"><CircularProgress /></TableCell></TableRow>
            ) : questionBankError ? (
              <TableRow><TableCell colSpan={4} align="center"><Typography color="error">{questionBankError}</Typography></TableCell></TableRow>
            ) : questionBanks.length === 0 ? (
              <TableRow><TableCell colSpan={4} align="center">No question banks found</TableCell></TableRow>
            ) : (
              questionBanks.map(bank => (
                <TableRow key={bank.id}>
                  <TableCell>{bank.title}</TableCell>
                  <TableCell>{bank.course?.title || 'N/A'}</TableCell>
                  <TableCell>{bank.questions?.length || 0}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => setQuestionBankDialog({ open: true, mode: 'edit', data: bank, error: '' })}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleQuestionBankDelete(bank.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={questionBankPagination.count}
          rowsPerPage={questionBankPagination.rowsPerPage}
          page={questionBankPagination.currentPage - 1}
          onPageChange={handlePageChange(questionBankPagination, setQuestionBankPagination)}
          onRowsPerPageChange={handleRowsPerPageChange(questionBankPagination, setQuestionBankPagination)}
        />
      </TableContainer>
    </Box>
  );

  const renderAssessments = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Quizzes & Assignments</Typography>
        <Box>
          <Autocomplete
            options={courses}
            getOptionLabel={(option) => option.title}
            value={courses.find((c) => c.id === selectedCourseId) || null}
            onChange={(event, newValue) => {
              setSelectedCourseId(newValue?.id || null);
              setSelectedModuleId(null);
            }}
            sx={{ width: 300, mr: 2, display: 'inline-flex' }}
            renderInput={(params) => (
              <TextField {...params} label="Select Course" variant="outlined" />
            )}
          />
          <Autocomplete
            options={modules}
            getOptionLabel={(option) => option.title}
            value={modules.find((m) => m.id === selectedModuleId) || null}
            onChange={(event, newValue) => {
              setSelectedModuleId(newValue?.id || null);
            }}
            sx={{ width: 300, mr: 2, display: 'inline-flex' }}
            renderInput={(params) => (
              <TextField {...params} label="Select Module" variant="outlined" />
            )}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() =>
              setAssessmentDialog({ open: true, mode: 'create', data: { course_id: selectedCourseId, module_id: selectedModuleId } })
            }
            disabled={!selectedCourseId || !selectedModuleId}
          >
            Add Assessment
          </Button>
        </Box>
      </Box>
      {!selectedCourseId || !selectedModuleId ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Please select a course and module to view assessments
          </Typography>
        </Box>
      ) : loading ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      ) : assessmentError ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{assessmentError}</Typography>
        </Box>
      ) : assessments.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No assessments found for this module</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Module</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell>{assessment.title}</TableCell>
                  <TableCell>
                    <Chip label={assessment.lesson_type} color={assessment.lesson_type === 'quiz' ? 'primary' : 'secondary'} />
                  </TableCell>
                  <TableCell>{assessment.module?.course?.title || 'N/A'}</TableCell>
                  <TableCell>{assessment.module?.title || 'N/A'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => setAssessmentDialog({ open: true, mode: 'edit', data: assessment })}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleAssessmentDelete(assessment)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={assessmentPagination.count}
            rowsPerPage={assessmentPagination.rowsPerPage}
            page={assessmentPagination.currentPage - 1}
            onPageChange={handlePageChange(assessmentPagination, setAssessmentPagination)}
            onRowsPerPageChange={handleRowsPerPageChange(assessmentPagination, setAssessmentPagination)}
          />
        </TableContainer>
      )}
    </Box>
  );

  const renderRubrics = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Grading Rubrics</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setRubricDialog({ open: true, mode: 'create', data: {}, error: '' })}>
          Add Rubric
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Total Points</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} align="center"><CircularProgress /></TableCell></TableRow>
            ) : rubricError ? (
              <TableRow><TableCell colSpan={4} align="center"><Typography color="error">{rubricError}</Typography></TableCell></TableRow>
            ) : rubrics.length === 0 ? (
              <TableRow><TableCell colSpan={4} align="center">No rubrics found</TableCell></TableRow>
            ) : (
              rubrics.map(rubric => (
                <TableRow key={rubric.id}>
                  <TableCell>{rubric.title}</TableCell>
                  <TableCell>{rubric.course?.title || 'N/A'}</TableCell>
                  <TableCell>{rubric.total_points || 0}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => setRubricDialog({ open: true, mode: 'edit', data: rubric, error: '' })}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleRubricDelete(rubric.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rubricPagination.count}
          rowsPerPage={rubricPagination.rowsPerPage}
          page={rubricPagination.currentPage - 1}
          onPageChange={handlePageChange(rubricPagination, setRubricPagination)}
          onRowsPerPageChange={handleRowsPerPageChange(rubricPagination, setRubricPagination)}
        />
      </TableContainer>
    </Box>
  );

  const renderModeration = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Assessment Moderation</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Assessment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} align="center"><CircularProgress /></TableCell></TableRow>
            ) : submissionError ? (
              <TableRow><TableCell colSpan={5} align="center"><Typography color="error">{submissionError}</Typography></TableCell></TableRow>
            ) : submissions.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center">No submissions found</TableCell></TableRow>
            ) : (
              submissions.map(submission => (
                <TableRow key={submission.id}>
                  <TableCell>{submission.user?.email || 'N/A'}</TableCell>
                  <TableCell>{submission.lesson?.title || 'N/A'}</TableCell>
                  <TableCell><Chip label={submission.status} color={submission.status === 'submitted' ? 'warning' : 'success'} /></TableCell>
                  <TableCell>{submission.grade || 'N/A'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setModerationDialog({ open: true, data: submission })}
                    >
                      Moderate
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={submissionPagination.count}
          rowsPerPage={submissionPagination.rowsPerPage}
          page={submissionPagination.currentPage - 1}
          onPageChange={handlePageChange(submissionPagination, setSubmissionPagination)}
          onRowsPerPageChange={handleRowsPerPageChange(submissionPagination, setSubmissionPagination)}
        />
      </TableContainer>
    </Box>
  );

  const renderFAQs = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Frequently Asked Questions</Typography>
        <Box>
          <Autocomplete
            options={courses}
            getOptionLabel={(option) => option.title}
            value={courses.find(c => c.id === selectedCourseId) || null}
            onChange={(event, newValue) => {
              setSelectedCourseId(newValue?.id || null);
              setFaqPagination(prev => ({ ...prev, currentPage: 1 }));
            }}
            sx={{ width: 300, mr: 2 }}
            renderInput={(params) => (
              <TextField {...params} label="Select Course" variant="outlined" />
            )}
          />
          <Button
            variant="outlined"
            startIcon={<ReorderIcon />}
            onClick={handleFaqReorder}
            sx={{ mr: 2 }}
            disabled={!selectedCourseId || faqs.length === 0}
          >
            Reorder
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFaqDialog({ 
              open: true, 
              mode: 'create', 
              data: { 
                course_id: selectedCourseId,
                is_active: true,
                order: faqs.length > 0 ? Math.max(...faqs.map(f => f.order)) + 1 : 1
              } 
            })}
            disabled={!selectedCourseId}
          >
            Add FAQ
          </Button>
        </Box>
      </Box>
      
      {!selectedCourseId ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Please select a course to view its FAQs
          </Typography>
        </Box>
      ) : loading ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      ) : faqError ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{faqError}</Typography>
        </Box>
      ) : faqs.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No FAQs found for this course</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Question</TableCell>
                <TableCell>Answer</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {faqs.map(faq => (
                <TableRow key={faq.id}>
                  <TableCell>{faq.question}</TableCell>
                  <TableCell>{faq.answer}</TableCell>
                  <TableCell>{faq.order}</TableCell>
                  <TableCell>
                    <Chip
                      label={faq.is_active ? 'Active' : 'Inactive'}
                      color={faq.is_active ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => setFaqDialog({ open: true, mode: 'edit', data: faq })}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleFaqDelete(faq.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={faqPagination.count}
            rowsPerPage={faqPagination.rowsPerPage}
            page={faqPagination.currentPage - 1}
            onPageChange={(e, newPage) => setFaqPagination(prev => ({ ...prev, currentPage: newPage + 1 }))}
            onRowsPerPageChange={(e) => setFaqPagination(prev => ({ 
              ...prev, 
              rowsPerPage: parseInt(e.target.value, 10), 
              currentPage: 1 
            }))}
          />
        </TableContainer>
      )}
    </Box>
  );

  useEffect(() => {
    fetchCourses();
    fetchModules();
    // Clear all error states when switching tabs
    setQuestionBankError(null);
    setAssessmentError(null);
    setRubricError(null);
    setSubmissionError(null);
    setFaqError(null);
    if (activeTab === 0) fetchQuestionBanks();
    else if (activeTab === 1) fetchAssessments();
    else if (activeTab === 2) fetchRubrics();
    else if (activeTab === 3) fetchSubmissions();
  }, [
    activeTab,
    selectedCourseId,
    questionBankPagination.currentPage, questionBankPagination.rowsPerPage,
    assessmentPagination.currentPage, assessmentPagination.rowsPerPage,
    rubricPagination.currentPage, rubricPagination.rowsPerPage,
    submissionPagination.currentPage, submissionPagination.rowsPerPage,
    faqPagination.currentPage, faqPagination.rowsPerPage
  ]);

  useEffect(() => {
    if (activeTab === 4 && selectedCourseId) {
      fetchFAQs();
    } else if (activeTab === 4 && !selectedCourseId) {
      setFaqs([]);
      setFaqError(null);
    }
  }, [activeTab, selectedCourseId, faqPagination.currentPage, faqPagination.rowsPerPage]);

  useEffect(() => {
    if (activeTab === 1) {
      fetchAssessments();
    }
  }, [activeTab, selectedCourseId, selectedModuleId, assessmentPagination.currentPage, assessmentPagination.rowsPerPage]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        Course Content Management
      </Typography>

      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={(e, newVal) => setActiveTab(newVal)} variant="scrollable" scrollButtons="auto">
          <Tab label="Question Banks" icon={<QuestionIcon />} />
          <Tab label="Quizzes & Assignments" icon={<QuizIcon />} />
          <Tab label="Grading Rubrics" icon={<GradingIcon />} />
          <Tab label="Moderation" icon={<AssignmentIcon />} />
          <Tab label="FAQs" icon={<QuestionAnswerIcon />} />
        </Tabs>
        <Divider />
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderQuestionBanks()}
          {activeTab === 1 && renderAssessments()}
          {activeTab === 2 && renderRubrics()}
          {activeTab === 3 && renderModeration()}
          {activeTab === 4 && renderFAQs()}
        </Box>
      </Paper>

      {/* Question Bank Dialog */}
      <Dialog open={questionBankDialog.open} onClose={() => setQuestionBankDialog({ open: false, mode: 'create', data: {}, error: '' })} maxWidth="md" fullWidth>
        <DialogTitle>{questionBankDialog.mode === 'create' ? 'Create Question Bank' : 'Edit Question Bank'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={questionBankDialog.data.title || ''}
            onChange={e => setQuestionBankDialog(prev => ({ ...prev, data: { ...prev.data, title: e.target.value }, error: '' }))}
            sx={{ mt: 2 }}
          />
          <Autocomplete
            options={courses}
            getOptionLabel={option => option.title}
            value={courses.find(c => c.id === questionBankDialog.data.course_id) || null}
            onChange={(e, newValue) => setQuestionBankDialog(prev => ({ ...prev, data: { ...prev.data, course_id: newValue?.id }, error: '' }))}
            renderInput={params => <TextField {...params} label="Course" sx={{ mt: 2 }} />}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Questions (JSON)"
            value={questionBankDialog.data.questions ? JSON.stringify(questionBankDialog.data.questions, null, 2) : ''}
            onChange={e => {
              try {
                const parsedQuestions = JSON.parse(e.target.value);
                setQuestionBankDialog(prev => ({
                  ...prev,
                  data: { ...prev.data, questions: parsedQuestions },
                  error: ''
                }));
              } catch (err) {
                setQuestionBankDialog(prev => ({
                  ...prev,
                  error: 'Invalid JSON format'
                }));
              }
            }}
            error={!!questionBankDialog.error}
            helperText={questionBankDialog.error}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuestionBankDialog({ open: false, mode: 'create', data: {}, error: '' })}>Cancel</Button>
          <Button onClick={handleQuestionBankSave} variant="contained" disabled={!!questionBankDialog.error}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Assessment Dialog */}
      <Dialog open={assessmentDialog.open} onClose={() => setAssessmentDialog({ open: false, mode: 'create', data: {} })} maxWidth="md" fullWidth>
        <DialogTitle>{assessmentDialog.mode === 'create' ? 'Create Assessment' : 'Edit Assessment'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={assessmentDialog.data.title || ''}
            onChange={e => setAssessmentDialog(prev => ({ ...prev, data: { ...prev.data, title: e.target.value } }))}
            sx={{ mt: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Type"
            value={assessmentDialog.data.lesson_type || 'quiz'}
            onChange={e => setAssessmentDialog(prev => ({ ...prev, data: { ...prev.data, lesson_type: e.target.value } }))}
            sx={{ mt: 2 }}
          >
            <MenuItem value="quiz">Quiz</MenuItem>
            <MenuItem value="assignment">Assignment</MenuItem>
          </TextField>
          <Autocomplete
            options={courses}
            getOptionLabel={option => option.title}
            value={courses.find(c => c.id === assessmentDialog.data.course_id) || null}
            onChange={(e, newValue) => setAssessmentDialog(prev => ({ ...prev, data: { ...prev.data, course_id: newValue?.id } }))}
            renderInput={params => <TextField {...params} label="Course" sx={{ mt: 2 }} />}
          />
          <TextField
            fullWidth
            label="Module ID"
            value={assessmentDialog.data.module_id || ''}
            onChange={e => setAssessmentDialog(prev => ({ ...prev, data: { ...prev.data, module_id: e.target.value } }))}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={assessmentDialog.data.description || ''}
            onChange={e => setAssessmentDialog(prev => ({ ...prev, data: { ...prev.data, description: e.target.value } }))}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssessmentDialog({ open: false, mode: 'create', data: {} })}>Cancel</Button>
          <Button onClick={handleAssessmentSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Rubric Dialog */}
      <Dialog open={rubricDialog.open} onClose={() => setRubricDialog({ open: false, mode: 'create', data: {}, error: '' })} maxWidth="md" fullWidth>
        <DialogTitle>{rubricDialog.mode === 'create' ? 'Create Rubric' : 'Edit Rubric'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={rubricDialog.data.title || ''}
            onChange={e => setRubricDialog(prev => ({ ...prev, data: { ...prev.data, title: e.target.value }, error: '' }))}
            sx={{ mt: 2 }}
          />
          <Autocomplete
            options={courses}
            getOptionLabel={option => option.title}
            value={courses.find(c => c.id === rubricDialog.data.course_id) || null}
            onChange={(e, newValue) => setRubricDialog(prev => ({ ...prev, data: { ...prev.data, course_id: newValue?.id }, error: '' }))}
            renderInput={params => <TextField {...params} label="Course" sx={{ mt: 2 }} />}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Criteria (JSON)"
            value={rubricDialog.data.criteria ? JSON.stringify(rubricDialog.data.criteria, null, 2) : ''}
            onChange={e => {
              try {
                const parsedCriteria = JSON.parse(e.target.value);
                setRubricDialog(prev => ({
                  ...prev,
                  data: { ...prev.data, criteria: parsedCriteria },
                  error: ''
                }));
              } catch (err) {
                setRubricDialog(prev => ({
                  ...prev,
                  error: 'Invalid JSON format'
                }));
              }
            }}
            error={!!rubricDialog.error}
            helperText={rubricDialog.error}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRubricDialog({ open: false, mode: 'create', data: {}, error: '' })}>Cancel</Button>
          <Button onClick={handleRubricSave} variant="contained" disabled={!!rubricDialog.error}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Moderation Dialog */}
      <Dialog open={moderationDialog.open} onClose={() => setModerationDialog({ open: false, data: {} })} maxWidth="md" fullWidth>
        <DialogTitle>Moderate Submission</DialogTitle>
        <DialogContent>
          <Typography><strong>User:</strong> {moderationDialog.data.user?.email || 'N/A'}</Typography>
          <Typography><strong>Assessment:</strong> {moderationDialog.data.lesson?.title || 'N/A'}</Typography>
          <Typography><strong>Status:</strong> {moderationDialog.data.status || 'N/A'}</Typography>
          <TextField
            fullWidth
            label="Grade"
            type="number"
            value={moderationDialog.data.grade || ''}
            onChange={e => setModerationDialog(prev => ({ ...prev, data: { ...prev.data, grade: e.target.value } }))}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Feedback"
            value={moderationDialog.data.feedback || ''}
            onChange={e => setModerationDialog(prev => ({ ...prev, data: { ...prev.data, feedback: e.target.value } }))}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModerationDialog({ open: false, data: {} })}>Cancel</Button>
          <Button onClick={handleSubmissionSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* FAQ Dialog */}
      <Dialog open={faqDialog.open} onClose={() => setFaqDialog({ open: false, mode: 'create', data: {} })} maxWidth="md" fullWidth>
        <DialogTitle>{faqDialog.mode === 'create' ? 'Create FAQ' : 'Edit FAQ'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Question"
            value={faqDialog.data.question || ''}
            onChange={e => setFaqDialog(prev => ({
              ...prev,
              data: { ...prev.data, question: e.target.value }
            }))}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Answer"
            value={faqDialog.data.answer || ''}
            onChange={e => setFaqDialog(prev => ({
              ...prev,
              data: { ...prev.data, answer: e.target.value }
            }))}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            label="Order"
            value={faqDialog.data.order || 0}
            onChange={e => setFaqDialog(prev => ({
              ...prev,
              data: { ...prev.data, order: parseInt(e.target.value) || 0 }
            }))}
            sx={{ mt: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Status"
            value={faqDialog.data.is_active !== undefined ? faqDialog.data.is_active : true}
            onChange={e => setFaqDialog(prev => ({
              ...prev,
              data: { ...prev.data, is_active: e.target.value === 'true' }
            }))}
            sx={{ mt: 2 }}
          >
            <MenuItem value={true}>Active</MenuItem>
            <MenuItem value={false}>Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFaqDialog({ open: false, mode: 'create', data: {} })}>
            Cancel
          </Button>
          <Button onClick={handleFaqSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

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
  );
};

export default CourseContentManagement;
