import React, { useState, useCallback } from 'react';
import { 
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Paper,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

const DocumentUpload = ({ 
  acceptedFileTypes = ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  maxFileSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5,
  onUploadComplete,
  label = "Drag & drop files here or click to browse",
  uploadButtonText = "Upload Documents"
}) => {
  const theme = useTheme();
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles && rejectedFiles.length > 0) {
      rejectedFiles.forEach(file => {
        const errorMessage = file.errors[0].code === 'file-too-large' 
          ? `File too large (max ${maxFileSize / (1024 * 1024)}MB)`
          : 'Invalid file type';
        
        setFiles(prev => [...prev, {
          file,
          status: 'rejected',
          error: errorMessage
        }]);
      });
    }

    // Handle accepted files
    const newAcceptedFiles = acceptedFiles.map(file => ({
      file,
      status: 'ready',
      id: Math.random().toString(36).substr(2, 9)
    }));

    setFiles(prev => [...prev, ...newAcceptedFiles]);
  }, [maxFileSize]);

  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.join(','),
    maxSize: maxFileSize,
    maxFiles,
    disabled: files.length >= maxFiles
  });

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    const uploadPromises = files
      .filter(f => f.status === 'ready')
      .map(file => {
        return new Promise((resolve) => {
          // Simulate upload progress
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
              clearInterval(interval);
              setUploadProgress(prev => ({ ...prev, [file.id]: 100 }));
              resolve(file.id);
            } else {
              setUploadProgress(prev => ({ ...prev, [file.id]: progress }));
            }
          }, 300);
        });
      });

    try {
      await Promise.all(uploadPromises);
      
      // Update file statuses
      setFiles(prev => prev.map(f => ({
        ...f,
        status: f.status === 'ready' ? 'uploaded' : f.status
      })));
      
      if (onUploadComplete) {
        onUploadComplete(files.filter(f => f.status !== 'rejected').map(f => f.file));
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircleIcon color="success" />;
      case 'rejected':
        return <ErrorIcon color="error" />;
      default:
        return <FileIcon color="action" />;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        variant="outlined"
        {...getRootProps()}
        sx={{
          p: 4,
          border: `2px dashed ${theme.palette.divider}`,
          backgroundColor: isDragActive ? theme.palette.action.hover : theme.palette.background.paper,
          textAlign: 'center',
          cursor: 'pointer',
          mb: 2
        }}
      >
        <input {...getInputProps()} />
        <UploadIcon fontSize="large" color="action" />
        <Typography variant="body1" sx={{ mt: 1 }}>
          {label}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Accepted file types: {acceptedFileTypes.join(', ')} (Max {maxFileSize / (1024 * 1024)}MB each)
        </Typography>
      </Paper>

      {files.length > 0 && (
        <List dense sx={{ mb: 2 }}>
          {files.map(({ file, status, error, id }) => (
            <ListItem
              key={id}
              secondaryAction={
                status !== 'uploaded' && (
                  <IconButton edge="end" onClick={() => removeFile(id)}>
                    <CloseIcon />
                  </IconButton>
                )
              }
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                mb: 1,
                backgroundColor: theme.palette.background.paper
              }}
            >
              <ListItemIcon>
                {getStatusIcon(status)}
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={
                  status === 'rejected' ? (
                    <Typography color="error">{error}</Typography>
                  ) : status === 'uploading' ? (
                    <LinearProgress 
                      variant="determinate" 
                      value={uploadProgress[id] || 0} 
                      sx={{ width: '100%' }}
                    />
                  ) : (
                    `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                  )
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={isUploading || files.length === 0 || files.every(f => f.status !== 'ready')}
          startIcon={<UploadIcon />}
        >
          {isUploading ? 'Uploading...' : uploadButtonText}
        </Button>
      </Box>
    </Box>
  );
};

export default DocumentUpload;