import React, { useState } from 'react';
import {
  Box, Typography, IconButton, Collapse, TextField, Button,
  useTheme, useMediaQuery, Divider, Chip, FormControl,
  InputLabel, Select, MenuItem, Snackbar, Alert
} from '@mui/material';
import {
  ExpandMore, ExpandLess, Delete, Edit, Save, Cancel,
  CloudUpload, DragHandle, VideoLibrary, PictureAsPdf,
  Link as LinkIcon, InsertDriveFile
} from '@mui/icons-material';
import { coursesAPI } from '../../../../config'; // Import API from api.js

const resourceTypes = [
  { value: 'link', label: 'Web Link', icon: <LinkIcon /> },
  { value: 'pdf', label: 'PDF Document', icon: <PictureAsPdf /> },
  { value: 'video', label: 'Video', icon: <VideoLibrary /> },
  { value: 'file', label: 'File', icon: <InsertDriveFile /> }
];

const LessonItem = ({ lesson, index, moduleId, courseId, onUpdate, onDelete, isMobile }) => {
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(!lesson.id); // Auto-edit for new lessons
  const [editedLesson, setEditedLesson] = useState({
    title: lesson.title || '',
    description: lesson.description || '',
    content_type: lesson.content_type || 'video',
    content_url: lesson.content_url || '',
    content_file: null,
    duration: lesson.duration || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedLesson({
      title: lesson.title || '',
      description: lesson.description || '',
      content_type: lesson.content_type || 'video',
      content_url: lesson.content_url || '',
      content_file: null,
      duration: lesson.duration || ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedLesson(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setEditedLesson(prev => ({ ...prev, content_file: e.target.files[0] }));
  };

  const handleSave = async () => {
    if (!editedLesson.title.trim()) {
      setError('Lesson title is required.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', editedLesson.title);
      formData.append('description', editedLesson.description);
      formData.append('content_type', editedLesson.content_type);
      if (editedLesson.content_type === 'link') {
        formData.append('content_url', editedLesson.content_url);
      } else if (editedLesson.content_file) {
        formData.append('content_file', editedLesson.content_file);
      }
      formData.append('duration', editedLesson.duration);
      formData.append('module_id', moduleId);

      let updatedLesson;
      if (lesson.id) {
        updatedLesson = await coursesAPI.updateLesson(lesson.id, formData);
        setSuccess('Lesson updated successfully.');
      } else {
        updatedLesson = await coursesAPI.createLesson(formData);
        setSuccess('Lesson created successfully.');
      }

      onUpdate(updatedLesson.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save lesson. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!lesson.id) {
      onDelete(lesson.tempId);
      return;
    }

    setLoading(true);
    try {
      await coursesAPI.deleteLesson(lesson.id);
      onDelete(lesson.id);
      setSuccess('Lesson deleted successfully.');
    } catch (err) {
      setError('Failed to delete lesson. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getContentIcon = () => {
    const resourceType = resourceTypes.find(t => t.value === lesson.content_type);
    return resourceType ? resourceType.icon : <InsertDriveFile />;
  };

  return (
    <Box sx={{ 
      mb: 1, 
      border: '1px solid', 
      borderColor: 'divider', 
      borderRadius: 1,
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: isMobileScreen ? 1 : 2,
        backgroundColor: theme.palette.background.default
      }}>
        <DragHandle sx={{ mr: 1, cursor: 'grab' }} fontSize={isMobileScreen ? 'small' : 'medium'} />
        <Typography 
          variant={isMobileScreen ? 'body2' : 'body1'} 
          sx={{ flex: 1, fontWeight: 500 }}
        >
          {lesson.title || `Lesson ${index + 1}`}
        </Typography>
        <IconButton 
          onClick={handleToggleExpand} 
          size={isMobileScreen ? 'small' : 'medium'}
        >
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        {!isEditing && (
          <IconButton 
            onClick={handleEditToggle} 
            size={isMobileScreen ? 'small' : 'medium'}
          >
            <Edit />
          </IconButton>
        )}
        <IconButton 
          onClick={handleDelete} 
          size={isMobileScreen ? 'small' : 'medium'}
          disabled={loading}
        >
          <Delete color="error" />
        </IconButton>
      </Box>

      <Collapse in={expanded || isEditing}>
        <Box sx={{ p: isMobileScreen ? 1 : 2 }}>
          {isEditing ? (
            <>
              <TextField
                fullWidth
                label="Lesson Title"
                name="title"
                value={editedLesson.title}
                onChange={handleChange}
                sx={{ mb: 2 }}
                size={isMobileScreen ? 'small' : 'medium'}
                error={!!error && !editedLesson.title.trim()}
                helperText={error && !editedLesson.title.trim() ? 'Title is required' : ''}
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={editedLesson.description}
                onChange={handleChange}
                multiline
                rows={2}
                sx={{ mb: 2 }}
                size={isMobileScreen ? 'small' : 'medium'}
              />
              <FormControl fullWidth sx={{ mb: 2 }} size={isMobileScreen ? 'small' : 'medium'}>
                <InputLabel>Content Type</InputLabel>
                <Select
                  name="content_type"
                  value={editedLesson.content_type}
                  onChange={handleChange}
                  label="Content Type"
                >
                  {resourceTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {editedLesson.content_type === 'link' ? (
                <TextField
                  fullWidth
                  label="Content URL"
                  name="content_url"
                  value={editedLesson.content_url}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  size={isMobileScreen ? 'small' : 'medium'}
                />
              ) : (
                <Button
                  fullWidth
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  sx={{ mb: 2 }}
                  size={isMobileScreen ? 'small' : 'medium'}
                >
                  Upload Content
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept={
                      editedLesson.content_type === 'pdf' ? 'application/pdf' :
                      editedLesson.content_type === 'video' ? 'video/*' : '*'
                    }
                  />
                </Button>
              )}
              {editedLesson.content_file && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Selected: {editedLesson.content_file.name}
                </Typography>
              )}
              <TextField
                fullWidth
                label="Duration (e.g., 30 min)"
                name="duration"
                value={editedLesson.duration}
                onChange={handleChange}
                sx={{ mb: 2 }}
                size={isMobileScreen ? 'small' : 'medium'}
              />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={() => lesson.id ? setIsEditing(false) : onDelete(lesson.tempId)}
                  size={isMobileScreen ? 'small' : 'medium'}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={loading || !editedLesson.title.trim()}
                  size={isMobileScreen ? 'small' : 'medium'}
                >
                  Save
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Description:</strong> {lesson.description || 'No description'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Content Type:</strong> {lesson.content_type}
              </Typography>
              {lesson.content_type === 'link' ? (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>URL:</strong> {lesson.content_url}
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>File:</strong> {lesson.content_file?.name || 'Uploaded content'}
                </Typography>
              )}
              <Typography variant="body2">
                <strong>Duration:</strong> {lesson.duration || 'Not specified'}
              </Typography>
            </>
          )}
        </Box>
      </Collapse>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LessonItem;