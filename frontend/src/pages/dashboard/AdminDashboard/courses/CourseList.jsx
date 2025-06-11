import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Grid, Paper, TextField, Divider, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, CircularProgress, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, Autocomplete, Checkbox, List, ListItem,
  ListItemText, ListItemIcon, Input, useTheme, TablePagination, Menu, MenuItem, 
} from '@mui/material';
import {
  Edit, Visibility, MoreVert, Search, FilterList, Refresh,
  PersonAdd, GroupAdd, UploadFile, Person, Groups, Description,
  CheckBoxOutlineBlank, CheckBox, Warning
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { coursesAPI, userAPI } from '../../../../config';

const CourseList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Course list state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [activeStatusTab, setActiveStatusTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all'
  });
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enrollment state
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [bulkEnrollDialogOpen, setBulkEnrollDialogOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // File upload state
  const [activeTab, setActiveTab] = useState('manual');
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [fileError, setFileError] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: acceptedFiles => {
      setFileError(null);
      if (acceptedFiles.length > 0) {
        parseFile(acceptedFiles[0]);
      }
    },
    onDropRejected: (rejectedFiles) => {
      setFileError('File too large. Maximum size is 5MB');
    }
  });

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          page: 1,
          page_size: 1000,
          search: searchTerm || undefined,
          category: filters.category === 'all' ? undefined : filters.category,
          level: filters.level === 'all' ? undefined : filters.level
        };
        
        Object.keys(params).forEach(key => {
          if (params[key] === undefined || params[key] === null) {
            delete params[key];
          }
        });

        const response = await coursesAPI.getCourses(params);
        setAllCourses(response.data.results || []);
        setTotalCourses(response.data.count || 0);
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch courses';
        setError(errorMsg);
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourses();
  }, [searchTerm, filters.category, filters.level]);

  // Fetch users when enrollment dialogs open
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userAPI.getUsers({ page_size: 1000 });
        setUsers(response.data.results || []);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    
    if (enrollDialogOpen || bulkEnrollDialogOpen) {
      fetchUsers();
    }
  }, [enrollDialogOpen, bulkEnrollDialogOpen]);

  // Filter courses
  useEffect(() => {
    let filtered = [...allCourses];

    if (activeStatusTab !== 'all') {
      filtered = filtered.filter(course => course.status === activeStatusTab);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchLower) ||
        course.code.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(course => course.category?.name === filters.category);
    }

    if (filters.level !== 'all') {
      filtered = filtered.filter(course => course.level === filters.level);
    }

    setFilteredCourses(filtered);
    setTotalCourses(filtered.length);

    if (page * rowsPerPage >= filtered.length) {
      setPage(0);
    }
  }, [activeStatusTab, searchTerm, filters, allCourses, page, rowsPerPage]);

  // Parse uploaded file
  const parseFile = (file) => {
    setFile(file);
    
    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          if (results.data.length === 0) {
            setFileError('CSV file is empty or improperly formatted');
            return;
          }
          
          // Validate required columns
          const firstRow = results.data[0];
          if (!('email' in firstRow || 'Email' in firstRow || 'EMAIL' in firstRow)) {
            setFileError('CSV must contain an "email" column');
            return;
          }
          
          setFileData(results.data);
        },
        error: (error) => {
          setFileError(error.message);
        }
      });
    } else {
      // Handle Excel files
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          
          if (jsonData.length === 0) {
            setFileError('Excel file is empty or improperly formatted');
            return;
          }
          
          // Validate required columns
          const firstRow = jsonData[0];
          if (!('email' in firstRow || 'Email' in firstRow || 'EMAIL' in firstRow)) {
            setFileError('Excel file must contain an "email" column');
            return;
          }
          
          setFileData(jsonData);
        } catch (error) {
          setFileError('Error parsing Excel file');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Enrollment functions
  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setSelectedUser(null);
    setEnrollmentError(null);
    setEnrollDialogOpen(true);
  };

  const handleBulkEnrollClick = (course) => {
    setSelectedCourse(course);
    setSelectedUsers([]);
    setActiveTab('manual');
    setFile(null);
    setFileData([]);
    setFileError(null);
    setEnrollmentError(null);
    setBulkEnrollDialogOpen(true);
  };

  const handleEnrollSubmit = async () => {
    if (!selectedUser || !selectedCourse) return;
    
    try {
      setEnrollmentLoading(true);
      setEnrollmentError(null);
      
      const response = await coursesAPI.adminSingleEnroll(selectedCourse.id, { 
        user_id: selectedUser.id 
      });
      
      setSuccessMessage(`Successfully enrolled ${selectedUser.first_name} ${selectedUser.last_name} in ${selectedCourse.title}`);
      setTimeout(() => setSuccessMessage(null), 5000);
      setEnrollDialogOpen(false);
      setSelectedUser(null);
    } catch (err) {
      let errorMessage = 'Failed to enroll user';
      
      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = err.response.data.error || errorMessage;
          if (err.response.data.details) {
            errorMessage += `: ${JSON.stringify(err.response.data.details)}`;
          }
        } else if (err.response.status === 500) {
          errorMessage = err.response.data.error || errorMessage;
          if (err.response.data.details) {
            console.error('Server error details:', err.response.data.details);
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setEnrollmentError(errorMessage);
      console.error('Enrollment error:', err);
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const handleBulkEnrollSubmit = async () => {
    if (activeTab === 'manual' && selectedUsers.length === 0) return;
    if (activeTab === 'file' && fileData.length === 0) return;
    
    try {
      setEnrollmentLoading(true);
      setEnrollmentError(null);
      
      let userIds = [];
      
      if (activeTab === 'manual') {
        userIds = selectedUsers.map(user => user.id);
      } else {
        const emails = fileData.map(row => row.email || row.Email || row.EMAIL).filter(Boolean);
        if (emails.length === 0) {
          throw new Error('No valid email addresses found in the file');
        }
        
        const matchingUsers = users.filter(user => emails.includes(user.email));
        if (matchingUsers.length === 0) {
          throw new Error('No matching users found for the provided emails');
        }
        userIds = matchingUsers.map(user => user.id);
      }
  
      const response = await coursesAPI.adminBulkEnrollCourse(selectedCourse.id, userIds);
      
      let successMsg = `Successfully enrolled ${response.data.created || userIds.length} users`;
      if (response.data.already_enrolled > 0) {
        successMsg += ` (${response.data.already_enrolled} were already enrolled)`;
      }
      
      setSuccessMessage(successMsg);
      setTimeout(() => setSuccessMessage(null), 5000);
      setBulkEnrollDialogOpen(false);
      setSelectedUsers([]);
      setFile(null);
      setFileData([]);
    } catch (err) {
      let errorMessage = 'Failed to bulk enroll users';
      
      if (err.response) {
        errorMessage = err.response.data.error || errorMessage;
        if (err.response.data.details) {
          errorMessage += `: ${JSON.stringify(err.response.data.details)}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setEnrollmentError(errorMessage);
      console.error('Bulk enrollment error:', err);
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.id === user.id);
      return isSelected 
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user];
    });
  };

  const toggleSelectAllUsers = (selectAll) => {
    if (selectAll) {
      setSelectedUsers([...users]);
    } else {
      setSelectedUsers([]);
    }
  };

  // Course actions
  const handleMenuOpen = (event, course) => {
    setAnchorEl(event.currentTarget);
    setSelectedCourse(course);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCourse(null);
  };

  const handleEdit = (courseId) => {
    navigate(`/admin/courses/edit/${courseId}`);
    handleMenuClose();
  };

  const handleView = (courseId) => {
    navigate(`/admin/courses/view/${courseId}`);
    handleMenuClose();
  };

  const handleDelete = async (courseId) => {
    try {
      await coursesAPI.deleteCourse(courseId);
      setAllCourses(prev => prev.filter(course => course.id !== courseId));
      setTotalCourses(prev => prev - 1);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete course');
    } finally {
      handleMenuClose();
    }
  };

  // Pagination and filtering
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusTabChange = (event, newValue) => {
    setActiveStatusTab(newValue);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(0);
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      level: 'all'
    });
    setSearchTerm('');
    setActiveStatusTab('all');
    setPage(0);
  };

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'success';
      case 'Draft': return 'warning';
      case 'Archived': return 'default';
      default: return 'info';
    }
  };

  const formatPrice = (price, currency) => {
    if (price === undefined || price === null) return 'Free';
    
    const priceNumber = typeof price === 'string' ? parseFloat(price) : price;
    const currencyToUse = currency || 'NGN';
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyToUse
      }).format(priceNumber);
    } catch (e) {
      return `${currencyToUse} ${priceNumber.toFixed(2)}`;
    }
  };

  const paginatedCourses = filteredCourses.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <Box>
      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {/* Filter and Search Bar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearchChange}
              size="small"
              InputProps={{
                startAdornment: <Search sx={{ color: theme.palette.text.secondary, mr: 1 }} />
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              size="small"
              onClick={() => setFilterDialogOpen(true)}
            >
              Filters
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Refresh />}
              size="small"
              onClick={resetFilters}
            >
              Reset
            </Button>
          </Grid>
        </Grid>

        {/* Status Tabs */}
        <Tabs 
          value={activeStatusTab} 
          onChange={handleStatusTabChange}
          sx={{ mt: 2 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All" value="all" />
          <Tab label="Published" value="Published" />
          <Tab label="Draft" value="Draft" />
          <Tab label="Archived" value="Archived" />
        </Tabs>
        <Divider />
      </Paper>

      {/* Filter Dialog */}
      {filterDialogOpen && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Advanced Filters</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                size="small"
              >
                <MenuItem value="all">All Categories</MenuItem>
                {Array.from(new Set(allCourses.map(c => c.category?.name).filter(Boolean))).map(categoryName => (
                  <MenuItem key={categoryName} value={categoryName}>
                    {categoryName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Level"
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                size="small"
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setFilterDialogOpen(false)} size="small">Cancel</Button>
            <Button 
              variant="contained" 
              onClick={() => setFilterDialogOpen(false)}
              size="small"
              sx={{ ml: 1 }}
            >
              Apply
            </Button>
          </Box>
        </Paper>
      )}

      {/* Error Alert */}
      {error && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Courses Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Outcomes</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="error">{error}</Typography>
                </TableCell>
              </TableRow>
            ) : paginatedCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography>No courses found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCourses.map((course) => (
                <TableRow key={course.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 500 }}>{course.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.category?.name} • {course.level}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {course.discount_price ? (
                      <>
                        <Typography sx={{ textDecoration: 'line-through', fontSize: '0.8rem' }}>
                          {formatPrice(course.price, course.currency)}
                        </Typography>
                        <Typography color="error" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                          {formatPrice(course.discount_price, course.currency)}
                        </Typography>
                      </>
                    ) : (
                      <Typography sx={{ fontSize: '0.8rem' }}>
                        {formatPrice(course.price, course.currency)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    {course.learning_outcomes?.length > 0 ? (
                      <>
                        {course.learning_outcomes.slice(0, 2).map((outcome, i) => (
                          <Typography 
                            key={i} 
                            variant="body2" 
                            sx={{ 
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontSize: '0.8rem'
                            }}
                          >
                            • {outcome}
                          </Typography>
                        ))}
                        {course.learning_outcomes.length > 2 && (
                          <Typography variant="caption">
                            +{course.learning_outcomes.length - 2} more
                          </Typography>
                        )}
                      </>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        No outcomes
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={course.status} 
                      size="small" 
                      color={getStatusColor(course.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEnrollClick(course)}
                      aria-label="enroll"
                      color="primary"
                    >
                      <PersonAdd fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleBulkEnrollClick(course)}
                      aria-label="bulk enroll"
                      color="secondary"
                    >
                      <GroupAdd fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEdit(course.id)}
                      aria-label="edit"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleView(course.id)}
                      aria-label="view"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={(e) => handleMenuOpen(e, course)}
                      aria-label="more options"
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCourses}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Single Enrollment Dialog */}
      <Dialog open={enrollDialogOpen} onClose={() => setEnrollDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
            <Person sx={{ mr: 1, fontSize: 20 }} /> Enroll User
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedCourse?.title}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {enrollmentError && (
            <Alert severity="error" sx={{ mb: 1 }} onClose={() => setEnrollmentError(null)}>
              {enrollmentError}
            </Alert>
          )}
          
          <Autocomplete
            options={users}
            getOptionLabel={(user) => `${user.first_name} ${user.last_name} (${user.email})`}
            value={selectedUser}
            onChange={(event, newValue) => setSelectedUser(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select User"
                variant="outlined"
                fullWidth
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          />
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1 }}>
          <Button 
            onClick={() => setEnrollDialogOpen(false)}
            size="small"
            sx={{ minWidth: 80 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEnrollSubmit}
            variant="contained"
            disabled={!selectedUser || enrollmentLoading}
            size="small"
            sx={{ minWidth: 80 }}
            startIcon={enrollmentLoading ? <CircularProgress size={16} /> : null}
          >
            Enroll
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Enrollment Dialog */}
      <Dialog open={bulkEnrollDialogOpen} onClose={() => setBulkEnrollDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
            <Groups sx={{ mr: 1, fontSize: 20 }} /> Bulk Enroll
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedCourse?.title}
          </Typography>
        </DialogTitle>
        
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ px: 2 }}
          variant="fullWidth"
        >
          <Tab label="Manual" value="manual" icon={<Person fontSize="small" />} sx={{ minHeight: 48 }} />
          <Tab label="File Upload" value="file" icon={<Description fontSize="small" />} sx={{ minHeight: 48 }} />
        </Tabs>
        
        <DialogContent sx={{ pt: 1 }}>
          {enrollmentError && (
            <Alert severity="error" sx={{ mb: 1 }} onClose={() => setEnrollmentError(null)}>
              {enrollmentError}
            </Alert>
          )}
          
          {activeTab === 'manual' ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {selectedUsers.length} of {users.length} selected
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => toggleSelectAllUsers(selectedUsers.length < users.length)}
                >
                  {selectedUsers.length === users.length ? 'Deselect all' : 'Select all'}
                </Button>
              </Box>
              <List dense sx={{ maxHeight: 250, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                {users.map((user) => (
                  <ListItem 
                    key={user.id} 
                    button
                    onClick={() => toggleUserSelection(user)}
                    sx={{ py: 0 }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Checkbox
                        edge="start"
                        checked={selectedUsers.some(u => u.id === user.id)}
                        tabIndex={-1}
                        disableRipple
                        size="small"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${user.first_name} ${user.last_name}`}
                      secondary={user.email}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Upload CSV/Excel file with user emails (max 5MB):
              </Typography>
              
              <Box 
                {...getRootProps()} 
                sx={{
                  border: '1px dashed',
                  borderColor: fileError ? 'error.main' : 'divider',
                  borderRadius: 1,
                  p: 2,
                  textAlign: 'center',
                  backgroundColor: theme.palette.action.hover,
                  cursor: 'pointer',
                  mb: 1
                }}
              >
                <input {...getInputProps()} />
                {file ? (
                  <Box>
                    <Description fontSize="small" />
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {fileData.length} records found
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <UploadFile fontSize="small" />
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      Drag & drop file here
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      or click to browse (CSV, XLS, XLSX)
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {fileError && (
                <Alert severity="error" sx={{ mb: 1 }}>
                  {fileError}
                </Alert>
              )}
              
              {fileData.length > 0 && (
                <Box sx={{ maxHeight: 150, overflow: 'auto' }}>
                  <Typography variant="caption" color="text.secondary">
                    Preview (first 3 rows):
                  </Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ mt: 0.5 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {Object.keys(fileData[0]).slice(0, 3).map(key => (
                            <TableCell key={key} sx={{ fontWeight: 'bold', p: 0.5 }}>
                              {key}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fileData.slice(0, 3).map((row, i) => (
                          <TableRow key={i}>
                            {Object.values(row).slice(0, 3).map((value, j) => (
                              <TableCell key={j} sx={{ p: 0.5 }}>
                                {String(value)}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1 }}>
          <Button 
            onClick={() => {
              setBulkEnrollDialogOpen(false);
              setSelectedUsers([]);
              setFile(null);
              setFileData([]);
            }}
            size="small"
            sx={{ minWidth: 80 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleBulkEnrollSubmit}
            variant="contained"
            disabled={
              (activeTab === 'manual' && selectedUsers.length === 0) ||
              (activeTab === 'file' && fileData.length === 0) ||
              enrollmentLoading
            }
            size="small"
            sx={{ minWidth: 120 }}
            startIcon={enrollmentLoading ? <CircularProgress size={16} /> : null}
          >
            {activeTab === 'manual' 
              ? `Enroll ${selectedUsers.length}`
              : `Enroll from File`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Course Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleView(selectedCourse?.id)} sx={{ fontSize: '0.875rem' }}>
          <Visibility fontSize="small" sx={{ mr: 1 }} /> View
        </MenuItem>
        <MenuItem onClick={() => handleEdit(selectedCourse?.id)} sx={{ fontSize: '0.875rem' }}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => handleDelete(selectedCourse?.id)} sx={{ fontSize: '0.875rem' }}>
          <Warning fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CourseList;