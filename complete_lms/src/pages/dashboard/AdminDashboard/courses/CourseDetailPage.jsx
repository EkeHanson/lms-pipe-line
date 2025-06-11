import React, { useState, useEffect } from 'react';
import { 
  useParams, useNavigate, useLocation 
} from 'react-router-dom';
import { 
  Box, Typography, Button, Grid, Paper, Divider, 
  Avatar, List, ListItem, ListItemText, Chip,
  Card, CardContent, CardMedia, Stack, useTheme,CircularProgress
} from '@mui/material';
import { School, People, AccessTime, Star, Warning } from '@mui/icons-material';
import { coursesAPI }  from '../../../../config';

const CourseDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  
  // Get enrollments from navigation state
  const enrollments = location.state?.enrollments || 0; 
    
 
    
  const navigate = useNavigate();
  const theme = useTheme();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await coursesAPI.getCourse(id);
        setCourse(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch course details');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Course not found</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button 
        onClick={() => navigate(-1)} 
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Back to Courses
      </Button>

      <Grid container spacing={3}>
        {/* Course Header */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                {course.thumbnail && (
                  <CardMedia
                    component="img"
                    sx={{ width: { xs: '100%', md: 300 }, height: 200, objectFit: 'cover' }}
                    image={course.thumbnail}
                    alt={course.title}
                  />
                )}
                <Box>
                  <Typography variant="h4" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {course.description}
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    {/* <Chip icon={<People />} label={`${course.enrollment_count || 0} Enrollments`} /> */}
                    <Chip icon={<People />} label={`${enrollments} Enrollments`} />
                    <Chip icon={<AccessTime />} label={course.duration} />
                    <Chip icon={<School />} label={course.level} />
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Course Details */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                What You'll Learn
              </Typography>
              <List>
                {course.learning_outcomes?.map((outcome, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`✓ ${outcome}`} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Prerequisites
              </Typography>
              <List>
                {course.prerequisites?.map((prereq, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`• ${prereq}`} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Modules and Lessons */}
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Course Content
              </Typography>
              {course.modules?.map((module) => (
                <Box key={module.id} sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {module.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {module.description}
                  </Typography>
                  <List>
                    {module.lessons?.map((lesson) => (
                      <ListItem key={lesson.id}>
                        <ListItemText 
                          primary={lesson.title} 
                          secondary={`${lesson.duration} • ${lesson.lesson_type}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Course Details
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Category" 
                    secondary={course.category?.name || 'Not specified'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Status" 
                    secondary={course.status} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Price" 
                    secondary={`${course.currency} ${course.current_price}`} 
                  />
                </ListItem>
                {course.discount_price && (
                  <ListItem>
                    <ListItemText 
                      primary="Original Price" 
                      secondary={`${course.currency} ${course.price}`} 
                      sx={{ textDecoration: 'line-through' }}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          {/* Resources */}
          {course.resources?.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resources
                </Typography>
                <List>
                  {course.resources.map((resource) => (
                    <ListItem key={resource.id}>
                      <ListItemText 
                        primary={resource.title} 
                        secondary={resource.resource_type} 
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseDetailPage;