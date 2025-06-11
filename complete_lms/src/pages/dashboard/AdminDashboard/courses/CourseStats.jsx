import React from 'react';
import {  Box,  Typography,  Card,  CardContent,  LinearProgress,  Chip,
  Avatar,  List,  ListItem,  ListItemText,  Stack,  Grid
} from '@mui/material';
import {
  People,  School,  Star,  Warning,  Category,  AccessTime
} from '@mui/icons-material';





const CourseStats = () => {

      // Dummy data
  const stats = {
    totalCourses: 42,
    totalEnrollments: 1256,
    mostPopularCourse: {
      title: "Advanced React Development",
      enrollments: 342,
      instructor: "Jane Smith"
    },
    leastPopularCourse: {
      title: "Introduction to Cobol",
      enrollments: 3,
      instructor: "John Doe"
    },
    noEnrollmentCourses: 5,
    completedCourses: 689,
    ongoingCourses: 567,
    averageCompletionRate: 68,
    recentCourses: [
      { title: "AI Fundamentals", date: "2023-05-15", instructor: "Dr. Chen" },
      { title: "DevOps Crash Course", date: "2023-05-10", instructor: "Alex Johnson" },
      { title: "UX Design Principles", date: "2023-05-05", instructor: "Sarah Williams" }
    ],
    categories: [
      { name: "Programming", count: 18 },
      { name: "Design", count: 8 },
      { name: "Business", count: 7 },
      { name: "Data Science", count: 9 }
    ],
    averageRating: 4.3
  };




  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {/* Most Popular Course - Compact Version */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Star color="warning" fontSize="small" />
              <Typography variant="subtitle2">Most Popular</Typography>
            </Stack>
            <Typography variant="body2" noWrap>{stats.mostPopularCourse.title}</Typography>
            <Typography variant="caption" color="text.secondary">
              {stats.mostPopularCourse.enrollments} enrollments
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Least Popular Course - Compact Version */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Warning color="error" fontSize="small" />
              <Typography variant="subtitle2">Least Popular</Typography>
            </Stack>
            <Typography variant="body2" noWrap>{stats.leastPopularCourse.title}</Typography>
            <Typography variant="caption" color="text.secondary">
              {stats.leastPopularCourse.enrollments} enrollments
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Categories Distribution - Compact Version */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Category fontSize="small" sx={{ color: 'purple' }} />
              <Typography variant="subtitle2">Categories</Typography>
            </Stack>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {stats.categories.slice(0, 3).map((category) => (
                <Chip 
                  key={category.name} 
                  label={`${category.name} (${category.count})`} 
                  size="small" 
                />
              ))}
              {stats.categories.length > 3 && (
                <Chip label={`+${stats.categories.length - 3}`} size="small" />
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Recently Added Courses - Compact Version */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <AccessTime fontSize="small" sx={{ color: 'orange' }} />
              <Typography variant="subtitle2">Recent</Typography>
            </Stack>
            <List dense sx={{ py: 0 }}>
              {stats.recentCourses.slice(0, 2).map((course, index) => (
                <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2" noWrap>
                        {course.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" noWrap>
                        {course.instructor}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CourseStats;