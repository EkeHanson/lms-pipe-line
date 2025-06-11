import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Paper, Divider, LinearProgress,
  Chip, List, ListItem, ListItemText, ListItemIcon, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  Tooltip, useTheme, useMediaQuery, Avatar, Badge, CircularProgress,
  Tabs, Tab, Button, Stack, Skeleton, TablePagination, TextField, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Menu, Alert, Snackbar,
} from '@mui/material';
import {
  Refresh as RefreshIcon, People as UsersIcon, School as CoursesIcon,
  CreditCard as PaymentsIcon, Assessment as AnalyticsIcon,
  EventNote as ScheduleIcon, Email as MessagesIcon,Feedback as FeedbackIcon,FactCheck as IQAIcon,
  Notifications as AlertsIcon, Storage as DatabaseIcon,
  BarChart as StatsIcon, LibraryBooks as ContentIcon,
  GroupWork as GroupsIcon, VerifiedUser as CertificatesIcon,
  Timeline as ActivityIcon, Settings as SettingsIcon,
  CheckCircle as SuccessIcon, Warning as WarningIcon,
  Error as ErrorIcon, Info as InfoIcon, Campaign as AdvertsIcon,
  MoreVert as MoreIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon,
  Search as SearchIcon, FilterList as FilterIcon, Add as AddIcon
} from '@mui/icons-material';
import {isSuperAdmin, userAPI, coursesAPI, paymentAPI, messagingAPI, scheduleAPI, groupsAPI, advertAPI } from '../../../config';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// StatusChip component for user status
const StatusChip = ({ status }) => {
  const statusMap = {
    active: { color: 'success', icon: <SuccessIcon fontSize="small" /> },
    pending: { color: 'warning', icon: <WarningIcon fontSize="small" /> },
    suspended: { color: 'error', icon: <ErrorIcon fontSize="small" /> },
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

const getStatusIcon = (status) => {
  switch (status) {
    case 'success': return <SuccessIcon color="success" fontSize="small" />;
    case 'warning': return <WarningIcon color="warning" fontSize="small" />;
    case 'error': return <ErrorIcon color="error" fontSize="small" />;
    default: return <InfoIcon color="info" fontSize="small" />;
  }
};

// RoleChip component for user roles
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

// Helper function to get user initials for avatars
const getInitial = (user) => {
  if (!user) return '?';
  if (user.first_name) return user.first_name.charAt(0).toUpperCase();
  return user.email?.charAt(0).toUpperCase() || '?';
};

// Helper function to format course prices
const formatPrice = (price, currency) => {
  if (price === undefined || price === null) return 'Free';
  
  const priceNumber = typeof price === 'string' ? parseFloat(price) : price;
  const currencyToUse = currency || 'USD';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyToUse
    }).format(priceNumber);
  } catch (e) {
    return `${currencyToUse} ${priceNumber.toFixed(2)}`;
  }
};

// Helper function to get color for course status chips
const getStatusColor = (status) => {
  switch (status) {
    case 'Published': return 'success';
    case 'Draft': return 'warning';
    case 'Archived': return 'default';
    default: return 'info';
  }
};

const AdminDashboard = () => {
  const CACHE_EXPIRY_TIME = 5 * 60 * 100
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  
  // Dashboard state
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [faqStats, setFAQStats] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // User management state
  const [users, setUsers] = useState([]);
  const [userPagination, setUserPagination] = useState({
    count: 0,
    currentPage: 1
  });
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);
  const [userFilters, setUserFilters] = useState({
    role: 'all',
    status: 'all',
    search: ''
  });
  
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [actionError, setActionError] = useState(null);

  // Course management state
  const [courses, setCourses] = useState([]);
  const [coursePagination, setCoursePagination] = useState({
    count: 0,
    currentPage: 1
  });
  const [coursesPerPage, setCoursesPerPage] = useState(10);
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseError, setCourseError] = useState(null);
  const [courseFilters, setCourseFilters] = useState({
    status: 'all',
    search: ''
  });
  const [courseAnchorEl, setCourseAnchorEl] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Dashboard data
  const [recentActivities, setRecentActivities] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [totalSchedules, setTotalSchedules] = useState(0);
  const [paymentData, setPaymentData] = useState(null);
  const [groupStats, setGroupStats] = useState(null);
  const [certificateStats, setCertificateStats] = useState(null);
  const [advertStats, setAdvertStats] = useState(null);

  // Fetch dashboard data
// Update the fetchDashboardData function in your AdminDashboard component:
const fetchDashboardData = async (forceRefresh = false) => {
  // Check cache first if not forcing refresh
  if (!forceRefresh) {
    const cachedData = localStorage.getItem('dashboardData');
    const cacheTimestamp = localStorage.getItem('dashboardDataTimestamp');
    
    if (cachedData && cacheTimestamp) {
      const age = Date.now() - parseInt(cacheTimestamp);
      const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
      
      if (age < CACHE_EXPIRY_TIME) {
        try {
          const {
            cachedStats,
            cachedRecentActivities,
            cachedUnreadMessages,
            cachedTotalMessages,
            cachedUpcomingSchedules,
            cachedTotalSchedules,
            cachedPaymentData,
            cachedGroupStats,
            cachedCertificateStats,
            cachedAdvertStats,
            cachedFAQStats
          } = JSON.parse(cachedData);

          // Set all states from cached data
          setStats(cachedStats);
          setRecentActivities(cachedRecentActivities);
          setUnreadMessages(cachedUnreadMessages);
          setTotalMessages(cachedTotalMessages);
          setUpcomingSchedules(cachedUpcomingSchedules);
          setTotalSchedules(cachedTotalSchedules);
          setPaymentData(cachedPaymentData);
          setGroupStats(cachedGroupStats);
          setCertificateStats(cachedCertificateStats);
          setAdvertStats(cachedAdvertStats);
          setFAQStats(cachedFAQStats);
          
          setLoading(false);
          return; // Exit early since we used cached data
        } catch (e) {
          console.error('Failed to parse cached data', e);
          // Continue to fetch fresh data if cache parsing fails
        }
      }
    }
  }

  // If no cache or forcing refresh, fetch fresh data
  setLoading(true);
  setError(null);
  
  try {
    const [
      userStats,
      courseStats,
      recentUsersRes,
      popularCoursesRes,
      activitiesRes,
      messagesRes,
      schedulesRes,
      paymentsRes,
      groupsRes,
      certificatesRes,
      advertsRes,
      totalMessagesRes,
      totalSchedulesRes,
      faqStatsRes
    ] = await Promise.all([
      userAPI.getUserStats(),
      coursesAPI.getCourses(),
      fetchUsers(1, usersPerPage, userFilters),
      fetchCourses(1, coursesPerPage, courseFilters),
      userAPI.getUserActivities({ limit: 10 }),
      messagingAPI.getUnreadCount(),
      scheduleAPI.getUpcomingSchedules(),
      paymentAPI.getPaymentConfig(),
      groupsAPI.getGroups({ limit: 10 }),
      coursesAPI.getCertificates(),
      advertAPI.getAdverts(),
      messagingAPI.getTotalMessages(),
      scheduleAPI.getTotalSchedules(),
      coursesAPI.getFAQStats()
    ]);

    // Prepare data object for state updates
    const newStats = {
      users: userStats.data,
      courses: courseStats.data
    };

    const newRecentActivities = activitiesRes.data.results;
    const newUnreadMessages = messagesRes.data.count;
    const newTotalMessages = totalMessagesRes.data.total_messages;
    const newUpcomingSchedules = schedulesRes.data;
    const newTotalSchedules = totalSchedulesRes.data.total_schedule;
    const newPaymentData = paymentsRes.data;
    const newGroupStats = groupsRes.data;
    const newCertificateStats = certificatesRes.data;
    const newAdvertStats = advertsRes.data;
    const newFAQStats = faqStatsRes.data;

    // Update state
    setStats(newStats);
    setRecentActivities(newRecentActivities);
    setUnreadMessages(newUnreadMessages);
    setTotalMessages(newTotalMessages);
    setUpcomingSchedules(newUpcomingSchedules);
    setTotalSchedules(newTotalSchedules);
    setPaymentData(newPaymentData);
    setGroupStats(newGroupStats);
    setCertificateStats(newCertificateStats);
    setAdvertStats(newAdvertStats);
    setFAQStats(newFAQStats);

    // Cache the data
    const dataToCache = {
      cachedStats: newStats,
      cachedRecentActivities: newRecentActivities,
      cachedUnreadMessages: newUnreadMessages,
      cachedTotalMessages: newTotalMessages,
      cachedUpcomingSchedules: newUpcomingSchedules,
      cachedTotalSchedules: newTotalSchedules,
      cachedPaymentData: newPaymentData,
      cachedGroupStats: newGroupStats,
      cachedCertificateStats: newCertificateStats,
      cachedAdvertStats: newAdvertStats,
      cachedFAQStats: newFAQStats
    };

    localStorage.setItem('dashboardData', JSON.stringify(dataToCache));
    localStorage.setItem('dashboardDataTimestamp', Date.now().toString());

  } catch (err) {
    console.error('Failed to fetch dashboard data:', err);
    setError('Failed to load dashboard data. Please try again.');
    
    // If we have cached data, use it as fallback
    const cachedData = localStorage.getItem('dashboardData');
    if (cachedData) {
      try {
        const {
          cachedStats,
          cachedRecentActivities,
          cachedUnreadMessages,
          cachedTotalMessages,
          cachedUpcomingSchedules,
          cachedTotalSchedules,
          cachedPaymentData,
          cachedGroupStats,
          cachedCertificateStats,
          cachedAdvertStats,
          cachedFAQStats
        } = JSON.parse(cachedData);

        setStats(cachedStats);
        setRecentActivities(cachedRecentActivities);
        setUnreadMessages(cachedUnreadMessages);
        setTotalMessages(cachedTotalMessages);
        setUpcomingSchedules(cachedUpcomingSchedules);
        setTotalSchedules(cachedTotalSchedules);
        setPaymentData(cachedPaymentData);
        setGroupStats(cachedGroupStats);
        setCertificateStats(cachedCertificateStats);
        setAdvertStats(cachedAdvertStats);
        setFAQStats(cachedFAQStats);
        
        setSnackbar({
          open: true,
          message: 'Showing cached data as network request failed',
          severity: 'warning'
        });
      } catch (e) {
        console.error('Failed to parse cached data as fallback', e);
      }
    }
  } finally {
    setLoading(false);
  }
};

// Add a refresh button handler that forces refresh
const handleForceRefresh = () => {
  fetchDashboardData(true); // true forces refresh
};

// In your refresh button:
<IconButton onClick={handleForceRefresh} disabled={loading}>
  <RefreshIcon />
</IconButton>

  // Fetch users with pagination and filtering
  const fetchUsers = async (page, pageSize, filters) => {
    setUserLoading(true);
    setUserError(null);
    try {
      const params = {
        page,
        page_size: pageSize,
        ...(filters.role !== 'all' && { role: filters.role }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.search && { search: filters.search })
      };

      const response = await userAPI.getUsers(params);
      setUsers(response.data.results || []);
      setUserPagination({
        count: response.data.count || 0,
        currentPage: page
      });
      return response;
    } catch (err) {
      setUserError(err.message);
      setUsers([]);
      setUserPagination({
        count: 0,
        currentPage: 1
      });
      throw err;
    } finally {
      setUserLoading(false);
    }
  };

  // Fetch courses with pagination and filtering
  const fetchCourses = async (page, pageSize, filters) => {
    setCourseLoading(true);
    setCourseError(null);
    try {
      const params = {
        page,
        page_size: pageSize,
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.search && { search: filters.search })
      };

      const response = await coursesAPI.getCourses(params);
      setCourses(response.data.results || []);
      setCoursePagination({
        count: response.data.count || 0,
        currentPage: page
      });
      return response;
    } catch (err) {
      setCourseError(err.message);
      setCourses([]);
      setCoursePagination({
        count: 0,
        currentPage: 1
      });
      throw err;
    } finally {
      setCourseLoading(false);
    }
  };

  // User pagination handlers
  const handleUserPageChange = (event, newPage) => {
    fetchUsers(newPage + 1, usersPerPage, userFilters);
  };

  const handleUsersPerPageChange = (event) => {
    const newPerPage = parseInt(event.target.value, 10);
    setUsersPerPage(newPerPage);
    fetchUsers(1, newPerPage, userFilters);
  };

  // Course pagination handlers
  const handleCoursePageChange = (event, newPage) => {
    fetchCourses(newPage + 1, coursesPerPage, courseFilters);
  };

  const handleCoursesPerPageChange = (event) => {
    const newPerPage = parseInt(event.target.value, 10);
    setCoursesPerPage(newPerPage);
    fetchCourses(1, newPerPage, courseFilters);
  };

  // User filter handlers
  const handleUserFilterChange = (name, value) => {
    const newFilters = { ...userFilters, [name]: value };
    setUserFilters(newFilters);
    fetchUsers(1, usersPerPage, newFilters);
  };

  // Course filter handlers
  const handleCourseFilterChange = (name, value) => {
    const newFilters = { ...courseFilters, [name]: value };
    setCourseFilters(newFilters);
    fetchCourses(1, coursesPerPage, newFilters);
  };

  // User actions
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

  const handleUserMenuOpen = (event, user) => {
    setUserAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
  };

  const handleUserActionSelect = (action) => {
    setActionType(action);
    setOpenConfirmModal(true);
    handleUserMenuClose();
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
        setUserPagination(prev => ({ ...prev, count: prev.count - 1 }));
        setSnackbar({
          open: true,
          message: 'User deleted successfully',
          severity: 'success'
        });
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

  // Course actions
  const handleCourseMenuOpen = (event, course) => {
    setCourseAnchorEl(event.currentTarget);
    setSelectedCourse(course);
  };

  const handleCourseMenuClose = () => {
    setCourseAnchorEl(null);
  };

  const handleEditCourse = (courseId) => {
    navigate(`/admin/courses/edit/${courseId}`);
    handleCourseMenuClose();
  };

  const handleViewCourse = (courseId) => {
    navigate(`/admin/courses/view/${courseId}`);
    handleCourseMenuClose();
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await coursesAPI.deleteCourse(courseId);
      setCourses(prev => prev.filter(course => course.id !== courseId));
      setCoursePagination(prev => ({ ...prev, count: prev.count - 1 }));
      setSnackbar({
        open: true,
        message: 'Course deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to delete course',
        severity: 'error'
      });
    } finally {
      handleCourseMenuClose();
    }
  };

  // Snackbar handler
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Initialize data
  useEffect(() => {
    fetchDashboardData();
    fetchUsers(1, usersPerPage, userFilters);
    fetchCourses(1, coursesPerPage, courseFilters);
  }, []);

  // Stats calculations
  const getActiveUsersCount = () => users.filter(u => u.status === 'active').length;
  const getNewSignupsCount = () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return users.filter(u => u.signup_date && new Date(u.signup_date) > thirtyDaysAgo).length;
  };
  const getSuspiciousActivityCount = () => users.filter(u => u.login_attempts > 0).length;

  // Render user stats chart
  const renderUserStatsChart = () => {
    if (!stats?.users?.role_distribution) return null;

    const data = Object.entries(stats.users.role_distribution).map(([role, count]) => ({
      name: role,
      value: count
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartTooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // Render enrollment trends
  const renderEnrollmentTrends = () => {
    if (!stats?.courses?.monthly_trends) return null;

    const data = Object.entries(stats.courses.monthly_trends).map(([month, count]) => ({
      name: month,
      enrollments: count
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip />
          <Area type="monotone" dataKey="enrollments" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  // Render revenue chart
  const renderRevenueChart = () => {
    if (!paymentData?.monthly_revenue) return null;

    const data = Object.entries(paymentData.monthly_revenue).map(([month, amount]) => ({
      name: month,
      revenue: amount
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
          <Legend />
          <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  if (loading && !stats) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={4} md={2} key={item}>
              <Skeleton variant="rectangular" width="100%" height={100} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <ErrorIcon color="error" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6" gutterBottom>{error}</Typography>
        {/* <Button variant="contained" onClick={fetchDashboardData} startIcon={<RefreshIcon />}>
          Retry
        </Button> */}
        <IconButton onClick={handleForceRefresh} disabled={loading}>
          <RefreshIcon />
        </IconButton>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          LMS Admin Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MessagesIcon color="action" />
            <Typography variant="body2">
              Messages: <strong>{totalMessages}</strong> ({unreadMessages} unread)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScheduleIcon color="action" />
            <Typography variant="body2">
              Schedules: <strong>{totalSchedules}</strong> ({upcomingSchedules.length} upcoming)
            </Typography>
          </Box>
          <Tooltip title="Refresh data">
            <IconButton onClick={fetchDashboardData} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Summary Cards - Smaller and More Compact */}
      <Grid container spacing={2} sx={{ mb: 4 }}>

        {/* Users Card */}
        <Grid item xs={12} sm={6} md={2.4}>
        <Button 
          component={Paper} 
          sx={{ 
            p: 2, 
            height: '100%', 
            display: 'block', 
            textAlign: 'left', 
            textTransform: 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[4]
            }
          }}
          onClick={() => navigate('users')}
        >
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Total Users</Typography>
              <Avatar sx={{ bgcolor: theme.palette.primary.light, width: 24, height: 24 }}>
                <UsersIcon sx={{ fontSize: 16, color: theme.palette.primary.contrastText }} />
              </Avatar>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {stats?.users?.total_users || 0}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {stats?.users?.active_users || 0} active
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="caption" color="text.secondary">
                {stats?.users?.new_users_today || 0} new today
              </Typography>
            </Box>
          </Paper>
          </Button>
        </Grid>

        {/* Courses Card */}
        <Grid item xs={12} sm={6} md={2.4}>
        <Button 
          component={Paper} 
          sx={{ 
            p: 2, 
            height: '100%', 
            display: 'block', 
            textAlign: 'left', 
            textTransform: 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[4]
            }
          }}
          onClick={() => navigate('courses')}
        >
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Total Courses</Typography>
              <Avatar sx={{ bgcolor: theme.palette.secondary.light, width: 24, height: 24 }}>
                <CoursesIcon sx={{ fontSize: 16, color: theme.palette.secondary.contrastText }} />
              </Avatar>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {stats?.courses?.count || 0}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {stats?.courses?.active_courses || 0} active
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="caption" color="text.secondary">
                {stats?.courses?.total_all_enrollments || 3} enrollments
              </Typography>
            </Box>
          </Paper>
          </Button>
        </Grid>

        {/* Revenue Card */}
        {isSuperAdmin() && (
          <Grid item xs={12} sm={6} md={2.4}>
            <Button 
            component={Paper} 
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'block', 
              textAlign: 'left', 
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4]
              }
            }}
            onClick={() => navigate('payments')}
            >
            <Paper sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                <Avatar sx={{ bgcolor: theme.palette.success.light, width: 24, height: 24 }}>
                  <PaymentsIcon sx={{ fontSize: 16, color: theme.palette.success.contrastText }} />
                </Avatar>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                ${paymentData?.total_revenue?.toLocaleString() || '0'}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  ${paymentData?.monthly_revenue ? Object.values(paymentData.monthly_revenue).reduce((a, b) => a + b, 0).toLocaleString() : '0'} this month
                </Typography>
                <Divider orientation="vertical" flexItem />
                <Typography variant="caption" color="text.secondary">
                  {paymentData?.active_payment_methods?.length || 0} methods
                </Typography>
              </Box>
            </Paper>
            </Button>
          </Grid>
        )}

        {/* Groups Card */}
        <Grid item xs={12} sm={6} md={2.4}>
        <Button 
            component={Paper} 
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'block', 
              textAlign: 'left', 
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4]
              }
            }}
            onClick={() => navigate('groups')}
            >
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Total Groups</Typography>
              <Avatar sx={{ bgcolor: theme.palette.info.light, width: 24, height: 24 }}>
                <GroupsIcon sx={{ fontSize: 16, color: theme.palette.info.contrastText }} />
              </Avatar>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {groupStats?.count || 0}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {groupStats?.results?.reduce((acc, group) => acc + (group.member_count || 0), 0) || 0} members
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="caption" color="text.secondary">
                {groupStats?.results?.filter(g => g.is_active).length || 0} active
              </Typography>
            </Box>
          </Paper>
          </Button>
        </Grid>

        {/* Certificates Card */}
        <Grid item xs={12} sm={6} md={2.4}>
        <Button 
            component={Paper} 
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'block', 
              textAlign: 'left', 
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4]
              }
            }}
            onClick={() => navigate('builder')}
            >
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Certificates</Typography>
              <Avatar sx={{ bgcolor: theme.palette.warning.light, width: 24, height: 24 }}>
                <CertificatesIcon sx={{ fontSize: 16, color: theme.palette.warning.contrastText }} />
              </Avatar>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {certificateStats?.count || 0}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {certificateStats?.results?.filter(c => dayjs(c.issued_at).isAfter(dayjs().subtract(30, 'day'))).length || 0} last 30d
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="caption" color="text.secondary">
                {certificateStats?.results?.length || 0} issued
              </Typography>
            </Box>
          </Paper>
          </Button>
        </Grid>

        {/* Adverts Card */}
        <Grid item xs={12} sm={6} md={2.4}>
        <Button 
            component={Paper} 
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'block', 
              textAlign: 'left', 
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4]
              }
            }}
            onClick={() => navigate('advertorial')}
            >
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Adverts</Typography>
              <Avatar sx={{ bgcolor: theme.palette.error.light, width: 24, height: 24 }}>
                <AdvertsIcon sx={{ fontSize: 16, color: theme.palette.error.contrastText }} />
              </Avatar>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {advertStats?.count || 0}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {advertStats?.advertStats || 0} clicks
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="caption" color="text.secondary">
                {(advertStats?.average_ctr || 0).toFixed(2)}% CTR
              </Typography>
            </Box>
          </Paper>
          </Button>
        </Grid>

        {/* Messages Card */}
        <Grid item xs={12} sm={6} md={2.4}>
        <Button 
            component={Paper} 
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'block', 
              textAlign: 'left', 
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4]
              }
            }}
            onClick={() => navigate('communication')}
            >
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Messages</Typography>
              <Avatar sx={{ bgcolor: theme.palette.info.light, width: 24, height: 24 }}>
                <MessagesIcon sx={{ fontSize: 16, color: theme.palette.info.contrastText }} />
              </Avatar>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {totalMessages}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {unreadMessages} unread
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="caption" color="text.secondary">
                {recentActivities.filter(a => a.action_type === 'message').length} recent
              </Typography>
            </Box>
          </Paper>
          </Button>
        </Grid>

        {/* Schedules Card */}
        <Grid item xs={12} sm={6} md={2.4}>
        <Button 
            component={Paper} 
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'block', 
              textAlign: 'left', 
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4]
              }
            }}
            onClick={() => navigate('schedule')}
            >
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Schedules</Typography>
              <Avatar sx={{ bgcolor: theme.palette.warning.light, width: 24, height: 24 }}>
                <ScheduleIcon sx={{ fontSize: 16, color: theme.palette.warning.contrastText }} />
              </Avatar>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {totalSchedules}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {upcomingSchedules.length} upcoming
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="caption" color="text.secondary">
                {recentActivities.filter(a => a.action_type === 'schedule').length} recent
              </Typography>
            </Box>
          </Paper>
          </Button>
        </Grid>

        {/* FAQ Card */}
        <Grid item xs={12} sm={6} md={2.4}>
        <Button 
            component={Paper} 
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'block', 
              textAlign: 'left', 
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4]
              }
            }}
            onClick={() => navigate('faqs')}
            >
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">FAQs</Typography>
              <Avatar sx={{ bgcolor: theme.palette.info.light, width: 24, height: 24 }}>
                <ContentIcon sx={{ fontSize: 16, color: theme.palette.info.contrastText }} />
              </Avatar>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {faqStats?.total_faqs || 0}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {faqStats?.active_faqs || 0} active
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="caption" color="text.secondary">
                {faqStats?.inactive_faqs || 0} inactive
              </Typography>
            </Box>
          </Paper>
          </Button>
        </Grid>
        {/* Feedback Card */}
        <Grid item xs={12} sm={6} md={2.4}>
        <Button 
            component={Paper} 
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'block', 
              textAlign: 'left', 
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4]
              }
            }}
            onClick={() => navigate('feedback')}
            >
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Feedback</Typography>
              <Avatar sx={{ bgcolor: theme.palette.info.light, width: 24, height: 24 }}>
                <FeedbackIcon sx={{ fontSize: 16, color: theme.palette.info.contrastText }} />
              </Avatar>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {faqStats?.total_faqs || 0}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {faqStats?.active_faqs || 0} active
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="caption" color="text.secondary">
                {faqStats?.inactive_faqs || 0} inactive
              </Typography>
            </Box>
          </Paper>
          </Button>
        </Grid>
        {/* IQA Card */}
        <Grid item xs={12} sm={6} md={2.4}>
        <Button 
            component={Paper} 
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'block', 
              textAlign: 'left', 
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4]
              }
            }}
            onClick={() => navigate('quality-assurance')}
            >
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">IQA</Typography>
              <Avatar sx={{ bgcolor: theme.palette.info.light, width: 24, height: 24 }}>
                <IQAIcon sx={{ fontSize: 16, color: theme.palette.info.contrastText }} />
              </Avatar>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {faqStats?.total_faqs || 0}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {faqStats?.active_faqs || 0} active
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="caption" color="text.secondary">
                {faqStats?.inactive_faqs || 0} inactive
              </Typography>
            </Box>
          </Paper>
          </Button>
        </Grid>
        {/* EQA Card */}
        <Grid item xs={12} sm={6} md={2.4}>
        <Button 
            component={Paper} 
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'block', 
              textAlign: 'left', 
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4]
              }
            }}
            onClick={() => navigate('quality-assurance')}
            >
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">EQA</Typography>
              <Avatar sx={{ bgcolor: theme.palette.info.light, width: 24, height: 24 }}>
                <IQAIcon sx={{ fontSize: 16, color: theme.palette.info.contrastText }} />
              </Avatar>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {faqStats?.total_faqs || 0}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {faqStats?.active_faqs || 0} active
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="caption" color="text.secondary">
                {faqStats?.inactive_faqs || 0} inactive
              </Typography>
            </Box>
          </Paper>
          </Button>
        </Grid>
        
      </Grid>



      {/* Main Content */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={(e, newVal) => setActiveTab(newVal)} variant="scrollable" scrollButtons="auto">
          {/* <Tab label="Overview" icon={<AnalyticsIcon fontSize="small" />} /> */}
          <Tab label="Users" icon={<UsersIcon fontSize="small" />} />
          <Tab label="Courses" icon={<CoursesIcon fontSize="small" />} />
          {isSuperAdmin() && <Tab label="Payments" icon={<PaymentsIcon fontSize="small" />} />}
          <Tab label="Activity" icon={<ActivityIcon fontSize="small" />} />
          <Tab label="Messages" icon={<MessagesIcon fontSize="small" />} />
          <Tab label="Schedules" icon={<ScheduleIcon fontSize="small" />} />
        </Tabs>
        <Divider />


        {/* Users Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Users Table Filter */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Search users..."
                    value={userFilters.search}
                    onChange={(e) => handleUserFilterChange('search', e.target.value)}
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
                    value={userFilters.role}
                    onChange={(e) => handleUserFilterChange('role', e.target.value)}
                  >
                    <MenuItem value="all">All Roles</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="instructor">Instructor</MenuItem>
                    <MenuItem value="learner">Learner</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6} sm={3} md={2}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Status"
                    value={userFilters.status}
                    onChange={(e) => handleUserFilterChange('status', e.target.value)}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={() => {
                      setUserFilters({
                        role: 'all',
                        status: 'all',
                        search: ''
                      });
                      fetchUsers(1, usersPerPage, {
                        role: 'all',
                        status: 'all',
                        search: ''
                      });
                    }}
                  >
                    Reset Filters
                  </Button>
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
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : userError ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography color="error">{userError}</Typography>
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
                                  {/* {user.email} */}
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
       
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(event) => handleUserMenuOpen(event, user)}
                            >
                              <MoreIcon />
                            </IconButton>
                            <Menu
                              anchorEl={userAnchorEl}
                              open={Boolean(userAnchorEl)}
                              onClose={handleUserMenuClose}
                            >
                              <MenuItem
                                onClick={() => handleUserActionSelect('activate')}
                                disabled={selectedUser?.status === 'active'}
                              >
                                Activate
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleUserActionSelect('suspend')}
                                disabled={selectedUser?.status === 'suspended'}
                              >
                                Suspend
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleUserActionSelect('delete')}
                              >
                                Delete
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  resetLoginAttempts(selectedUser?.id);
                                  handleUserMenuClose();
                                }}
                                disabled={selectedUser?.login_attempts === 0}
                              >
                                Reset Login Attempts
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
                count={userPagination.count}
                rowsPerPage={usersPerPage}
                page={userPagination.currentPage - 1}
                onPageChange={handleUserPageChange}
                onRowsPerPageChange={handleUsersPerPageChange}
              />
            </Paper>
          </Box>
        )}

        {/* Courses Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            {/* Courses Table Filter */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Search courses..."
                    value={courseFilters.search}
                    onChange={(e) => handleCourseFilterChange('search', e.target.value)}
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
                    label="Status"
                    value={courseFilters.status}
                    onChange={(e) => handleCourseFilterChange('status', e.target.value)}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="Published">Published</MenuItem>
                    <MenuItem value="Draft">Draft</MenuItem>
                    <MenuItem value="Archived">Archived</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={() => {
                      setCourseFilters({
                        status: 'all',
                        search: ''
                      });
                      fetchCourses(1, coursesPerPage, {
                        status: 'all',
                        search: ''
                      });
                    }}
                  >
                    Reset Filters
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Courses Table */}
            <TableContainer component={Paper} sx={{ maxWidth: '90%', overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 200 }}>Title</TableCell>
                    <TableCell sx={{ minWidth: 150 }}>Price</TableCell>
                    <TableCell sx={{ minWidth: 100 }}>Status</TableCell>
                    <TableCell sx={{ minWidth: 120 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courseLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : courseError ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="error">{courseError}</Typography>
                      </TableCell>
                    </TableRow>
                  ) : courses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography>No courses found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    courses.map((course) => (
                      <TableRow key={course.id} hover>
                        <TableCell>
                          <Typography sx={{ fontWeight: 500 }}>{course.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {course.category?.name || 'No category'} • {course.level}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {course.discount_price ? (
                            <>
                              <Typography sx={{ textDecoration: 'line-through' }}>
                                {formatPrice(course.price, course.currency)}
                              </Typography>
                              <Typography color="error" sx={{ fontWeight: 600 }}>
                                {formatPrice(course.discount_price, course.currency)}
                              </Typography>
                            </>
                          ) : (
                            <Typography>{formatPrice(course.price, course.currency)}</Typography>
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
                            onClick={() => handleEditCourse(course.id)}
                            aria-label="edit"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleViewCourse(course.id)}
                            aria-label="view"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteCourse(course.id)}
                            aria-label="view"
                          >
                            <DeleteIcon fontSize="small" />
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
                count={coursePagination.count}
                rowsPerPage={coursesPerPage}
                page={coursePagination.currentPage - 1}
                onPageChange={handleCoursePageChange}
                onRowsPerPageChange={handleCoursesPerPageChange}
              />
            </TableContainer>

            {/* Course Actions Menu */}
            <Menu
              anchorEl={courseAnchorEl}
              open={Boolean(courseAnchorEl)}
              onClose={handleCourseMenuClose}
            >
              <MenuItem onClick={() => handleEditCourse(selectedCourse?.id)}>
                <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
              </MenuItem>
              <MenuItem onClick={() => handleViewCourse(selectedCourse?.id)}>
                <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> View Details
              </MenuItem>
              <MenuItem 
                onClick={() => handleDeleteCourse(selectedCourse?.id)} 
                sx={{ color: 'error.main' }}
              >
                Delete
              </MenuItem>
            </Menu>
          </Box>
        )}

        {/* Payments Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Payment Methods</Typography>
                {paymentData?.active_payment_methods?.length > 0 ? (
                  <List dense>
                    {paymentData.active_payment_methods.map((method) => (
                      <ListItem key={method.name} sx={{ py: 2 }}>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: theme.palette.grey[200] }}>
                            {method.name[0]}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={method.name}
                          secondary={`${method.transaction_count} transactions • $${method.total_amount?.toLocaleString()}`}
                        />
                        <Chip
                          label={method.is_live ? 'Live' : 'Test'}
                          size="small"
                          color={method.is_live ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No payment methods configured
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
                {paymentData?.recent_transactions?.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>User</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="right">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paymentData.recent_transactions.map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell>{new Date(tx.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>{tx.user_email}</TableCell>
                            <TableCell align="right">${tx.amount.toFixed(2)}</TableCell>
                            <TableCell align="right">
                              <Chip
                                label={tx.status}
                                size="small"
                                color={
                                  tx.status === 'completed' ? 'success' :
                                  tx.status === 'failed' ? 'error' : 'default'
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No recent transactions
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Activity Tab */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Recent Activities</Typography>
                <List>
                  {recentActivities.map((activity) => (
                    <ListItem key={activity.id} sx={{ py: 1 }}>
                      <ListItemIcon>
                        {getStatusIcon(activity.action_type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.description}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              sx={{ display: 'inline' }}
                            >
                              {activity.user?.full_name || 'System'}
                            </Typography>
                            {` • ${new Date(activity.timestamp).toLocaleString()}`}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Upcoming Events</Typography>
                {upcomingSchedules.length > 0 ? (
                  <List>
                    {upcomingSchedules.map((event) => (
                      <ListItem key={event.id} sx={{ py: 2 }}>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                            <ScheduleIcon sx={{ color: theme.palette.primary.contrastText }} />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={event.title}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                                sx={{ display: 'inline' }}
                              >
                                {new Date(event.start_time).toLocaleString()}
                              </Typography>
                              {` • ${event.description.substring(0, 50)}...`}
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No upcoming events
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Messages Tab */}
        {activeTab === 4 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Messages Overview</Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4">{totalMessages}</Typography>
                  <Typography variant="subtitle1">Total Messages</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4">{unreadMessages}</Typography>
                  <Typography variant="subtitle1">Unread Messages</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4">
                    {totalMessages > 0 ? Math.round((unreadMessages / totalMessages) * 100) : 0}%
                  </Typography>
                  <Typography variant="subtitle1">Unread Percentage</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4">
                    {recentActivities.filter(a => a.action_type === 'message').length}
                  </Typography>
                  <Typography variant="subtitle1">Recent Message Activities</Typography>
                </Paper>
              </Grid>
            </Grid>
            <Typography variant="h6" gutterBottom>Recent Messages</Typography>
            {recentActivities.filter(a => a.action_type === 'message').length > 0 ? (
              <List>
                {recentActivities
                  .filter(a => a.action_type === 'message')
                  .slice(0, 5)
                  .map((activity, index) => (
                    <ListItem key={index} sx={{ py: 2, borderBottom: 1, borderColor: 'divider' }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                          <MessagesIcon sx={{ color: theme.palette.primary.contrastText }} />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.description}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              sx={{ display: 'inline' }}
                            >
                              {activity.user?.full_name || 'System'}
                            </Typography>
                            {` • ${dayjs(activity.timestamp).fromNow()}`}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recent message activities
              </Typography>
            )}
          </Box>
        )}

        {/* Schedules Tab */}
        {activeTab === 5 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Schedules Overview</Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4">{totalSchedules}</Typography>
                  <Typography variant="subtitle1">Total Schedules</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4">{upcomingSchedules.length}</Typography>
                  <Typography variant="subtitle1">Upcoming Schedules</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4">
                    {recentActivities.filter(a => a.action_type === 'schedule').length}
                  </Typography>
                  <Typography variant="subtitle1">Recent Schedule Activities</Typography>
                </Paper>
              </Grid>
            </Grid>
            <Typography variant="h6" gutterBottom>Upcoming Schedules</Typography>
            {upcomingSchedules.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Start Time</TableCell>
                      <TableCell>End Time</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {upcomingSchedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>{schedule.title}</TableCell>
                        <TableCell>{new Date(schedule.start_time).toLocaleString()}</TableCell>
                        <TableCell>{new Date(schedule.end_time).toLocaleString()}</TableCell>
                        <TableCell>{schedule.description.substring(0, 50)}...</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No upcoming schedules
              </Typography>
            )}
          </Box>
        )}
      </Paper>

      {/* Confirmation Modal for User Actions */}
      <Dialog
        open={openConfirmModal}
        onClose={handleCancelAction}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {actionType === 'delete' ? 'Delete User' : 
           actionType === 'suspend' ? 'Suspend User' : 'Activate User'}
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

      {/* Snackbar */}
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
    </Container>
  );
};

export default AdminDashboard;