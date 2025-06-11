import React, { useState } from 'react';
import { Paper, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const StudentSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');

  const dummyCourses = [
    { id: 4, title: 'Cloud Computing Basics', category: 'Cloud', level: 'Beginner', price: 59.99, thumbnail: 'https://source.unsplash.com/random/300x200?cloud' },
    { id: 5, title: 'Cybersecurity Essentials', category: 'Security', level: 'Intermediate', price: 69.99, thumbnail: 'https://source.unsplash.com/random/300x200?security' }
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Search Courses</Typography>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Search by title or instructor"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{ startAdornment: <SearchIcon /> }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="AI">AI</MenuItem>
              <MenuItem value="Web">Web Development</MenuItem>
              <MenuItem value="Cloud">Cloud Computing</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Level</InputLabel>
            <Select value={level} onChange={(e) => setLevel(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {dummyCourses.map(course => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card>
              <CardMedia component="img" height="140" image={course.thumbnail} alt={course.title} />
              <CardContent>
                <Typography variant="h6">{course.title}</Typography>
                <Typography variant="body2">Category: {course.category}</Typography>
                <Typography variant="body2">Level: {course.level}</Typography>
                <Typography variant="body2">${course.price}</Typography>
                <Button variant="contained" sx={{ mt: 2 }}>Enroll Now</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default StudentSearch;