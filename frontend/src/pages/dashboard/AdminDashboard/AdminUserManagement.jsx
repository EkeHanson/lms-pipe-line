import React, { useState, useEffect } from 'react';
import API_BASE_URL, { userAPI, coursesAPI, messagingAPI } from '../../../config';
import {
  Box, Container, Typography, Grid, Paper, Table,
  TableBody, TableCell, TableContainer, TableHead, Snackbar,
  TableRow, TablePagination, Avatar, Chip, TextField, MenuItem,
  Divider, IconButton, useTheme, useMediaQuery, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, Menu, Tooltip,
  CircularProgress, Alert, Tabs, Tab, List, ListItem, ListItemText,
  ListItemAvatar, Select, FormControl, InputLabel
} from '@mui/material';
import {
  People as PeopleIcon, PersonAdd as PersonAddIcon,
  CheckCircle as ActiveIcon, Warning as WarningIcon, 
  Lock as SuspendedIcon, Schedule as PendingIcon, 
  Search as SearchIcon, FilterList as FilterIcon, 
  Refresh as RefreshIcon, MoreVert as MoreIcon,
  Add as AddIcon, Upload as UploadIcon, Login as LoginIcon,
  Close as CloseIcon, Login as ImpersonateIcon,
  Password as PasswordIcon, LockOpen as UnlockIcon,
  School as CourseIcon, Message as MessageIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from 'react-router-dom';
import UserRegistration from './UserRegistration';
import BulkUserUpload from './BulkUserUpload';
import UserGroupsManagement from './UserGroupsManagement';

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showCourseEnrollment, setShowCourseEnrollment] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [actionError, setActionError] = useState(null);

  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    search: '',
    dateFrom: null,
    dateTo: null
  });

  const [tabValue, setTabValue] = useState(0);
  const [userActivities, setUserActivities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [userEnrollments, setUserEnrollments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({
    subject: '',
    content: '',
    type: 'general'
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: pagination.currentPage,
        page_size: rowsPerPage,
        ...(filters.role !== 'all' && { role: filters.role }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
        ...(filters.dateFrom && { date_from: filters.dateFrom?.toISOString().split('T')[0] }),
        ...(filters.dateTo && { date_to: filters.dateTo?.toISOString().split('T')[0] })
      };

      const response = await userAPI.getUsers(params);
      setUsers(response.data.results || []);
      setPagination({
        count: response.data.count || 0,
        next: response.data.links?.next || null,
        previous: response.data.links?.previous || null,
        currentPage: pagination.currentPage
      });
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to fetch users';
      setError(errorMessage);
      setUsers([]);
      setPagination({
        count: 0,
        next: null,
        previous: null,
        currentPage: 1
      });
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserActivities = async (userId) => {
    try {
      const response = await userAPI.getUserActivities({ user_id: userId });
      setUserActivities(response.data.results || []);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch user activities',
        severity: 'error'
      });
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getCourses();
      setCourses(response.data.results || []);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch courses',
        severity: 'error'
      });
    }
  };

  const fetchUserEnrollments = async (userId) => {
    try {
      const response = await coursesAPI.getUserEnrollments(userId);
      setUserEnrollments(response.data.results || []);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch user enrollments',
        severity: 'error'
      });
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await messagingAPI.getMessages({ recipient_id: userId });
      setMessages(response.data.results || []);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch messages',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, [pagination.currentPage, rowsPerPage, filters]);

  useEffect(() => {
    if (selectedUser) {
      fetchUserActivities(selectedUser.id);
      fetchUserEnrollments(selectedUser.id);
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleChangePage = (event, newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleImpersonate = async (userId) => {
    // Placeholder: userAPI.impersonateUser is not defined in config.jsx or backend
    setSnackbar({
      open: true,
      message: 'Impersonation not implemented yet',
      severity: 'warning'
    });
  };

// In AdminUserManagement.js, update handlePasswordReset
const handlePasswordReset = async (userId) => {
  try {
    const user = users.find(u => u.id === userId);
    await authAPI.resetPassword({ email: user.email });
    setSnackbar({
      open: true,
      message: 'Password reset email sent successfully',
      severity: 'success'
    });
  } catch (err) {
    setSnackbar({
      open: true,
      message: 'Failed to send password reset email',
      severity: 'error'
    });
  }
};

  const handleAccountLock = async (userId, lock) => {
    try {
      await userAPI.updateUser(userId, { is_locked: lock });
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_locked: lock } : user
      ));
      setSnackbar({
        open: true,
        message: `Account ${lock ? 'locked' : 'unlocked'} successfully`,
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Failed to ${lock ? 'lock' : 'unlock'} account`,
        severity: 'error'
      });
    }
  };

  const handleEnrollCourse = async (courseId) => {
    try {
      await coursesAPI.adminSingleEnroll(courseId, { user_id: selectedUser.id });
      await fetchUserEnrollments(selectedUser.id);
      setSnackbar({
        open: true,
        message: 'User enrolled in course successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to enroll user in course',
        severity: 'error'
      });
    }
  };

  const handleDisenrollCourse = async (enrollmentId) => {
    // Placeholder: coursesAPI.deleteEnrollment is not defined in config.jsx or backend
    setSnackbar({
      open: true,
      message: 'Course disenrollment not implemented yet',
      severity: 'warning'
    });
  };

  const handleSendMessage = async () => {
    try {
      await messagingAPI.createMessage({
        recipient_id: selectedUser.id,
        subject: newMessage.subject,
        content: newMessage.content,
        type: newMessage.type
      });
      setNewMessage({ subject: '', content: '', type: 'general' });
      await fetchMessages(selectedUser.id);
      setSnackbar({
        open: true,
        message: 'Message sent successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to send message',
        severity: 'error'
      });
    }
  };

  const resetLoginAttempts = async (userId) => {
    try {
      await userAPI.updateUser(userId, { login_attempts: 0 });
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, login_attempts: 0 } : user
      ));
      setSnackbar({
        open: true,
        message: 'Login attempts reset successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to reset login attempts',
        severity: 'error'
      });
    }
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionSelect = (action) => {
    setActionType(action);
    if (action === 'courses' || action === 'messages') {
      setShowCourseEnrollment(action === 'courses');
      setShowMessaging(action === 'messages');
    } else {
      setOpenConfirmModal(true);
    }
    handleMenuClose();
  };

  const handleConfirmAction = async () => {
    setActionError(null);
    
    if (!selectedUser) {
      setActionError('No user selected');
      return;
    }
  
    try {
      if (actionType === 'delete') {
        await userAPI.deleteUser(selectedUser.id);
        setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
        setPagination(prev => ({ ...prev, count: prev.count - 1 }));
        setSnackbar({
          open: true,
          message: 'User deleted successfully',
          severity: 'success'
        });
      } else if (actionType === 'impersonate') {
        await handleImpersonate(selectedUser.id);
      } else if (actionType === 'reset_password') {
        await handlePasswordReset(selectedUser.id);
      } else if (actionType === 'lock' || actionType === 'unlock') {
        await handleAccountLock(selectedUser.id, actionType === 'lock');
      } else {
        const newStatus = actionType === 'suspend' ? 'suspended' : 'active';
        await userAPI.updateUser(selectedUser.id, { status: newStatus });
        setUsers(prev => prev.map(user =>
          user.id === selectedUser.id ? { ...user, status: newStatus } : user
        ));
        setSnackbar({
          open: true,
          message: `User ${newStatus === 'suspended' ? 'suspended' : 'activated'} successfully`,
          severity: 'success'
        });
      }
      setOpenConfirmModal(false);
      setSelectedUser(null);
    } catch (err) {
      setActionError(err.message || 'Failed to perform action');
    }
  };

  const handleCancelAction = () => {
    setOpenConfirmModal(false);
    setActionType(null);
    setActionError(null);
  };

  const StatusChip = ({ status }) => {
    const statusMap = {
      active: { color: 'success', icon: <ActiveIcon fontSize="small" /> },
      pending: { color: 'warning', icon: <PendingIcon fontSize="small" /> },
      suspended: { color: 'error', icon: <SuspendedIcon fontSize="small" /> }
    };

    return (
      <Chip
        icon={statusMap[status]?.icon}
        label={status}
        color={statusMap[status]?.color || 'default'}
        size="small"
        variant="outlined"
      />
    );
  };

  const RoleChip = ({ role }) => {
    const roleMap = {
      admin: { color: 'primary', label: 'Admin' },
      instructor: { color: 'secondary', label: 'Instructor' },
      learner: { color: 'default', label: 'Learner' },
      owner: { color: 'info', label: 'Owner' }
    };

    return (
      <Chip
        label={roleMap[role]?.label || role}
        color={roleMap[role]?.color || 'default'}
        size="small"
      />
    );
  };

  const handleAddUser = async (newUser) => {
    try {
      const response = await userAPI.createUser(newUser);
      setUsers(prev => [...prev, {
        ...response.data,
        last_login: null,
        last_login_ip: null,
        last_login_device: null,
        signup_date: new Date().toISOString(),
        login_attempts: 0,
        status: 'active'
      }]);
      setPagination(prev => ({ ...prev, count: prev.count + 1 }));
      setShowRegistrationForm(false);
      setSnackbar({
        open: true,
        message: 'User created successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.detail || err.message || 'Failed to add user',
        severity: 'error'
      });
    }
  };

  const getInitial = (user) => {
    if (!user) return '?';
    if (user.first_name) return user.first_name.charAt(0).toUpperCase();
    return user.email?.charAt(0).toUpperCase() || '?';
  };

  const handleBulkUpload = async () => {
    try {
      await fetchUsers();
      setShowBulkUpload(false);
      setSnackbar({
        open: true,
        message: 'Users uploaded successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to refresh user list after upload',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getActiveUsersCount = () => users.filter(u => u.status === 'active').length;
  const getNewSignupsCount = () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return users.filter(u => u.signup_date && new Date(u.signup_date) > thirtyDaysAgo).length;
  };
  const getSuspiciousActivityCount = () => users.filter(u => u.login_attempts > 0).length;

  const stats = [
    { title: 'Total Users', value: pagination.count, icon: <PeopleIcon fontSize="large" />, change: '+12% from last month' },
    { title: 'Active Users', value: getActiveUsersCount(), icon: <ActiveIcon fontSize="large" />, change: 'Active in last 30 days' },
    { title: 'New Signups', value: getNewSignupsCount(), icon: <PersonAddIcon fontSize="large" />, change: 'This month' },
    { title: 'Suspicious Activity', value: getSuspiciousActivityCount(), icon: <WarningIcon fontSize="large" />, change: 'Failed login attempts' }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
          User Management
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {stat.title}
                  </Typography>
                  <Avatar sx={{
                    bgcolor: theme.palette.primary.light,
                    color: theme.palette.primary.main
                  }}>
                    {stat.icon}
                  </Avatar>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.change}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowRegistrationForm(true)}
          >
            Add User
          </Button>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => setShowBulkUpload(true)}
          >
            Bulk Upload
          </Button>
        </Box>

        {/* Filters Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Role"
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="instructor">Instructor</MenuItem>
                <MenuItem value="learner">Learner</MenuItem>
                <MenuItem value="owner">Owner</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6} sm={6} md={2}>
              <DatePicker
                label="From"
                value={filters.dateFrom}
                onChange={(newValue) => handleFilterChange('dateFrom', newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={2}>
              <DatePicker
                label="To"
                value={filters.dateTo}
                onChange={(newValue) => handleFilterChange('dateTo', newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={1} sx={{ textAlign: 'right' }}>
              <IconButton onClick={() => {
                setFilters({
                  role: 'all',
                  status: 'all',
                  search: '',
                  dateFrom: null,
                  dateTo: null
                });
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}>
                <RefreshIcon />
              </IconButton>
              <IconButton>
                <FilterIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>

        {/* Users Table */}
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Signup Date</TableCell>
                  <TableCell>Login Attempts</TableCell>
                  <TableCell>Locked</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="error">{error}</Typography>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography>No users found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              mr: 2,
                              bgcolor: theme.palette.primary.light,
                              color: theme.palette.primary.main
                            }}
                            onClick={() => navigate(`/admin/learner-profile/${user.id}`)}
                          >
                            {getInitial(user)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">{user.first_name} {user.last_name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <RoleChip role={user.role} />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={user.status} />
                      </TableCell>
                      <TableCell>
                        {new Date(user.signup_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {user.login_attempts > 0 ? (
                          <Tooltip title="Click to reset">
                            <Chip
                              label={user.login_attempts}
                              color="error"
                              size="small"
                              variant="outlined"
                              onClick={() => resetLoginAttempts(user.id)}
                              clickable
                            />
                          </Tooltip>
                        ) : (
                          <Typography variant="body2">0</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.is_locked ? 'Locked' : 'Unlocked'}
                          color={user.is_locked ? 'error' : 'success'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(event) => handleMenuOpen(event, user)}
                        >
                          <MoreIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                        >
                          <MenuItem
                            onClick={() => handleActionSelect('activate')}
                            disabled={selectedUser?.status === 'active'}
                          >
                            Activate
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleActionSelect('suspend')}
                            disabled={selectedUser?.status === 'suspended'}
                          >
                            Suspend
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleActionSelect('delete')}
                          >
                            Delete
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleActionSelect('impersonate')}
                          >
                            Impersonate
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleActionSelect('reset_password')}
                          >
                            Reset Password
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleActionSelect(user.is_locked ? 'unlock' : 'lock')}
                          >
                            {user.is_locked ? 'Unlock' : 'Lock'} Account
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              resetLoginAttempts(selectedUser?.id);
                              handleMenuClose();
                            }}
                            disabled={selectedUser?.login_attempts === 0}
                          >
                            Reset Login Attempts
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleActionSelect('courses')}
                          >
                            Manage Courses
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleActionSelect('messages')}
                          >
                            Messages
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={pagination.count}
            rowsPerPage={rowsPerPage}
            page={pagination.currentPage - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* User Details Section */}
        {selectedUser && (
          <Paper elevation={3} sx={{ mt: 4, p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              User Details: {selectedUser.first_name} {selectedUser.last_name}
            </Typography>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
              <Tab label="Activity Logs" />
              <Tab label="Course Enrollments" />
              <Tab label="Messages" />
            </Tabs>

            {tabValue === 0 && (
              <List>
                {userActivities.length > 0 ? (
                  userActivities.map((activity) => (
                    <ListItem key={activity.id}>
                      <ListItemAvatar>
                        <Avatar>
                          {activity.activity_type === 'login' ? <LoginIcon /> : <PeopleIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${activity.activity_type} - ${activity.status}`}
                        secondary={`${activity.details} (${new Date(activity.timestamp).toLocaleString()})`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography>No activity logs found</Typography>
                )}
              </List>
            )}

            {tabValue === 1 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Enrolled Courses
                </Typography>
                <List>
                  {userEnrollments.map((enrollment) => (
                    <ListItem key={enrollment.id} secondaryAction={
                      <IconButton edge="end" onClick={() => handleDisenrollCourse(enrollment.id)}>
                        <DeleteIcon />
                      </IconButton>
                    }>
                      <ListItemAvatar>
                        <Avatar>
                          <CourseIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={enrollment.course.title}
                        secondary={`Enrolled on: ${new Date(enrollment.created_at).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Message History
                </Typography>
                <List>
                  {messages.map((message) => (
                    <ListItem key={message.id}>
                      <ListItemAvatar>
                        <Avatar>
                          <MessageIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={message.subject}
                        secondary={`${message.content} (${new Date(message.created_at).toLocaleString()})`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        )}

        {/* User Groups Management Section */}
        <Box sx={{ mt: 4 }}>
          <UserGroupsManagement users={users} />
        </Box>

        {/* Confirmation Modal */}
        <Dialog
          open={openConfirmModal}
          onClose={handleCancelAction}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {actionType === 'delete' ? 'Delete User' : 
             actionType === 'suspend' ? 'Suspend User' :
             actionType === 'impersonate' ? 'Impersonate User' :
             actionType === 'reset_password' ? 'Reset Password' :
             actionType === 'lock' ? 'Lock Account' :
             actionType === 'unlock' ? 'Unlock Account' : 'Activate User'}
          </DialogTitle>
          <DialogContent>
            {actionError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {actionError}
              </Alert>
            )}
            {selectedUser ? (
              <Typography>
                Are you sure you want to {actionType} the user <strong>{selectedUser.email}</strong>?
                {actionType === 'delete' && ' This action cannot be undone.'}
                {actionType === 'impersonate' && ' You will be logged in as this user.'}
              </Typography>
            ) : (
              <Typography color="error">No user selected</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelAction}>Cancel</Button>
            <Button
              onClick={handleConfirmAction}
              variant="contained"
              color={actionType === 'delete' ? 'error' : 'primary'}
              disabled={!selectedUser}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Course Enrollment Dialog */}
        <Dialog
          open={showCourseEnrollment}
          onClose={() => setShowCourseEnrollment(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Manage Course Enrollments
            <IconButton
              aria-label="close"
              onClick={() => setShowCourseEnrollment(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Available Courses</InputLabel>
              <Select
                label="Available Courses"
                onChange={(e) => handleEnrollCourse(e.target.value)}
              >
                {courses
                  .filter(course => !userEnrollments.some(e => e.course.id === course.id))
                  .map(course => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </DialogContent>
        </Dialog>

        {/* Messaging Dialog */}
        <Dialog
          open={showMessaging}
          onClose={() => setShowMessaging(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Send Message
            <IconButton
              aria-label="close"
              onClick={() => setShowMessaging(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Subject"
              value={newMessage.subject}
              onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              value={newMessage.content}
              onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Message Type</InputLabel>
              <Select
                label="Message Type"
                value={newMessage.type}
                onChange={(e) => setNewMessage({ ...newMessage, type: e.target.value })}
              >
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="alert">Alert</MenuItem>
                <MenuItem value="notification">Notification</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleSendMessage}
              sx={{ mt: 2 }}
              disabled={!newMessage.subject || !newMessage.content}
            >
              Send Message
            </Button>
          </DialogContent>
        </Dialog>

        {/* User Roles & Permissions Summary */}
        <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            User Roles & Permissions Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Administrators
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {users.filter(u => u.role === 'admin').length} users • Full system access
                </Typography>
                <Typography variant="caption">
                  Can manage all users, courses, and system settings
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, borderLeft: `4px solid ${theme.palette.secondary.main}` }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Instructors
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {users.filter(u => u.role === 'instructor').length} users • Can create and manage courses
                </Typography>
                <Typography variant="caption">
                  Can create course content, manage learners, and view analytics
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, borderLeft: `4px solid ${theme.palette.success.main}` }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Learners
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {users.filter(u => u.role === 'learner').length} users • Can enroll in courses
                </Typography>
                <Typography variant="caption">
                  Can browse courses, enroll in programs, and track progress
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Registration Dialog */}
        <Dialog
          open={showRegistrationForm}
          onClose={() => setShowRegistrationForm(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Register New User
            <IconButton
              aria-label="close"
              onClick={() => setShowRegistrationForm(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <UserRegistration onRegister={handleAddUser} />
          </DialogContent>
        </Dialog>

        {/* Bulk Upload Dialog */}
        <Dialog
          open={showBulkUpload}
          onClose={() => setShowBulkUpload(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Bulk User Upload
            <IconButton
              aria-label="close"
              onClick={() => setShowBulkUpload(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <BulkUserUpload onUpload={handleBulkUpload} />
          </DialogContent>
        </Dialog>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default AdminUserManagement;