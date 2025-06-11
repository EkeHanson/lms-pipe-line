import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Badge,
  LinearProgress,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Search,
  Visibility,
  Feedback,
  CheckCircle,
  Warning,
  Close,
  Assessment,
  FileDownload,
  BarChart,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';

// Sample data focused on assessment quality
const assessorData = [
  {
    id: 1,
    name: 'John Smith',
    avatar: '/avatars/1.jpg',
    assessmentsCompleted: 24,
    sampledAssessments: 5,
    complianceScore: 92,
    lastSampled: '2023-06-15',
    status: 'compliant',
    qualifications: ['Level 5 Assessor', 'IQA Certified'],
    samples: [
      {
        date: '2023-06-15',
        course: 'Health & Safety L2',
        passRate: 85,
        notes: 'Minor inconsistencies in grading criteria application',
        action: 'Standardization session scheduled',
      },
    ],
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    avatar: '/avatars/2.jpg',
    assessmentsCompleted: 18,
    sampledAssessments: 4,
    complianceScore: 78,
    lastSampled: '2023-06-10',
    status: 'needs_improvement',
    qualifications: ['Level 3 Assessor'],
    samples: [
      {
        date: '2023-06-10',
        course: 'First Aid at Work',
        passRate: 65,
        notes: 'Needs to improve assessment feedback quality',
        action: 'Feedback template provided',
      },
    ],
  },
  {
    id: 3,
    name: 'David Lee',
    avatar: '/avatars/3.jpg',
    assessmentsCompleted: 30,
    sampledAssessments: 6,
    complianceScore: 88,
    lastSampled: '2023-07-01',
    status: 'compliant',
    qualifications: ['Level 4 Assessor'],
    samples: [
      {
        date: '2023-07-01',
        course: 'Manual Handling',
        passRate: 82,
        notes: 'Overall good, minor delays in marking',
        action: 'Time management workshop recommended',
      },
    ],
  },
  {
    id: 4,
    name: 'Emily Davis',
    avatar: '/avatars/4.jpg',
    assessmentsCompleted: 22,
    sampledAssessments: 5,
    complianceScore: 95,
    lastSampled: '2023-06-20',
    status: 'compliant',
    qualifications: ['Level 5 Assessor', 'IQA Certified', 'Internal Verifier'],
    samples: [
      {
        date: '2023-06-20',
        course: 'Customer Service Skills',
        passRate: 90,
        notes: 'Excellent documentation and clear feedback',
        action: 'Used as a model example',
      },
    ],
  },
  {
    id: 5,
    name: 'Michael Brown',
    avatar: '/avatars/5.jpg',
    assessmentsCompleted: 15,
    sampledAssessments: 3,
    complianceScore: 70,
    lastSampled: '2023-06-18',
    status: 'needs_improvement',
    qualifications: ['Level 3 Assessor'],
    samples: [
      {
        date: '2023-06-18',
        course: 'Food Safety L2',
        passRate: 60,
        notes: 'Insufficient evidence provided in assessments',
        action: 'Additional training assigned',
      },
    ],
  },
  {
    id: 6,
    name: 'Jessica White',
    avatar: '/avatars/6.jpg',
    assessmentsCompleted: 28,
    sampledAssessments: 7,
    complianceScore: 89,
    lastSampled: '2023-07-03',
    status: 'compliant',
    qualifications: ['Level 4 Assessor', 'IQA Certified'],
    samples: [
      {
        date: '2023-07-03',
        course: 'Workplace Safety',
        passRate: 87,
        notes: 'Accurate and timely assessments',
        action: 'Commendation issued',
      },
    ],
  },
  {
    id: 7,
    name: 'Daniel Green',
    avatar: '/avatars/7.jpg',
    assessmentsCompleted: 12,
    sampledAssessments: 2,
    complianceScore: 75,
    lastSampled: '2023-06-25',
    status: 'needs_improvement',
    qualifications: ['Level 3 Assessor'],
    samples: [
      {
        date: '2023-06-25',
        course: 'Fire Safety Awareness',
        passRate: 70,
        notes: 'Needs improvement in providing learner support',
        action: 'Mentorship program enrollment',
      },
    ],
  },
];

const statusMap = {
  exemplary: { label: 'Exemplary', color: 'info', icon: <CheckCircle fontSize="small" /> },
  compliant: { label: 'Compliant', color: 'success', icon: <CheckCircle fontSize="small" /> },
  needs_improvement: { label: 'Needs Improvement', color: 'warning', icon: <Warning fontSize="small" /> },
  action_required: { label: 'Action Required', color: 'error', icon: <Warning fontSize="small" /> },
};

export default function AssessorMonitoring() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedAssessor, setSelectedAssessor] = useState(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [assessors, setAssessors] = useState(assessorData);
  const [trendsDialogOpen, setTrendsDialogOpen] = useState(false);
  const rowsPerPage = 5;

  // Determine status based on compliance score
  const determineStatus = (score) => {
    if (score >= 90) return 'exemplary';
    if (score >= 80) return 'compliant';
    if (score >= 70) return 'needs_improvement';
    return 'action_required';
  };

  // Event handlers
  const handleSubmitFeedback = () => {
    const updatedAssessors = assessors.map(assessor =>
      assessor.id === selectedAssessor.id
        ? {
            ...assessor,
            samples: [
              ...assessor.samples,
              {
                date: new Date().toISOString().split('T')[0],
                course: 'Multiple',
                passRate: null,
                notes: feedbackNotes,
                action: 'Pending review',
              },
            ],
            lastSampled: new Date().toISOString().split('T')[0],
          }
        : assessor
    );

    setAssessors(updatedAssessors);
    setSnackbarMessage('Feedback submitted to assessor!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    setFeedbackDialogOpen(false);
    setFeedbackNotes('');
  };

  const filteredData = assessors.filter(assessor => {
    const matchesSearch = assessor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || assessor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header and Filters */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Assessor Quality Monitoring
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search assessors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
          }}
          sx={{ width: 300 }}
        />

        <FormControl size="small" sx={{ width: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Filter by Status"
          >
            <MenuItem value="all">All Statuses</MenuItem>
            {Object.keys(statusMap).map(status => (
              <MenuItem key={status} value={status}>
                {statusMap[status].label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Main Table */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell>Assessor</TableCell>
              <TableCell align="center">Assessments</TableCell>
              <TableCell align="center">Sampled</TableCell>
              <TableCell align="center">Compliance</TableCell>
              <TableCell align="center">Last Sampled</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((assessor) => (
              <TableRow key={assessor.id}>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar src={assessor.avatar} alt={assessor.name} />
                    <Box>
                      <Typography>{assessor.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {assessor.qualifications[0]}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  {assessor.assessmentsCompleted}
                </TableCell>
                <TableCell align="center">
                  <Badge
                    badgeContent={assessor.sampledAssessments}
                    color="primary"
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <Assessment color="action" />
                  </Badge>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={assessor.complianceScore}
                        color={
                          assessor.complianceScore >= 90 ? 'success' :
                          assessor.complianceScore >= 80 ? 'info' :
                          assessor.complianceScore >= 70 ? 'warning' : 'error'
                        }
                      />
                    </Box>
                    {assessor.complianceScore}%
                  </Box>
                </TableCell>
                <TableCell align="center">{assessor.lastSampled}</TableCell>
                <TableCell align="center">
                  <Chip
                    icon={statusMap[assessor.status].icon}
                    label={statusMap[assessor.status].label}
                    color={statusMap[assessor.status].color}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Sampling Details">
                    <IconButton
                      color="primary"
                      onClick={() => setSelectedAssessor(assessor)}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Provide IQA Feedback">
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        setSelectedAssessor(assessor);
                        setFeedbackNotes('');
                        setFeedbackDialogOpen(true);
                      }}
                    >
                      <Feedback />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={Math.ceil(filteredData.length / rowsPerPage)}
          page={page}
          onChange={(e, newPage) => setPage(newPage)}
          color="primary"
        />
      </Box>

      {/* Assessor Sampling Details Dialog */}
      <Dialog
        open={Boolean(selectedAssessor)}
        onClose={() => setSelectedAssessor(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedAssessor?.name}'s Assessment Sampling
          <IconButton onClick={() => setSelectedAssessor(null)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedAssessor && (
            <Box>
              <Stack direction="row" spacing={4} alignItems="center" mb={3}>
                <Avatar src={selectedAssessor.avatar} sx={{ width: 80, height: 80 }} />
                <Box>
                  <Typography variant="h6">{selectedAssessor.name}</Typography>
                  <Typography color="text.secondary">
                    {selectedAssessor.qualifications.join(', ')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip
                      icon={statusMap[selectedAssessor.status].icon}
                      label={statusMap[selectedAssessor.status].label}
                      color={statusMap[selectedAssessor.status].color}
                    />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      {selectedAssessor.assessmentsCompleted} assessments completed
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<BarChart />}
                    onClick={() => setTrendsDialogOpen(true)}
                  >
                    View Trends
                  </Button>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>Sampling History</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Course</TableCell>
                      <TableCell align="right">Pass Rate</TableCell>
                      <TableCell>IQA Notes</TableCell>
                      <TableCell>Actions Taken</TableCell>
                      <TableCell>Download</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedAssessor.samples.map((sample, index) => (
                      <TableRow key={index}>
                        <TableCell>{sample.date}</TableCell>
                        <TableCell>{sample.course}</TableCell>
                        <TableCell align="right">
                          {sample.passRate ? `${sample.passRate}%` : 'N/A'}
                        </TableCell>
                        <TableCell>{sample.notes}</TableCell>
                        <TableCell>{sample.action}</TableCell>
                        <TableCell>
                          <Tooltip title="Download Sample Report">
                            <IconButton
                              size="small"
                              onClick={() => {
                                const csvContent = [
                                  ['Date', 'Course', 'Pass Rate', 'IQA Notes', 'Actions Taken'],
                                  [
                                    sample.date,
                                    sample.course,
                                    sample.passRate ? `${sample.passRate}%` : 'N/A',
                                    sample.notes,
                                    sample.action,
                                  ],
                                ]
                                  .map(row => row.join(','))
                                  .join('\n');

                                const blob = new Blob([csvContent], { type: 'text/csv' });
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `${selectedAssessor.name}_sample_${sample.date}.csv`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);

                                setSnackbarMessage('Sample report downloaded successfully!');
                                setSnackbarSeverity('success');
                                setSnackbarOpen(true);
                              }}
                            >
                              <FileDownload fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedAssessor(null);
              setFeedbackDialogOpen(true);
            }}
          >
            Add Feedback
          </Button>
          <Button onClick={() => setSelectedAssessor(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Trends Dialog */}
      <Dialog
        open={trendsDialogOpen}
        onClose={() => setTrendsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Assessment Trends for {selectedAssessor?.name}
          <IconButton
            onClick={() => setTrendsDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedAssessor && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Pass Rate Trends
              </Typography>
              <LineChart
                width={700}
                height={400}
                data={selectedAssessor.samples.filter(sample => sample.passRate !== null)}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  label={{ value: 'Pass Rate (%)', angle: -90, position: 'insideLeft' }}
                />
                <RechartsTooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="passRate"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Pass Rate"
                />
              </LineChart>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTrendsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* IQA Feedback Dialog */}
      <Dialog
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          IQA Feedback for {selectedAssessor?.name}
          <IconButton onClick={() => setFeedbackDialogOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Assessment Quality Feedback</Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              placeholder="Provide detailed feedback on assessment quality, consistency, and compliance..."
              value={feedbackNotes}
              onChange={(e) => setFeedbackNotes(e.target.value)}
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            This feedback will be recorded in the assessor's quality record and sent to them for review.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitFeedback}
            variant="contained"
            disabled={!feedbackNotes.trim()}
          >
            Submit IQA Feedback
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}