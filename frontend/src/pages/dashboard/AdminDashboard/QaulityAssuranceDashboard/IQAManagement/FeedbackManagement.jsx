import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Snackbar, Alert, TextField, Button, Select, MenuItem,
  FormControl, InputLabel, Chip, Avatar, IconButton, Tooltip, Divider,
  Pagination, Grid, Dialog, DialogTitle, DialogContent, DialogActions,ListItemSecondaryAction ,
  FormGroup, FormControlLabel, Checkbox, Card, CardContent, Badge,List,ListItem,ListItemText
} from '@mui/material';
import {
  Search as SearchIcon, FilterList as FilterIcon, Check as CheckIcon,
  Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon,
  Refresh as RefreshIcon, Assignment as AssignmentIcon, Person as PersonIcon,
  Download as DownloadIcon, Feedback as FeedbackIcon, ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon, Comment as CommentIcon, Task as TaskIcon
} from '@mui/icons-material';
import FeedbackForm from './FeedbackForm';

const FeedbackManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [feedbackData, setFeedbackData] = useState([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [viewFeedback, setViewFeedback] = useState(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionNote, setActionNote] = useState('');
  const rowsPerPage = 5;

  // Sample data for trainers and courses
  const trainers = [
    { id: '1', name: 'John Smith', avatar: '', role: 'Assessor' },
    { id: '2', name: 'Sarah Johnson', avatar: '', role: 'Trainer' },
    { id: '3', name: 'Michael Brown', avatar: '', role: 'Assessor' },
    { id: '4', name: 'Emily Davis', avatar: '', role: 'Trainer' },
    { id: '5', name: 'Robert Wilson', avatar: '', role: 'Assessor' },
    { id: '6', name: 'Lisa Thompson', avatar: '', role: 'Trainer' }
  ];

  const courses = [
    { id: '1', name: 'Health and Safety Level 2' },
    { id: '2', name: 'First Aid at Work' },
    { id: '3', name: 'Manual Handling' },
    { id: '4', name: 'Fire Safety Awareness' },
    { id: '5', name: 'Food Hygiene' },
    { id: '6', name: 'COSHH Awareness' }
  ];

  // Feedback types for advanced filtering
  const feedbackTypes = [
    'Assessment Feedback', 
    'Observation Feedback', 
    'Learner Feedback', 
    'Standardization Issue',
    'Compliance Concern'
  ];

  // Initialize with sample data
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    // Simulate API call
    setSnackbar({ open: true, message: 'Data refreshed successfully', severity: 'success' });
    
    // Sample data with IQA-specific fields
    const sampleData = [
      {
        id: 1,
        trainer: trainers[0],
        course: courses[0],
        date: '2023-06-15',
        type: 'Assessment Feedback',
        status: 'Pending Review',
        priority: 'High',
        comments: 'Assessment criteria needs clarification - not aligned with awarding body requirements',
        attachments: ['assessment_sample.pdf'],
        iqaAction: 'Review required',
        iqaNotes: '',
        learnerWorkSamples: ['A101', 'A102', 'A103'],
        standardisationMeeting: false
      },
      {
        id: 2,
        trainer: trainers[1],
        course: courses[1],
        date: '2023-06-14',
        type: 'Observation Feedback',
        status: 'Action Required',
        priority: 'Medium',
        comments: 'Excellent session delivery observed, but assessment decisions need standardization',
        attachments: ['observation_notes.docx'],
        iqaAction: 'Standardization session needed',
        iqaNotes: 'Scheduled for 25th June',
        learnerWorkSamples: [],
        standardisationMeeting: true
      },
      {
        id: 3,
        trainer: trainers[2],
        course: courses[2],
        date: '2023-06-12',
        type: 'Standardization Issue',
        status: 'Resolved',
        priority: 'Low',
        comments: 'Minor inconsistencies in grading between assessors',
        attachments: ['grading_samples.zip'],
        iqaAction: 'Standardization completed',
        iqaNotes: 'All assessors now using updated grading criteria',
        learnerWorkSamples: ['B201', 'B202'],
        standardisationMeeting: true
      },
      {
        id: 4,
        trainer: trainers[3],
        course: courses[3],
        date: '2023-06-10',
        type: 'Compliance Concern',
        status: 'Pending Review',
        priority: 'High',
        comments: 'Potential compliance issue with practical assessment recording',
        attachments: ['compliance_issue.pdf'],
        iqaAction: 'Urgent review required',
        iqaNotes: '',
        learnerWorkSamples: ['C301', 'C302'],
        standardisationMeeting: false
      },
      {
        id: 5,
        trainer: trainers[4],
        course: courses[4],
        date: '2023-06-08',
        type: 'Learner Feedback',
        status: 'In Progress',
        priority: 'Medium',
        comments: 'Learners reported unclear feedback on their assessments',
        attachments: ['learner_feedback.xlsx'],
        iqaAction: 'Feedback template review',
        iqaNotes: 'New template being developed',
        learnerWorkSamples: [],
        standardisationMeeting: false
      }
    ];
    
    setFeedbackData(sampleData);
  };

  const handleFeedbackSubmit = (newFeedback) => {
    const newFeedbackWithId = {
      ...newFeedback,
      id: Math.max(...feedbackData.map(f => f.id)) + 1,
      trainer: trainers.find(t => t.id === newFeedback.trainerId) || { name: 'N/A' },
      course: courses.find(c => c.id === newFeedback.courseId) || { name: 'N/A' },
      type: newFeedback.type,
      status: 'Pending Review',
      priority: 'Medium',
      attachments: newFeedback.attachments.map(a => a.name),
      iqaAction: 'Review required',
      iqaNotes: '',
      learnerWorkSamples: [],
      standardisationMeeting: false,
      date: new Date().toISOString().split('T')[0]
    };

    setFeedbackData(prev => [newFeedbackWithId, ...prev]);
    setShowFeedbackForm(false);
    setSnackbar({ open: true, message: 'Feedback submitted successfully!', severity: 'success' });
  };

  const handleStatusChange = (id, newStatus) => {
    setFeedbackData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
    setSnackbar({ open: true, message: `Feedback status updated to ${newStatus}`, severity: 'success' });
  };

  const handleAddActionNote = (id) => {
    if (!actionNote.trim()) return;
    
    setFeedbackData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, iqaNotes: actionNote } : item
      )
    );
    setActionDialogOpen(false);
    setActionNote('');
    setSnackbar({ open: true, message: 'Action note added successfully', severity: 'success' });
  };

  const handleViewDetails = (feedback) => {
    setViewFeedback(feedback);
  };

  const handleCloseDetails = () => {
    setViewFeedback(null);
  };

  const handleGenerateReport = () => {
    setSnackbar({ open: true, message: 'Feedback report generated successfully', severity: 'success' });
    
    // Create CSV content
    const headers = ['ID', 'Trainer', 'Course', 'Date', 'Type', 'Status', 'Priority', 'Comments', 'IQA Action'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        item.id,
        `"${item.trainer.name}"`,
        `"${item.course.name}"`,
        `"${item.date}"`,
        `"${item.type}"`,
        `"${item.status}"`,
        `"${item.priority}"`,
        `"${item.comments}"`,
        `"${item.iqaAction}"`
      ].join(','))
    ].join('\n');
    
    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `iqa-feedback-report-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id) => {
    setFeedbackData(prevData => prevData.filter(item => item.id !== id));
    setSnackbar({ open: true, message: 'Feedback deleted successfully', severity: 'success' });
  };

  const filteredData = feedbackData.filter(item => {
    const matchesSearch = 
      item.trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.comments.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesTypes = 
      selectedTypes.length === 0 || selectedTypes.includes(item.type);
    
    return matchesSearch && matchesStatus && matchesTypes;
  });

  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending review': return 'warning';
      case 'action required': return 'error';
      case 'in progress': return 'info';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  if (showFeedbackForm) {
    return (
      <FeedbackForm 
        trainers={trainers}
        courses={courses}
        onSubmit={handleFeedbackSubmit}
        onCancel={() => setShowFeedbackForm(false)}
      />
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        IQA Feedback Management
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Total Feedback Items</Typography>
              <Typography variant="h4">{feedbackData.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Pending Review</Typography>
              <Typography variant="h4" color="warning.main">
                {feedbackData.filter(f => f.status === 'Pending Review').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Action Required</Typography>
              <Typography variant="h4" color="error.main">
                {feedbackData.filter(f => f.status === 'Action Required').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Standardization Needed</Typography>
              <Typography variant="h4">
                {feedbackData.filter(f => f.standardisationMeeting).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="pending review">Pending Review</MenuItem>
              <MenuItem value="action required">Action Required</MenuItem>
              <MenuItem value="in progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setFilterDialogOpen(true)}
          >
            Advanced Filters
          </Button>
        </Grid>
      </Grid>

      {/* Feedback Table */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              <TableCell sx={{ fontWeight: 600 }}>Trainer/Assessor</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Course</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>IQA Action</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                      {row.trainer.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography>{row.trainer.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.trainer.role}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{row.course.name}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={getStatusColor(row.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.priority}
                    color={getPriorityColor(row.priority)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {row.iqaAction}
                    {row.standardisationMeeting && (
                      <Tooltip title="Standardization meeting scheduled">
                        <TaskIcon color="info" sx={{ ml: 1, fontSize: '1rem' }} />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Tooltip title="View details">
                      <IconButton size="small" onClick={() => handleViewDetails(row)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Add action note">
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setViewFeedback(row);
                          setActionDialogOpen(true);
                        }}
                      >
                        <CommentIcon fontSize="small" color="info" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Mark as resolved">
                      <IconButton 
                        size="small" 
                        onClick={() => handleStatusChange(row.id, 'Resolved')}
                        disabled={row.status === 'Resolved'}
                      >
                        <CheckIcon fontSize="small" color="success" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {paginatedData.length} of {filteredData.length} feedback items
        </Typography>
        <Pagination
          count={Math.ceil(filteredData.length / rowsPerPage)}
          page={page}
          onChange={(e, newPage) => setPage(newPage)}
          color="primary"
        />
      </Box>

      {/* Quick Actions */}
      <Divider sx={{ my: 3 }} />
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          startIcon={<DownloadIcon />}
          onClick={handleGenerateReport}
        >
          Export Feedback Report
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={refreshData}
        >
          Refresh Data
        </Button>
        <Button 
          variant="contained" 
          startIcon={<FeedbackIcon />}
          onClick={() => setShowFeedbackForm(true)}
          sx={{ ml: 'auto' }}
        >
          New IQA Feedback
        </Button>
      </Box>

      {/* Advanced Filters Dialog */}
      <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)}>
        <DialogTitle>Advanced Filters</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Feedback Types
          </Typography>
          <FormGroup>
            {feedbackTypes.map(type => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox
                    checked={selectedTypes.includes(type)}
                    onChange={() => setSelectedTypes(prev =>
                      prev.includes(type)
                        ? prev.filter(t => t !== type)
                        : [...prev, type]
                    )}
                  />
                }
                label={type}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setSelectedTypes([]);
            setStatusFilter('all');
            setSearchTerm('');
          }}>Reset All</Button>
          <Button onClick={() => setFilterDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setFilterDialogOpen(false)}>
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Details Dialog */}
      {viewFeedback && (
        <Dialog 
          open={!!viewFeedback} 
          onClose={handleCloseDetails} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              minHeight: '60vh'
            }
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box>
              <Typography variant="h6">Feedback Details</Typography>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                ID: {viewFeedback.id}
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDetails} sx={{ color: 'inherit' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent dividers sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Trainer/Assessor
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 40, height: 40 }}>
                    {viewFeedback.trainer.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography>{viewFeedback.trainer.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {viewFeedback.trainer.role}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Course
                </Typography>
                <Typography>{viewFeedback.course.name}</Typography>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Date
                </Typography>
                <Typography>{viewFeedback.date}</Typography>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Type
                </Typography>
                <Typography>{viewFeedback.type}</Typography>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Chip 
                  label={viewFeedback.status} 
                  color={getStatusColor(viewFeedback.status)} 
                  size="small"
                />
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Priority
                </Typography>
                <Chip 
                  label={viewFeedback.priority} 
                  color={getPriorityColor(viewFeedback.priority)} 
                  size="small"
                  variant="outlined"
                />
              </Grid>
              
              {/* Divider */}
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              {/* Feedback Content */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Feedback Comments
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  <Typography whiteSpace="pre-wrap">{viewFeedback.comments}</Typography>
                </Paper>
              </Grid>
              
              {/* IQA Actions */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  IQA Action
                </Typography>
                <Typography>{viewFeedback.iqaAction}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  IQA Notes
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  {viewFeedback.iqaNotes || (
                    <Typography color="text.secondary">No notes added yet</Typography>
                  )}
                </Paper>
              </Grid>
              
              {/* Learner Work Samples */}
              {viewFeedback.learnerWorkSamples.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Learner Work Samples ({viewFeedback.learnerWorkSamples.length})
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap',
                    gap: 1,
                    mt: 1
                  }}>
                    {viewFeedback.learnerWorkSamples.map(sample => (
                      <Chip 
                        key={sample} 
                        label={sample} 
                        variant="outlined"
                        onClick={() => {
                          // Implement sample viewing functionality
                          setSnackbar({
                            open: true,
                            message: `Opening learner work sample ${sample}`,
                            severity: 'info'
                          });
                        }}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Grid>
              )}
              
              {/* Attachments */}
              {viewFeedback.attachments.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Attachments ({viewFeedback.attachments.length})
                  </Typography>
                  <List dense sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1
                  }}>
                    {viewFeedback.attachments.map((file, index) => (
                      <ListItem 
                        key={index}
                        secondaryAction={
                          <Tooltip title="Download attachment">
                            <IconButton
                              edge="end"
                              aria-label="download"
                              onClick={() => {
                                // Simulate download functionality
                                const link = document.createElement('a');
                                link.href = `#${file}`; // Replace with actual file URL
                                link.download = file;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                
                                setSnackbar({
                                  open: true,
                                  message: `Downloading ${file}`,
                                  severity: 'success'
                                });
                              }}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        }
                        sx={{
                          borderBottom: index < viewFeedback.attachments.length - 1 ? 
                            '1px solid' : 'none',
                          borderColor: 'divider'
                        }}
                      >
                        <ListItemText 
                          primary={file}
                          primaryTypographyProps={{
                            noWrap: true,
                            sx: { 
                              maxWidth: 'calc(100% - 40px)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={handleCloseDetails}
              variant="contained"
              sx={{ minWidth: 120 }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Add Action Note Dialog */}
      <Dialog 
        open={actionDialogOpen} 
        onClose={() => setActionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2
        }}>
          <Typography variant="h6">Add IQA Action Note</Typography>
          <IconButton 
            onClick={() => setActionDialogOpen(false)} 
            sx={{ color: 'inherit' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Feedback Reference: {viewFeedback?.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Trainer: {viewFeedback?.trainer.name} | Course: {viewFeedback?.course.name}
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            multiline
            minRows={4}
            maxRows={8}
            value={actionNote}
            onChange={(e) => setActionNote(e.target.value)}
            placeholder="Enter detailed action notes, follow-up instructions, or standardization requirements..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              }
            }}
          />
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Note: This will be visible to the trainer/assessor and recorded in the IQA audit trail.
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button 
            onClick={() => setActionDialogOpen(false)}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              handleAddActionNote(viewFeedback?.id);
              setActionDialogOpen(false);
            }}
            disabled={!actionNote.trim()}
            sx={{ minWidth: 100 }}
            startIcon={<CheckIcon />}
          >
            Save Note
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar */}
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

export default FeedbackManagement;