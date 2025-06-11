import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button,
  Select, MenuItem, FormControl, InputLabel, Grid, Card, CardHeader, CardContent, Divider,
  Rating, IconButton, Chip, Avatar, Paper, List, ListItem, ListItemText,
  ListItemSecondaryAction, Snackbar, Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  AttachFile as AttachFileIcon, Delete as DeleteIcon, Person as PersonIcon, School as CourseIcon,
  Computer as SystemIcon
} from '@mui/icons-material';

// Dummy data for trainers and courses
const DUMMY_TRAINERS = [
  { id: '1', name: 'John Smith', avatar: '' },
  { id: '2', name: 'Sarah Johnson', avatar: '' },
  { id: '3', name: 'Michael Brown', avatar: '' },
  { id: '4', name: 'Emily Davis', avatar: '' }
];

const DUMMY_COURSES = [
  { id: '1', name: 'Advanced React' },
  { id: '2', name: 'Node.js Fundamentals' },
  { id: '3', name: 'Database Design' },
  { id: '4', name: 'UI/UX Principles' }
];

const FeedbackForm = ({ trainers = DUMMY_TRAINERS, courses = DUMMY_COURSES, onClose }) => {
    const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    type: 'trainer',
    trainerId: trainers[0]?.id || '',
    courseId: courses[0]?.id || '',
    rating: 3,
    comments: '',
    attachments: []
  });
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFeedback(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...files.map(file => ({
          name: file.name,
          size: file.size,
          file
        }))]
      }));
      setFileInputKey(Date.now());
    }
  };

  const handleRemoveAttachment = (index) => {
    setFeedback(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleGoBack = () => {
    // First try using the onClose prop if provided (for modal usage)
    if (typeof onClose === 'function') {
      onClose();
    } 
    // Otherwise use navigation
    else {
      navigate(-1); // Go back to previous page
    }
  };

  const handleSubmit = () => {
    console.log('Feedback submitted:', feedback);
    
    setSnackbar({
      open: true,
      message: 'Feedback submitted successfully!',
      severity: 'success'
    });
    
    // Use the same back navigation as handleGoBack
    setTimeout(() => handleGoBack(), 1500);
  };
 

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleGoBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Provide Feedback
        </Typography>
      </Box>

      <Card>
        <CardHeader title="Feedback Details" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Feedback Type</InputLabel>
                <Select
                  name="type"
                  value={feedback.type}
                  onChange={handleChange}
                  label="Feedback Type"
                >
                  <MenuItem value="trainer">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon fontSize="small" /> Trainer Feedback
                    </Box>
                  </MenuItem>
                  <MenuItem value="course">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CourseIcon fontSize="small" /> Course Feedback
                    </Box>
                  </MenuItem>
                  <MenuItem value="system">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SystemIcon fontSize="small" /> System Feedback
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {feedback.type === 'trainer' && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Trainer</InputLabel>
                  <Select
                    name="trainerId"
                    value={feedback.trainerId}
                    onChange={handleChange}
                    label="Select Trainer"
                  >
                    {trainers?.map(trainer => (
                      <MenuItem key={trainer.id} value={trainer.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24 }} src={trainer.avatar}>
                            {trainer.name.charAt(0)}
                          </Avatar>
                          {trainer.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {feedback.type === 'course' && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Course</InputLabel>
                  <Select
                    name="courseId"
                    value={feedback.courseId}
                    onChange={handleChange}
                    label="Select Course"
                  >
                    {courses?.map(course => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography component="legend">Rating</Typography>
              <Rating
                name="rating"
                value={Number(feedback.rating)}
                onChange={(event, newValue) => {
                  setFeedback(prev => ({ ...prev, rating: newValue }));
                }}
                precision={0.5}
                size="large"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="comments"
                label="Detailed Feedback"
                value={feedback.comments}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <input
                key={fileInputKey}
                type="file"
                id="file-upload"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<AttachFileIcon />}
                >
                  Attach Files
                </Button>
              </label>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Maximum file size: 5MB. Supported formats: PDF, JPG, PNG
              </Typography>
            </Grid>

            {feedback.attachments.length > 0 && (
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Attachments ({feedback.attachments.length})
                  </Typography>
                  <List dense>
                    {feedback.attachments.map((file, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024).toFixed(2)} KB`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleRemoveAttachment(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            )}
          </Grid>
        </CardContent>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button variant="outlined" sx={{ mr: 2 }} onClick={handleGoBack}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!feedback.comments.trim()}
          >
            Submit Feedback
          </Button>
        </Box>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FeedbackForm;