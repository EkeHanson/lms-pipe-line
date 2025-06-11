// src/components/QaulityAssuranceDashboard/IqaSamplingModal.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Person as TrainerIcon,
  School as CourseIcon,
  Checklist as ChecklistIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const IqaSamplingModal = ({ open, onClose }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    sampleType: 'random',
    course: '',
    trainer: '',
    date: '',
    focusArea: '',
    notes: ''
  });

  const courses = [
    'Advanced React Development',
    'Cybersecurity Fundamentals',
    'Data Science Bootcamp',
    'Cloud Architecture'
  ];

  const trainers = [
    'Dr. Sarah Johnson',
    'Prof. James Wilson',
    'Dr. Lisa Chen',
    'Prof. Robert Taylor'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Submitting IQA sampling:', formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <ChecklistIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Schedule New Quality Check</Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Sampling Type</InputLabel>
              <Select
                name="sampleType"
                value={formData.sampleType}
                onChange={handleChange}
                label="Sampling Type"
              >
                <MenuItem value="random">Random Sampling</MenuItem>
                <MenuItem value="targeted">Targeted Sampling</MenuItem>
                <MenuItem value="full">Full Cohort</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Course</InputLabel>
              <Select
                name="course"
                value={formData.course}
                onChange={handleChange}
                label="Course"
                startAdornment={<CourseIcon />}
              >
                {courses.map(course => (
                  <MenuItem key={course} value={course}>{course}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Trainer</InputLabel>
              <Select
                name="trainer"
                value={formData.trainer}
                onChange={handleChange}
                label="Trainer"
              >
                {trainers.map(trainer => (
                  <MenuItem key={trainer} value={trainer}>{trainer}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Scheduled Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Focus Area</InputLabel>
              <Select
                name="focusArea"
                value={formData.focusArea}
                onChange={handleChange}
                label="Focus Area"
              >
                <MenuItem value="assessment">Assessment Quality</MenuItem>
                <MenuItem value="delivery">Delivery Methods</MenuItem>
                <MenuItem value="materials">Learning Materials</MenuItem>
                <MenuItem value="feedback">Learner Feedback</MenuItem>
                <MenuItem value="compliance">Compliance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="normal"
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={3}
              placeholder="Any specific instructions or focus points for this quality check..."
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Schedule Quality Check
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IqaSamplingModal;