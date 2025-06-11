import React from 'react';
import {  Card,  CardMedia,  CardContent,  CardActions,
  Typography,  Button,  Chip,  Box,  Avatar,  useTheme
} from '@mui/material';
import { School, People, AccessTime, Star } from '@mui/icons-material';

const CourseCard = ({ 
  course, 
  onView, 
  onEdit, 
  onEnroll,
  variant = 'default' // 'default' or 'minimal'
}) => {
  const theme = useTheme();

  if (variant === 'minimal') {
    return (
      <Card sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4]
        }
      }}>
        <CardMedia
          component="img"
          height="140"
          image={course.thumbnail || '/default-course.jpg'}
          alt={course.title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div">
            {course.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {course.instructor}
          </Typography>
          <Chip 
            label={course.level} 
            size="small" 
            sx={{ 
              mr: 1,
              backgroundColor: 
                course.level === 'Advanced' ? theme.palette.error.light :
                course.level === 'Intermediate' ? theme.palette.warning.light :
                theme.palette.success.light
            }} 
          />
          <Chip 
            label={course.category} 
            size="small" 
            variant="outlined" 
          />
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <People fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">{course.enrolled}</Typography>
          </Box>
          <Button size="small" onClick={onView}>View</Button>
        </CardActions>
      </Card>
    );
  }

  // Default variant
  return (
    <Card sx={{ 
      display: 'flex',
      height: '100%',
      flexDirection: 'column',
      boxShadow: 'none',
      border: `1px solid ${theme.palette.divider}`,
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: theme.shadows[4],
        borderColor: 'transparent'
      }
    }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="160"
          image={course.thumbnail || '/default-course.jpg'}
          alt={course.title}
          sx={{ objectFit: 'cover' }}
        />
        <Chip
          label={course.status}
          size="small"
          color={
            course.status === 'Published' ? 'success' :
            course.status === 'Draft' ? 'warning' : 'default'
          }
          sx={{ 
            position: 'absolute',
            top: 10,
            right: 10,
            fontWeight: 600
          }}
        />
      </Box>
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {course.shortDescription || 'No description available'}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar 
            src={course.instructorAvatar} 
            sx={{ 
              width: 32, 
              height: 32, 
              mr: 1,
              bgcolor: theme.palette.primary.main
            }}
          >
            {course.instructor?.charAt(0)}
          </Avatar>
          <Typography variant="body2">
            {course.instructor || 'Unknown Instructor'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Chip 
            icon={<AccessTime fontSize="small" />}
            label={course.duration || 'N/A'} 
            size="small" 
          />
          <Chip 
            icon={<School fontSize="small" />}
            label={course.level || 'All Levels'} 
            size="small" 
          />
          {course.rating && (
            <Chip 
              icon={<Star fontSize="small" sx={{ color: theme.palette.warning.main }} />}
              label={course.rating} 
              size="small" 
            />
          )}
        </Box>
      </CardContent>
      
      <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={600}>
          {course.price ? `$${course.price}` : 'Free'}
        </Typography>
        <Box>
          {onEdit && (
            <Button 
              size="small" 
              onClick={onEdit}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
          )}
          <Button 
            variant="contained" 
            size="small" 
            onClick={onView || onEnroll}
          >
            {onEdit ? 'Preview' : 'Enroll Now'}
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default CourseCard;