import React, { useState, useRef } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Divider,
  IconButton, List, ListItem, ListItemText, ListItemSecondaryAction,
  FormControl, InputLabel, Select, MenuItem, useTheme,
  Dialog, DialogTitle, DialogContent, DialogActions,
  ListItemIcon, Accordion, AccordionSummary, AccordionDetails,
  FormControlLabel, Switch, Checkbox, Alert, CircularProgress,
  useMediaQuery
} from '@mui/material';
import {
  ExpandMore, AddCircle, Delete, Edit,
  VideoLibrary, InsertDriveFile, Link as LinkIcon,
  CloudUpload, Visibility, VisibilityOff
} from '@mui/icons-material';
import { useDrag, useDrop } from 'react-dnd';
import { coursesAPI } from '../../config';

const lessonTypes = [
  { value: 'video', label: 'Video', icon: <VideoLibrary /> },
  { value: 'file', label: 'File', icon: <InsertDriveFile /> },
  { value: 'link', label: 'Link', icon: <LinkIcon /> }
];

const DraggableModule = ({ module, index, moveModule, selectedModules, toggleModuleSelection, ...props }) => {
  const ref = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [{ isDragging }, drag] = useDrag({
    type: 'MODULE',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'MODULE',
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveModule(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div 
      ref={ref}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        border: selectedModules.includes(module.id) ? `1px solid ${theme.palette.primary.main}` : 'none',
        borderRadius: '4px',
        marginBottom: isMobile ? '4px' : '8px'
      }}
    >
      <ModuleForm 
        module={module} 
        index={index}
        selected={selectedModules.includes(module.id)}
        onToggleSelect={() => toggleModuleSelection(module.id)}
        isMobile={isMobile}
        {...props}
      />
    </div>
  );
};

const ModuleForm = ({ 
  module, 
  index, 
  onChange, 
  onDelete, 
  isMobile, 
  courseId,
  selected,
  onToggleSelect
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: '',
    lesson_type: 'video',
    content_url: '',
    content_file: null,
    duration: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateLesson = () => {
    const newErrors = {};
    if (!newLesson.title.trim()) newErrors.title = 'Lesson title is required';
    if (newLesson.lesson_type === 'link' && !newLesson.content_url.trim()) {
      newErrors.content_url = 'URL is required for link lessons';
    }
    if (['video', 'file'].includes(newLesson.lesson_type) && !newLesson.content_file && !editingLesson) {
      newErrors.content_file = 'File is required for this lesson type';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModuleChange = (field, value) => {
    const updatedModule = { ...module, [field]: value };
    onChange(module.id, updatedModule);
  };

  const handleModuleSave = async (field, value) => {
    if (!module.id || !courseId || isNaN(module.id)) {
      setErrors(prev => ({
        ...prev,
        module: 'Module not saved yet. Please save the module first.'
      }));
      return;
    }

    try {
      setLoading(true);
      const updatedModule = { ...module, [field]: value };
      await coursesAPI.updateModule(courseId, module.id, { [field]: value });
      onChange(module.id, updatedModule);
    } catch (error) {
      console.error('Error updating module:', error);
      const errorMessage = error.response?.status === 404 
        ? 'Module not found. It may have been deleted.' 
        : error.response?.data?.detail || 'Failed to update module';
      setErrors(prev => ({
        ...prev,
        module: errorMessage
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async () => {
    try {
      setLoading(true);
      if (module.id && courseId) {
        await coursesAPI.deleteModule(courseId, module.id);
      }
      onDelete(module.id);
    } catch (error) {
      console.error('Error deleting module:', error);
      setErrors(prev => ({ ...prev, module: error.response?.data || 'Failed to delete module' }));
    } finally {
      setLoading(false);
    }
  };

  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setNewLesson(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleLessonFileChange = (e) => {
    setNewLesson(prev => ({ ...prev, content_file: e.target.files[0] }));
    setErrors(prev => ({ ...prev, content_file: '' }));
  };

  const addLesson = async () => {
    if (!validateLesson()) return;
  
    const formData = new FormData();
    formData.append('title', newLesson.title.trim());
    formData.append('lesson_type', newLesson.lesson_type);
    formData.append('order', module.lessons.length + 1);
    formData.append('is_published', true);
    if (newLesson.duration) formData.append('duration', newLesson.duration);
    if (newLesson.lesson_type === 'link') {
      formData.append('content_url', newLesson.content_url);
    } else if (newLesson.content_file) {
      formData.append('content_file', newLesson.content_file);
    }
  
    try {
      setLoading(true);
      const response = await coursesAPI.createLesson(courseId, module.id, formData);
      onChange(module.id, {
        ...module,
        lessons: [...module.lessons, response.data]
      });
      setNewLesson({
        title: '',
        lesson_type: 'video',
        content_url: '',
        content_file: null,
        duration: ''
      });
      setLessonDialogOpen(false);
      setErrors({});
    } catch (error) {
      console.error('Error creating lesson:', error);
      setErrors(prev => ({ ...prev, submit: error.response?.data || 'Failed to create lesson' }));
    } finally {
      setLoading(false);
    }
  };
  
  const updateLesson = async () => {
    if (!validateLesson()) return;
  
    const formData = new FormData();
    formData.append('title', newLesson.title.trim());
    formData.append('lesson_type', newLesson.lesson_type);
    if (newLesson.duration) formData.append('duration', newLesson.duration);
    if (newLesson.lesson_type === 'link') {
      formData.append('content_url', newLesson.content_url);
    } else if (newLesson.content_file) {
      formData.append('content_file', newLesson.content_file);
    }
  
    try {
      setLoading(true);
      const response = await coursesAPI.updateLesson(courseId, module.id, editingLesson.id, formData);
      const updatedLessons = module.lessons.map(lesson =>
        lesson.id === editingLesson.id ? response.data : lesson
      );
      onChange(module.id, {
        ...module,
        lessons: updatedLessons
      });
      setLessonDialogOpen(false);
      setEditingLesson(null);
      setNewLesson({
        title: '',
        lesson_type: 'video',
        content_url: '',
        content_file: null,
        duration: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error updating lesson:', error);
      setErrors(prev => ({ ...prev, submit: error.response?.data || 'Failed to update lesson' }));
    } finally {
      setLoading(false);
    }
  };
  
  const deleteLesson = async (lessonId) => {
    try {
      setLoading(true);
      await coursesAPI.deleteLesson(courseId, module.id, lessonId);
      onChange(module.id, {
        ...module,
        lessons: module.lessons.filter(l => l.id !== lessonId)
      });
    } catch (error) {
      console.error('Error deleting lesson:', error);
      setErrors(prev => ({ ...prev, lesson: error.response?.data || 'Failed to delete lesson' }));
    } finally {
      setLoading(false);
    }
  };

  const editLesson = (lesson) => {
    setEditingLesson(lesson);
    setNewLesson({
      title: lesson.title,
      lesson_type: lesson.lesson_type,
      content_url: lesson.content_url || '',
      content_file: null,
      duration: lesson.duration || ''
    });
    setLessonDialogOpen(true);
  };

  const getLessonIcon = (type) => {
    const lessonType = lessonTypes.find(t => t.value === type);
    return lessonType ? lessonType.icon : <InsertDriveFile />;
  };

  return (
    <>
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{ 
          mb: isMobile ? 1 : 2, 
          boxShadow: 3,
          '& .MuiAccordionSummary-root': {
            padding: isMobile ? '0 8px' : '0 16px'
          }
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{ 
            bgcolor: theme.palette.grey[100],
            position: 'relative',
            minHeight: isMobile ? 48 : 56
          }}
        >
          {loading && (
            <CircularProgress 
              size={isMobile ? 20 : 24} 
              sx={{ position: 'absolute', right: 8, top: isMobile ? 6 : 8 }} 
            />
          )}
          <Checkbox
            edge="start"
            checked={selected}
            onChange={onToggleSelect}
            onClick={(e) => e.stopPropagation()}
            sx={{ mr: isMobile ? 0.5 : 1, padding: isMobile ? '4px' : '9px' }}
          />
          <Typography 
            sx={{ flexGrow: 1, fontWeight: 600 }}
            variant={isMobile ? 'body2' : 'body1'}
          >
            Module {index + 1}: {module.title || 'Untitled Module'}
          </Typography>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteModule();
            }}
            sx={{ mr: isMobile ? 0 : 1 }}
            size="small"
          >
            <Delete color="error" fontSize={isMobile ? 'small' : 'medium'} />
          </IconButton>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ p: isMobile ? 1 : 2 }}>
            {errors.module && (
              <Alert severity="error" sx={{ mb: isMobile ? 1 : 2, fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                {typeof errors.module === 'string' ? errors.module : 
                 Object.entries(errors.module).map(([key, val]) => (
                   <div key={key}>{key}: {val}</div>
                 ))}
              </Alert>
            )}

            <Button
              variant="outlined"
              onClick={() => setPreviewMode(!previewMode)}
              sx={{ mb: isMobile ? 1 : 2, width: isMobile ? '100%' : 'auto' }}
              size="small"
              startIcon={previewMode ? <Edit /> : <Visibility />}
            >
              {previewMode ? 'Edit Mode' : 'Preview Mode'}
            </Button>

            {previewMode ? (
              <Box sx={{ 
                border: '1px solid #eee', 
                borderRadius: 1, 
                p: isMobile ? 1 : 2,
                mb: isMobile ? 1 : 2
              }}>
                <Typography 
                  variant={isMobile ? 'subtitle2' : 'h6'} 
                  sx={{ mb: isMobile ? 0.5 : 1 }}
                >
                  {module.title}
                </Typography>
                <Typography 
                  variant={isMobile ? 'body2' : 'body1'}
                >
                  {module.description || 'No description provided.'}
                </Typography>
                {module.lessons.length > 0 && (
                  <Box sx={{ mt: isMobile ? 1 : 2 }}>
                    <Typography 
                      variant={isMobile ? 'caption' : 'subtitle1'} 
                      sx={{ mb: isMobile ? 0.5 : 1 }}
                    >
                      Lessons:
                    </Typography>
                    <List dense>
                      {module.lessons.map(lesson => (
                        <ListItem key={lesson.id}>
                          <ListItemIcon>
                            {getLessonIcon(lesson.lesson_type)}
                          </ListItemIcon>
                          <ListItemText 
                            primary={lesson.title}
                            primaryTypographyProps={{ variant: isMobile ? 'body2' : 'body1' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="Module Title"
                  value={module.title}
                  onChange={(e) => handleModuleChange('title', e.target.value)}
                  onBlur={(e) => handleModuleSave('title', e.target.value)}
                  sx={{ mb: isMobile ? 1 : 2 }}
                  size="small"
                  error={!!errors.title}
                  helperText={errors.title}
                />

                <Box sx={{ mb: isMobile ? 1 : 2 }}>
                  <Typography 
                    variant={isMobile ? 'caption' : 'subtitle2'} 
                    sx={{ mb: isMobile ? 0.5 : 1 }}
                  >
                    Description
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={isMobile ? 3 : 4}
                    value={module.description || ''}
                    onChange={(e) => handleModuleChange('description', e.target.value)}
                    onBlur={(e) => handleModuleSave('description', e.target.value)}
                    placeholder="Enter module description"
                    size="small"
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={module.is_published}
                      onChange={(e) => {
                        handleModuleChange('is_published', e.target.checked);
                        handleModuleSave('is_published', e.target.checked);
                      }}
                      color="primary"
                      size="small"
                    />
                  }
                  label="Published"
                  sx={{ mb: isMobile ? 1 : 2 }}
                />

                <Divider sx={{ my: isMobile ? 1 : 2 }} />

                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between', 
                    alignItems: isMobile ? 'stretch' : 'center', 
                    mb: isMobile ? 1 : 2,
                    gap: isMobile ? 1 : 0
                  }}
                >
                  <Typography 
                    variant={isMobile ? 'subtitle2' : 'subtitle1'} 
                    sx={{ fontWeight: 600 }}
                  >
                    Lessons
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddCircle />}
                    onClick={() => {
                      setEditingLesson(null);
                      setNewLesson({
                        title: '',
                        lesson_type: 'video',
                        content_url: '',
                        content_file: null,
                        duration: ''
                      });
                      setLessonDialogOpen(true);
                    }}
                    size="small"
                    sx={{ width: isMobile ? '100%' : 'auto' }}
                  >
                    Add Lesson
                  </Button>
                </Box>

                {module.lessons.length === 0 && (
                  <Typography 
                    color="text.secondary" 
                    sx={{ mb: isMobile ? 1 : 2, textAlign: 'center' }}
                    variant={isMobile ? 'caption' : 'body2'}
                  >
                    No lessons added to this module yet
                  </Typography>
                )}

                <List dense>
                  {module.lessons.map((lesson) => (
                    <ListItem 
                      key={lesson.id} 
                      divider
                      sx={{ 
                        alignItems: 'flex-start',
                        paddingRight: isMobile ? 6 : 8 // Extra padding for actions
                      }}
                    >
                      <ListItemIcon>
                        {getLessonIcon(lesson.lesson_type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={lesson.title}
                        secondary={
                          <>
                            {lesson.lesson_type === 'link' ? lesson.content_url : (lesson.content_file?.name || lesson.content_file || 'No file selected')}
                            {lesson.duration && ` • Duration: ${lesson.duration}`}
                          </>
                        }
                        primaryTypographyProps={{ variant: isMobile ? 'body2' : 'body1' }}
                        secondaryTypographyProps={{ 
                          variant: isMobile ? 'caption' : 'body2',
                          sx: { 
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                          }
                        }}
                        sx={{ maxWidth: isMobile ? '60%' : '70%' }} // Limit text width
                      />
                      <ListItemSecondaryAction sx={{ right: isMobile ? 8 : 16 }}>
                        <IconButton
                          onClick={() => editLesson(lesson)}
                          size="small"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => deleteLesson(lesson.id)}
                          size="small"
                        >
                          <Delete color="error" fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Dialog
        open={lessonDialogOpen}
        onClose={() => {
          setLessonDialogOpen(false);
          setEditingLesson(null);
          setNewLesson({
            title: '',
            lesson_type: 'video',
            content_url: '',
            content_file: null,
            duration: ''
          });
          setErrors({});
        }}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
        PaperProps={{
          sx: { padding: isMobile ? 1 : 2 }
        }}
      >
        <DialogTitle sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
          {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Lesson Title"
            name="title"
            value={newLesson.title}
            onChange={handleLessonChange}
            sx={{ mb: isMobile ? 1 : 2, mt: isMobile ? 0.5 : 1 }}
            size="small"
            error={!!errors.title}
            helperText={errors.title}
          />

          <FormControl fullWidth sx={{ mb: isMobile ? 1 : 2 }} size="small">
            <InputLabel>Lesson Type</InputLabel>
            <Select
              name="lesson_type"
              value={newLesson.lesson_type}
              onChange={handleLessonChange}
              label="Lesson Type"
            >
              {lessonTypes.map(type => (
                <MenuItem key={type.value} value={type.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {type.icon}
                    {type.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {newLesson.lesson_type === 'link' && (
            <TextField
              fullWidth
              label="Content URL"
              name="content_url"
              value={newLesson.content_url}
              onChange={handleLessonChange}
              sx={{ mb: isMobile ? 1 : 2 }}
              size="small"
              error={!!errors.content_url}
              helperText={errors.content_url}
            />
          )}

          {(newLesson.lesson_type === 'video' || newLesson.lesson_type === 'file') && (
            <Box sx={{ mb: isMobile ? 1 : 2 }}>
              <Button
                fullWidth
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                size="small"
              >
                Upload {newLesson.lesson_type === 'video' ? 'Video' : 'File'}
                <input
                  type="file"
                  hidden
                  onChange={handleLessonFileChange}
                  accept={newLesson.lesson_type === 'video' ? 'video/*' : '*'}
                />
              </Button>
              {newLesson.content_file && (
                <Typography 
                  variant={isMobile ? 'caption' : 'body2'} 
                  sx={{ mt: isMobile ? 0.5 : 1 }}
                >
                  Selected: {newLesson.content_file.name}
                </Typography>
              )}
              {errors.content_file && (
                <Typography 
                  variant="caption" 
                  color="error" 
                  sx={{ mt: isMobile ? 0.5 : 1 }}
                >
                  {errors.content_file}
                </Typography>
              )}
            </Box>
          )}

          <TextField
            fullWidth
            label="Duration (e.g., 15 min)"
            name="duration"
            value={newLesson.duration}
            onChange={handleLessonChange}
            sx={{ mb: isMobile ? 1 : 2 }}
            size="small"
          />

          {errors.submit && (
            <Typography 
              variant="caption" 
              color="error" 
              sx={{ mb: isMobile ? 1 : 2, display: 'block' }}
            >
              {errors.submit}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 0 }}>
          <Button
            onClick={() => {
              setLessonDialogOpen(false);
              setEditingLesson(null);
              setNewLesson({
                title: '',
                lesson_type: 'video',
                content_url: '',
                content_file: null,
                duration: ''
              });
              setErrors({});
            }}
            size="small"
            sx={{ width: isMobile ? '100%' : 'auto' }}
          >
            Cancel
          </Button>
          <Button
            onClick={editingLesson ? updateLesson : addLesson}
            variant="contained"
            disabled={!newLesson.title.trim() || loading}
            size="small"
            sx={{ width: isMobile ? '100%' : 'auto' }}
          >
            {loading ? <CircularProgress size={20} /> : (editingLesson ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default { ModuleForm, DraggableModule };