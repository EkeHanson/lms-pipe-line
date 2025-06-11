import React, { useState } from 'react';
import { Assessment as AssessmentIcon } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import {
  Box, Container, Typography,
  Grid, Card, CardContent,
  Divider, Tabs, Tab, Table, TableBody,
  TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, IconButton,
  Tooltip, useTheme, useMediaQuery,
  TextField, InputAdornment, Button,
  Badge, Stack, List, ListItem,
  ListItemIcon, ListItemText,
  Menu, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText,
  Select, FormControl, InputLabel
} from '@mui/material';
import {
  Assessment as ReportsIcon,
  Timeline as TrendsIcon,
  AttachMoney as FinanceIcon,
  Warning as FraudIcon,
  BarChart as AnalyticsIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  ArrowForward as DetailsIcon,
  CalendarToday as CalendarIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  InsertChartOutlined as ChartIcon,
  Receipt as ReceiptIcon,
  People as UsersIcon,
  SettingsApplications as FeaturesIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ReportsDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [selectedReport, setSelectedReport] = useState(null);

  // Mock data - replace with actual API calls
  const userGrowthData = [
    { month: 'Jan', newUsers: 120, activeUsers: 450, returningUsers: 180 },
    { month: 'Feb', newUsers: 150, activeUsers: 520, returningUsers: 210 },
    { month: 'Mar', newUsers: 180, activeUsers: 600, returningUsers: 250 },
    { month: 'Apr', newUsers: 210, activeUsers: 720, returningUsers: 290 },
    { month: 'May', newUsers: 240, activeUsers: 850, returningUsers: 330 },
    { month: 'Jun', newUsers: 280, activeUsers: 920, returningUsers: 380 },
  ];

  const financialReports = [
    { id: 1, period: 'Daily', date: '2023-06-15', revenue: 12500, transactions: 342, avgOrder: 36.55, status: 'generated' },
    { id: 2, period: 'Weekly', date: '2023-06-12 to 2023-06-18', revenue: 87500, transactions: 2415, avgOrder: 36.23, status: 'generated' },
    { id: 3, period: 'Monthly', date: 'May 2023', revenue: 375000, transactions: 10280, avgOrder: 36.48, status: 'pending' },
    { id: 4, period: 'Daily', date: '2023-06-14', revenue: 11800, transactions: 325, avgOrder: 36.31, status: 'generated' },
  ];

  const fraudAnalysis = [
    { id: 1, userId: 'user123', email: 'user123@example.com', riskScore: 87, flags: ['Multiple IPs', 'Unusual activity', 'High refund rate'], lastActivity: '2023-06-15 14:32:45' },
    { id: 2, userId: 'user456', email: 'user456@example.com', riskScore: 65, flags: ['Suspicious payment', 'Unverified email'], lastActivity: '2023-06-15 11:15:22' },
    { id: 3, userId: 'user789', email: 'user789@example.com', riskScore: 92, flags: ['Bot-like behavior', 'Fake profile'], lastActivity: '2023-06-14 09:45:10' },
    { id: 4, userId: 'user012', email: 'user012@example.com', riskScore: 54, flags: ['Unusual login times'], lastActivity: '2023-06-13 22:18:37' },
  ];

  const featureUsage = [
    { id: 1, feature: 'Advanced Search', usageCount: 12500, uniqueUsers: 4500, satisfaction: 4.2, trend: 'up' },
    { id: 2, feature: 'Dashboard Customization', usageCount: 8700, uniqueUsers: 3200, satisfaction: 3.8, trend: 'steady' },
    { id: 3, feature: 'API Integration', usageCount: 5200, uniqueUsers: 1200, satisfaction: 4.5, trend: 'up' },
    { id: 4, feature: 'Mobile App', usageCount: 21500, uniqueUsers: 8500, satisfaction: 4.1, trend: 'up' },
    { id: 5, feature: 'Legacy Features', usageCount: 3200, uniqueUsers: 1500, satisfaction: 2.8, trend: 'down' },
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

  const handleOpenExportDialog = (report) => {
    setSelectedReport(report);
    setOpenExportDialog(true);
  };

  const handleCloseExportDialog = () => {
    setOpenExportDialog(false);
    setSelectedReport(null);
  };

  const handleExport = () => {
    // API call to export report
    console.log(`Exporting ${selectedReport?.period} report as ${exportFormat}`);
    handleCloseExportDialog();
  };

  const handleGenerateReport = (type) => {
    // API call to generate report
    console.log(`Generating ${type} report`);
  };

  const statusColor = (status) => {
    switch (status) {
      case 'generated': return 'success';
      case 'pending': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const riskColor = (score) => {
    if (score >= 80) return theme.palette.error.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  const trendIcon = (trend) => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };

  const trendColor = (trend) => {
    switch (trend) {
      case 'up': return theme.palette.success.main;
      case 'down': return theme.palette.error.main;
      default: return theme.palette.warning.main;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            <AssessmentIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Custom Reports & Data Exports
          </Typography>
          <Button variant="outlined" startIcon={<RefreshIcon />}>
            Refresh Data
          </Button>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  New Users (30d)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendsIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h4">1,240</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  ↑ 12% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Revenue (30d)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <FinanceIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h4">$375K</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  ↑ 8% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  High Risk Users
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <FraudIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h4">24</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  ↓ 3 from last week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Feature Adoption
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <AnalyticsIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h4">72%</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  New features: 85% adoption
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
              <Tab label="User Growth Trends" icon={<TrendsIcon />} iconPosition="start" />
              <Tab label="Financial Reports" icon={<FinanceIcon />} iconPosition="start" />
              <Tab label="Fraud Analysis" icon={<FraudIcon />} iconPosition="start" />
              <Tab label="Feature Usage" icon={<AnalyticsIcon />} iconPosition="start" />
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
              <MenuItem onClick={handleMenuClose}>Export All Data</MenuItem>
              <MenuItem onClick={handleMenuClose}>Schedule Report</MenuItem>
              <MenuItem onClick={handleMenuClose}>Custom Report</MenuItem>
            </Menu>
          </Box>

          <Divider />

          {/* Tab Content */}
          <Box sx={{ p: 2 }}>
            {/* User Growth Trends Tab */}
            {tabValue === 0 && (
              <Box>
                <Box sx={{ height: 400, mb: 4 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={userGrowthData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="newUsers" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="activeUsers" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="returningUsers" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Month</TableCell>
                        <TableCell align="right">New Users</TableCell>
                        <TableCell align="right">Active Users</TableCell>
                        <TableCell align="right">Returning Users</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userGrowthData.map((row) => (
                        <TableRow key={row.month} hover>
                          <TableCell>{row.month}</TableCell>
                          <TableCell align="right">{row.newUsers.toLocaleString()}</TableCell>
                          <TableCell align="right">{row.activeUsers.toLocaleString()}</TableCell>
                          <TableCell align="right">{row.returningUsers.toLocaleString()}</TableCell>
                          <TableCell align="right">
                            <Tooltip title="Export Data">
                              <IconButton size="small" onClick={() => handleOpenExportDialog({ period: `${row.month} User Growth` })}>
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Financial Reports Tab */}
            {tabValue === 1 && (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Period</TableCell>
                      <TableCell>Date Range</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Transactions</TableCell>
                      <TableCell align="right">Avg. Order</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {financialReports.map((report) => (
                      <TableRow key={report.id} hover>
                        <TableCell>{report.period}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell align="right">${report.revenue.toLocaleString()}</TableCell>
                        <TableCell align="right">{report.transactions.toLocaleString()}</TableCell>
                        <TableCell align="right">${report.avgOrder.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={report.status} 
                            color={statusColor(report.status)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell align="right">
                          {report.status === 'generated' ? (
                            <Tooltip title="Download Report">
                              <IconButton size="small" onClick={() => handleOpenExportDialog(report)}>
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Generate Report">
                              <IconButton size="small" onClick={() => handleGenerateReport(report.period)}>
                                <RefreshIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="View Details">
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

            {/* Fraud Analysis Tab */}
            {tabValue === 2 && (
              <Box>
                <Box sx={{ height: 300, mb: 4 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={fraudAnalysis.map(user => ({ 
                        userId: user.userId, 
                        riskScore: user.riskScore 
                      }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="userId" />
                      <YAxis domain={[0, 100]} />
                      <ChartTooltip />
                      <Legend />
                      <Bar 
                        dataKey="riskScore" 
                        fill={theme.palette.error.main} 
                        name="Risk Score"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>User ID</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="right">Risk Score</TableCell>
                        <TableCell>Flags</TableCell>
                        <TableCell>Last Activity</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fraudAnalysis.map((user) => (
                        <TableRow key={user.id} hover>
                          <TableCell>{user.userId}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={user.riskScore} 
                              sx={{ 
                                backgroundColor: riskColor(user.riskScore),
                                color: 'white',
                                fontWeight: 'bold'
                              }} 
                            />
                          </TableCell>
                          <TableCell>
                            {user.flags.map((flag, i) => (
                              <Chip 
                                key={i}
                                label={flag} 
                                size="small" 
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </TableCell>
                          <TableCell>{user.lastActivity}</TableCell>
                          <TableCell align="right">
                            <Tooltip title="Export Data">
                              <IconButton size="small" onClick={() => handleOpenExportDialog({ period: `Fraud Report - ${user.userId}` })}>
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Investigate">
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
              </Box>
            )}

            {/* Feature Usage Tab */}
            {tabValue === 3 && (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Feature</TableCell>
                      <TableCell align="right">Usage Count</TableCell>
                      <TableCell align="right">Unique Users</TableCell>
                      <TableCell align="right">Satisfaction</TableCell>
                      <TableCell>Trend</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {featureUsage.map((feature) => (
                      <TableRow key={feature.id} hover>
                        <TableCell>{feature.feature}</TableCell>
                        <TableCell align="right">{feature.usageCount.toLocaleString()}</TableCell>
                        <TableCell align="right">{feature.uniqueUsers.toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ 
                            display: 'inline-flex', 
                            alignItems: 'center',
                            color: feature.satisfaction >= 4 ? theme.palette.success.main : 
                                  feature.satisfaction >= 3 ? theme.palette.warning.main : 
                                  theme.palette.error.main
                          }}>
                            {feature.satisfaction.toFixed(1)}
                            <ChartIcon sx={{ ml: 0.5, fontSize: 16 }} />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            sx={{ 
                              color: trendColor(feature.trend),
                              fontWeight: 'bold'
                            }}
                          >
                            {trendIcon(feature.trend)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Export Data">
                            <IconButton size="small" onClick={() => handleOpenExportDialog({ period: `Feature Usage - ${feature.feature}` })}>
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Details">
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
              Recent Report Activity
            </Typography>
            <Paper elevation={3} sx={{ p: 2 }}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                      <DownloadIcon color="success" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Daily financial report generated"
                    secondary="2 hours ago - 342 transactions"
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: theme.palette.warning.light }}>
                      <FraudIcon color="warning" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="New high-risk user detected"
                    secondary="5 hours ago - Risk score: 92"
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: theme.palette.info.light }}>
                      <TrendsIcon color="info" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="User growth report exported"
                    secondary="Yesterday - CSV format"
                  />
                </ListItem>
              </List>
            </Paper>
          </Box>
        )}

        {/* Export Dialog */}
        <Dialog open={openExportDialog} onClose={handleCloseExportDialog}>
          <DialogTitle>Export Report</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Export {selectedReport?.period || 'selected'} data in your preferred format.
            </DialogContentText>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Format</InputLabel>
              <Select
                value={exportFormat}
                label="Format"
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <MenuItem value="csv">CSV</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="json">JSON</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseExportDialog}>Cancel</Button>
            <Button onClick={handleExport} variant="contained" startIcon={<DownloadIcon />}>
              Export
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default ReportsDashboard;