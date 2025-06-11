import React, { useState } from 'react';
import {
  Box, Container, Typography,
  Grid, Card, CardContent,
  Divider, Tabs, Tab, Table, TableBody,
  TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip,
  Avatar, IconButton, Tooltip, useTheme,
  useMediaQuery, TextField,
  InputAdornment, Button, Badge, Stack,
  List, ListItem, ListItemIcon, ListItemText,
  Menu, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import {
  Email as EmailIcon,
  Chat as ChatIcon,
  Forum as ForumIcon,
  Announcement as AnnouncementIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as ResolveIcon,
  ArrowForward as DetailsIcon,
  MoreVert as MoreIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  Flag as FlagIcon,
  Reply as ReplyIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Person as PersonIcon,
  AccessTime as PendingIcon,
  HourglassTop as InProgressIcon,
  DoneAll as DoneIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const CommunicationSupportDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  // Mock data - replace with actual API calls
  const unreadMessages = [
    { id: 1, user: 'user1@example.com', subject: 'Account access issue', content: 'I cannot log in to my account...', received: '2023-06-15 14:32:45', priority: 'high' },
    { id: 2, user: 'user2@example.com', subject: 'Payment question', content: 'I was charged twice for...', received: '2023-06-15 11:15:22', priority: 'medium' },
    { id: 3, user: 'user3@example.com', subject: 'Feature request', content: 'Would it be possible to add...', received: '2023-06-14 09:45:10', priority: 'low' },
    { id: 4, user: 'user4@example.com', subject: 'Bug report', content: 'When I try to upload a file...', received: '2023-06-13 22:18:37', priority: 'high' }
  ];

  const supportTickets = [
    { id: 1, ticketId: 'TKT-1001', user: 'user1@example.com', subject: 'Login issues', status: 'open', created: '2023-06-15 14:32:45', lastUpdated: '2023-06-15 14:32:45', assignedTo: null },
    { id: 2, ticketId: 'TKT-1002', user: 'user2@example.com', subject: 'Payment discrepancy', status: 'in-progress', created: '2023-06-15 11:15:22', lastUpdated: '2023-06-15 12:30:00', assignedTo: 'admin1@example.com' },
    { id: 3, ticketId: 'TKT-1003', user: 'user3@example.com', subject: 'Feature inquiry', status: 'resolved', created: '2023-06-14 09:45:10', lastUpdated: '2023-06-14 15:20:00', assignedTo: 'admin2@example.com' },
    { id: 4, ticketId: 'TKT-1004', user: 'user4@example.com', subject: 'Bug report', status: 'open', created: '2023-06-13 22:18:37', lastUpdated: '2023-06-13 22:18:37', assignedTo: null }
  ];

  const communityEngagement = [
    { id: 1, user: 'user5@example.com', type: 'forum post', title: 'Best practices for...', content: 'I wanted to share some tips...', posted: '2023-06-15 16:20:12', flagged: false, comments: 5 },
    { id: 2, user: 'user6@example.com', type: 'comment', title: 'Re: Feature request', content: 'I agree with this suggestion...', posted: '2023-06-15 14:05:33', flagged: true, comments: 0 },
    { id: 3, user: 'user7@example.com', type: 'forum post', title: 'Question about integration', content: 'Has anyone tried integrating with...', posted: '2023-06-15 10:12:45', flagged: false, comments: 3 },
    { id: 4, user: 'user8@example.com', type: 'comment', title: 'Re: Bug report', content: 'I experienced this too...', posted: '2023-06-14 18:30:21', flagged: true, comments: 0 }
  ];

  const broadcastMessages = [
    { id: 1, subject: 'Scheduled Maintenance', content: 'We will be performing maintenance on...', sent: '2023-06-15 09:15:00', recipients: 'All users', status: 'sent' },
    { id: 2, subject: 'New Feature Announcement', content: 'We are excited to announce...', sent: '2023-06-14 14:30:00', recipients: 'Premium users', status: 'sent' },
    { id: 3, subject: 'Policy Update', content: 'Please review our updated terms...', sent: '2023-06-13 11:45:00', recipients: 'All users', status: 'draft' }
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDateChange = (newValue, index) => {
    const newDateRange = [...dateRange];
    newDateRange[index] = newValue;
    setDateRange(newDateRange);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = (message) => {
    setSelectedMessage(message);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMessage(null);
    setReplyContent('');
  };

  const handleReplySubmit = () => {
    // API call to send reply
    console.log('Reply sent:', replyContent);
    handleCloseDialog();
  };

  const handleResolveTicket = (ticketId) => {
    // API call to resolve ticket
    console.log(`Resolving ticket ${ticketId}`);
  };

  const handleAssignTicket = (ticketId) => {
    // API call to assign ticket
    console.log(`Assigning ticket ${ticketId}`);
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.success.main;
      default: return theme.palette.text.secondary;
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'open': return 'error';
      case 'in-progress': return 'warning';
      case 'resolved': return 'success';
      case 'draft': return 'default';
      case 'sent': return 'info';
      case 'flagged': return 'error';
      default: return 'default';
    }
  };

  const statusIcon = (status) => {
    switch (status) {
      case 'open': return <PendingIcon />;
      case 'in-progress': return <InProgressIcon />;
      case 'resolved': return <DoneIcon />;
      default: return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            <ChatIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Communication & Support
          </Typography>
          <Button variant="outlined" startIcon={<RefreshIcon />}>
            Refresh Data
          </Button>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Unread Messages
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Badge badgeContent={unreadMessages.length} color="error" sx={{ mr: 2 }}>
                    <EmailIcon color="action" sx={{ fontSize: 40 }} />
                  </Badge>
                  <Typography variant="h4">{unreadMessages.length}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Open Support Tickets
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Badge badgeContent={supportTickets.filter(t => t.status === 'open').length} color="error" sx={{ mr: 2 }}>
                    <ForumIcon color="action" sx={{ fontSize: 40 }} />
                  </Badge>
                  <Typography variant="h4">{supportTickets.filter(t => t.status !== 'resolved').length}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {supportTickets.filter(t => t.status === 'open').length} new, {supportTickets.filter(t => t.status === 'in-progress').length} in progress
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Community Engagement
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Badge badgeContent={communityEngagement.filter(c => c.flagged).length} color="error" sx={{ mr: 2 }}>
                    <ForumIcon color="action" sx={{ fontSize: 40 }} />
                  </Badge>
                  <Typography variant="h4">{communityEngagement.length}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {communityEngagement.filter(c => c.type === 'forum post').length} posts, {communityEngagement.filter(c => c.flagged).length} flagged
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Broadcast Messages
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <AnnouncementIcon color="action" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h4">{broadcastMessages.length}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {broadcastMessages.filter(b => b.status === 'sent').length} sent, {broadcastMessages.filter(b => b.status === 'draft').length} drafts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Card elevation={3}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
              <Tab label="Unread Messages" icon={<EmailIcon />} iconPosition="start" />
              <Tab label="Support Tickets" icon={<ForumIcon />} iconPosition="start" />
              <Tab label="Community Engagement" icon={<ForumIcon />} iconPosition="start" />
              <Tab label="Broadcast Messages" icon={<AnnouncementIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          {/* Filter Bar */}
          <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flexGrow: 1, maxWidth: 400 }}
            />
            
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <CalendarIcon color="action" />
              <DatePicker
                label="From"
                value={dateRange[0]}
                onChange={(newValue) => handleDateChange(newValue, 0)}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
              <Typography>-</Typography>
              <DatePicker
                label="To"
                value={dateRange[1]}
                onChange={(newValue) => handleDateChange(newValue, 1)}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </Stack>
            
            <Button variant="outlined" startIcon={<FilterIcon />}>
              Filters
            </Button>

            <IconButton onClick={handleMenuOpen}>
              <MoreIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Export Data</MenuItem>
              <MenuItem onClick={handleMenuClose}>View Statistics</MenuItem>
              <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            </Menu>
          </Box>

          <Divider />

          {/* Tab Content */}
          <Box sx={{ p: 2 }}>
            {/* Unread Messages Tab */}
            {tabValue === 0 && (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>From</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Received</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {unreadMessages.map((message) => (
                      <TableRow key={message.id} hover>
                        <TableCell>{message.user}</TableCell>
                        <TableCell>
                          <Typography fontWeight="500">{message.subject}</Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {message.content.substring(0, 50)}...
                          </Typography>
                        </TableCell>
                        <TableCell>{message.received}</TableCell>
                        <TableCell>
                          <Chip 
                            label={message.priority} 
                            sx={{ 
                              backgroundColor: priorityColor(message.priority),
                              color: 'white',
                              fontWeight: 'bold'
                            }} 
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Reply">
                            <IconButton size="small" onClick={() => handleOpenDialog(message)}>
                              <ReplyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Mark as read">
                            <IconButton size="small">
                              <DoneIcon fontSize="small" color="success" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View details">
                            <IconButton size="small">
                              <DetailsIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Support Tickets Tab */}
            {tabValue === 1 && (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ticket ID</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Assigned To</TableCell>
                      <TableCell>Last Updated</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {supportTickets.map((ticket) => (
                      <TableRow key={ticket.id} hover>
                        <TableCell>{ticket.ticketId}</TableCell>
                        <TableCell>{ticket.user}</TableCell>
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell>
                          <Chip 
                            icon={statusIcon(ticket.status)}
                            label={ticket.status} 
                            color={statusColor(ticket.status)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          {ticket.assignedTo || 'Unassigned'}
                        </TableCell>
                        <TableCell>{ticket.lastUpdated}</TableCell>
                        <TableCell align="right">
                          {ticket.status !== 'resolved' && (
                            <>
                              {ticket.status === 'open' && (
                                <Tooltip title="Assign to me">
                                  <IconButton size="small" onClick={() => handleAssignTicket(ticket.ticketId)}>
                                    <PersonIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Resolve">
                                <IconButton size="small" onClick={() => handleResolveTicket(ticket.ticketId)}>
                                  <ResolveIcon fontSize="small" color="success" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          <Tooltip title="View details">
                            <IconButton size="small">
                              <DetailsIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Community Engagement Tab */}
            {tabValue === 2 && (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Content</TableCell>
                      <TableCell>Posted</TableCell>
                      <TableCell>Comments</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {communityEngagement.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.user}</TableCell>
                        <TableCell>
                          <Typography fontWeight="500">{item.title}</Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {item.content.substring(0, 50)}...
                          </Typography>
                        </TableCell>
                        <TableCell>{item.posted}</TableCell>
                        <TableCell>{item.comments}</TableCell>
                        <TableCell>
                          {item.flagged ? (
                            <Chip 
                              icon={<FlagIcon />}
                              label="Flagged" 
                              color={statusColor('flagged')} 
                              size="small" 
                            />
                          ) : (
                            <Chip 
                              label="Normal" 
                              color="default" 
                              size="small" 
                            />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {item.flagged && (
                            <Tooltip title="Unflag">
                              <IconButton size="small">
                                <DoneIcon fontSize="small" color="success" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="View details">
                            <IconButton size="small">
                              <DetailsIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small">
                              <CloseIcon fontSize="small" color="error" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Broadcast Messages Tab */}
            {tabValue === 3 && (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Subject</TableCell>
                      <TableCell>Content</TableCell>
                      <TableCell>Recipients</TableCell>
                      <TableCell>Sent</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {broadcastMessages.map((message) => (
                      <TableRow key={message.id} hover>
                        <TableCell>{message.subject}</TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap>
                            {message.content.substring(0, 70)}...
                          </Typography>
                        </TableCell>
                        <TableCell>{message.recipients}</TableCell>
                        <TableCell>{message.sent}</TableCell>
                        <TableCell>
                          <Chip 
                            label={message.status} 
                            color={statusColor(message.status)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell align="right">
                          {message.status === 'draft' && (
                            <Tooltip title="Send">
                              <IconButton size="small">
                                <SendIcon fontSize="small" color="primary" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Edit">
                            <IconButton size="small">
                              <DetailsIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Duplicate">
                            <IconButton size="small">
                              <ReplyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Card>

        {/* Recent Activity Sidebar */}
        {!isMobile && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Recent Support Activity
            </Typography>
            <Paper elevation={3} sx={{ p: 2 }}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: theme.palette.error.light }}>
                      <EmailIcon color="error" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="New message from user1@example.com"
                    secondary="5 minutes ago - Subject: Account issue"
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                      <ResolveIcon color="success" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Ticket TKT-1003 resolved"
                    secondary="1 hour ago - By admin2@example.com"
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: theme.palette.warning.light }}>
                      <FlagIcon color="warning" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Comment flagged for review"
                    secondary="2 hours ago - User: user6@example.com"
                  />
                </ListItem>
              </List>
            </Paper>
          </Box>
        )}

        {/* Message Reply Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogTitle>
            Reply to: {selectedMessage?.subject}
            <Typography variant="subtitle2" color="text.secondary">
              From: {selectedMessage?.user}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 3, p: 2, backgroundColor: theme.palette.grey[100], borderRadius: 1 }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {selectedMessage?.content}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Received: {selectedMessage?.received}
              </Typography>
            </Box>
            <TextField
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              placeholder="Type your reply here..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleReplySubmit} 
              variant="contained" 
              startIcon={<SendIcon />}
              disabled={!replyContent.trim()}
            >
              Send Reply
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default CommunicationSupportDashboard;