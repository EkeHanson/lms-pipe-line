import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem, Snackbar, 
  Tooltip, Link, Chip, Autocomplete, Checkbox, FormControlLabel, 
  FormGroup, Divider, useMediaQuery, IconButton, Stack, 
  Collapse, Card, CardContent, CardActions, List, ListItem, 
  ListItemText, ListItemAvatar, Avatar, TablePagination, Grid,
  LinearProgress, CircularProgress, Badge,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, 
  CalendarToday as CalendarIcon, Person as PersonIcon,
  Group as GroupIcon, MoreVert as MoreIcon, ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon, Check as CheckIcon,
  Close as CloseIcon, Schedule as ScheduleIcon, Search as SearchIcon,
  ArrowForward as ArrowForwardIcon, ArrowBack as ArrowBackIcon,
  EventAvailable as EventAvailableIcon, EventBusy as EventBusyIcon,
  LocationOn as LocationIcon, Refresh as RefreshIcon, Email as EmailIcon, 
  Videocam as VideocamIcon, Groups as TeamsIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, parseISO, isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { scheduleAPI, groupsAPI, userAPI } from '../../../config';
import { debounce } from 'lodash';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const responseOptions = [
  { value: 'pending', label: 'Pending', color: 'default' },
  { value: 'accepted', label: 'Accepted', color: 'success' },
  { value: 'declined', label: 'Declined', color: 'error' },
  { value: 'tentative', label: 'Tentative', color: 'warning' },
];

const Schedule = () => {
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // State management
  const [schedules, setSchedules] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [expandedSchedule, setExpandedSchedule] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [groupSearchQuery, setGroupSearchQuery] = useState('');

  // Pagination state
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    page: 1
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: null,
    dateTo: null,
    showPast: false
  });

  // WebSocket integration
  const { lastMessage, sendMessage } = useWebSocket(
    `ws://${window.location.host}/ws/schedules/`
  );

  // Helper function to generate Google Calendar link
  const generateGoogleCalendarLink = (schedule) => {
    const startTime = new Date(schedule.start_time).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endTime = new Date(schedule.end_time).toISOString().replace(/-|:|\.\d\d\d/g, '');
    
    const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
    const title = `&text=${encodeURIComponent(schedule.title || '')}`;
    const dates = `&dates=${startTime}/${endTime}`;
    const details = `&details=${encodeURIComponent(schedule.description || '')}`;
    const location = `&location=${encodeURIComponent(schedule.location || '')}`;
    
    return `${baseUrl}${title}${dates}${details}${location}`;
  };

  // Helper function to truncate URLs
  const truncateUrl = (url, maxLength = 30) => {
    if (!url) return '';
    
    try {
      const urlObj = new URL(url);
      let displayUrl = urlObj.hostname.replace('www.', '');
      
      if (urlObj.hostname.includes('meet.google.com')) {
        return 'Google Meet';
      }
      if (urlObj.hostname.includes('teams.microsoft.com')) {
        return 'Microsoft Teams';
      }
      if (urlObj.hostname.includes('zoom.us')) {
        return 'Zoom Meeting';
      }
      
      if (displayUrl.length + urlObj.pathname.length <= maxLength) {
        return `${displayUrl}${urlObj.pathname}`;
      }
      
      return displayUrl;
    } catch {
      return url.length <= maxLength ? url : `${url.substring(0, maxLength - 3)}...`;
    }
  };

  // Function to get platform icon and color
  const getPlatformIcon = (url) => {
    if (!url) return <VideocamIcon fontSize="small" />;
    
    try {
      const urlObj = new URL(url);
      
      if (urlObj.hostname.includes('meet.google.com')) {
        return <VideocamIcon fontSize="small" style={{ color: '#00897B' }} />;
      }
      if (urlObj.hostname.includes('teams.microsoft.com')) {
        return <TeamsIcon fontSize="small" style={{ color: '#464EB8' }} />;
      }
      if (urlObj.hostname.includes('zoom.us')) {
        return <VideocamIcon fontSize="small" style={{ color: '#2D8CFF' }} />;
      }
    } catch {
      // If URL parsing fails, fall back to default
    }
    
    return <VideocamIcon fontSize="small" />;
  };

  // Fetch users with search query
  const fetchUsers = useCallback(async (searchQuery = '') => {
    try {
      const params = {
        search: searchQuery,
        page_size: 50,
      };
      const usersRes = await userAPI.getUsers(params);
      setUsers(usersRes.data.results || []);
    } catch (error) {
      enqueueSnackbar('Failed to load users', { variant: 'error' });
      console.error('Error fetching users:', error);
    }
  }, [enqueueSnackbar]);

  // Debounced user search
  const debouncedFetchUsers = useCallback(
    debounce((query) => {
      fetchUsers(query);
    }, 300),
    [fetchUsers]
  );

  // Handle user search input
  const handleUserSearch = (event, value) => {
    setUserSearchQuery(value);
    debouncedFetchUsers(value);
  };

  // Fetch groups with search query
  const fetchGroups = useCallback(async (searchQuery = '') => {
    try {
      const params = {
        search: searchQuery,
        page_size: 50,
      };
      const groupsRes = await groupsAPI.getGroups(params);
      setFilteredGroups(groupsRes.data.results || []);
    } catch (error) {
      enqueueSnackbar('Failed to load groups', { variant: 'error' });
      console.error('Error fetching groups:', error);
    }
  }, [enqueueSnackbar]);

  // Debounced group search
  const debouncedFetchGroups = useCallback(
    debounce((query) => {
      fetchGroups(query);
    }, 300),
    [fetchGroups]
  );

  // Handle group search input
  const handleGroupSearch = (event, value) => {
    setGroupSearchQuery(value);
    debouncedFetchGroups(value);
  };

  // Fetch initial data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: pagination.page,
        page_size: rowsPerPage,
        ...(filters.search && { search: filters.search }),
        ...(filters.dateFrom && { date_from: format(filters.dateFrom, 'yyyy-MM-dd') }),
        ...(filters.dateTo && { date_to: format(filters.dateTo, 'yyyy-MM-dd') }),
        show_past: filters.showPast
      };

      const [schedulesRes, groupsRes] = await Promise.all([
        scheduleAPI.getSchedules(params),
        groupsAPI.getGroups({ page_size: 50 })
      ]);

      // console.log("schedulesRes")
      // console.log(schedulesRes)
      // console.log("schedulesRes")

      setSchedules(schedulesRes.data.results || []);
      setGroups(groupsRes.data.results || []);
      setFilteredGroups(groupsRes.data.results || []);
      setPagination({
        count: schedulesRes.data.count || 0,
        next: schedulesRes.data.next,
        previous: schedulesRes.data.previous,
        page: pagination.page
      });

      await fetchUsers('');
    } catch (error) {
      setError(error.message);
      enqueueSnackbar('Failed to load data', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, rowsPerPage, filters]);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      if (data.type === 'new_schedule') {
        if (pagination.page === 1) {
          setSchedules(prev => [data.schedule, ...prev.slice(0, -1)]);
          setPagination(prev => ({
            ...prev,
            count: prev.count + 1
          }));
        } else {
          setPagination(prev => ({
            ...prev,
            count: prev.count + 1
          }));
        }
      } else if (data.type === 'schedule_updated') {
        setSchedules(prev => prev.map(s => 
          s.id === data.schedule.id ? data.schedule : s
        ));
      } else if (data.type === 'schedule_deleted') {
        setSchedules(prev => prev.filter(s => s.id !== data.schedule_id));
        setPagination(prev => ({
          ...prev,
          count: prev.count - 1
        }));
      } else if (data.type === 'schedule_response') {
        setSchedules(prev => prev.map(s => {
          if (s.id === data.schedule_id) {
            const updatedParticipants = s.participants.map(p => 
              p.user?.id === data.user_id ? { ...p, response_status: data.response_status } : p
            );
            return { ...s, participants: updatedParticipants };
          }
          return s;
        }));
      }
    }
  }, [lastMessage, pagination.page]);

  // Helper functions
  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'MMM d, yyyy - h:mm a');
  };

  const isPastEvent = (schedule) => {
    return isBefore(parseISO(schedule.end_time), new Date());
  };

  const handleOpenDialog = (schedule = null) => {
    const defaultSchedule = { 
      title: '', 
      description: '',
      start_time: new Date(),
      end_time: new Date(Date.now() + 3600000), // 1 hour later
      location: '',
      is_all_day: false
    };

    if (schedule) {
      setCurrentSchedule({
        ...schedule,
        start_time: parseISO(schedule.start_time),
        end_time: parseISO(schedule.end_time)
      });
      setSelectedUsers(schedule.participants.filter(p => p.user).map(p => ({
        id: p.user.id,
        email: p.user.email,
        first_name: p.user.first_name,
        last_name: p.user.last_name
      })));
      setSelectedGroups(schedule.participants.filter(p => p.group).map(p => ({
        id: p.group.id,
        name: p.group.name
      })));
    } else {
      setCurrentSchedule(defaultSchedule);
      setSelectedUsers([]);
      setSelectedGroups([]);
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentSchedule(null);
    setSelectedUsers([]);
    setSelectedGroups([]);
  };

  const handleSaveSchedule = async () => {
    try {
      const formData = {
        title: currentSchedule.title,
        description: currentSchedule.description,
        start_time: currentSchedule.start_time.toISOString(),
        end_time: currentSchedule.end_time.toISOString(),
        location: currentSchedule.location,
        is_all_day: currentSchedule.is_all_day,
        participant_users: selectedUsers.map(user => user.id),
        participant_groups: selectedGroups.map(group => group.id)
      };

      const response = currentSchedule.id 
        ? await scheduleAPI.updateSchedule(currentSchedule.id, formData)
        : await scheduleAPI.createSchedule(formData);
      
      enqueueSnackbar(
        currentSchedule.id ? 'Schedule updated successfully!' : 'Schedule created successfully!',
        { variant: 'success' }
      );

      setSnackbar({
        open: true,
        message: currentSchedule.id ? 'Schedule updated successfully!' : 'Schedule created successfully!',
        severity: 'success'
      });

      fetchData();
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar('Error saving schedule', { variant: 'error' });
      console.error('Error saving schedule:', error);
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await scheduleAPI.deleteSchedule(id);
      enqueueSnackbar('Schedule deleted successfully!', { variant: 'success' });
      fetchData();
    } catch (error) {
      enqueueSnackbar('Error deleting schedule', { variant: 'error' });
      console.error('Error deleting schedule:', error);
    }
  };

  const handleRespondToSchedule = async (scheduleId, response) => {
    try {
      await scheduleAPI.respondToSchedule(scheduleId, response);
      enqueueSnackbar(`Response "${response}" recorded!`, { variant: 'success' });
      fetchData();
    } catch (error) {
      enqueueSnackbar('Error recording response', { variant: 'error' });
      console.error('Error recording response:', error);
    }
  };

  const handleRemoveParticipant = (participantToRemove) => {
    if (participantToRemove.email) {
      setSelectedUsers(selectedUsers.filter(user => user.id !== participantToRemove.id));
    } else {
      setSelectedGroups(selectedGroups.filter(group => group.id !== participantToRemove.id));
    }
  };

  const toggleExpandSchedule = (scheduleId) => {
    setExpandedSchedule(expandedSchedule === scheduleId ? null : scheduleId);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      dateFrom: null,
      dateTo: null,
      showPast: false
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getResponseColor = (responseStatus) => {
    const option = responseOptions.find(opt => opt.value === responseStatus);
    return option ? option.color : 'default';
  };

  const handleChangePage = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // User Autocomplete rendering with search
  const renderUserAutocomplete = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        Select Users
      </Typography>
      <Autocomplete
        multiple
        options={users}
        getOptionLabel={(option) =>
          `${option.first_name} ${option.last_name} (${option.email})`
        }
        value={selectedUsers}
        onChange={(event, newValue) => setSelectedUsers(newValue)}
        onInputChange={handleUserSearch}
        filterOptions={(options, state) => options}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search users"
            placeholder="Select individual users"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <SearchIcon color="action" sx={{ mr: 1 }} />
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.id}
              label={`${option.first_name} ${option.last_name}`}
              icon={<PersonIcon />}
              onDelete={() => handleRemoveParticipant(option)}
            />
          ))
        }
      />
    </Box>
  );

  // Group Autocomplete rendering with search
  const renderGroupAutocomplete = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        Select Groups
      </Typography>
      <Autocomplete
        multiple
        options={filteredGroups}
        getOptionLabel={(option) => option.name}
        value={selectedGroups}
        onChange={(event, newValue) => setSelectedGroups(newValue)}
        onInputChange={handleGroupSearch}
        filterOptions={(options, state) => options}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search groups"
            placeholder="Select groups"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <SearchIcon color="action" sx={{ mr: 1 }} />
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.id}
              label={option.name}
              icon={<GroupIcon />}
              onDelete={() => handleRemoveParticipant(option)}
            />
          ))
        }
      />
    </Box>
  );

  // Mobile view for schedules
  const renderMobileScheduleCards = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {schedules.map((schedule) => (
        <Card key={schedule.id} elevation={3}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isPastEvent(schedule) ? (
                  <EventBusyIcon color="error" />
                ) : (
                  <EventAvailableIcon color="primary" />
                )}
                <Typography variant="subtitle1" component="div">
                  {schedule.title}
                </Typography>
              </Box>
              <IconButton onClick={() => toggleExpandSchedule(schedule.id)}>
                {expandedSchedule === schedule.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Typography color="text.secondary" gutterBottom>
              {formatDate(schedule.start_time)} - {formatDate(schedule.end_time)}
            </Typography>
            
            <Collapse in={expandedSchedule === schedule.id}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                  {schedule.description}
                </Typography>
                
                {schedule.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {getPlatformIcon(schedule.location)}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {truncateUrl(schedule.location)}
                    </Typography>
                    {schedule.location && (
                      <IconButton 
                        size="small" 
                        sx={{ ml: 1 }}
                        onClick={() => window.open(schedule.location, '_blank')}
                      >
                        <ArrowForwardIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                )}
                              
                <Typography variant="subtitle2" sx={{ mt: 2 }}>Participants:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                  {schedule.participants.map((participant, i) => (
                    <Chip 
                      key={i} 
                      label={participant.user ? 
                        `${participant.user.first_name} ${participant.user.last_name}` : 
                        participant.group.name}
                      size="small" 
                      icon={participant.group ? <GroupIcon /> : <PersonIcon />}
                      color={getResponseColor(participant.response_status)}
                    />
                  ))}
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Your Response:</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    {responseOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant="outlined"
                        size="small"
                        color={option.color}
                        startIcon={option.value === 'accepted' ? <CheckIcon /> : 
                                  option.value === 'declined' ? <CloseIcon /> : null}
                        onClick={() => handleRespondToSchedule(schedule.id, option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </Stack>
                </Box>

                {/* Add to Google Calendar button in expanded view */}
                <Button
                  variant="contained"
                  startIcon={<CalendarIcon />}
                  onClick={() => window.open(generateGoogleCalendarLink(schedule), '_blank')}
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Add to Google Calendar
                </Button>
              </Box>
            </Collapse>
          </CardContent>
          <CardActions sx={{ justifyContent: 'space-between' }}>
            <Box>
              <Button 
                size="small" 
                startIcon={<CalendarIcon />}
                onClick={() => window.open(generateGoogleCalendarLink(schedule), '_blank')}
              >
                Add to Google
              </Button>
              <Button 
                size="small" 
                startIcon={<EditIcon />}
                onClick={() => handleOpenDialog(schedule)}
              >
                Edit
              </Button>
            </Box>
            <Box>
              <Button 
                size="small" 
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteSchedule(schedule.id)}
                color="error"
              >
                Delete
              </Button>
            </Box>
          </CardActions>
        </Card>
      ))}
    </Box>
  );

  // Desktop view for schedules
  const renderDesktopScheduleTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Participants</TableCell>
            <TableCell>Your Response</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedules.map((schedule) => (
            <React.Fragment key={schedule.id}>
              <TableRow 
                hover 
                sx={{ 
                  '&:hover': { cursor: 'pointer' },
                  backgroundColor: expandedSchedule === schedule.id ? 'action.hover' : 'inherit'
                }}
                onClick={() => toggleExpandSchedule(schedule.id)}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isPastEvent(schedule) ? (
                      <EventBusyIcon color="error" sx={{ mr: 1 }} />
                    ) : (
                      <EventAvailableIcon color="primary" sx={{ mr: 1 }} />
                    )}
                    <Typography sx={{ fontWeight: isPastEvent(schedule) ? 'normal' : 'bold' }}>
                      {schedule.title}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {formatDate(schedule.start_time)} - {formatDate(schedule.end_time)}
                </TableCell>
                <TableCell>
                  {schedule.location && (
                    <Tooltip title={schedule.location || ''}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getPlatformIcon(schedule.location)}
                        <Link 
                          href={schedule.location} 
                          target="_blank" 
                          rel="noopener" 
                          sx={{ ml: 1 }}
                        >
                          {truncateUrl(schedule.location)}
                        </Link>
                      </Box>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {schedule.participants.slice(0, 2).map((participant, i) => (
                      <Chip 
                        key={i} 
                        label={participant.user ? 
                          `${participant.user.first_name} ${participant.user.last_name}` : 
                          participant.group.name}
                        size="small" 
                        icon={participant.group ? <GroupIcon /> : <PersonIcon />}
                        color={getResponseColor(participant.response_status)}
                      />
                    ))}
                    {schedule.participants.length > 2 && (
                      <Chip label={`+${schedule.participants.length - 2}`} size="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {schedule.participants.find(p => p.user)?.response_status || 'Not invited'}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Add to Google Calendar">
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(generateGoogleCalendarLink(schedule), '_blank');
                        }}
                      >
                        <CalendarIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(schedule);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSchedule(schedule.id);
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ padding: 0 }} colSpan={6}>
                  <Collapse in={expandedSchedule === schedule.id} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 3, backgroundColor: 'background.paper' }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                        {schedule.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocationIcon color="action" sx={{ mr: 1 }} />
                        <Typography>{schedule.location || 'No location specified'}</Typography>
                      </Box>
                      
                      <Typography variant="subtitle2" sx={{ mt: 2 }}>Participants:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {schedule.participants.map((participant, i) => (
                          <Chip 
                            key={i} 
                            label={participant.user ? 
                              `${participant.user.first_name} ${participant.user.last_name}` : 
                              participant.group.name}
                            size="small" 
                            icon={participant.group ? <GroupIcon /> : <PersonIcon />}
                            color={getResponseColor(participant.response_status)}
                          />
                        ))}
                      </Box>
                      
                      <Typography variant="subtitle2" sx={{ mt: 2 }}>Your Response:</Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {responseOptions.map((option) => (
                          <Button
                            key={option.value}
                            variant="outlined"
                            size="small"
                            color={option.color}
                            startIcon={option.value === 'accepted' ? <CheckIcon /> : 
                                      option.value === 'declined' ? <CloseIcon /> : null}
                            onClick={() => handleRespondToSchedule(schedule.id, option.value)}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </Stack>

                      {/* Add to Google Calendar button in expanded view */}
                      <Button
                        variant="contained"
                        startIcon={<CalendarIcon />}
                        onClick={() => window.open(generateGoogleCalendarLink(schedule), '_blank')}
                        sx={{ mt: 2 }}
                      >
                        Add to Google Calendar
                      </Button>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Schedule Manager
          <Badge badgeContent={schedules.filter(s => !isPastEvent(s)).length} color="primary" sx={{ ml: 2 }}>
            <CalendarIcon />
          </Badge>
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            New Schedule
          </Button>

          {/* Bulk export to Google Calendar button */}
          <Button 
            variant="outlined" 
            startIcon={<CalendarIcon />}
            onClick={() => {
              schedules.forEach(schedule => {
                window.open(generateGoogleCalendarLink(schedule), '_blank');
              });
            }}
            disabled={schedules.length === 0}
          >
            Export All to Google Calendar
          </Button>
        </Box>
      
        {/* Filters Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search schedules..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
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
            <Grid item xs={6} sm={3} md={2}>
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
            <Grid item xs={6} sm={3} md={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.showPast}
                    onChange={(e) => handleFilterChange('showPast', e.target.checked)}
                    color="primary"
                  />
                }
                label="Show Past Events"
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2} sx={{ textAlign: 'right' }}>
              <Tooltip title="Reset Filters">
                <IconButton onClick={resetFilters}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>

        {isLoading ? (
          <LinearProgress />
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : schedules.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography>No schedules found</Typography>
          </Box>
        ) : isMobile ? renderMobileScheduleCards() : renderDesktopScheduleTable()}

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pagination.count}
          rowsPerPage={rowsPerPage}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Schedule Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="md" 
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            {currentSchedule?.id ? 'Edit Schedule' : 'Create New Schedule'}
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
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
          <DialogContent dividers>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={currentSchedule?.title || ''}
              onChange={(e) => setCurrentSchedule({...currentSchedule, title: e.target.value})}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={currentSchedule?.description || ''}
              onChange={(e) => setCurrentSchedule({...currentSchedule, description: e.target.value})}
              sx={{ mb: 2 }}
            />
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Time"
                  value={currentSchedule?.start_time}
                  onChange={(newValue) => setCurrentSchedule({...currentSchedule, start_time: newValue})}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      margin="dense"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Time"
                  value={currentSchedule?.end_time}
                  onChange={(newValue) => setCurrentSchedule({...currentSchedule, end_time: newValue})}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      margin="dense"
                    />
                  )}
                  minDateTime={currentSchedule?.start_time}
                />
              </Grid>
            </Grid>
            
            <TextField
              margin="dense"
              label="Location"
              fullWidth
              value={currentSchedule?.location || ''}
              onChange={(e) => setCurrentSchedule({...currentSchedule, location: e.target.value})}
              sx={{ mb: 2 }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={currentSchedule?.is_all_day || false}
                  onChange={(e) => setCurrentSchedule({...currentSchedule, is_all_day: e.target.checked})}
                  color="primary"
                />
              }
              label="All Day Event"
              sx={{ mb: 2 }}
            />
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Participants
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {renderUserAutocomplete()}
            {renderGroupAutocomplete()}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveSchedule} 
              variant="contained" 
              disabled={
                !currentSchedule?.title || 
                !currentSchedule?.start_time || 
                !currentSchedule?.end_time
              }
            >
              {currentSchedule?.id ? 'Update Schedule' : 'Create Schedule'}
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <MuiAlert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} elevation={6} variant="filled">
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default Schedule;