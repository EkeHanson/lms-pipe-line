import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, InputAdornment, TablePagination,
  Paper, Select, MenuItem, FormControl, InputLabel,
  IconButton, CircularProgress, Alert, Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { userAPI } from '../../../config';
import { useTheme, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const ActivityFeed = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [allActivities, setAllActivities] = useState([]);
  const [displayedActivities, setDisplayedActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch all activities on component mount
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getUserActivities();
        setAllActivities(response.data.results);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch activities');
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Apply filters whenever filter criteria or pagination changes
  useEffect(() => {
    if (allActivities.length === 0) return;

    let filtered = [...allActivities];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.user.toLowerCase().includes(term) ||
        activity.activity_type.toLowerCase().includes(term)
      );
    }

    // Apply activity type filter
    if (activityFilter !== 'all') {
      filtered = filtered.filter(activity =>
        activity.activity_type === activityFilter
      );
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const today = dayjs();
      let startDate;

      switch (dateFilter) {
        case 'today':
          startDate = today.startOf('day');
          break;
        case 'week':
          startDate = today.subtract(7, 'day');
          break;
        case 'month':
          startDate = today.subtract(30, 'day');
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        filtered = filtered.filter(activity => {
          const activityDate = dayjs(activity.timestamp);
          return activityDate.isAfter(startDate) && activityDate.isBefore(today);
        });
      }
    }

    // Apply pagination
    const startIndex = page * rowsPerPage;
    const paginatedActivities = filtered.slice(startIndex, startIndex + rowsPerPage);

    setDisplayedActivities(paginatedActivities);
  }, [allActivities, searchTerm, dateFilter, activityFilter, page, rowsPerPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
    setPage(0);
  };

  const handleActivityFilterChange = (e) => {
    setActivityFilter(e.target.value);
    setPage(0);
  };

  const formatActivityType = (type) => {
    const verbMap = {
      login: 'logged in',
      logout: 'logged out',
      password_change: 'changed their password',
      profile_update: 'updated their profile',
      system: 'triggered a system event'
    };
    return verbMap[type] || type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ').toLowerCase();
  };

  const formatTimestamp = (timestamp) => {
    const activityDate = dayjs(timestamp);
    const now = dayjs();
    const hoursDiff = now.diff(activityDate, 'hour');

    if (hoursDiff < 24) {
      return activityDate.fromNow();
    } else {
      return activityDate.format('MMM D, YYYY - h:mm A');
    }
  };

  const getTotalFilteredCount = () => {
    let filtered = [...allActivities];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.user.toLowerCase().includes(term) ||
        activity.activity_type.toLowerCase().includes(term)
      );
    }

    if (activityFilter !== 'all') {
      filtered = filtered.filter(activity =>
        activity.activity_type === activityFilter
      );
    }

    if (dateFilter !== 'all') {
      const today = dayjs();
      let startDate;

      switch (dateFilter) {
        case 'today':
          startDate = today.startOf('day');
          break;
        case 'week':
          startDate = today.subtract(7, 'day');
          break;
        case 'month':
          startDate = today.subtract(30, 'day');
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        filtered = filtered.filter(activity => {
          const activityDate = dayjs(activity.timestamp);
          return activityDate.isAfter(startDate) && activityDate.isBefore(today);
        });
      }
    }

    return filtered.length;
  };

  if (error) {
    return (
      <Box sx={{ p: isMobile ? 1 : 2, marginLeft: 'auto', width: isMobile ? '100%' : 'auto' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 1 : { xs: 1, sm: 2, md: 2, pr: 0 }, marginLeft: 'auto', width: isMobile ? '100%' : 'auto' }}>
      <Typography
        variant={isMobile ? 'h6' : 'h5'}
        gutterBottom
        sx={{ mb: 3, fontWeight: 'medium' }}
      >
        Activity Feed
      </Typography>

      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
        alignItems={isMobile ? 'stretch' : 'center'}
        mb={3}
      >
        <TextField
          variant="outlined"
          placeholder="Search activities..."
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          sx={{ minWidth: isMobile ? '100%' : 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Date</InputLabel>
          <Select
            value={dateFilter}
            label="Date"
            onChange={handleDateFilterChange}
          >
            <MenuItem value="all">All Time</MenuItem>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">Last 7 Days</MenuItem>
            <MenuItem value="month">Last 30 Days</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Activity</InputLabel>
          <Select
            value={activityFilter}
            label="Activity"
            onChange={handleActivityFilterChange}
          >
            <MenuItem value="all">All Activities</MenuItem>
            <MenuItem value="login">Login</MenuItem>
            <MenuItem value="logout">Logout</MenuItem>
            <MenuItem value="password_change">Password Change</MenuItem>
            <MenuItem value="profile_update">Profile Update</MenuItem>
            <MenuItem value="system">System Event</MenuItem>
          </Select>
        </FormControl>
        <IconButton
          size="small"
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            display: isMobile ? 'none' : 'flex'
          }}
        >
          <FilterIcon fontSize="small" />
        </IconButton>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              p: isMobile ? 1 : 2,
              maxHeight: 'calc(100vh - 250px)',
              overflowY: 'auto',
              backgroundColor: theme.palette.background.paper
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {displayedActivities.length > 0 ? (
                displayedActivities.map((activity) => (
                  <Typography
                    key={activity.id}
                    variant={isMobile ? 'caption' : 'body2'}
                    sx={{ color: theme.palette.text.primary }}
                  >
                    <Typography
                      component="span"
                      sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}
                    >
                      <Link
                        to={`/activity/${activity.id}`}
                        sx={{
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        {activity.user}
                      </Link>
                    </Typography>{' '}
                    {formatActivityType(activity.activity_type)} {formatTimestamp(activity.timestamp)}.{' '}
                    <Link
                      to={`/activity/${activity.id}`}
                      sx={{
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        fontSize: 'inherit',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      [View]
                    </Link>
                  </Typography>
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ py: 4 }}
                >
                  No activities found matching your criteria
                </Typography>
              )}
            </Box>
          </Paper>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={getTotalFilteredCount()}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            sx={{
              borderBottom: 'none',
              '& .MuiTablePagination-toolbar': {
                paddingLeft: 0
              }}
            }
          />
        </>
      )}
    </Box>
  );
};

export default ActivityFeed;