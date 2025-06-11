import React, { useState, useRef } from 'react';
import { Box,  Typography,  Grid,  Card,  CardContent,
  CardHeader,  Divider,  Select,  MenuItem,  FormControl,  InputLabel,  Button,
  IconButton,  Tooltip,  Paper,  Table,  TableBody,  TableCell,  TableContainer,  TableHead,  TableRow,
  LinearProgress,  Menu,  Snackbar,  Alert,  Checkbox,Chip ,
  Dialog,  DialogTitle,  DialogContent,  DialogActions,  TextField,
  Avatar,  List,  ListItem,  ListItemText,  ListItemAvatar,  Badge,InputAdornment 
} from '@mui/material';
import {BarChart as BarChartIcon,  PieChart as PieChartIcon,
  Timeline as TimelineIcon,  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,  Refresh as RefreshIcon,
  FileDownload as FileDownloadIcon,  FilterList as FilterListIcon,
  Search as SearchIcon,  Close as CloseIcon,
  Visibility as ViewIcon,  Comment as CommentIcon, 
  Assignment as AssignmentIcon,  Person as PersonIcon, 
} from '@mui/icons-material';

import {
  Chart as ChartJS,  CategoryScale,
  LinearScale,  BarElement ,
  Title,  Tooltip as ChartTooltip,
  Legend,  ArcElement} from 'chart.js';
import { Bar, Pie, getElementAtEvent } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

const courses = [
  'Health and Safety Level 2',
  'First Aid at Work',
  'Manual Handling',
  'Fire Safety Awareness',
  'Food Hygiene'
];

const assessors = [
  { id: 1, name: 'John Smith', avatar: '/avatars/1.jpg' },
  { id: 2, name: 'Sarah Johnson', avatar: '/avatars/2.jpg' },
  { id: 3, name: 'Michael Brown', avatar: '/avatars/3.jpg' }
];

const assessmentData = [
  {
    id: 'A101',
    course: 'Health and Safety Level 2',
    assessor: assessors[0],
    date: '2023-06-18',
    learners: 24,
    sampled: 5,
    passRate: 92,
    status: 'Verified',
    flagged: false,
    details: [
      { learner: 'Emma Watson', score: 85, passed: true, verified: true },
      { learner: 'Daniel Radcliffe', score: 72, passed: true, verified: true },
      { learner: 'Rupert Grint', score: 65, passed: false, verified: true },
      { learner: 'Tom Felton', score: 88, passed: true, verified: true },
      { learner: 'Bonnie Wright', score: 91, passed: true, verified: true }
    ]
  },
  {
    id: 'A102',
    course: 'First Aid at Work',
    assessor: assessors[1],
    date: '2023-06-17',
    learners: 18,
    sampled: 4,
    passRate: 75,
    status: 'Needs Review',
    flagged: true,
    details: [
      { learner: 'Tom Hanks', score: 80, passed: true, verified: true },
      { learner: 'Meryl Streep', score: 55, passed: false, verified: true },
      { learner: 'Leonardo DiCaprio', score: 62, passed: false, verified: false },
      { learner: 'Jennifer Lawrence', score: 78, passed: true, verified: false }
    ]
  },
  {
    id: 'A103',
    course: 'Manual Handling',
    assessor: assessors[2],
    date: '2023-06-16',
    learners: 32,
    sampled: 6,
    passRate: 88,
    status: 'Pending',
    flagged: false,
    details: [
      { learner: 'Robert Downey Jr.', score: 92, passed: true, verified: false },
      { learner: 'Chris Evans', score: 85, passed: true, verified: false },
      { learner: 'Scarlett Johansson', score: 78, passed: true, verified: false },
      { learner: 'Mark Ruffalo', score: 65, passed: false, verified: false },
      { learner: 'Chris Hemsworth', score: 88, passed: true, verified: false },
      { learner: 'Jeremy Renner', score: 72, passed: true, verified: false }
    ]
  }
];

export default function IQAAssessmentSampling() {
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedAssessments, setSelectedAssessments] = useState([]);
  const [viewAssessment, setViewAssessment] = useState(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const barChartRef = useRef();
  const pieChartRef = useRef();

  // Filtered data based on selections
  const filteredData = assessmentData.filter(assessment => {
    const matchesCourse = selectedCourse === 'all' || assessment.course === selectedCourse;
    const matchesStatus = selectedStatus === 'all' || assessment.status === selectedStatus;
    return matchesCourse && matchesStatus;
  });

  // Chart data
  const completionData = {
    labels: courses,
    datasets: [
      {
        label: 'Sampling Rate (%)',
        data: courses.map(course => {
          const courseAssessments = assessmentData.filter(a => a.course === course);
          if (courseAssessments.length === 0) return 0;
          return Math.round(courseAssessments.reduce((sum, a) => sum + (a.sampled / a.learners * 100), 0) / courseAssessments.length);
        }),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const passRateData = {
    labels: ['Verified', 'Needs Review', 'Pending'],
    datasets: [
      {
        label: 'Number of Assessments',
        data: [
          assessmentData.filter(a => a.status === 'Verified').length,
          assessmentData.filter(a => a.status === 'Needs Review').length,
          assessmentData.filter(a => a.status === 'Pending').length
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(255, 99, 132, 0.5)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
      setSnackbar({ open: true, message: 'Data refreshed successfully', severity: 'success' });
    }, 1500);
  };

  const handleSelectAssessment = (assessmentId) => {
    setSelectedAssessments(prev => 
      prev.includes(assessmentId)
        ? prev.filter(id => id !== assessmentId)
        : [...prev, assessmentId]
    );
  };

  const handleSelectAll = (event) => {
    setSelectedAssessments(event.target.checked 
      ? filteredData.map(a => a.id) 
      : []);
  };

  const handleViewDetails = (assessment) => {
    setViewAssessment(assessment);
  };

  const handleProvideFeedback = () => {
    setFeedbackDialogOpen(true);
  };

  const handleFeedbackSubmit = () => {
    // In a real app, this would send feedback to the backend
    setSnackbar({ open: true, message: 'Feedback submitted successfully', severity: 'success' });
    setFeedbackDialogOpen(false);
    setFeedback('');
  };

  const handleVerifyAssessment = () => {
    // In a real app, this would update the assessment status
    setSnackbar({ open: true, message: 'Assessment verified successfully', severity: 'success' });
    setSelectedAssessments([]);
  };

  const exportAsPDF = async () => {
    try {
      const pdf = new jsPDF();
      
      // Add title
      pdf.setFontSize(16);
      pdf.text('IQA Assessment Sampling Report', 15, 20);
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 30);
      
      // Add summary table
      autoTable(pdf, {
        startY: 40,
        head: [['Assessment ID', 'Course', 'Assessor', 'Date', 'Sampled', 'Pass Rate', 'Status']],
        body: filteredData.map(a => [
          a.id,
          a.course,
          a.assessor.name,
          a.date,
          `${a.sampled}/${a.learners}`,
          `${a.passRate}%`,
          a.status
        ]),
        theme: 'grid',
        headStyles: { fillColor: [25, 118, 210] }
      });
      
      pdf.save('IQA_Assessment_Sampling_Report.pdf');
      setSnackbar({ open: true, message: 'PDF exported successfully', severity: 'success' });
    } catch (error) {
      console.error('PDF export error:', error);
      setSnackbar({ open: true, message: 'Failed to export PDF', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        IQA Assessment Sampling
      </Typography>
      
      {/* Filters and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ width: 150 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="7days">Last 7 Days</MenuItem>
              <MenuItem value="30days">Last 30 Days</MenuItem>
              <MenuItem value="90days">Last 90 Days</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ width: 200 }}>
            <InputLabel>Course</InputLabel>
            <Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              label="Course"
            >
              <MenuItem value="all">All Courses</MenuItem>
              {courses.map((course) => (
                <MenuItem key={course} value={course}>{course}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ width: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="Verified">Verified</MenuItem>
              <MenuItem value="Needs Review">Needs Review</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            size="small"
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={exportAsPDF}
          >
            Export Report
          </Button>
          
          {selectedAssessments.length > 0 && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={handleVerifyAssessment}
            >
              Verify Selected
            </Button>
          )}
        </Box>
      </Box>
      
      {isLoading && <LinearProgress sx={{ mb: 2 }} />}
      
      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardHeader
              title="Sampling Rates by Course"
              subheader="Percentage of learners sampled for each course"
            />
            <Divider />
            <CardContent sx={{ height: 300 }}>
              <Bar 
                ref={barChartRef}
                data={completionData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.parsed.y}% sampled`
                      }
                    }
                  },
                  scales: {
                    y: {
                      min: 0,
                      max: 100,
                      title: { display: true, text: 'Percentage Sampled' }
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardHeader
              title="Verification Status"
              subheader="Breakdown of assessment verification status"
            />
            <Divider />
            <CardContent sx={{ height: 300 }}>
              <Pie 
                ref={pieChartRef}
                data={passRateData}
                options={{
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.parsed} assessments`
                      }
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Assessments Table */}
      <Card elevation={3}>
        <CardHeader
          title="Assessment Sampling Records"
          subheader={`Showing ${filteredData.length} assessments`}
        />
        <Divider />
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedAssessments.length > 0 && selectedAssessments.length < filteredData.length}
                      checked={filteredData.length > 0 && selectedAssessments.length === filteredData.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Assessment ID</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Assessor</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Sample Size</TableCell>
                  <TableCell align="center">Pass Rate</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((assessment) => (
                  <TableRow 
                    key={assessment.id}
                    hover
                    selected={selectedAssessments.includes(assessment.id)}
                    sx={assessment.flagged ? { backgroundColor: 'rgba(255, 0, 0, 0.05)' } : {}}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedAssessments.includes(assessment.id)}
                        onChange={() => handleSelectAssessment(assessment.id)}
                      />
                    </TableCell>
                    <TableCell>{assessment.id}</TableCell>
                    <TableCell>{assessment.course}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={assessment.assessor.avatar} 
                          sx={{ width: 24, height: 24, mr: 1 }}
                        >
                          {assessment.assessor.name.charAt(0)}
                        </Avatar>
                        {assessment.assessor.name}
                      </Box>
                    </TableCell>
                    <TableCell align="center">{assessment.date}</TableCell>
                    <TableCell align="center">
                      {assessment.sampled}/{assessment.learners}
                    </TableCell>
                    <TableCell align="center">
                      <Box 
                        sx={{ 
                          fontWeight: 'bold',
                          color: assessment.passRate >= 80 ? 'success.main' : 
                                assessment.passRate >= 60 ? 'warning.main' : 'error.main'
                        }}
                      >
                        {assessment.passRate}%
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={assessment.status}
                        size="small"
                        color={
                          assessment.status === 'Verified' ? 'success' :
                          assessment.status === 'Needs Review' ? 'warning' : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewDetails(assessment)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Provide Feedback">
                        <IconButton 
                          size="small" 
                          onClick={handleProvideFeedback}
                        >
                          <CommentIcon color={assessment.flagged ? 'error' : 'inherit'} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Assessment Detail Dialog */}
      <Dialog 
        open={!!viewAssessment} 
        onClose={() => setViewAssessment(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Assessment Details: {viewAssessment?.id}
          <IconButton
            onClick={() => setViewAssessment(null)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {viewAssessment && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Course</Typography>
                  <Typography>{viewAssessment.course}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Assessor</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      src={viewAssessment.assessor.avatar} 
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    <Typography>{viewAssessment.assessor.name}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Assessment Date</Typography>
                  <Typography>{viewAssessment.date}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Sampling</Typography>
                  <Typography>
                    {viewAssessment.sampled} of {viewAssessment.learners} learners sampled
                    ({Math.round(viewAssessment.sampled / viewAssessment.learners * 100)}%)
                  </Typography>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom>Sampled Learners</Typography>
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Learner</TableCell>
                      <TableCell align="center">Score</TableCell>
                      <TableCell align="center">Result</TableCell>
                      <TableCell align="center">Verified</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {viewAssessment.details.map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell>{detail.learner}</TableCell>
                        <TableCell align="center">{detail.score}%</TableCell>
                        <TableCell align="center">
                          {detail.passed ? (
                            <CheckCircleIcon color="success" fontSize="small" />
                          ) : (
                            <WarningIcon color="error" fontSize="small" />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {detail.verified ? (
                            <CheckCircleIcon color="success" fontSize="small" />
                          ) : (
                            <WarningIcon color="warning" fontSize="small" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Typography variant="h6" gutterBottom>Verification Notes</Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography color="text.secondary">
                  {viewAssessment.status === 'Pending' 
                    ? 'No verification notes yet' 
                    : 'Verification notes will appear here once completed'}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewAssessment(null)}>Close</Button>
          <Button variant="contained" onClick={handleProvideFeedback}>
            Add Feedback
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog 
        open={feedbackDialogOpen} 
        onClose={() => setFeedbackDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Provide Feedback to Assessor
          <IconButton
            onClick={() => setFeedbackDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide constructive feedback to the assessor about this assessment..."
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleFeedbackSubmit}
            disabled={!feedback.trim()}
          >
            Submit Feedback
          </Button>
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
}