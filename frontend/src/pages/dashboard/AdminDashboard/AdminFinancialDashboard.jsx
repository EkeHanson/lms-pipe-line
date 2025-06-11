import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  TextField,
  MenuItem,
  Divider,
  IconButton,
  Avatar,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Error as FailedIcon,
  SwapHoriz as EscrowIcon,
  Receipt as ReceiptIcon,
  CreditCard as SubscriptionIcon,
  Warning as DisputeIcon,
  TrendingUp as RevenueIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminFinancialDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Mock data - replace with API calls
  const [transactions, setTransactions] = useState([
    {
      id: 'TX-1001',
      date: '2023-06-15T14:30:00Z',
      user: 'Alex Johnson',
      amount: 89.00,
      type: 'rental',
      status: 'completed',
      escrow: 'released',
      payout: 'processed',
      dispute: false
    },
    {
      id: 'TX-1002',
      date: '2023-06-14T09:15:00Z',
      user: 'Sarah Williams',
      amount: 250.00,
      type: 'rental',
      status: 'pending',
      escrow: 'held',
      payout: 'pending',
      dispute: false
    },
    {
      id: 'TX-1003',
      date: '2023-06-13T11:45:00Z',
      user: 'Michael Chen',
      amount: 45.00,
      type: 'rental',
      status: 'failed',
      escrow: 'none',
      payout: 'none',
      dispute: true
    },
    {
      id: 'TX-1004',
      date: '2023-06-12T18:20:00Z',
      user: 'Emily Davis',
      amount: 75.00,
      type: 'subscription',
      status: 'completed',
      escrow: 'none',
      payout: 'processed',
      dispute: false
    },
    {
      id: 'TX-1005',
      date: '2023-06-10T10:05:00Z',
      user: 'David Wilson',
      amount: 120.00,
      type: 'rental',
      status: 'refunded',
      escrow: 'refunded',
      payout: 'reversed',
      dispute: true
    }
  ]);

  // Stats data
  const stats = [
    { 
      title: 'Total Revenue', 
      value: '$24,589', 
      icon: <MoneyIcon fontSize="large" />,
      change: '+18% from last month',
      trend: 'up'
    },
    { 
      title: 'Completed Payments', 
      value: '1,842', 
      icon: <CompletedIcon fontSize="large" />,
      change: '92% success rate',
      trend: 'up'
    },
    { 
      title: 'Escrow Holdings', 
      value: '$8,742', 
      icon: <EscrowIcon fontSize="large" />,
      change: 'Currently held',
      trend: 'neutral'
    },
    { 
      title: 'Active Subscriptions', 
      value: '328', 
      icon: <SubscriptionIcon fontSize="large" />,
      change: '12 new this week',
      trend: 'up'
    },
    { 
      title: 'Disputes', 
      value: '23', 
      icon: <DisputeIcon fontSize="large" />,
      change: '5 resolved this week',
      trend: 'down'
    },
    { 
      title: 'Commission Earnings', 
      value: '$4,917', 
      icon: <RevenueIcon fontSize="large" />,
      change: '15% of transactions',
      trend: 'up'
    }
  ];

  // Revenue chart data
  const revenueData = [
    { name: 'Jan', revenue: 4200, commission: 840 },
    { name: 'Feb', revenue: 5800, commission: 1160 },
    { name: 'Mar', revenue: 7100, commission: 1420 },
    { name: 'Apr', revenue: 8900, commission: 1780 },
    { name: 'May', revenue: 12500, commission: 2500 },
    { name: 'Jun', revenue: 15800, commission: 3160 },
  ];

  // Filters state
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    escrow: 'all',
    search: '',
    dateFrom: null,
    dateTo: null
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
    setPage(0); // Reset to first page when filters change
  };

  // Filter transactions based on current filters
  const filteredTransactions = transactions.filter(tx => {
    return (
      (filters.type === 'all' || tx.type === filters.type) &&
      (filters.status === 'all' || tx.status === filters.status) &&
      (filters.escrow === 'all' || tx.escrow === filters.escrow) &&
      (filters.search === '' || 
        tx.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        tx.user.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.dateFrom || new Date(tx.date) >= new Date(filters.dateFrom)) &&
      (!filters.dateTo || new Date(tx.date) <= new Date(filters.dateTo))
    );
  });

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Status chip component
  const StatusChip = ({ status }) => {
    const statusMap = {
      completed: { color: 'success', icon: <CompletedIcon fontSize="small" /> },
      pending: { color: 'warning', icon: <PendingIcon fontSize="small" /> },
      failed: { color: 'error', icon: <FailedIcon fontSize="small" /> },
      refunded: { color: 'info', icon: <FailedIcon fontSize="small" /> }
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

  // Escrow chip component
  const EscrowChip = ({ status }) => {
    const statusMap = {
      held: { color: 'warning', label: 'Held' },
      released: { color: 'success', label: 'Released' },
      refunded: { color: 'info', label: 'Refunded' },
      none: { color: 'default', label: 'None' }
    };
    
    return (
      <Chip
        label={statusMap[status]?.label || status}
        color={statusMap[status]?.color || 'default'}
        size="small"
        variant="outlined"
      />
    );
  };

  // Dispute chip component
  const DisputeChip = ({ hasDispute }) => {
    return hasDispute ? (
      <Chip
        label="Dispute"
        color="error"
        size="small"
        variant="outlined"
        icon={<DisputeIcon fontSize="small" />}
      />
    ) : (
      <Typography variant="body2" color="text.secondary">-</Typography>
    );
  };

  // Refresh data
  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
          Financial Dashboard
        </Typography>
        
        {/* Tabs */}
        <Paper elevation={2} sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab label="Overview" icon={<MoneyIcon />} iconPosition="start" />
            <Tab label="Transactions" icon={<ReceiptIcon />} iconPosition="start" />
            <Tab label="Escrow" icon={<EscrowIcon />} iconPosition="start" />
            <Tab label="Subscriptions" icon={<SubscriptionIcon />} iconPosition="start" />
            <Tab label="Disputes" icon={<DisputeIcon />} iconPosition="start" />
          </Tabs>
        </Paper>

        {/* Stats Cards */}
        {tabValue === 0 && (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 2,
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
                      mb: 1
                    }}>
                      <Typography 
                        variant="subtitle2" 
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        {stat.title}
                      </Typography>
                      <Avatar sx={{ 
                        width: 40, 
                        height: 40,
                        bgcolor: theme.palette.primary.light,
                        color: theme.palette.primary.main
                      }}>
                        {stat.icon}
                      </Avatar>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.change}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Revenue Chart */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Revenue & Commission (Last 6 Months)
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill={theme.palette.primary.main} name="Total Revenue" />
                    <Bar dataKey="commission" fill={theme.palette.secondary.main} name="Commission" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </>
        )}

        {/* Transactions Tab */}
        {tabValue === 1 && (
          <>
            {/* Filters Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Search transactions..."
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
                    label="Type"
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="rental">Rental</MenuItem>
                    <MenuItem value="subscription">Subscription</MenuItem>
                    <MenuItem value="service">Service</MenuItem>
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
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                    <MenuItem value="refunded">Refunded</MenuItem>
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
                  <IconButton onClick={handleRefresh} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
                  </IconButton>
                  <IconButton>
                    <ExportIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>

            {/* Transactions Table */}
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
                    <TableRow>
                      <TableCell>Transaction ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Escrow</TableCell>
                      <TableCell>Dispute</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTransactions
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((tx) => (
                        <TableRow key={tx.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2">{tx.id}</Typography>
                          </TableCell>
                          <TableCell>
                            {new Date(tx.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                sx={{ 
                                  width: 30, 
                                  height: 30, 
                                  mr: 1,
                                  bgcolor: theme.palette.primary.light,
                                  color: theme.palette.primary.main
                                }}
                              >
                                {tx.user.charAt(0)}
                              </Avatar>
                              <Typography variant="body2">{tx.user}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              ${tx.amount.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={tx.type}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <StatusChip status={tx.status} />
                          </TableCell>
                          <TableCell>
                            <EscrowChip status={tx.escrow} />
                          </TableCell>
                          <TableCell>
                            <DisputeChip hasDispute={tx.dispute} />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small">
                              <MoreIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredTransactions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </>
        )}

        {/* Escrow Tab */}
        {tabValue === 2 && (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Escrow Management
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Funds Currently in Escrow
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                    $8,742.00
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    42 transactions • Average hold time: 3.5 days
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Recent Escrow Activity
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: theme.palette.warning.light, color: theme.palette.warning.main }}>
                          <EscrowIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary="TX-1002 - $250.00"
                        secondary="Held for Sarah Williams • Rental"
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: theme.palette.success.light, color: theme.palette.success.main }}>
                          <EscrowIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary="TX-1007 - $180.00"
                        secondary="Released to Michael Chen • Completed"
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: theme.palette.info.light, color: theme.palette.info.main }}>
                          <EscrowIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary="TX-1005 - $120.00"
                        secondary="Refunded to David Wilson • Dispute resolved"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Subscriptions Tab */}
        {tabValue === 3 && (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Subscription Management
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Active Subscriptions
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    328
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    $9,840 MRR • 12 new this week
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Renewals This Month
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    84
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    $2,520 expected revenue
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Expiring Soon
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    19
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    In next 7 days • $570 at risk
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Disputes Tab */}
        {tabValue === 4 && (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Dispute Resolution Center
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Open Disputes
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
                    14
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    $1,250 in disputed amounts
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Recently Resolved
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                    5
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    This week • $420 refunded
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Dispute Breakdown
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Jan', disputes: 8, resolved: 5 },
                          { name: 'Feb', disputes: 12, resolved: 9 },
                          { name: 'Mar', disputes: 15, resolved: 11 },
                          { name: 'Apr', disputes: 10, resolved: 8 },
                          { name: 'May', disputes: 18, resolved: 12 },
                          { name: 'Jun', disputes: 14, resolved: 5 },
                        ]}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="disputes" fill={theme.palette.error.main} name="New Disputes" />
                        <Bar dataKey="resolved" fill={theme.palette.success.main} name="Resolved" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default AdminFinancialDashboard;