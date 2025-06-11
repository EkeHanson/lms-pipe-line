import React, { useState } from 'react';
import {
  Box,  Container, Typography,
  Grid, Card,List, CardContent,
  Divider, Tabs, Tab, Table, TableBody,
  TableCell, TableContainer,
  TableHead, TableRow, Paper,  Chip,
  Avatar, IconButton, Tooltip, useTheme,
  useMediaQuery, TextField,
  InputAdornment,  Button, Badge, Stack, // Added List import
  ListItem, // Added ListItem import
  ListItemIcon, // Added ListItemIcon import
  ListItemText // Added ListItemText import
} from '@mui/material';
import {
  Security as SecurityIcon,
  Warning as WarningIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  History as HistoryIcon,
  Gavel as ComplianceIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Block as BlockIcon,
  CheckCircle as ResolveIcon,
  ArrowForward as DetailsIcon,
  CalendarToday as CalendarIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const SecurityComplianceDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual API calls
  const failedLogins = [
    { id: 1, ip: '192.168.1.45', username: 'admin', timestamp: '2023-06-15 14:32:45', attempts: 5, status: 'active' },
    { id: 2, ip: '203.113.117.89', username: 'user123', timestamp: '2023-06-15 11:15:22', attempts: 3, status: 'blocked' },
    { id: 3, ip: '45.67.89.123', username: 'test_account', timestamp: '2023-06-14 09:45:10', attempts: 10, status: 'active' },
    { id: 4, ip: '118.92.156.72', username: 'admin', timestamp: '2023-06-13 22:18:37', attempts: 7, status: 'blocked' },
    { id: 5, ip: '91.204.33.156', username: 'service_account', timestamp: '2023-06-13 18:05:14', attempts: 4, status: 'active' }
  ];

  const blockedIPs = [
    { id: 1, ip: '203.113.117.89', reason: 'Repeated failed login attempts', timestamp: '2023-06-15 11:20:00', action: 'Auto-blocked' },
    { id: 2, ip: '45.67.89.123', reason: 'Known malicious IP', timestamp: '2023-06-14 10:00:00', action: 'Manual block' },
    { id: 3, ip: '118.92.156.72', reason: 'Brute force attack detected', timestamp: '2023-06-13 22:20:00', action: 'Auto-blocked' },
    { id: 4, ip: '185.143.223.67', reason: 'Suspected bot activity', timestamp: '2023-06-12 15:45:00', action: 'Manual block' }
  ];

  const auditLogs = [
    { id: 1, admin: 'superadmin@example.com', action: 'Modified user permissions', target: 'user@example.com', timestamp: '2023-06-15 16:20:12' },
    { id: 2, admin: 'admin@example.com', action: 'Approved listing', target: 'Listing #4587', timestamp: '2023-06-15 14:05:33' },
    { id: 3, admin: 'superadmin@example.com', action: 'Reset password', target: 'manager@example.com', timestamp: '2023-06-15 10:12:45' },
    { id: 4, admin: 'admin@example.com', action: 'Deleted comment', target: 'Comment #8912', timestamp: '2023-06-14 18:30:21' }
  ];

  const vulnerabilityAlerts = [
    { id: 1, severity: 'high', title: 'Outdated library detected', component: 'Payment processor', detected: '2023-06-15 09:15:00', status: 'pending' },
    { id: 2, severity: 'medium', title: 'Missing CORS headers', component: 'API Gateway', detected: '2023-06-14 14:30:00', status: 'in-progress' },
    { id: 3, severity: 'low', title: 'Deprecated function usage', component: 'User service', detected: '2023-06-13 11:45:00', status: 'resolved' }
  ];

  const complianceReports = [
    { id: 1, type: 'GDPR', status: 'compliant', lastAudit: '2023-05-30', nextAudit: '2023-11-30' },
    { id: 2, type: 'CCPA', status: 'compliant', lastAudit: '2023-04-15', nextAudit: '2023-10-15' },
    { id: 3, type: 'PCI DSS', status: 'pending-review', lastAudit: '2023-03-20', nextAudit: '2023-09-20' }
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

  const handleBlockIP = (ip) => {
    // API call to block IP
    console.log(`Blocking IP ${ip}`);
  };

  const severityColor = (severity) => {
    switch (severity) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.success.main;
      default: return theme.palette.text.secondary;
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'active': return 'warning';
      case 'blocked': return 'error';
      case 'resolved': return 'success';
      case 'pending': return 'warning';
      case 'in-progress': return 'info';
      case 'compliant': return 'success';
      case 'pending-review': return 'warning';
      default: return 'default';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          <SecurityIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Security & Compliance
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
                Failed Logins (24h)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <WarningIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h4">12</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Blocked IPs
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <LockIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h4">8</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Active Alerts
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <WarningIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h4">3</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Audit Events (7d)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <VisibilityIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h4">42</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Compliance Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <ComplianceIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h4">2/3</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Data Requests (30d)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <HistoryIcon color="action" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h4">5</Typography>
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
            <Tab label="Failed Logins" icon={<WarningIcon />} iconPosition="start" />
            <Tab label="Blocked IPs" icon={<BlockIcon />} iconPosition="start" />
            <Tab label="Audit Logs" icon={<VisibilityIcon />} iconPosition="start" />
            <Tab label="Vulnerability Alerts" icon={<SecurityIcon />} iconPosition="start" />
            <Tab label="Compliance Reports" icon={<ComplianceIcon />} iconPosition="start" />
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
          {/* Failed Logins Tab */}
          {tabValue === 0 && (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>IP Address</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell align="center">Attempts</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {failedLogins.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{row.timestamp}</TableCell>
                      <TableCell>{row.ip}</TableCell>
                      <TableCell>{row.username}</TableCell>
                      <TableCell align="center">{row.attempts}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status} 
                          color={statusColor(row.status)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Block IP">
                          <IconButton size="small" onClick={() => handleBlockIP(row.ip)}>
                            <BlockIcon fontSize="small" />
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

          {/* Blocked IPs Tab */}
          {tabValue === 1 && (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>IP Address</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Blocked At</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {blockedIPs.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{row.ip}</TableCell>
                      <TableCell>{row.reason}</TableCell>
                      <TableCell>{row.timestamp}</TableCell>
                      <TableCell>{row.action}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Unblock">
                          <IconButton size="small">
                            <ResolveIcon fontSize="small" color="success" />
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

          {/* Audit Logs Tab */}
          {tabValue === 2 && (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Admin</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Target</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell align="right">Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditLogs.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{row.admin}</TableCell>
                      <TableCell>{row.action}</TableCell>
                      <TableCell>{row.target}</TableCell>
                      <TableCell>{row.timestamp}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small">
                          <DetailsIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Vulnerability Alerts Tab */}
          {tabValue === 3 && (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Severity</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Component</TableCell>
                    <TableCell>Detected</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vulnerabilityAlerts.map((row) => (
                    <TableRow key={row.id} hover>
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
                      <TableCell>{row.title}</TableCell>
                      <TableCell>{row.component}</TableCell>
                      <TableCell>{row.detected}</TableCell>
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

          {/* Compliance Reports Tab */}
          {tabValue === 4 && (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Standard</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Audit</TableCell>
                    <TableCell>Next Audit</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {complianceReports.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status} 
                          color={statusColor(row.status)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{row.lastAudit}</TableCell>
                      <TableCell>{row.nextAudit}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Generate Report">
                          <IconButton size="small">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Schedule Audit">
                          <IconButton size="small">
                            <CalendarIcon fontSize="small" />
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

      {/* Recent Activity Sidebar (would be fixed position in a real layout) */}
      {!isMobile && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            Recent Security Events
          </Typography>
          <Paper elevation={3} sx={{ p: 2 }}>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: theme.palette.error.light }}>
                    <WarningIcon color="error" />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary="Multiple failed login attempts"
                  secondary="5 minutes ago - IP: 192.168.1.45"
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
                  primary="Vulnerability resolved"
                  secondary="1 hour ago - Outdated library updated"
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: theme.palette.info.light }}>
                    <VisibilityIcon color="info" />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary="Admin permissions modified"
                  secondary="2 hours ago - User: admin@example.com"
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

export default SecurityComplianceDashboard;