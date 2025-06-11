import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, Button, Divider, Alert, CircularProgress, useTheme,
  List, ListItem, ListItemAvatar, ListItemText, Avatar, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Grid, InputAdornment, Backdrop,
  FormControl, InputLabel, Select, Checkbox, FormControlLabel
} from '@mui/material';
import {
  Publish as UploadIcon, Description as FileIcon, CheckCircle as SuccessIcon,
  Error as ErrorIcon, CloudDownload as DownloadIcon, Search as SearchIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { userAPI, coursesAPI, messagingAPI } from '../../../config';

const BulkUserUpload = ({ onUpload }) => {
  const theme = useTheme();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openRemoveConfirm, setOpenRemoveConfirm] = useState(false);
  const [courses, setCourses] = useState([]);
  const [existingEmails, setExistingEmails] = useState([]);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);

  // Template data for download
  const templateData = [
    ['firstName', 'lastName', 'email', 'password', 'role', 'birthDate', 'status', 'department', 'courseIds'],
    ['John', 'Doe', 'john@example.com', 'SecurePass123!', 'learner', '1990-01-15', 'active', 'Engineering', 'course1,course2'],
    ['Jane', 'Smith', 'jane@example.com', 'SecurePass456!', 'instructor', '1985-05-22', 'active', 'Mathematics', '']
  ];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length) {
        setFile(acceptedFiles[0]);
        setUploadResult(null);

        const data = await acceptedFiles[0].arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setPreviewData(jsonData);
        setOpenPreviewModal(true);
      }
    }
  });

  // Fetch courses and existing emails
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResponse, usersResponse] = await Promise.all([
          coursesAPI.getCourses(),
          userAPI.getUsers({ page_size: 1000 })
        ]);
        setCourses(coursesResponse.data.results || []);
        setExistingEmails(usersResponse.data.results.map(user => user.email.toLowerCase()));
      } catch (err) {
        setUploadResult({
          success: false,
          message: 'Failed to fetch initial data',
          details: [err.message]
        });
      }
    };
    fetchData();
  }, []);

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users Template");
    XLSX.writeFile(wb, "user_upload_template.xlsx");
  };

  const validateUserData = (userData, index, allUsers) => {
    const errors = [];
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'role'];
    
    requiredFields.forEach(field => {
      if (!userData[field]) {
        errors.push(`Row ${index + 2}: Missing required field: ${field}`);
      }
    });

    if (userData.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        errors.push(`Row ${index + 2}: Invalid email format`);
      }
      const emailCount = allUsers.filter(u => u.email?.toLowerCase() === userData.email.toLowerCase()).length;
      if (emailCount > 1) {
        errors.push(`Row ${index + 2}: Duplicate email in upload batch`);
      }
      if (existingEmails.includes(userData.email.toLowerCase())) {
        errors.push(`Row ${index + 2}: Email already exists in the system`);
      }
    }

    if (userData.password && userData.password.length < 8) {
      errors.push(`Row ${index + 2}: Password must be at least 8 characters`);
    }

    const validRoles = ['admin', 'instructor', 'learner', 'owner'];
    if (userData.role && !validRoles.includes(userData.role.toLowerCase())) {
      errors.push(`Row ${index + 2}: Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }

    if (userData.birthDate && isNaN(new Date(userData.birthDate).getTime())) {
      errors.push(`Row ${index + 2}: Invalid birth date format (use YYYY-MM-DD)`);
    }

    const validStatuses = ['active', 'pending', 'suspended'];
    if (userData.status && !validStatuses.includes(userData.status.toLowerCase())) {
      errors.push(`Row ${index + 2}: Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    if (userData.courseIds) {
      const courseIds = userData.courseIds.split(',').map(id => id.trim()).filter(id => id);
      courseIds.forEach(id => {
        if (!courses.some(course => course.id === id)) {
          errors.push(`Row ${index + 2}: Invalid course ID: ${id}`);
        }
      });
    }

    return errors.length ? errors : null;
  };

  const handleSelectUser = (index) => {
    setSelectedUserIndex(index);
    setEditedUser({ ...previewData[index] });
    setValidationErrors(validateUserData(previewData[index], index, previewData) || []);
  };

  const handleEditUser = (field, value) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
    setValidationErrors(validateUserData({ ...editedUser, [field]: value }, selectedUserIndex, previewData) || []);
  };

  const handleSaveUser = async () => {
    if (validationErrors.length) return;

    try {
      const userData = {
        first_name: editedUser.firstName || '',
        last_name: editedUser.lastName || '',
        email: editedUser.email || '',
        password: editedUser.password || '',
        role: editedUser.role || 'learner',
        birth_date: editedUser.birthDate || null,
        status: editedUser.status || 'active',
        department: editedUser.department || null,
      };

      const response = await userAPI.createUser(userData);

      if (response.status === 201 || response.status === 200) {
        const courseIds = editedUser.courseIds?.split(',').map(id => id.trim()).filter(id => id) || [];
        for (const courseId of courseIds) {
          await coursesAPI.adminSingleEnroll(courseId, { user_id: response.data.id });
        }

        if (sendWelcomeEmail) {
          await messagingAPI.createMessage({
            recipient_id: response.data.id,
            subject: 'Welcome to Our Platform!',
            content: `Hello ${editedUser.firstName},\n\nWelcome to our platform! Your account has been created successfully.\n\nUsername: ${editedUser.email}\n\nPlease login to get started.`,
            type: 'welcome'
          });
        }

        setPreviewData((prev) => {
          const newData = [...prev];
          newData[selectedUserIndex] = {
            ...editedUser,
            id: response.data.id,
          };
          return newData;
        });

        setUploadResult({
          success: true,
          message: `User ${userData.email} saved successfully`,
          details: courseIds.length ? [`Enrolled in courses: ${courseIds.join(', ')}`] : [],
        });

        setSelectedUserIndex(null);
        setEditedUser(null);
        setValidationErrors([]);
      }
    } catch (error) {
      let errorMessage = 'Failed to save user';
      let errorDetails = [];

      if (error.response?.data) {
        errorMessage = error.response.data.error || 'Error saving user';
        errorDetails = error.response.data.errors || [errorMessage];
      } else {
        errorDetails = [error.message || 'Network error'];
      }

      setUploadResult({
        success: false,
        message: errorMessage,
        details: errorDetails,
      });
    }
  };

  const handleRemoveUser = () => {
    setOpenRemoveConfirm(true);
  };

  const confirmRemoveUser = () => {
    if (selectedUserIndex !== null) {
      setPreviewData(prev => {
        const newData = prev.filter((_, index) => index !== selectedUserIndex);
        return newData;
      });
      setSelectedUserIndex(null);
      setEditedUser(null);
      setValidationErrors([]);
      if (previewData.length === 1) {
        setOpenPreviewModal(false);
        setFile(null);
        setSearchQuery('');
      }
    }
    setOpenRemoveConfirm(false);
  };

  const processFile = async () => {
    if (!file || previewData.length === 0) return;

    setIsProcessing(true);
    setUploadResult(null);

    try {
      const unsavedUsers = previewData.filter(user => !user.id);
      if (unsavedUsers.length === 0) {
        setUploadResult({
          success: true,
          message: 'All users already saved individually',
          details: [],
        });
        setIsProcessing(false);
        return;
      }

      const ws = XLSX.utils.json_to_sheet(unsavedUsers);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: 'text/csv' });
      const csvFile = new File([blob], 'users.csv', { type: 'text/csv' });

      const response = await userAPI.bulkUpload(csvFile);

      if (response.data.success) {
        for (const createdUser of response.data.created_users) {
          const userData = unsavedUsers.find(u => u.email === createdUser.email);
          if (userData?.courseIds) {
            const courseIds = userData.courseIds.split(',').map(id => id.trim()).filter(id => id);
            for (const courseId of courseIds) {
              await coursesAPI.adminSingleEnroll(courseId, { user_id: createdUser.id });
            }
          }

          if (sendWelcomeEmail) {
            await messagingAPI.createMessage({
              recipient_id: createdUser.id,
              subject: 'Welcome to Our Platform!',
              content: `Hello ${userData.firstName},\n\nWelcome to our platform! Your account has been created successfully.\n\nUsername: ${createdUser.email}\n\nPlease login to get started.`,
              type: 'welcome'
            });
          }
        }

        setUploadResult({
          success: true,
          message: `Successfully processed ${response.data.created_count} users`,
          details: response.data.errors || [],
        });

        if (onUpload && response.data.created_count > 0) {
          onUpload();
        }
      } else {
        setUploadResult({
          success: false,
          message: response.data.error || 'Upload failed',
          details: response.data.errors || [],
        });
      }
    } catch (error) {
      let errorDetails = [];

      if (error.response?.data?.errors) {
        errorDetails = error.response.data.errors;
      } else if (error.response?.data?.error) {
        errorDetails = [error.response.data.error];
      } else {
        errorDetails = [error.message || 'Network error'];
      }

      setUploadResult({
        success: false,
        message: 'Error processing file',
        details: errorDetails,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getInitial = (user) => {
    if (user.firstName) return user.firstName.charAt(0).toUpperCase();
    return user.email?.charAt(0).toUpperCase() || '?';
  };

  const filteredUsers = previewData.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (user.firstName?.toLowerCase() || '').includes(searchLower) ||
      (user.lastName?.toLowerCase() || '').includes(searchLower) ||
      (user.email?.toLowerCase() || '').includes(searchLower)
    );
  });

  return (
    <Container sx={{ py: 2, width: '600px', maxWidth: '600px' }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isProcessing}
      >
        <Box textAlign="center">
          <CircularProgress color="inherit" size={40} thickness={4}/>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Processing...
          </Typography>
        </Box>
      </Backdrop>

      <Paper elevation={3} sx={{ p: 2, maxHeight: '70vh', overflow: 'auto' }}>
        <Typography variant="h6" component="h1" gutterBottom sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
          Bulk User Upload
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
          Upload an Excel or CSV file to register users
        </Typography>

        <Box sx={{ mb: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={downloadTemplate}
            size="small"
            sx={{ mr: 1 }}
          >
            Template
          </Button>
          <Typography variant="caption" color="text.secondary">
            Use our template for formatting
          </Typography>
        </Box>

        <Box sx={{ mb: 1, p: 1, backgroundColor: theme.palette.grey[100], borderRadius: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Required: firstName, lastName, email, password, role
          </Typography>
          <Typography variant="caption">
            Optional: birthDate (YYYY-MM-DD), status, department, courseIds
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box
          {...getRootProps()}
          sx={{
            border: `2px dashed ${theme.palette.divider}`,
            borderRadius: 1,
            p: 2,
            textAlign: 'center',
            backgroundColor: isDragActive ? theme.palette.action.hover : theme.palette.background.paper,
            cursor: 'pointer',
            mb: 1
          }}
        >
          <input {...getInputProps()} />
          {file ? (
            <>
              <FileIcon sx={{ fontSize: 24, color: 'primary.main', mb: 1 }} />
              <Typography variant="body2">{file.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {Math.round(file.size / 1024)} KB
              </Typography>
            </>
          ) : (
            <>
              <UploadIcon sx={{ fontSize: 24, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body2">
                {isDragActive ? 'Drop file' : 'Drag & drop or click to select'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Excel (.xlsx, .xls) or CSV
              </Typography>
            </>
          )}
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={sendWelcomeEmail}
              onChange={(e) => setSendWelcomeEmail(e.target.checked)}
              size="small"
            />
          }
          label={<Typography variant="caption">Send welcome email</Typography>}
          sx={{ mb: 1 }}
        />

        {uploadResult && (
          <Alert
            icon={uploadResult.success ? <SuccessIcon fontSize="inherit" /> : <ErrorIcon fontSize="inherit" />}
            severity={uploadResult.success ? 'success' : 'error'}
            sx={{ mt: 1, py: 0.5 }}
          >
            <Typography variant="body2" fontWeight="bold">{uploadResult.message}</Typography>
            {uploadResult.details && (
              <Box component="ul" sx={{ pl: 2, mt: 0.5 }}>
                {uploadResult.details.map((detail, index) => (
                  <li key={index}>
                    <Typography variant="caption">
                      {typeof detail === 'string' ? detail : 
                      detail.error ? `Row ${detail.row}: ${detail.error}` : 
                      JSON.stringify(detail)}
                    </Typography>
                  </li>
                ))}
              </Box>
            )}
          </Alert>
        )}
      </Paper>

      <Dialog
        open={openPreviewModal}
        onClose={() => setOpenPreviewModal(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            width: '600px',
            maxHeight: '70vh',
            m: 1,
          }
        }}
      >
        <DialogTitle sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1">Preview Users</Typography>
          <Typography variant="caption" color="text.secondary">
            {previewData.length} users
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 1 }}
              />
              <Paper sx={{ height: '300px', overflow: 'auto' }}>
                <List dense sx={{ py: 0 }}>
                  {filteredUsers.length === 0 ? (
                    <Box sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        No users
                      </Typography>
                    </Box>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <ListItem
                        key={index}
                        button
                        dense
                        selected={selectedUserIndex === previewData.indexOf(user)}
                        onClick={() => handleSelectUser(previewData.indexOf(user))}
                        sx={{
                          py: 0.5,
                          borderLeft: selectedUserIndex === previewData.indexOf(user) ? `2px solid ${theme.palette.primary.main}` : 'none',
                          bgcolor: selectedUserIndex === previewData.indexOf(user) ? theme.palette.action.selected : 'inherit',
                          '&:hover': {
                            bgcolor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              bgcolor: theme.palette.primary.light,
                              color: theme.palette.primary.main,
                              fontSize: '0.75rem',
                            }}
                          >
                            {getInitial(user)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed'}
                          secondary={user.email || 'No email'}
                          primaryTypographyProps={{ 
                            fontWeight: 500,
                            variant: 'caption',
                            noWrap: true
                          }}
                          secondaryTypographyProps={{ 
                            color: 'text.secondary',
                            variant: 'caption',
                            noWrap: true
                          }}
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={7}>
              {selectedUserIndex !== null && editedUser ? (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                    Edit (Row {selectedUserIndex + 2})
                  </Typography>
                  <Paper sx={{ p: 1, flexGrow: 1, overflow: 'auto' }}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="First Name"
                          value={editedUser.firstName || ''}
                          onChange={(e) => handleEditUser('firstName', e.target.value)}
                          fullWidth
                          size="small"
                          margin="dense"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Last Name"
                          value={editedUser.lastName || ''}
                          onChange={(e) => handleEditUser('lastName', e.target.value)}
                          fullWidth
                          size="small"
                          margin="dense"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Email"
                          value={editedUser.email || ''}
                          onChange={(e) => handleEditUser('email', e.target.value)}
                          fullWidth
                          size="small"
                          margin="dense"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Password"
                          value={editedUser.password || ''}
                          onChange={(e) => handleEditUser('password', e.target.value)}
                          fullWidth
                          size="small"
                          margin="dense"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          label="Role"
                          value={editedUser.role || ''}
                          onChange={(e) => handleEditUser('role', e.target.value)}
                          fullWidth
                          size="small"
                          margin="dense"
                          variant="outlined"
                        >
                          {['admin', 'instructor', 'learner', 'owner'].map((role) => (
                            <MenuItem key={role} value={role} dense>
                              {role}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Birth Date"
                          value={editedUser.birthDate || ''}
                          onChange={(e) => handleEditUser('birthDate', e.target.value)}
                          fullWidth
                          size="small"
                          margin="dense"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          label="Status"
                          value={editedUser.status || ''}
                          onChange={(e) => handleEditUser('status', e.target.value)}
                          fullWidth
                          size="small"
                          margin="dense"
                          variant="outlined"
                        >
                          {['active', 'pending', 'suspended'].map((status) => (
                            <MenuItem key={status} value={status} dense>
                              {status}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Department"
                          value={editedUser.department || ''}
                          onChange={(e) => handleEditUser('department', e.target.value)}
                          fullWidth
                          size="small"
                          margin="dense"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth size="small" margin="dense" variant="outlined">
                          <InputLabel shrink>Courses</InputLabel>
                          <Select
                            multiple
                            value={editedUser.courseIds?.split(',').map(id => id.trim()).filter(id => id) || []}
                            onChange={(e) => handleEditUser('courseIds', e.target.value.join(','))}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                            label="Courses"
                          >
                            {courses.map((course) => (
                              <MenuItem key={course.id} value={course.id} dense>
                                {course.title}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    
                    {validationErrors.length > 0 && (
                      <Alert severity="error" sx={{ mt: 1, py: 0.5 }}>
                        <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                          {validationErrors.map((error, idx) => (
                            <li key={idx}>
                              <Typography variant="caption">{error}</Typography>
                            </li>
                          ))}
                        </Box>
                      </Alert>
                    )}
                    
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Button
                        variant="contained"
                        onClick={handleSaveUser}
                        disabled={validationErrors.length > 0}
                        size="small"
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleRemoveUser}
                        size="small"
                      >
                        Remove
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              ) : (
                <Box sx={{ 
                  height: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography variant="caption" color="text.secondary">
                    Select a user
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 1 }}>
          <Button onClick={() => setOpenPreviewModal(false)} size="small">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={processFile}
            disabled={isProcessing || previewData.length === 0}
            startIcon={isProcessing ? <CircularProgress size={16} /> : null}
            size="small"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRemoveConfirm}
        onClose={() => setOpenRemoveConfirm(false)}
        maxWidth="xs"
        sx={{
          '& .MuiDialog-paper': {
            width: '300px',
            m: 1,
          }
        }}
      >
        <DialogTitle sx={{ p: 1 }}>
          <Typography variant="body1">Confirm</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 1 }}>
          <Typography variant="body2">
            Remove user?
          </Typography>
          {editedUser && (
            <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5 }}>
              {editedUser.email || 'Unnamed'}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 1 }}>
          <Button onClick={() => setOpenRemoveConfirm(false)} size="small">Cancel</Button>
          <Button
            onClick={confirmRemoveUser}
            variant="contained"
            color="error"
            size="small"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BulkUserUpload;