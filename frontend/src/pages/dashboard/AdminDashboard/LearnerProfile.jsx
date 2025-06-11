import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, Paper, Avatar, Divider,
  Chip, Tabs, Tab, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Button, TextField, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress
} from '@mui/material';
import {
  Email as EmailIcon, Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon, Pending as PendingIcon,
  Edit as EditIcon, Delete as DeleteIcon,
  Add as AddIcon, Close as CloseIcon, ArrowBack as ArrowBackIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { coursesAPI } from '../../../config';

const LearnerProfile = ({ learnerId }) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [isEditingContact, setIsEditingContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Learner data state
  const [learnerData, setLearnerData] = useState({
    id: learnerId,
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+1 555-123-4567',
    coursesSubscribed: 5,
    coursesCompleted: 3,
    completionRate: 60,
    qualifications: 'BSc Computer Science, MSc Data Science',
    target: 'Become a full-stack developer',
    keyActivities: 'Working on React projects, Learning Node.js',
    coursesTaken: [
      { id: 1, name: 'React Fundamentals', status: 'completed' },
      { id: 2, name: 'Advanced JavaScript', status: 'completed' },
      { id: 3, name: 'Node.js Basics', status: 'completed' },
      { id: 4, name: 'Database Design', status: 'in-progress' },
      { id: 5, name: 'Cloud Computing', status: 'pending' }
    ],
    contactLogs: [
      { id: 1, date: '2023-06-01', method: 'email', notes: 'Follow-up on course progress', admin: 'John Doe' },
      { id: 2, date: '2023-05-15', method: 'phone', notes: 'Initial consultation', admin: 'Jane Smith' },
      { id: 3, date: '2023-04-10', method: 'messaging', notes: 'Course recommendation', admin: 'John Doe' }
    ]
  });

  // Gamification state
  const [userBadges, setUserBadges] = useState([]);
  const [userPoints, setUserPoints] = useState(0);

  // Contact log state
  const [newContactLog, setNewContactLog] = useState({
    date: new Date().toISOString().split('T')[0],
    method: 'email',
    notes: '',
    admin: 'Current User'
  });

  // Fetch gamification data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const [badgesResponse, pointsResponse] = await Promise.all([
          coursesAPI.getUserBadges(learnerId),
          coursesAPI.getUserPoints(learnerId),
        ]);
        setUserBadges(badgesResponse.data?.results || []);
        setUserPoints(pointsResponse.data?.total_points || 0);
        if (badgesResponse.data?.results?.length > 0) {
          toast.success('New badge earned!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (err) {
        setError('Failed to load gamification data');
        console.error('Error fetching gamification data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [learnerId]);

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Contact log handlers
  const handleEditContact = (log) => {
    setIsEditingContact(log.id);
  };

  const handleSaveContact = () => {
    setIsEditingContact(null);
  };

  const handleDeleteContact = (logId) => {
    setLearnerData(prev => ({
      ...prev,
      contactLogs: prev.contactLogs.filter(log => log.id !== logId)
    }));
  };

  const handleAddContact = () => {
    const newLog = {
      ...newContactLog,
      id: Math.max(...learnerData.contactLogs.map(log => log.id), 0) + 1
    };
    
    setLearnerData(prev => ({
      ...prev,
      contactLogs: [...prev.contactLogs, newLog]
    }));
    
    setNewContactLog({
      date: new Date().toISOString().split('T')[0],
      method: 'email',
      notes: '',
      admin: 'Current User'
    });
    
    setOpenModal(false);
  };

  // Modal handlers
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ToastContainer />
      <Button 
        onClick={() => navigate('/admin/users')}
        variant="outlined" 
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Back to Users
      </Button>

      {/* Learner Profile Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mb: 2,
                  bgcolor: 'primary.light',
                  color: 'primary.main',
                  fontSize: '3rem'
                }}
              >
                {learnerData.name.charAt(0)}
              </Avatar>
              <Typography variant="h5" component="h1" align="center">
                {learnerData.name}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  {learnerData.email}
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  {learnerData.phone || 'Not provided'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, mr: 1 }}>
                    Courses:
                  </Typography>
                  <Typography variant="body1">
                    {learnerData.coursesSubscribed} subscribed • {learnerData.coursesCompleted} completed
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                    Completion Rate:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={learnerData.completionRate} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 5, 
                        flexGrow: 1,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          backgroundColor: learnerData.completionRate >= 75 ? 'success.main' : 
                                          learnerData.completionRate >= 50 ? 'warning.main' : 'error.main'
                        }
                      }} 
                    />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {learnerData.completionRate}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                  Qualifications
                </Typography>
                <Typography variant="body1">
                  {learnerData.qualifications || 'Not specified'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                  Target
                </Typography>
                <Typography variant="body1">
                  {learnerData.target || 'Not specified'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                  Key Activities
                </Typography>
                <Typography variant="body1">
                  {learnerData.keyActivities || 'Not specified'}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Courses" />
        <Tab label="Contact Log" />
        <Tab label="Gamification" />
      </Tabs>

      {/* Courses Tab */}
      {tabValue === 0 && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Course Progress
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                Completed Courses
              </Typography>
              {learnerData.coursesTaken
                .filter(course => course.status === 'completed')
                .map(course => (
                  <Box key={course.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    <Typography>{course.name}</Typography>
                  </Box>
                ))}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                Pending/In-Progress Courses
              </Typography>
              {learnerData.coursesTaken
                .filter(course => course.status !== 'completed')
                .map(course => (
                  <Box key={course.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PendingIcon color={course.status === 'in-progress' ? 'warning' : 'disabled'} sx={{ mr: 1 }} />
                    <Typography>{course.name}</Typography>
                    <Chip 
                      label={course.status === 'in-progress' ? 'In Progress' : 'Pending'} 
                      size="small" 
                      sx={{ ml: 1 }}
                      color={course.status === 'in-progress' ? 'warning' : 'default'}
                    />
                  </Box>
                ))}
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Contact Log Tab */}
      {tabValue === 1 && (
        <Box>
          <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Contact History
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenModal}
              >
                Add Contact Log
              </Button>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {learnerData.contactLogs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>{log.date}</TableCell>
                      <TableCell>
                        <Chip 
                          label={log.method.charAt(0).toUpperCase() + log.method.slice(1)} 
                          size="small" 
                          variant="outlined"
                          color={
                            log.method === 'email' ? 'primary' : 
                            log.method === 'phone' ? 'secondary' : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {isEditingContact === log.id ? (
                          <TextField
                            fullWidth
                            value={log.notes}
                            onChange={(e) => {
                              const updatedLogs = learnerData.contactLogs.map(item => 
                                item.id === log.id ? {...item, notes: e.target.value} : item
                              );
                              setLearnerData({...learnerData, contactLogs: updatedLogs});
                            }}
                          />
                        ) : (
                          log.notes
                        )}
                      </TableCell>
                      <TableCell>{log.admin}</TableCell>
                      <TableCell align="right">
                        {isEditingContact === log.id ? (
                          <>
                            <IconButton onClick={handleSaveContact} color="primary">
                              <CheckCircleIcon />
                            </IconButton>
                            <IconButton onClick={() => setIsEditingContact(null)} color="error">
                              <CloseIcon />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton onClick={() => handleEditContact(log)} color="primary">
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleDeleteContact(log.id)} 
                              color="error"
                              sx={{ ml: 1 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}

      {/* Gamification Tab */}
      {tabValue === 2 && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Gamification
          </Typography>
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StarIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Total Points: {userPoints}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                Earned Badges
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <LinearProgress sx={{ width: '100%' }} />
                </Box>
              ) : userBadges.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No badges earned yet
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {userBadges.map(badge => (
                    <Box key={badge.id} sx={{ mb: 2, width: { xs: '100%', sm: 'auto' } }}>
                      <Chip
                        avatar={<Avatar src={badge.badge.image} />}
                        label={badge.badge.title}
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                        Progress: {learnerData.coursesCompleted} / {badge.badge.criteria.courses_completed} courses
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(learnerData.coursesCompleted / badge.badge.criteria.courses_completed) * 100}
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            backgroundColor: 'primary.main'
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Add Contact Log Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>
          Add New Contact Log
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={newContactLog.date}
                onChange={(e) => setNewContactLog({...newContactLog, date: e.target.value})}
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Contact Method"
                value={newContactLog.method}
                onChange={(e) => setNewContactLog({...newContactLog, method: e.target.value})}
                margin="normal"
              >
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="phone">Phone</MenuItem>
                <MenuItem value="messaging">Messaging</MenuItem>
                <MenuItem value="in-person">In Person</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={newContactLog.notes}
                onChange={(e) => setNewContactLog({...newContactLog, notes: e.target.value})}
                multiline
                rows={4}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="outlined">Cancel</Button>
          <Button 
            onClick={handleAddContact} 
            variant="contained" 
            color="primary"
            disabled={!newContactLog.notes.trim()}
          >
            Add Contact Log
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LearnerProfile;