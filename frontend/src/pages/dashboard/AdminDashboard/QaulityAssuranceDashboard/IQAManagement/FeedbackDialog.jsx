import React, { useState } from 'react';
import {
  Dialog,  DialogTitle,  DialogContent,  DialogActions,
  Box,  Typography,  TextField,
  Button,  Select,  MenuItem,  FormControl,
  InputLabel,  Grid,  Divider,  Rating,
  IconButton,  Chip,  Avatar,
  Paper,  List,  ListItem,
  ListItemText,  ListItemSecondaryAction,  Snackbar,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  School as CourseIcon,
  Computer as SystemIcon
} from '@mui/icons-material';

const FeedbackDialog = ({ open, onClose, trainers, courses }) => {
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

  const handleSubmit = () => {
    console.log('Feedback submitted:', feedback);
    
    setSnackbar({
      open: true,
      message: 'Feedback submitted successfully!',
      severity: 'success'
    });
    
    // Close the dialog after submission
    setTimeout(() => {
      onClose();
      // Reset form
      setFeedback({
        type: 'trainer',
        trainerId: trainers[0]?.id || '',
        courseId: courses[0]?.id || '',
        rating: 3,
        comments: '',
        attachments: []
      });
    }, 1500);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Provide Feedback</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ pt: 2 }}>
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
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!feedback.comments.trim()}
          >
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default FeedbackDialog;