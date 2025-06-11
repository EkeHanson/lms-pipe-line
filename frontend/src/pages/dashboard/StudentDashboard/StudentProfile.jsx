import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box , TextField, Grid, Avatar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Upload } from '@mui/icons-material';

const StudentProfile = ({ open, onClose, student, onSave }) => {
  const [formData, setFormData] = useState({
    name: student.name,
    bio: student.bio,
    interests: student.interests,
    learningTrack: student.learningTrack,
    language: student.language
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Profile Settings</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar src={student.avatar} sx={{ width: 120, height: 120, mb: 2 }} />
              <Button variant="outlined" startIcon={<Upload />}>Change Photo</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Email" value={student.email} margin="normal" disabled />
            <TextField fullWidth label="Department" value={student.department} margin="normal" disabled />
            <TextField fullWidth label="Bio" name="bio" multiline rows={4} value={formData.bio} onChange={handleChange} margin="normal" />
            <FormControl fullWidth margin="normal">
              <InputLabel>Learning Track</InputLabel>
              <Select name="learningTrack" value={formData.learningTrack} onChange={handleChange}>
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Language</InputLabel>
              <Select name="language" value={formData.language} onChange={handleChange}>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave()}>Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentProfile;