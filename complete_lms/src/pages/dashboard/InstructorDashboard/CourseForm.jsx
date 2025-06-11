
import React, { useState, useEffect } from 'react';
import { Box, TextField, Select, MenuItem, Button, Chip, Typography } from '@mui/material';
import dummyData from './dummyData';

const CourseForm = ({ course, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    status: 'Draft',
    thumbnail: '',
    prerequisites: []
  });

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        category: course.category,
        status: course.status,
        thumbnail: course.thumbnail,
        prerequisites: course.prerequisites
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePrerequisites = (e) => {
    setFormData({ ...formData, prerequisites: e.target.value });
  };

  const handleSubmit = () => {
    console.log('Submitting course:', formData);
    onSubmit();
  };

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Course Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        margin="normal"
        required
      />
      <Select
        fullWidth
        name="category"
        value={formData.category}
        onChange={handleChange}
        displayEmpty
        margin="normal"
        sx={{ mt: 2 }}
      >
        <MenuItem value="" disabled>Select Category</MenuItem>
        <MenuItem value="AI">AI</MenuItem>
        <MenuItem value="Web">Web</MenuItem>
        <MenuItem value="CS Core">CS Core</MenuItem>
      </Select>
      <Select
        fullWidth
        name="status"
        value={formData.status}
        onChange={handleChange}
        margin="normal"
        sx={{ mt: 2 }}
      >
        <MenuItem value="Draft">Draft</MenuItem>
        <MenuItem value="Published">Published</MenuItem>
        <MenuItem value="Archived">Archived</MenuItem>
      </Select>
      <TextField
        fullWidth
        label="Thumbnail URL"
        name="thumbnail"
        value={formData.thumbnail}
        onChange={handleChange}
        margin="normal"
      />
      <Box mt={2}>
        <Typography variant="subtitle1">Prerequisites</Typography>
        <Select
          multiple
          fullWidth
          value={formData.prerequisites}
          onChange={handlePrerequisites}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map(value => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {['Programming 101', 'Data Structures', 'Web Basics'].map(prereq => (
            <MenuItem key={prereq} value={prereq}>{prereq}</MenuItem>
          ))}
        </Select>
      </Box>
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        onClick={handleSubmit}
        disabled={!formData.title || !formData.category}
      >
        {course ? 'Update Course' : 'Create Course'}
      </Button>
    </Box>
  );
};

export default CourseForm;
