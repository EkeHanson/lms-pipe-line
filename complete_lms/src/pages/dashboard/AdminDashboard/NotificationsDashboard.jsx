import React, { useState } from 'react';
import {
  Box, Container, Typography,  Grid, Card, List, CardContent,
  Divider, Tabs, Tab, Table, TableBody,  TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip,  InputAdornment, Button, Badge, Stack,
  Avatar, IconButton, Tooltip, useTheme,  useMediaQuery, TextField,ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import {
  Notifications as NotificationsIcon,  Warning as WarningIcon,  Report as ReportIcon,
  AddShoppingCart as ListingIcon,  HowToReg as ApprovalIcon,  Security as SuspiciousIcon,
   ArrowForward as DetailsIcon,  Refresh as RefreshIcon,  CheckCircle as ResolveIcon,  
  CalendarToday as CalendarIcon,  FilterList as FilterIcon, Search as SearchIcon, Block as BlockIcon,
  Error as CriticalIcon,  Storage as StorageIcon,  Traffic as TrafficIcon,
  } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const NotificationsDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual API calls
  const systemWarnings = [
    { id: 1, type: 'API Failure', component: 'Payment Gateway', severity: 'critical', message: 'Failed to process 12 transactions', timestamp: '2023-06-15 14:32:45', status: 'unresolved' },
    { id: 2, type: 'High Traffic', component: 'Web Server', severity: 'high', message: 'Traffic spike detected (300% increase)', timestamp: '2023-06-15 11:15:22', status: 'monitoring' },
    { id: 3, type: 'Low Storage', component: 'Database Server', severity: 'medium', message: 'Only 10% storage remaining', timestamp: '2023-06-14 09:45:10', status: 'unresolved' },
    { id: 4, type: 'API Latency', component: 'User Service', severity: 'medium', message: 'Response time > 2s for 15% requests', timestamp: '2023-06-13 22:18:37', status: 'investigating' },
    { id: 5, type: 'Backup Failed', component: 'Storage System', severity: 'high', message: 'Nightly backup failed', timestamp: '2023-06-13 18:05:14', status: 'unresolved' }
  ];

  const userReports = [
    { id: 1, user: 'customer123@example.com', type: 'Complaint', subject: 'Product not as described', message: 'Received wrong color item', timestamp: '2023-06-15 16:20:12', status: 'new' },
    { id: 2, user: 'user456@example.com', type: 'Bug Report', subject: 'Checkout error', message: 'Getting 500 error when applying coupon', timestamp: '2023-06-15 14:05:33', status: 'in-progress' },
    { id: 3, user: 'shopper789@example.com', type: 'Feature Request', subject: 'Dark mode', message: 'Please add dark mode option', timestamp: '2023-06-15 10:12:45', status: 'review' },
    { id: 4, user: 'guest-4587', type: 'Complaint', subject: 'Late delivery', message: 'Package arrived 5 days late', timestamp: '2023-06-14 18:30:21', status: 'resolved' }
  ];

  const newListings = [
    { id: 1, itemId: 'PROD-4587', title: 'Wireless Headphones', seller: 'audio_shop', category: 'Electronics', timestamp: '2023-06-15 09:15:00', status: 'pending-review' },
    { id: 2, itemId: 'PROD-4588', title: 'Leather Wallet', seller: 'fashion_goods', category: 'Accessories', timestamp: '2023-06-14 14:30:00', status: 'approved' },
    { id: 3, itemId: 'PROD-4589', title: 'Smart Watch', seller: 'tech_deals', category: 'Electronics', timestamp: '2023-06-13 11:45:00', status: 'rejected' },
    { id: 4, itemId: 'PROD-4590', title: 'Organic Coffee', seller: 'food_market', category: 'Groceries', timestamp: '2023-06-12 15:45:00', status: 'pending-review' }
  ];

  const pendingApprovals = [
    { id: 1, requestId: 'REQ-4587', type: 'Vendor Application', user: 'new_vendor@example.com', submitted: '2023-06-15', status: 'pending' },
    { id: 2, requestId: 'REQ-4588', type: 'Refund Request', user: 'customer123@example.com', order: 'ORD-4587', submitted: '2023-06-14', status: 'pending' },
    { id: 3, requestId: 'REQ-4589', type: 'Content Update', user: 'editor@example.com', page: 'About Us', submitted: '2023-06-14', status: 'pending' },
    { id: 4, requestId: 'REQ-4590', type: 'Account Upgrade', user: 'pro_user@example.com', plan: 'Professional', submitted: '2023-06-13', status: 'pending' }
  ];

  const suspiciousActivities = [
    { id: 1, type: 'Multiple Accounts', user: 'user123@example.com', ip: '192.168.1.45', details: '3 accounts from same IP', timestamp: '2023-06-15 14:32:45', status: 'investigating' },
    { id: 2, type: 'Fraudulent Transaction', order: 'ORD-4587', amount: '$450', details: 'Possible stolen credit card', timestamp: '2023-06-15 11:15:22', status: 'blocked' },
    { id: 3, type: 'Bot Activity', ip: '45.67.89.123', details: 'Scraping product data', timestamp: '2023-06-14 09:45:10', status: 'blocked' },
    { id: 4, type: 'Fake Reviews', user: 'reviewer123@example.com', details: '5 identical positive reviews', timestamp: '2023-06-13 22:18:37', status: 'investigating' }
  ];

  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDateChange = (newValue, index) => {
    const newDateRange = [...dateRange];
    newDateRange[index] = newValue;
    setDateRange(newDateRange);
  };

  const handleResolveAlert = (id) => {
    // API call to resolve alert
    console.log(`Resolving alert ${id}`);
  };

  const handleApproveRequest = (id) => {
    // API call to approve request
    console.log(`Approving request ${id}`);
  };

  const severityColor = (severity) => {
    switch (severity) {
      case 'critical': return theme.palette.error.dark;
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.success.main;
      default: return theme.palette.text.secondary;
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'unresolved': return 'error';
      case 'monitoring': return 'info';
      case 'investigating': return 'warning';
      case 'resolved': return 'success';
      case 'new': return 'warning';
      case 'in-progress': return 'info';
      case 'review': return 'secondary';
      case 'pending': return 'warning';
      case 'pending-review': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'blocked': return 'error';
      default: return 'default';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            <NotificationsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Notifications & Alerts
          </Typography>
          <Button variant="outlined" startIcon={<RefreshIcon />}>
            Refresh Data
          </Button>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  System Warnings
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <WarningIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4">8</Typography>
                    <Typography variant="caption" color="error.main">3 critical</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  User Reports
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <ReportIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4">12</Typography>
                    <Typography variant="caption">5 new</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  New Listings
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <ListingIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4">24</Typography>
                    <Typography variant="caption">7 pending</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Pending Approvals
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <ApprovalIcon color="action" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h4">9</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Suspicious Activities
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <SuspiciousIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h4">5</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Alerts
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CriticalIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h4">58</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Card elevation={3}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
              <Tab label="System Warnings" icon={<WarningIcon />} iconPosition="start" />
              <Tab label="User Reports" icon={<ReportIcon />} iconPosition="start" />
              <Tab label="New Listings" icon={<ListingIcon />} iconPosition="start" />
              <Tab label="Pending Approvals" icon={<ApprovalIcon />} iconPosition="start" />
              <Tab label="Suspicious Activities" icon={<SuspiciousIcon />} iconPosition="start" />
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
          </Box>

          <Divider />

          {/* Tab Content */}
          <Box sx={{ p: 2 }}>
            {/* System Warnings Tab */}
            {tabValue === 0 && (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Component</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {systemWarnings.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>{row.component}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.severity} 
                            sx={{ 
                              backgroundColor: severityColor(row.severity),
                              color: 'white',
                              fontWeight: 'bold'
                            }} 
                          />
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography noWrap>{row.message}</Typography>
                        </TableCell>
                        <TableCell>{row.timestamp}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.status} 
                            color={statusColor(row.status)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell align="right">
                          {row.status !== 'resolved' && (
                            <Tooltip title="Mark as resolved">
                              <IconButton 
                                size="small" 
                                onClick={() => handleResolveAlert(row.id)}
                              >
                                <ResolveIcon fontSize="small" color="success" />
                              </IconButton>
                            </Tooltip>
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

            {/* User Reports Tab */}
            {tabValue === 1 && (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userReports.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.user}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.type} 
                            color={row.type === 'Complaint' ? 'error' : 'info'} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>{row.subject}</TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography noWrap>{row.message}</Typography>
                        </TableCell>
                        <TableCell>{row.timestamp}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.status} 
                            color={statusColor(row.status)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell align="right">
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

            {/* New Listings Tab */}
            {tabValue === 2 && (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item ID</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Seller</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {newListings.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.itemId}</TableCell>
                        <TableCell>{row.title}</TableCell>
                        <TableCell>{row.seller}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.timestamp}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.status} 
                            color={statusColor(row.status)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell align="right">
                          {row.status === 'pending-review' && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleApproveRequest(row.id)}
                                >
                                  <ResolveIcon fontSize="small" color="success" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton size="small">
                                  <BlockIcon fontSize="small" color="error" />
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

            {/* Pending Approvals Tab */}
            {tabValue === 3 && (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Request ID</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Details</TableCell>
                      <TableCell>Submitted</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingApprovals.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.requestId}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>{row.user}</TableCell>
                        <TableCell>
                          {row.order && `Order: ${row.order}`}
                          {row.page && `Page: ${row.page}`}
                          {row.plan && `Plan: ${row.plan}`}
                        </TableCell>
                        <TableCell>{row.submitted}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.status} 
                            color={statusColor(row.status)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Approve">
                            <IconButton 
                              size="small" 
                              onClick={() => handleApproveRequest(row.id)}
                            >
                              <ResolveIcon fontSize="small" color="success" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton size="small">
                              <BlockIcon fontSize="small" color="error" />
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

            {/* Suspicious Activities Tab */}
            {tabValue === 4 && (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>User/Order</TableCell>
                      <TableCell>IP Address</TableCell>
                      <TableCell>Details</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {suspiciousActivities.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>
                          {row.user && row.user}
                          {row.order && row.order}
                        </TableCell>
                        <TableCell>{row.ip}</TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography noWrap>{row.details}</Typography>
                        </TableCell>
                        <TableCell>{row.timestamp}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.status} 
                            color={statusColor(row.status)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell align="right">
                          {row.status !== 'blocked' && (
                            <Tooltip title="Block">
                              <IconButton size="small">
                                <BlockIcon fontSize="small" color="error" />
                              </IconButton>
                            </Tooltip>
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
          </Box>
        </Card>

        {/* Recent Activity Sidebar */}
        {!isMobile && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Recent Alerts
            </Typography>
            <Paper elevation={3} sx={{ p: 2 }}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: theme.palette.error.light }}>
                      <CriticalIcon color="error" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="API Failure - Payment Gateway"
                    secondary="15 minutes ago - 12 failed transactions"
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: theme.palette.warning.light }}>
                      <ReportIcon color="warning" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="New user complaint"
                    secondary="1 hour ago - Wrong item received"
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: theme.palette.info.light }}>
                      <SuspiciousIcon color="info" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Suspicious activity detected"
                    secondary="2 hours ago - Multiple accounts from same IP"
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                      <ListingIcon color="success" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="New listing added"
                    secondary="3 hours ago - Wireless Headphones"
                  />
                </ListItem>
              </List>
            </Paper>
          </Box>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default NotificationsDashboard;