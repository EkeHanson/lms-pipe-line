import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextareaAutosize,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  CheckCircle as VerifyIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useQAAuth } from '../../../../../contexts/AuthContext';
import axios from 'axios';

// API endpoint (replace with your actual endpoint from src/config.js)
const API_URL = '/quality/api/portfolios'; // Updated to align with qualityAPI

// Sample courses and statuses (replace with dynamic data from backend)
const COURSES = [
  'Health and Safety Level 2',
  'First Aid at Work',
  'Manual Handling',
  'Fire Safety Awareness',
  'Food Hygiene',
];
const STATUSES = ['In Progress', 'Submitted', 'Verified', 'Needs Revision'];

const LearnerPortfolio = ({ searchTerm = '' }) => {
  const { canEditPortfolio, canVerifyPortfolio, canManageFeedback, canViewPortfolio, user } = useQAAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch portfolios from backend
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });

        // Ensure response.data is an array
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.portfolios || response.data?.data || [];
        
        setPortfolios(data);
      } catch (error) {
        console.error('Fetch portfolios error:', error);
        setSnackbar({ open: true, message: 'Failed to fetch portfolios', severity: 'error' });
        setPortfolios([]); // Reset to empty array on error
      }
    };
    if (canViewPortfolio) {
      fetchPortfolios();
    }
  }, [canViewPortfolio]);

  // Handle portfolio verification
  const handleVerify = async (portfolioId) => {
    try {
      const response = await axios.patch(`${API_URL}/${portfolioId}`, {
        status: 'Verified',
        lastVerified: new Date().toISOString(),
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setPortfolios((prev) =>
        prev.map((p) => (p.id === portfolioId ? { ...p, ...response.data } : p))
      );
      setSnackbar({ open: true, message: 'Portfolio verified successfully', severity: 'success' });
    } catch (error) {
      console.error('Verify error:', error);
      setSnackbar({ open: true, message: 'Failed to verify portfolio', severity: 'error' });
    }
  };

  // Handle comment submission
  const handleAddComment = async (portfolioId) => {
    if (!comment.trim()) {
      setSnackbar({ open: true, message: 'Comment cannot be empty', severity: 'warning' });
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/${portfolioId}/comments`, {
        comment,
        createdBy: user?.id || 'Current User', // Use user ID from AuthContext
        createdAt: new Date().toISOString(),
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setPortfolios((prev) =>
        prev.map((p) =>
          p.id === portfolioId
            ? { ...p, comments: [...(p.comments || []), response.data] }
            : p
        )
      );
      setComment('');
      setSnackbar({ open: true, message: 'Comment added successfully', severity: 'success' });
    } catch (error) {
      console.error('Comment error:', error);
      setSnackbar({ open: true, message: 'Failed to add comment', severity: 'error' });
    }
  };

  // Open portfolio details
  const handleViewPortfolio = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setDialogOpen(true);
  };

  // Filter portfolios
  const filteredPortfolios = Array.isArray(portfolios)
    ? portfolios.filter((portfolio) => {
        const matchesSearch = portfolio?.learnerName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCourse = courseFilter === 'all' || portfolio?.course === courseFilter;
        const matchesStatus = statusFilter === 'all' || portfolio?.status === statusFilter;
        return matchesSearch && matchesCourse && matchesStatus;
      })
    : [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Learner Portfolios
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ width: 200 }}>
            <InputLabel>Course</InputLabel>
            <Select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              label="Course"
            >
              <MenuItem value="all">All Courses</MenuItem>
              {COURSES.map((course) => (
                <MenuItem key={course} value={course}>
                  {course}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ width: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              {STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell>Learner Name</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPortfolios.length > 0 ? (
              filteredPortfolios.map((portfolio) => (
                <TableRow key={portfolio.id}>
                  <TableCell>{portfolio.learnerName}</TableCell>
                  <TableCell>{portfolio.course}</TableCell>
                  <TableCell>{portfolio.progress}%</TableCell>
                  <TableCell>
                    <Chip
                      label={portfolio.status}
                      color={
                        portfolio.status === 'Verified'
                          ? 'success'
                          : portfolio.status === 'Needs Revision'
                          ? 'error'
                          : 'primary'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    {canViewPortfolio && (
                      <Tooltip title="View Portfolio">
                        <IconButton onClick={() => handleViewPortfolio(portfolio)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {canVerifyPortfolio && portfolio.status !== 'Verified' && (
                      <Tooltip title="Verify Portfolio">
                        <IconButton onClick={() => handleVerify(portfolio.id)}>
                          <VerifyIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No portfolios found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Portfolio Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Portfolio: {selectedPortfolio?.learnerName}
          <IconButton
            onClick={() => setDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>
            Assessment Submissions
          </Typography>
          <Box sx={{ mb: 2 }}>
            {(selectedPortfolio?.assessments || []).map((assessment, index) => (
              <Box key={index} sx={{ mb: 1, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                <Typography variant="subtitle1">{assessment.title}</Typography>
                <Typography variant="body2">
                  Submitted: {new Date(assessment.submittedAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  Assessor Feedback: {assessment.feedback || 'None'}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography variant="h6" gutterBottom>
            IQA Comments
          </Typography>
          <Box sx={{ mb: 2 }}>
            {(selectedPortfolio?.comments || []).map((comment, index) => (
              <Box key={index} sx={{ mb: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2">{comment.comment}</Typography>
                <Typography variant="caption">
                  By {comment.createdBy} on {new Date(comment.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Box>
          {canManageFeedback && (
            <Box>
              <Typography variant="subtitle1">Add Comment</Typography>
              <TextareaAutosize
                minRows={4}
                style={{ width: '100%', marginTop: '8px', padding: '8px' }}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment..."
              />
              <Button
                variant="contained"
                onClick={() => handleAddComment(selectedPortfolio?.id)}
                sx={{ mt: 1 }}
              >
                Submit Comment
              </Button>
            </Box>
          )}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Attached Documents
          </Typography>
          <Box>
            {(selectedPortfolio?.documents || []).map((doc, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  {doc.name} ({doc.type}) -{' '}
                  <a href={`/api/documents/${doc.id}/download`} target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LearnerPortfolio;