import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Rating, Checkbox,
  FormControlLabel, Snackbar, Alert, Paper, Typography, List, Accordion, AccordionSummary,
  AccordionDetails, Box
} from '@mui/material';
import { Feedback as FeedbackIcon, ExpandMore, Edit, StarBorder } from '@mui/icons-material';
import { format } from 'date-fns';

const StudentFeedback = ({ open = false, onClose, type, target, onSubmit, feedback = [] }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getTitle = () => {
    if (!type) return 'Submit Feedback';
    switch (type) {
      case 'course':
        return `Feedback for ${target?.title || 'this course'}`;
      case 'instructor':
        return `Feedback for ${target?.name || 'the instructor'}`;
      case 'lms':
        return 'General LMS Feedback';
      default:
        return 'Submit Feedback';
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      onSubmit();
      setLoading(false);
      setSuccess(true);
      onClose();
    }, 1500);
  };

  useEffect(() => {
    if (!open) {
      setRating(0);
      setComment('');
      setAnonymous(false);
      setSuccess(false);
    }
  }, [open]);

  return (
    <>
      {/* Feedback Submission Modal */}
      {open && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography gutterBottom>How would you rate your experience?</Typography>
              <Rating
                value={rating}
                onChange={(e, newValue) => setRating(newValue)}
                precision={0.5}
                size="large"
                emptyIcon={<StarBorder fontSize="inherit" />}
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your feedback"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              margin="normal"
              placeholder="What did you like? What could be improved?"
            />
            <FormControlLabel
              control={<Checkbox checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} color="primary" />}
              label="Submit anonymously"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!rating || loading}
            >
              Submit Feedback
            </Button>
          </DialogActions>
          <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
            <Alert onClose={() => setSuccess(false)} severity="success">
              Thank you for your feedback!
            </Alert>
          </Snackbar>
        </Dialog>
      )}

      {/* Feedback History View */}
      {!open && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5">Your Feedback</Typography>
            <Button variant="contained" startIcon={<FeedbackIcon />} onClick={() => onFeedback({ title: 'Learning Management System' }, 'lms')}>
              General LMS Feedback
            </Button>
          </Box>
          {feedback.length > 0 ? (
            <List>
              {feedback.map(item => (
                <Accordion key={item.id} elevation={0}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                      <Rating value={item.rating} precision={0.5} readOnly sx={{ mr: 2 }} />
                      <Typography sx={{ flexGrow: 1 }}>
                        {item.course} • {format(new Date(item.date), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography paragraph>{item.comment}</Typography>
                    <Button size="small" startIcon={<Edit />}>Edit Feedback</Button>
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          ) : (
            <Box textAlign="center" py={4}>
              <FeedbackIcon fontSize="large" color="action" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" gutterBottom>You haven't submitted any feedback yet</Typography>
              <Typography color="text.secondary" paragraph>Your feedback helps improve the learning experience</Typography>
              <Button variant="contained" startIcon={<FeedbackIcon />} onClick={() => onFeedback({ title: 'Learning Management System' }, 'lms')}>
                Share Your Feedback
              </Button>
            </Box>
          )}
        </Paper>
      )}
    </>
  );
};

export default StudentFeedback;