import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Paper, TextField, MenuItem, Button, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Tabs, Tab,
  Divider, List, ListItem, ListItemText, Avatar, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Alert, Snackbar, Badge
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Check as CheckIcon, 
  Close as CloseIcon,
  Grade as GradeIcon,
  Comment as CommentIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

// Dummy data for submissions
const dummySubmissions = [
  {
    id: '1',
    user: {
      id: '101',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/static/images/avatar/1.jpg'
    },
    attempt_number: 1,
    status: 'graded',
    score: 85,
    feedback: 'Good work overall, but needs more detail in question 3.',
    submitted_at: '2023-05-15T14:30:00Z',
    graded_at: '2023-05-16T09:15:00Z',
    graded_by: {
      id: '201',
      name: 'Professor Smith'
    },
    is_passed: true,
    is_late: false,
    responses: [
      {
        id: '101',
        question: {
          id: 'q1',
          text: 'What is the capital of France?',
          points: 10,
          question_type: 'mcq'
        },
        selected_options: [
          { id: 'o1', text: 'Paris', is_correct: true }
        ],
        text_response: null,
        score: 10,
        is_correct: true,
        feedback: null
      },
      {
        id: '102',
        question: {
          id: 'q2',
          text: 'Explain the theory of relativity',
          points: 20,
          question_type: 'essay'
        },
        selected_options: [],
        text_response: 'The theory of relativity is...',
        score: 15,
        is_correct: null,
        feedback: 'Good start but needs more detail'
      }
    ]
  },
  {
    id: '2',
    user: {
      id: '102',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: '/static/images/avatar/2.jpg'
    },
    attempt_number: 1,
    status: 'submitted',
    score: null,
    feedback: null,
    submitted_at: '2023-05-16T10:45:00Z',
    graded_at: null,
    graded_by: null,
    is_passed: null,
    is_late: true,
    responses: [
      {
        id: '201',
        question: {
          id: 'q1',
          text: 'What is the capital of France?',
          points: 10,
          question_type: 'mcq'
        },
        selected_options: [
          { id: 'o2', text: 'London', is_correct: false }
        ],
        text_response: null,
        score: null,
        is_correct: false,
        feedback: null
      },
      {
        id: '202',
        question: {
          id: 'q2',
          text: 'Explain the theory of relativity',
          points: 20,
          question_type: 'essay'
        },
        selected_options: [],
        text_response: 'Relativity is about...',
        score: null,
        is_correct: null,
        feedback: null
      }
    ]
  }
];

// Dummy assessment data
const dummyAssessment = {
  id: 'a1',
  title: 'Physics Midterm Exam',
  course: {
    id: 'c1',
    title: 'Introduction to Physics'
  },
  due_date: '2023-05-10T23:59:00Z',
  passing_score: 70,
  assessment_type: 'quiz',
  questions: [
    {
      id: 'q1',
      text: 'What is the capital of France?',
      points: 10,
      question_type: 'mcq',
      options: [
        { id: 'o1', text: 'Paris', is_correct: true },
        { id: 'o2', text: 'London', is_correct: false },
        { id: 'o3', text: 'Berlin', is_correct: false }
      ]
    },
    {
      id: 'q2',
      text: 'Explain the theory of relativity',
      points: 20,
      question_type: 'essay'
    }
  ]
};

const SubmissionViewer = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);

  // In a real app, you would fetch this data from the API
  const [submissions, setSubmissions] = useState(dummySubmissions);
  const assessment = dummyAssessment;

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setFeedback(submission.feedback || '');
    setScore(submission.score || 0);
    setGradeDialogOpen(true);
  };

  const handleGradeSubmit = () => {
    // In a real app, you would submit this to the API
    const updatedSubmissions = submissions.map(sub => 
      sub.id === selectedSubmission.id 
        ? { 
            ...sub, 
            status: 'graded', 
            score, 
            feedback,
            graded_at: new Date().toISOString(),
            graded_by: { id: '201', name: 'Professor Smith' }, // Current user
            is_passed: score >= assessment.passing_score
          }
        : sub
    );
    
    setSubmissions(updatedSubmissions);
    setGradeDialogOpen(false);
    setSnackbar({
      open: true,
      message: 'Submission graded successfully',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (tabValue === 0) return sub.status === 'graded';
    if (tabValue === 1) return sub.status === 'submitted' || sub.status === 'late';
    return true;
  });

  const getStatusChip = (submission) => {
    switch (submission.status) {
      case 'graded':
        return <Chip 
          icon={<CheckIcon />} 
          label={`Graded (${submission.score}%)`} 
          color={submission.is_passed ? 'success' : 'error'} 
          size="small" 
        />;
      case 'submitted':
        return <Chip label="Submitted" color="info" size="small" />;
      case 'late':
        return <Chip label="Submitted Late" color="warning" size="small" />;
      default:
        return <Chip label={submission.status} size="small" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4">Submissions for {assessment.title}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {assessment.course.title} • Due: {format(new Date(assessment.due_date), 'MMM dd, yyyy')}
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab label="Graded" />
          <Tab label="Pending" />
          <Tab label="All" />
        </Tabs>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Attempt</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={submission.user.avatar} 
                        alt={submission.user.name} 
                        sx={{ width: 36, height: 36, mr: 2 }}
                      />
                      <Box>
                        <Typography>{submission.user.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {submission.user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>Attempt #{submission.attempt_number}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getStatusChip(submission)}
                      {submission.is_late && (
                        <Chip label="Late" color="error" size="small" sx={{ ml: 1 }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {format(new Date(submission.submitted_at), 'MMM dd, yyyy hh:mm a')}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={() => handleViewSubmission(submission)} 
                      title="View Submission"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    {submission.status !== 'graded' && (
                      <IconButton 
                        onClick={() => handleGradeSubmission(submission)} 
                        title="Grade Submission"
                        color="primary"
                      >
                        <GradeIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* View Submission Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)} 
        fullWidth 
        maxWidth="md"
      >
        <DialogTitle>
          Submission by {selectedSubmission?.user.name}
          <Typography variant="subtitle2" color="text.secondary">
            Attempt #{selectedSubmission?.attempt_number}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedSubmission && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Submission Details</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Typography>
                      {getStatusChip(selectedSubmission)}
                      {selectedSubmission.is_late && (
                        <Chip label="Late" color="error" size="small" sx={{ ml: 1 }} />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Submitted</Typography>
                    <Typography>
                      {format(new Date(selectedSubmission.submitted_at), 'MMM dd, yyyy hh:mm a')}
                    </Typography>
                  </Grid>
                  {selectedSubmission.graded_at && (
                    <>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">Graded By</Typography>
                        <Typography>{selectedSubmission.graded_by?.name || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">Graded On</Typography>
                        <Typography>
                          {format(new Date(selectedSubmission.graded_at), 'MMM dd, yyyy hh:mm a')}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>

              {selectedSubmission.feedback && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Instructor Feedback</Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                    <Typography>{selectedSubmission.feedback}</Typography>
                  </Paper>
                </Box>
              )}

              <Typography variant="h6" gutterBottom>Responses</Typography>
              {selectedSubmission.responses.map((response, index) => (
                <Paper key={response.id} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1">
                    Question {index + 1} ({response.question.points} points)
                  </Typography>
                  <Typography sx={{ mb: 1 }}>{response.question.text}</Typography>
                  
                  {response.question.question_type === 'mcq' && (
                    <Box sx={{ ml: 2 }}>
                      {response.question.options.map(option => (
                        <Box 
                          key={option.id} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            color: option.is_correct ? 'success.main' : 'inherit',
                            fontWeight: response.selected_options.some(so => so.id === option.id) 
                              ? 'bold' 
                              : 'normal'
                          }}
                        >
                          {response.selected_options.some(so => so.id === option.id) ? (
                            option.is_correct ? (
                              <CheckIcon color="success" sx={{ mr: 1 }} />
                            ) : (
                              <CloseIcon color="error" sx={{ mr: 1 }} />
                            )
                          ) : (
                            <Box sx={{ width: 24, mr: 1 }} />
                          )}
                          <Typography>{option.text}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {response.question.question_type === 'essay' && response.text_response && (
                    <Paper sx={{ p: 2, mt: 1, backgroundColor: 'grey.50' }}>
                      <Typography>{response.text_response}</Typography>
                    </Paper>
                  )}

                  {(response.score !== null || response.feedback) && (
                    <Box sx={{ mt: 2, p: 1, backgroundColor: 'action.hover', borderRadius: 1 }}>
                      <Typography variant="body2">
                        <strong>Score:</strong> {response.score !== null ? `${response.score}/${response.question.points}` : 'Not graded'}
                      </Typography>
                      {response.feedback && (
                        <Typography variant="body2">
                          <strong>Feedback:</strong> {response.feedback}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Paper>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          {selectedSubmission?.status !== 'graded' && (
            <Button 
              variant="contained" 
              onClick={() => {
                setViewDialogOpen(false);
                handleGradeSubmission(selectedSubmission);
              }}
              startIcon={<GradeIcon />}
            >
              Grade Submission
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Grade Submission Dialog */}
      <Dialog 
        open={gradeDialogOpen} 
        onClose={() => setGradeDialogOpen(false)} 
        fullWidth 
        maxWidth="sm"
      >
        <DialogTitle>
          Grade Submission by {selectedSubmission?.user.name}
        </DialogTitle>
        <DialogContent dividers>
          {selectedSubmission && (
            <>
              <Typography variant="body1" gutterBottom>
                Please review the submission and provide a score and feedback.
              </Typography>
              
              <TextField
                fullWidth
                label="Score (%)"
                type="number"
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                inputProps={{ min: 0, max: 100 }}
                sx={{ mt: 2, mb: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Passing score: {assessment.passing_score}%
              </Typography>
              
              <TextField
                fullWidth
                label="Feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                multiline
                rows={4}
                sx={{ mt: 2 }}
              />
              
              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                Question Responses
              </Typography>
              
              {selectedSubmission.responses.map((response, index) => (
                <Box key={response.id} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">
                    Q{index + 1}: {response.question.text}
                  </Typography>
                  
                  {response.question.question_type === 'mcq' && (
                    <Box sx={{ ml: 1 }}>
                      {response.selected_options.map(option => (
                        <Typography key={option.id} sx={{ fontStyle: 'italic' }}>
                          Selected: {option.text}
                        </Typography>
                      ))}
                    </Box>
                  )}
                  
                  {response.question.question_type === 'essay' && response.text_response && (
                    <Paper sx={{ p: 1, mt: 1, backgroundColor: 'grey.50' }}>
                      <Typography variant="body2">{response.text_response}</Typography>
                    </Paper>
                  )}
                </Box>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGradeDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleGradeSubmit}
            startIcon={<GradeIcon />}
          >
            Submit Grade
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SubmissionViewer;