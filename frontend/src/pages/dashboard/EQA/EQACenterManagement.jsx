import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Badge,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  People as PeopleIcon
} from '@mui/icons-material';

const EQACenterManagement = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCenter, setCurrentCenter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterQualification, setFilterQualification] = useState('all');

  // Sample data
  const centers = [
    {
      id: 1,
      name: 'ABC Training Center',
      code: 'ABC123',
      status: 'active',
      qualifications: ['Level 3 Business', 'Level 2 Customer Service'],
      contact: {
        email: 'contact@abctraining.com',
        phone: '+1 555-123-4567',
        address: '123 Education St, London, UK'
      },
      lastVisit: '2023-05-15',
      nextVisit: '2023-11-20',
      assessors: 5,
      learners: 120
    },
    {
      id: 2,
      name: 'XYZ College',
      code: 'XYZ456',
      status: 'active',
      qualifications: ['Level 4 Management', 'Level 3 Administration'],
      contact: {
        email: 'info@xyzcollege.edu',
        phone: '+1 555-987-6543',
        address: '456 Academy Ave, Manchester, UK'
      },
      lastVisit: '2023-04-10',
      nextVisit: '2023-10-15',
      assessors: 8,
      learners: 200
    },
    {
      id: 3,
      name: 'City Skills Academy',
      code: 'CSA789',
      status: 'pending',
      qualifications: ['Level 2 Business', 'Level 3 Team Leading'],
      contact: {
        email: 'admin@cityskills.org',
        phone: '+1 555-456-7890',
        address: '789 Learning Lane, Birmingham, UK'
      },
      lastVisit: null,
      nextVisit: '2023-09-01',
      assessors: 3,
      learners: 75
    },
    {
      id: 4,
      name: 'Global Education Network',
      code: 'GEN321',
      status: 'suspended',
      qualifications: ['Level 5 Leadership', 'Level 4 Project Management'],
      contact: {
        email: 'support@globaledu.net',
        phone: '+1 555-654-3210',
        address: '321 Knowledge Rd, Edinburgh, UK'
      },
      lastVisit: '2023-01-20',
      nextVisit: null,
      assessors: 6,
      learners: 150
    }
  ];

  const qualifications = [
    'Level 2 Business',
    'Level 3 Business',
    'Level 3 Administration',
    'Level 3 Team Leading',
    'Level 4 Management',
    'Level 4 Project Management',
    'Level 5 Leadership',
    'Level 2 Customer Service'
  ];

  const handleOpenAddDialog = () => {
    setEditMode(false);
    setCurrentCenter(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (center) => {
    setEditMode(true);
    setCurrentCenter(center);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveCenter = () => {
    // In a real app, this would save to an API
    console.log('Saving center:', currentCenter);
    setOpenDialog(false);
  };

  const handleDeleteCenter = (id) => {
    // In a real app, this would delete from an API
    console.log('Deleting center with id:', id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCenter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setCurrentCenter(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value
      }
    }));
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'active':
        return <Chip icon={<CheckCircleIcon />} label="Active" color="success" size="small" />;
      case 'pending':
        return <Chip icon={<WarningIcon />} label="Pending" color="warning" size="small" />;
      case 'suspended':
        return <Chip icon={<ErrorIcon />} label="Suspended" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const filteredCenters = centers.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         center.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || center.status === filterStatus;
    const matchesQualification = filterQualification === 'all' || 
                                center.qualifications.includes(filterQualification);
    return matchesSearch && matchesStatus && matchesQualification;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Center Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{ backgroundColor: theme.palette.secondary.main }}
        >
          Add New Center
        </Button>
      </Box>

      {/* Filters and Search */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search centers..."
              InputProps={{
                startAdornment: <SearchIcon color="action" />
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Qualification</InputLabel>
              <Select
                value={filterQualification}
                label="Qualification"
                onChange={(e) => setFilterQualification(e.target.value)}
              >
                <MenuItem value="all">All Qualifications</MenuItem>
                {qualifications.map((qual, index) => (
                  <MenuItem key={index} value={qual}>{qual}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => alert('Exporting centers data')}
            >
              Export
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Centers Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableCell>Center Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Qualifications</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Last Visit</TableCell>
              <TableCell>Next Visit</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCenters.map((center) => (
              <TableRow key={center.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: theme.palette.secondary.light, mr: 2 }}>
                      {center.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography>{center.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {center.assessors} assessors • {center.learners} learners
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{center.code}</TableCell>
                <TableCell>{getStatusChip(center.status)}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {center.qualifications.map((qual, index) => (
                      <Chip key={index} label={qual} size="small" />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <EmailIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                      <Typography variant="body2">{center.contact.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                      <Typography variant="body2">{center.contact.phone}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {center.lastVisit || 'Never'}
                </TableCell>
                <TableCell>
                  {center.nextVisit ? (
                    <Chip 
                      label={center.nextVisit} 
                      color="primary" 
                      size="small" 
                      icon={<CalendarToday fontSize="small" />}
                    />
                  ) : 'Not scheduled'}
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit Center">
                    <IconButton onClick={() => handleOpenEditDialog(center)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Center">
                    <IconButton onClick={() => handleDeleteCenter(center.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Center Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Center' : 'Add New Center'}
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
          {currentCenter ? (
            <Grid container spacing={3} sx={{ pt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Center Name"
                  name="name"
                  value={currentCenter.name || ''}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Center Code"
                  name="code"
                  value={currentCenter.code || ''}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={currentCenter.status || 'pending'}
                    label="Status"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Qualifications</InputLabel>
                  <Select
                    multiple
                    name="qualifications"
                    value={currentCenter.qualifications || []}
                    onChange={handleInputChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {qualifications.map((qual) => (
                      <MenuItem key={qual} value={qual}>
                        <Checkbox checked={currentCenter.qualifications?.includes(qual) || false} />
                        <ListItemText primary={qual} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Contact Information
                </Typography>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={currentCenter.contact?.email || ''}
                  onChange={handleContactChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={currentCenter.contact?.phone || ''}
                  onChange={handleContactChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={currentCenter.contact?.address || ''}
                  onChange={handleContactChange}
                  margin="normal"
                  multiline
                  rows={3}
                />
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Visit Information
                  </Typography>
                  <TextField
                    fullWidth
                    label="Last Visit Date"
                    type="date"
                    name="lastVisit"
                    value={currentCenter.lastVisit || ''}
                    onChange={handleInputChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="Next Visit Date"
                    type="date"
                    name="nextVisit"
                    value={currentCenter.nextVisit || ''}
                    onChange={handleInputChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Typography>Loading center data...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveCenter} 
            variant="contained"
            sx={{ backgroundColor: theme.palette.secondary.main }}
          >
            {editMode ? 'Update Center' : 'Add Center'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EQACenterManagement;