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
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Star as StarIcon,
  Assignment as RequestIcon,
  Refresh as RefreshIcon,
  ArrowForward as DetailsIcon,
  CalendarToday as CalendarIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingIcon,
  SentimentDissatisfied as AbandonedIcon,
  ThumbUp as PositiveIcon,
  ThumbDown as NegativeIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
const ContentUsageDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual API calls
  const activePages = [
    { id: 1, path: '/products/electronics', views: 1245, avgTime: '2:45', bounceRate: '32%' },
    { id: 2, path: '/home', views: 987, avgTime: '1:30', bounceRate: '45%' },
    { id: 3, path: '/products/fashion', views: 876, avgTime: '3:15', bounceRate: '28%' },
    { id: 4, path: '/blog/post-123', views: 654, avgTime: '4:20', bounceRate: '22%' },
    { id: 5, path: '/account/dashboard', views: 543, avgTime: '5:10', bounceRate: '18%' }
  ];

  const popularSearches = [
    { id: 1, query: 'wireless headphones', count: 342, results: 45, noResults: false },
    { id: 2, query: 'summer dress', count: 287, results: 32, noResults: false },
    { id: 3, query: 'smartphone 2023', count: 198, results: 28, noResults: false },
    { id: 4, query: 'xys123zzz', count: 156, results: 0, noResults: true },
    { id: 5, query: 'home decor', count: 132, results: 56, noResults: false }
  ];

  const abandonedCarts = [
    { id: 1, user: 'user123@example.com', items: 3, value: '$145.99', step: 'Payment', time: '15 min ago' },
    { id: 2, user: 'guest-4587', items: 1, value: '$49.99', step: 'Shipping', time: '32 min ago' },
    { id: 3, user: 'customer@example.com', items: 5, value: '$287.50', step: 'Cart', time: '1 hour ago' },
    { id: 4, user: 'guest-6721', items: 2, value: '$89.98', step: 'Payment', time: '2 hours ago' },
    { id: 5, user: 'user456@example.com', items: 1, value: '$24.99', step: 'Shipping', time: '3 hours ago' }
  ];

  const customerFeedback = [
    { id: 1, user: 'happy_customer@example.com', type: 'Review', rating: 5, comment: 'Great product! Fast shipping.', date: '2023-06-15' },
    { id: 2, user: 'frustrated@example.com', type: 'Complaint', rating: 1, comment: 'Item arrived damaged', date: '2023-06-14' },
    { id: 3, user: 'neutral_user@example.com', type: 'Review', rating: 3, comment: 'Average quality, could be better', date: '2023-06-14' },
    { id: 4, user: 'support_case_4587', type: 'Support', rating: null, comment: 'Need help with return process', date: '2023-06-13' },
    { id: 5, user: 'loyal_customer@example.com', type: 'Review', rating: 4, comment: 'Good value for money', date: '2023-06-12' }
  ];

  const serviceRequests = [
    { id: 1, requestId: 'SR-4587', type: 'Installation', status: 'Completed', date: '2023-06-15', assigned: 'Tech Team A' },
    { id: 2, requestId: 'SR-4588', type: 'Repair', status: 'In Progress', date: '2023-06-14', assigned: 'Tech Team B' },
    { id: 3, requestId: 'SR-4589', type: 'Consultation', status: 'Pending', date: '2023-06-14', assigned: 'Sales Team' },
    { id: 4, requestId: 'SR-4590', type: 'Maintenance', status: 'Scheduled', date: '2023-06-13', assigned: 'Tech Team A' },
    { id: 5, requestId: 'SR-4591', type: 'Installation', status: 'Completed', date: '2023-06-12', assigned: 'Tech Team C' }
  ];

  // Chart data
  const pageViewsData = [
    { name: 'Products', value: 45 },
    { name: 'Home', value: 25 },
    { name: 'Blog', value: 15 },
    { name: 'Account', value: 10 },
    { name: 'Other', value: 5 }
  ];

  const searchTrendsData = [
    { name: 'Mon', count: 400 },
    { name: 'Tue', count: 300 },
    { name: 'Wed', count: 600 },
    { name: 'Thu', count: 200 },
    { name: 'Fri', count: 500 },
    { name: 'Sat', count: 800 },
    { name: 'Sun', count: 700 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDateChange = (newValue, index) => {
    const newDateRange = [...dateRange];
    newDateRange[index] = newValue;
    setDateRange(newDateRange);
  };

  const handleFollowUp = (id) => {
    // API call to follow up
    console.log(`Following up on item ${id}`);
  };

  const statusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      case 'Pending': return 'warning';
      case 'Scheduled': return 'secondary';
      default: return 'default';
    }
  };

  const feedbackColor = (type) => {
    switch (type) {
      case 'Review': return 'info';
      case 'Complaint': return 'error';
      case 'Support': return 'warning';
      default: return 'default';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            <AnalyticsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Content & Usage Analytics
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
                  Page Views (24h)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h4">12,456</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Unique Searches
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <SearchIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h4">2,187</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Abandoned Carts
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <AbandonedIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h4">42</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Avg. Rating
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <StarIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h4">4.2</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Open Requests
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <RequestIcon color="action" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h4">18</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Conversion Rate
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <PositiveIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h4">3.8%</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Centered Charts Row */}
        <Grid container spacing={3} sx={{ 
        mb: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
        }}>
        <Grid item xs={12} md={5}>
            <Card elevation={3} sx={{ 
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%'
            }}>
            <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 700,
                textAlign: 'center',
                color: theme.palette.text.primary
            }}>
                PAGE VIEWS DISTRIBUTION
            </Typography>
            <Box sx={{ 
                width: '100%',
                height: 300,
                display: 'flex',
                justifyContent: 'center'
            }}>
                <ResponsiveContainer width="90%" height="100%">
                <PieChart>
                    <Pie
                    data={pageViewsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    >
                    {pageViewsData.map((entry, index) => (
                        <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke={theme.palette.background.paper}
                        strokeWidth={2}
                        />
                    ))}
                    </Pie>
                    <Legend 
                    layout="horizontal"
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: '20px' }}
                    />
                </PieChart>
                </ResponsiveContainer>
            </Box>
            </Card>
        </Grid>
        <Grid item xs={12} md={5}>
            <Card elevation={3} sx={{ 
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%'
            }}>
            <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 700,
                textAlign: 'center',
                color: theme.palette.text.primary
            }}>
                SEARCH TRENDS (LAST 7 DAYS)
            </Typography>
            <Box sx={{ 
                width: '100%',
                height: 300,
                display: 'flex',
                justifyContent: 'center'
            }}>
                <ResponsiveContainer width="90%" height="100%">
                <BarChart data={searchTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis 
                    dataKey="name" 
                    tick={{ fill: theme.palette.text.primary }}
                    />
                    <YAxis 
                    tick={{ fill: theme.palette.text.primary }}
                    />
                    <Bar 
                    dataKey="count" 
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                    />
                </BarChart>
                </ResponsiveContainer>
            </Box>
            </Card>
        </Grid>
        </Grid>

        {/* Main Content */}
        <Card elevation={3}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
              <Tab label="Active Pages" icon={<TrendingIcon />} iconPosition="start" />
              <Tab label="Popular Searches" icon={<SearchIcon />} iconPosition="start" />
              <Tab label="Abandoned Carts" icon={<CartIcon />} iconPosition="start" />
              <Tab label="Customer Feedback" icon={<StarIcon />} iconPosition="start" />
              <Tab label="Service Requests" icon={<RequestIcon />} iconPosition="start" />
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
            {/* Active Pages Tab */}
            {tabValue === 0 && (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Page Path</TableCell>
                      <TableCell align="right">Views</TableCell>
                      <TableCell align="right">Avg. Time</TableCell>
                      <TableCell align="right">Bounce Rate</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activePages.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.path}</TableCell>
                        <TableCell align="right">{row.views}</TableCell>
                        <TableCell align="right">{row.avgTime}</TableCell>
                        <TableCell align="right">{row.bounceRate}</TableCell>
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

            {/* Popular Searches Tab */}
            {tabValue === 1 && (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Search Query</TableCell>
                      <TableCell align="right">Count</TableCell>
                      <TableCell align="right">Results Found</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {popularSearches.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.query}</TableCell>
                        <TableCell align="right">{row.count}</TableCell>
                        <TableCell align="right">{row.results}</TableCell>
                        <TableCell>
                          {row.noResults ? (
                            <Chip label="No Results" color="error" size="small" />
                          ) : (
                            <Chip label="Results Found" color="success" size="small" />
                          )}
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

            {/* Abandoned Carts Tab */}
            {tabValue === 2 && (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell align="right">Items</TableCell>
                      <TableCell align="right">Value</TableCell>
                      <TableCell>Abandoned At</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {abandonedCarts.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.user}</TableCell>
                        <TableCell align="right">{row.items}</TableCell>
                        <TableCell align="right">{row.value}</TableCell>
                        <TableCell>{row.step}</TableCell>
                        <TableCell>{row.time}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Follow up">
                            <IconButton 
                              size="small" 
                              onClick={() => handleFollowUp(row.id)}
                            >
                              <DetailsIcon fontSize="small" color="primary" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Customer Feedback Tab */}
            {tabValue === 3 && (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="center">Rating</TableCell>
                      <TableCell>Comment</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customerFeedback.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.user}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.type} 
                            color={feedbackColor(row.type)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell align="center">
                          {row.rating && (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <StarIcon fontSize="small" color={row.rating > 3 ? 'success' : row.rating > 2 ? 'warning' : 'error'} />
                              <Typography variant="body2" sx={{ ml: 0.5 }}>
                                {row.rating}
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography noWrap>{row.comment}</Typography>
                        </TableCell>
                        <TableCell>{row.date}</TableCell>
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

            {/* Service Requests Tab */}
            {tabValue === 4 && (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Request ID</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Assigned To</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {serviceRequests.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.requestId}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.status} 
                            color={statusColor(row.status)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.assigned}</TableCell>
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
          </Box>
        </Card>

        {/* Recent Activity Sidebar */}
        {!isMobile && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Recent User Activity
            </Typography>
            <Paper elevation={3} sx={{ p: 2 }}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                      <PositiveIcon color="success" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="New 5-star review received"
                    secondary="15 minutes ago - 'Great service!'"
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: theme.palette.warning.light }}>
                      <CartIcon color="warning" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Cart abandoned at payment"
                    secondary="1 hour ago - Value: $145.99"
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: theme.palette.error.light }}>
                      <NegativeIcon color="error" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Customer complaint received"
                    secondary="2 hours ago - Damaged item"
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: theme.palette.info.light }}>
                      <SearchIcon color="info" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Popular search with no results"
                    secondary="3 hours ago - 'xys123zzz'"
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

export default ContentUsageDashboard;