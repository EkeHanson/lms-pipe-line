import { coursesAPI } from '../../../../config';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, List, ListItem,
  ListItemText, ListItemSecondaryAction, IconButton,
  TextField, Chip, useTheme, Grid, useMediaQuery,
  Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Alert, Checkbox
} from '@mui/material';
import {
  Add, Delete, DragHandle, School, Edit
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const LearningPaths = ({ courseId, isMobile }) => {
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const [paths, setPaths] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newPath, setNewPath] = useState({ title: '', description: '', courses: [] });
  const [editingPath, setEditingPath] = useState(null);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      coursesAPI.getLearningPaths(),
      coursesAPI.getCourses()
    ])
      .then(([pathsResponse, coursesResponse]) => {
        setPaths(pathsResponse.data?.results || []);
        setCourses(coursesResponse.data?.results || []);
      })
      .catch(err => {
        setError('Failed to load learning paths or courses');
        console.error(err);
        setPaths([]);
        setCourses([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // const handleAddPath = async () => {
  //   if (!newPath.title.trim()) {
  //     setError('Title is required');
  //     return;
  //   }
    
  //   if (newPath.courses.length === 0) {
  //     setError('At least one course is required');
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const pathData = {
  //       title: newPath.title,
  //       description: newPath.description,
  //       course_ids: newPath.courses.map(c => typeof c === 'object' ? c.id : c)
  //     };
      
  //     const response = await coursesAPI.createLearningPath(pathData);
  //     setPaths([...paths, response.data]);
  //     setNewPath({ title: '', description: '', courses: [] });
  //     setSelectedCourses([]);
  //     setError('');
  //   } catch (err) {
  //     const errorData = err.response?.data;
  //     if (errorData) {
  //       const errorMessages = [];
  //       if (errorData.title) errorMessages.push(errorData.title.join(' '));
  //       if (errorData.course_ids) errorMessages.push(errorData.course_ids.join(' '));
  //       setError(errorMessages.join(' ') || 'Failed to create learning path');
  //     } else {
  //       setError(err.message || 'Failed to create learning path');
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleAddPath = async () => {
    if (!newPath.title.trim()) {
      setError("Title is required");
      return;
    }
  
    if (newPath.courses.length === 0 || !newPath.courses.every((c) => c.id)) {
      setError("At least one valid course with an ID is required");
      return;
    }
  
    setLoading(true);
    try {
      const pathData = {
        title: newPath.title,
        description: newPath.description,
        course_ids: newPath.courses.map((c) => c.id),
      };
      console.log("Sending pathData:", pathData);
      const response = await coursesAPI.createLearningPath(pathData);
      setPaths([...paths, response.data]);
      setNewPath({ title: "", description: "", courses: [] });
      setSelectedCourses([]);
      setError("");
    } catch (err) {
      console.error("Error creating path:", err.response?.data);
      const errorData = err.response?.data;
      if (errorData) {
        const errorMessages = [];
        if (errorData.title) errorMessages.push(errorData.title.join(" "));
        if (errorData.course_ids) errorMessages.push(errorData.course_ids.join(" "));
        setError(errorMessages.join(" ") || "Failed to create learning path");
      } else {
        setError(err.message || "Failed to create learning path");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeletePath = async (id) => {
    setLoading(true);
    try {
      await coursesAPI.deleteLearningPath(id);
      setPaths(paths.filter(path => path.id !== id));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete learning path');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPath = (path) => {
    setEditingPath(path);
    setNewPath({ 
      title: path.title, 
      description: path.description, 
      courses: path.courses 
    });
    setSelectedCourses(path.courses.map(c => c.id));
    setCourseDialogOpen(true);
  };

  const handleUpdatePath = async () => {
    if (!editingPath || !newPath.title.trim()) return;
    
    setLoading(true);
    try {
      const pathData = {
        title: newPath.title,
        description: newPath.description,
        course_ids: newPath.courses.map(c => typeof c === 'object' ? c.id : c)
      };
      const response = await coursesAPI.updateLearningPath(editingPath.id, pathData);
      setPaths(paths.map(path => path.id === editingPath.id ? response.data : path));
      setEditingPath(null);
      setNewPath({ title: '', description: '', courses: [] });
      setSelectedCourses([]);
      setCourseDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update learning path');
    } finally {
      setLoading(false);
    }
  };

  const toggleCourseSelection = (courseId) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const saveSelectedCourses = () => {
    setNewPath(prev => ({ 
      ...prev, 
      courses: selectedCourses.map(id => {
        const fullCourse = courses.find(c => c.id === id);
        return fullCourse || id;
      })
    }));
    setCourseDialogOpen(false);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const reorderedPaths = Array.from(paths);
    const [removed] = reorderedPaths.splice(result.source.index, 1);
    reorderedPaths.splice(result.destination.index, 0, removed);
    
    setPaths(reorderedPaths);
  };

  return (
    <Box sx={{ 
      p: isMobileView ? 2 : 3,
      maxWidth: '100%',
      overflowX: 'hidden'
    }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Typography variant={isMobileView ? "h5" : "h4"} sx={{ 
        mb: 3, 
        fontWeight: 600,
        wordBreak: 'break-word'
      }}>
        Learning Paths
      </Typography>
      
      <Paper sx={{ 
        p: isMobileView ? 2 : 3, 
        mb: 3,
        overflow: 'hidden'
      }}>
        <Typography variant="h6" sx={{ 
          mb: 2, 
          fontWeight: 600,
          fontSize: isMobileView ? '1.1rem' : '1.25rem'
        }}>
          {editingPath ? 'Edit Learning Path' : 'Create New Learning Path'}
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Path Title"
              value={newPath.title}
              onChange={(e) => setNewPath({...newPath, title: e.target.value})}
              sx={{ mb: 2 }}
              size={isMobileView ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Description"
              value={newPath.description}
              onChange={(e) => setNewPath({...newPath, description: e.target.value})}
              sx={{ mb: 2 }}
              size={isMobileView ? "small" : "medium"}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Selected Courses: {newPath.courses.length}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setCourseDialogOpen(true)}
            size={isMobileView ? "small" : "medium"}
          >
            Select Courses
          </Button>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          gap: 1,
          flexWrap: 'wrap'
        }}>
          {editingPath ? (
            <>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setEditingPath(null);
                  setNewPath({ title: '', description: '', courses: [] });
                  setSelectedCourses([]);
                }}
                size={isMobileView ? "small" : "medium"}
                sx={{ minWidth: isMobileView ? 'auto' : 100 }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleUpdatePath}
                disabled={loading || !newPath.title.trim()}
                size={isMobileView ? "small" : "medium"}
                sx={{ minWidth: isMobileView ? 'auto' : 120 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Update'}
              </Button>
            </>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleAddPath}
              disabled={loading || !newPath.title.trim()}
              startIcon={<Add />}
              size={isMobileView ? "small" : "medium"}
              fullWidth={isMobileView}
            >
              {loading ? <CircularProgress size={24} /> : 'Add Path'}
            </Button>
          )}
        </Box>
      </Paper>
      
      <Typography variant="h6" sx={{ 
        mb: 2, 
        fontWeight: 600,
        fontSize: isMobileView ? '1.1rem' : '1.25rem'
      }}>
        Existing Learning Paths
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (paths || []).length === 0 ? (
        <Paper sx={{ 
          p: 3, 
          textAlign: 'center',
          mb: 2
        }}>
          <School sx={{ 
            fontSize: 60, 
            color: 'text.disabled', 
            mb: 2 
          }} />
          <Typography variant="h6" color="text.secondary">
            No learning paths created yet
          </Typography>
          <Typography color="text.secondary">
            Create learning paths to sequence courses for different learner journeys
          </Typography>
        </Paper>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="learningPaths">
            {(provided) => (
              <List 
                {...provided.droppableProps} 
                ref={provided.innerRef} 
                sx={{ 
                  p: 0,
                  '& .MuiListItem-root': {
                    p: 0
                  }
                }}
              >
                {paths.map((path, index) => (
                  <Draggable key={path.id} draggableId={path.id} index={index}>
                    {(provided) => (
                      <Paper 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{ 
                          mb: 2,
                          overflow: 'hidden'
                        }}
                      >
                        <Box sx={{ p: isMobileView ? 1.5 : 2 }}>
                          <Box sx={{ 
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1,
                            mb: 1
                          }}>
                            <Box 
                              {...provided.dragHandleProps} 
                              sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                height: '100%',
                                cursor: 'grab',
                                pt: isMobileView ? 0.5 : 0
                              }}
                            >
                              <DragHandle fontSize={isMobileView ? "small" : "medium"} />
                            </Box>
                            
                            <Box sx={{ 
                              flex: 1,
                              minWidth: 0,
                              mr: 1
                            }}>
                              <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                  fontWeight: 500,
                                  wordBreak: 'break-word'
                                }}
                              >
                                {path.title}
                              </Typography>
                              {path.description && (
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary"
                                  sx={{
                                    wordBreak: 'break-word'
                                  }}
                                >
                                  {path.description}
                                </Typography>
                              )}
                            </Box>
                            
                            <Box sx={{ 
                              display: 'flex',
                              flexShrink: 0
                            }}>
                              <IconButton 
                                onClick={() => handleEditPath(path)} 
                                size="small"
                                sx={{ p: isMobileView ? 0.5 : 1 }}
                              >
                                <Edit fontSize={isMobileView ? "small" : "medium"} />
                              </IconButton>
                              <IconButton 
                                onClick={() => handleDeletePath(path.id)} 
                                size="small"
                                sx={{ p: isMobileView ? 0.5 : 1 }}
                              >
                                <Delete fontSize={isMobileView ? "small" : "medium"} color="error" />
                              </IconButton>
                            </Box>
                          </Box>
                          
                          <Box sx={{ 
                            pl: isMobileView ? 3 : 4,
                            pt: 1
                          }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Courses in this path:
                            </Typography>
                            
                            {path.courses.length > 0 ? (
                              <Box sx={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                gap: 1,
                                mb: 1
                              }}>
                                {path.courses.map(course => (
                                  <Chip 
                                    key={course.id} 
                                    label={course.title} 
                                    onDelete={() => {
                                      setNewPath(prev => ({
                                        ...prev,
                                        courses: prev.courses.filter(c => c.id !== course.id)
                                      }));
                                      setSelectedCourses(prev => prev.filter(id => id !== course.id));
                                    }}
                                    size={isMobileView ? "small" : "medium"}
                                  />
                                ))}
                              </Box>
                            ) : (
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ mb: 1 }}
                              >
                                No courses added to this path yet
                              </Typography>
                            )}
                            
                            <Button 
                              size={isMobileView ? "small" : "medium"}
                              startIcon={<Add />}
                              onClick={() => setCourseDialogOpen(true)}
                            >
                              Add Courses
                            </Button>
                          </Box>
                        </Box>
                      </Paper>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <Dialog 
        open={courseDialogOpen} 
        onClose={() => setCourseDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobileView}
      >
        <DialogTitle>Select Courses</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List sx={{ maxHeight: isMobileView ? '40vh' : 300, overflow: 'auto' }}>
              {Array.isArray(courses) && courses.length > 0 ? (
                courses.map(course => (
                  <ListItem 
                    key={course.id} 
                    button 
                    onClick={() => toggleCourseSelection(course.id)}
                  >
                    <ListItemText 
                      primary={course.title} 
                      secondary={course.description} 
                      primaryTypographyProps={{ variant: isMobileView ? 'body2' : 'body1' }}
                      secondaryTypographyProps={{ variant: isMobileView ? 'caption' : 'body2' }}
                    />
                    <Checkbox
                      edge="end"
                      checked={selectedCourses.includes(course.id)}
                      size={isMobileView ? 'small' : 'medium'}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                  No courses available
                </Typography>
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCourseDialogOpen(false)} size={isMobileView ? 'small' : 'medium'}>
            Cancel
          </Button>
          <Button 
            onClick={saveSelectedCourses}
            variant="contained"
            size={isMobileView ? 'small' : 'medium'}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LearningPaths;