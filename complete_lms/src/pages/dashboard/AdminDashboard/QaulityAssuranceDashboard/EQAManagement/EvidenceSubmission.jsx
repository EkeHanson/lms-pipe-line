import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  TextField,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Avatar,
  Tooltip,
  Badge,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  CloudUpload,
  Description,
  CheckCircle,
  Pending,
  Error,
  Delete,
  Add,
  Visibility,
  Download,
  Lock,
  History,
  Comment,
  Task
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const EvidenceSubmission = ({ isReadOnly = false }) => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [newEvidence, setNewEvidence] = useState({
    name: '',
    description: '',
    file: null,
    type: 'assessment'
  });
  const [comment, setComment] = useState('');
  const [filter, setFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      name: 'Trainer Qualifications',
      description: 'Certificates for all active trainers',
      type: 'trainer',
      status: 'approved',
      date: '2023-05-15',
      submittedBy: 'Admin User',
      reviewedBy: 'EQA Team A',
      files: ['trainer_certs.zip'],
      comments: [
        { text: 'All certificates verified', by: 'EQA Team A', date: '2023-05-12' }
      ],
      history: [
        { date: '2023-05-10', action: 'Submitted', by: 'Admin User' },
        { date: '2023-05-12', action: 'Approved', by: 'EQA Team A' }
      ]
    },
    {
      id: 2,
      name: 'IQA Process Documentation',
      description: 'Internal quality assurance procedures',
      type: 'process',
      status: 'pending',
      date: '2023-06-20',
      submittedBy: 'IQA Lead',
      reviewedBy: '',
      files: ['iqa_policy.pdf', 'iqa_records.xlsx'],
      comments: [],
      history: [
        { date: '2023-06-20', action: 'Submitted', by: 'IQA Lead' }
      ]
    },
    {
      id: 3,
      name: 'Learner Assessment Samples',
      description: 'Random sample of graded learner assessments',
      type: 'assessment',
      status: 'rejected',
      date: '2023-04-10',
      submittedBy: 'Assessor',
      reviewedBy: 'EQA Team B',
      files: ['assessments_sample.zip'],
      comments: [
        { text: 'Inconsistent grading found', by: 'EQA Team B', date: '2023-04-15' }
      ],
      history: [
        { date: '2023-04-10', action: 'Submitted', by: 'Assessor' },
        { date: '2023-04-12', action: 'Reviewed', by: 'EQA Team B' },
        { date: '2023-04-15', action: 'Rejected', by: 'EQA Team B' }
      ]
    }
  ]);

  const handleAddEvidence = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setNewEvidence({
      name: '',
      description: '',
      file: null,
      type: 'assessment'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvidence(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setNewEvidence(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleSubmitEvidence = () => {
    const newSubmission = {
      id: Math.max(...submissions.map(s => s.id)) + 1,
      name: newEvidence.name,
      description: newEvidence.description,
      type: newEvidence.type,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      submittedBy: 'Current User',
      reviewedBy: '',
      files: [newEvidence.file?.name || 'evidence.pdf'],
      comments: [],
      history: [
        { date: new Date().toISOString().split('T')[0], action: 'Submitted', by: 'Current User' }
      ]
    };

    setSubmissions([...submissions, newSubmission]);
    setSnackbar({
      open: true,
      message: "Evidence submitted successfully!",
      severity: "success"
    });
    handleDialogClose();
  };

  const handleDeleteSubmission = (id) => {
    setSubmissions(submissions.filter(sub => sub.id !== id));
    setSnackbar({
      open: true,
      message: "Evidence deleted",
      severity: "warning"
    });
  };

  const handleOpenDetails = (submission) => {
    setSelectedSubmission(submission);
    setOpenDetails(true);
  };

  const handleOpenComments = (submission) => {
    setSelectedSubmission(submission);
    setOpenComments(true);
  };

  const handleAddComment = () => {
    if (!comment.trim() || !selectedSubmission) return;

    const updatedSubmissions = submissions.map(sub => {
      if (sub.id === selectedSubmission.id) {
        return {
          ...sub,
          comments: [
            ...sub.comments,
            { text: comment, by: 'Current User', date: new Date().toISOString().split('T')[0] }
          ]
        };
      }
      return sub;
    });

    setSubmissions(updatedSubmissions);
    setComment('');
    setSnackbar({
      open: true,
      message: "Comment added",
      severity: "success"
    });
  };

  const handleStatusChange = (submissionId, newStatus) => {
    const updatedSubmissions = submissions.map(sub => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          status: newStatus,
          reviewedBy: newStatus !== 'pending' ? 'Current User' : '',
          history: [
            ...sub.history,
            { 
              date: new Date().toISOString().split('T')[0], 
              action: newStatus === 'approved' ? 'Approved' : 'Rejected',
              by: 'Current User'
            }
          ]
        };
      }
      return sub;
    });

    setSubmissions(updatedSubmissions);
    setOpenDetails(false);
    setSnackbar({
      open: true,
      message: `Evidence ${newStatus}`,
      severity: newStatus === 'approved' ? 'success' : 'warning'
    });
  };

  const filteredSubmissions = filter === 'all' 
    ? submissions 
    : submissions.filter(sub => sub.status === filter);

  const evidenceTypes = [
    { value: 'assessment', label: 'Assessment Samples' },
    { value: 'trainer', label: 'Trainer Qualifications' },
    { value: 'process', label: 'Process Documentation' },
    { value: 'facility', label: 'Facility Evidence' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Evidence Submission
        {isReadOnly && (
          <Chip 
            icon={<Lock />} 
            label="EQA Review Mode" 
            size="small" 
            sx={{ ml: 2 }} 
            color="info"
          />
        )}
      </Typography>

      <Grid container spacing={3}>
        {/* Filters and Actions */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Filter by Status</InputLabel>
                  <Select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    label="Filter by Status"
                  >
                    <MenuItem value="all">All Submissions</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>

                {!isReadOnly && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleAddEvidence}
                  >
                    Add New Evidence
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Submission List */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Evidence</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Description</TableCell>
                      {isReadOnly && <TableCell>Submitted By</TableCell>}
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>{submission.name}</TableCell>
                        <TableCell>
                          <Chip 
                            label={
                              evidenceTypes.find(t => t.value === submission.type)?.label || submission.type
                            } 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell sx={{ maxWidth: 300 }}>
                          <Typography noWrap>
                            {submission.description}
                          </Typography>
                        </TableCell>
                        {isReadOnly && (
                          <TableCell>
                            <Tooltip title={submission.submittedBy}>
                              <Avatar sx={{ width: 32, height: 32 }}>
                                {submission.submittedBy.charAt(0)}
                              </Avatar>
                            </Tooltip>
                          </TableCell>
                        )}
                        <TableCell>
                          <Chip
                            icon={
                              submission.status === 'approved' ? <CheckCircle /> :
                              submission.status === 'rejected' ? <Error /> : <Pending />
                            }
                            label={submission.status}
                            color={
                              submission.status === 'approved' ? 'success' :
                              submission.status === 'rejected' ? 'error' : 'warning'
                            }
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>{submission.date}</TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              onClick={() => handleOpenDetails(submission)}
                              color="primary"
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download Files">
                            <IconButton size="small" color="secondary">
                              <Download />
                            </IconButton>
                          </Tooltip>
                          {isReadOnly ? (
                            <>
                              <Tooltip title="Comments">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleOpenComments(submission)}
                                >
                                  <Badge 
                                    badgeContent={submission.comments.length} 
                                    color="primary"
                                  >
                                    <Comment />
                                  </Badge>
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="History">
                                <IconButton size="small">
                                  <History />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            submission.status === 'pending' && (
                              <Tooltip title="Delete">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleDeleteSubmission(submission.id)}
                                  color="error"
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            )
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Evidence Details Dialog */}
      <Dialog 
        open={openDetails} 
        onClose={() => setOpenDetails(false)} 
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedSubmission?.name}
          {isReadOnly && selectedSubmission?.status === 'pending' && (
            <Box sx={{ float: 'right' }}>
              <Button 
                variant="contained" 
                color="error" 
                sx={{ mr: 1 }}
                onClick={() => handleStatusChange(selectedSubmission.id, 'rejected')}
              >
                Reject
              </Button>
              <Button 
                variant="contained" 
                color="success"
                onClick={() => handleStatusChange(selectedSubmission.id, 'approved')}
              >
                Approve
              </Button>
            </Box>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedSubmission && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Details
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Type:</strong> {evidenceTypes.find(t => t.value === selectedSubmission.type)?.label || selectedSubmission.type}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Description:</strong> {selectedSubmission.description}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Submitted:</strong> {selectedSubmission.date} by {selectedSubmission.submittedBy}
                  </Typography>
                  {selectedSubmission.reviewedBy && (
                    <Typography variant="body1">
                      <strong>Reviewed by:</strong> {selectedSubmission.reviewedBy}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Files
                  </Typography>
                  <List>
                    {selectedSubmission.files.map((file, index) => (
                      <ListItem 
                        key={index}
                        secondaryAction={
                          <IconButton edge="end">
                            <Download />
                          </IconButton>
                        }
                      >
                        <ListItemIcon>
                          <Description />
                        </ListItemIcon>
                        <ListItemText primary={file} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>

              {isReadOnly && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Add Review Comment
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter your comments..."
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<Comment />}
                    onClick={handleAddComment}
                    disabled={!comment.trim()}
                  >
                    Add Comment
                  </Button>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Comments Dialog */}
      <Dialog 
        open={openComments} 
        onClose={() => setOpenComments(false)} 
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Comments for {selectedSubmission?.name}
        </DialogTitle>
        <DialogContent>
          {selectedSubmission?.comments.length > 0 ? (
            <List>
              {selectedSubmission.comments.map((comment, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <Avatar>{comment.by.charAt(0)}</Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={comment.by}
                      secondary={
                        <>
                          <Typography variant="body2">
                            {comment.text}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {comment.date}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < selectedSubmission.comments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ p: 2 }}>
              No comments yet
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenComments(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Evidence Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleDialogClose} 
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Submit New Evidence</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Evidence Name"
              name="name"
              value={newEvidence.name}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
              required
            />
            
            <TextField
              select
              fullWidth
              label="Evidence Type"
              name="type"
              value={newEvidence.type}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
            >
              {evidenceTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={newEvidence.description}
              onChange={handleInputChange}
              multiline
              rows={3}
              sx={{ mb: 3 }}
            />
            
            <Button
              component="label"
              variant="outlined"
              color="primary"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{ mb: 2 }}
            >
              Upload File
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {newEvidence.file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {newEvidence.file.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button 
            onClick={handleSubmitEvidence}
            variant="contained"
            color="primary"
            disabled={!newEvidence.name || !newEvidence.file}
          >
            Submit Evidence
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      {snackbar.open && (
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar({...snackbar, open: false})}
          sx={{ position: 'fixed', bottom: 20, right: 20, minWidth: 300 }}
        >
          {snackbar.message}
        </Alert>
      )}
    </Box>
  );
};

export default EvidenceSubmission;