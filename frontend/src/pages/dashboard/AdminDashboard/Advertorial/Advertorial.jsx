import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem, 
  Tooltip, Link, Chip, FormControlLabel, 
  FormGroup, Divider, useMediaQuery, IconButton, Stack, Snackbar,
  Collapse, Card, CardContent, CardActions, Grid,
  TablePagination, Switch, FormControl, InputLabel, Select,
  Avatar, LinearProgress, CircularProgress, Alert
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, 
  Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon,
  ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, 
  Search as SearchIcon, FilterList as FilterIcon, Refresh as RefreshIcon,
  Image as ImageIcon, Link as LinkIcon, Schedule as ScheduleIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useSnackbar } from 'notistack';
import { advertAPI } from '../../../../config';

const targetOptions = [
  { value: 'all', label: 'All Users' },
  { value: 'learners', label: 'Learners Only' },
  { value: 'instructors', label: 'Instructors Only' },
  { value: 'admins', label: 'Admins Only' },
];

const Advertorial = () => {
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAdvert, setCurrentAdvert] = useState(null);
  const [expandedAdvert, setExpandedAdvert] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [saveError, setSaveError] = useState(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 5,
    count: 0
  });

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    target: 'all',
    dateFrom: null,
    dateTo: null
  });

  // Validate the current advert data
  const validateAdvert = () => {
    const errors = {};
    
    if (!currentAdvert?.title?.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!currentAdvert?.content?.trim()) {
      errors.content = 'Content is required';
    }
    
    if (!currentAdvert?.start_date || !(currentAdvert.start_date instanceof Date) || isNaN(currentAdvert.start_date.getTime())) {
      errors.start_date = 'Valid start date is required';
    }
    
    if (!currentAdvert?.end_date || !(currentAdvert.end_date instanceof Date) || isNaN(currentAdvert.end_date.getTime())) {
      errors.end_date = 'Valid end date is required';
    }
    
    if (currentAdvert?.start_date && currentAdvert?.end_date && 
        currentAdvert.start_date instanceof Date && 
        currentAdvert.end_date instanceof Date &&
        currentAdvert.start_date > currentAdvert.end_date) {
      errors.dateRange = 'End date must be after start date';
    }
    
    if (currentAdvert?.link && !/^https?:\/\//i.test(currentAdvert.link)) {
      errors.link = 'Link must start with http:// or https://';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Fetch adverts from API
  const fetchAdverts = async () => {
    setLoading(true);
    try {
      const params = {
        search: filters.search,
        status: filters.status !== 'all' ? filters.status : undefined,
        target: filters.target !== 'all' ? filters.target : undefined,
        date_from: filters.dateFrom ? filters.dateFrom.toISOString() : undefined,
        date_to: filters.dateTo ? filters.dateTo.toISOString() : undefined,
        page: pagination.page + 1,
        page_size: pagination.rowsPerPage
      };

      const response = await advertAPI.getAdverts();
      setAdverts(response.data.results || []);
      setPagination(prev => ({
        ...prev,
        count: response.data.count || 0
      }));
    } catch (error) {
      enqueueSnackbar('Failed to fetch adverts', { variant: 'error' });
      setSnackbar({ open: true, message: 'Failed to fetch adverts', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAdverts();
  }, [filters, pagination.page, pagination.rowsPerPage]);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      enqueueSnackbar('Only JPG, PNG, or GIF files are allowed', { variant: 'warning' });
      setSnackbar({
        open: true,
        message: 'Only JPG, PNG, or GIF files are allowed',
        severity: 'warning'
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar('File size must be under 5MB', { variant: 'warning' });
      setSnackbar({
        open: true,
        message: 'File size must be under 5MB',
        severity: 'warning'
      });
      return;
    }

    setSelectedImage({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    });
  };

  // Handle file removal
  const handleRemoveImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.url);
    }
    setSelectedImage(null);
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination({
      page: 0,
      rowsPerPage: parseInt(event.target.value, 10),
      count: pagination.count
    });
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleOpenDialog = (advert = null) => {
    const defaultAdvert = { 
      title: '', 
      content: '',
      image: null,
      link: '',
      start_date: new Date(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'active',
      priority: 1,
      target: 'all'
    };
  
    // Convert API date strings to Date objects if advert exists
    const processedAdvert = advert ? {
      ...advert,
      start_date: new Date(advert.start_date),
      end_date: new Date(advert.end_date)
    } : null;
  
    setCurrentAdvert(processedAdvert || defaultAdvert);
    setSelectedImage(advert?.image ? { url: advert.image, name: 'Current Image' } : null);
    setOpenDialog(true);
    setValidationErrors({});
    setSaveError(null);
  
    if (advert?.id) {
      fetchActivities(advert.id);
    }
  };

  const handleCloseDialog = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.url);
    }
    setOpenDialog(false);
    setSelectedImage(null);
    setValidationErrors({});
    setSaveError(null);
  };

  // Save advert with image
  const handleSaveAdvert = async () => {
    setSaveError(null);
  
    if (!validateAdvert()) {
      const errorMsg = 'Please fill all required fields';
      enqueueSnackbar(errorMsg, { variant: 'error' });
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
      return;
    }
  
    try {
      const isUpdate = Boolean(currentAdvert.id);
      const isWithImage = Boolean(selectedImage?.file);
  
      const advertData = {
        title: currentAdvert.title?.trim() || '',
        content: currentAdvert.content?.trim() || '',
        start_date: new Date(currentAdvert.start_date).toISOString(),
        end_date: new Date(currentAdvert.end_date).toISOString(),
        status: currentAdvert.status || 'active',
        priority: currentAdvert.priority ?? 1,
        target: currentAdvert.target || 'all',
        link: currentAdvert.link?.trim() || '',
      };
  
      let response;
  
      if (isWithImage) {
        const formData = new FormData();
  
        Object.entries(advertData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        });
  
        // Add image only if it's a valid File object
        if (selectedImage.file instanceof File) {
          formData.append('image', selectedImage.file);
        }
  
        response = await advertAPI[isUpdate ? 'updateAdvert' : 'createAdvertWithImage'](
          isUpdate ? currentAdvert.id : formData,
          formData,
          true
        );
      } else {
        response = await advertAPI[isUpdate ? 'updateAdvert' : 'createAdvert'](
          isUpdate ? currentAdvert.id : null,
          advertData,
          false
        );
      }
  
      setAdverts((prev) =>
        isUpdate
          ? prev.map((a) => (a.id === currentAdvert.id ? response.data : a))
          : [...prev, response.data]
      );
  
      const successMsg = 'Advert saved successfully';
      enqueueSnackbar(successMsg, { variant: 'success' });
      setSnackbar({ open: true, message: successMsg, severity: 'success' });
      handleCloseDialog();
    } catch (error) {
      console.error('Save Advert Error:', error);
      const errorDetails = error.response?.data?.details;
      const fallback = error.response?.data?.error || 'Failed to save advert. Please try again.';
      const errorMessage = errorDetails
        ? Object.values(errorDetails).flat().join('; ')
        : fallback;
  
      setSaveError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };
  

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Check if save button should be disabled
  const isSaveDisabled = () => {
    return (
      !currentAdvert?.title?.trim() ||
      !currentAdvert?.content?.trim() ||
      !currentAdvert?.start_date ||
      !(currentAdvert.start_date instanceof Date) ||
      isNaN(currentAdvert.start_date.getTime()) ||
      !currentAdvert?.end_date ||
      !(currentAdvert.end_date instanceof Date) ||
      isNaN(currentAdvert.end_date.getTime()) ||
      Object.keys(validationErrors).length > 0
    );
  };;

  // Render error messages
  const renderErrorMessages = () => {
    if (Object.keys(validationErrors).length === 0 && !saveError) return null;

    return (
      <Box sx={{ mb: 2 }}>
        {Object.entries(validationErrors).map(([field, message]) => (
          <Alert key={field} severity="error" sx={{ mb: 1 }}>
            {message}
          </Alert>
        ))}
        {saveError && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {saveError}
          </Alert>
        )}
      </Box>
    );
  };

  // Handle status toggle
  const toggleAdvertStatus = async (id) => {
    try {
      const advert = adverts.find(a => a.id === id);
      const newStatus = advert.status === 'active' ? 'retired' : 'active';
      
      await advertAPI.toggleAdvertStatus(id, { status: newStatus });
      
      setAdverts(prev => prev.map(a => 
        a.id === id ? { ...a, status: newStatus } : a
      ));
      
      enqueueSnackbar(`Advert marked as ${newStatus}`, { variant: 'success' });
      setSnackbar({ open: true, message: `Advert marked as ${newStatus}`, severity: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to update advert status', { variant: 'error' });
      setSnackbar({ open: true, message: 'Failed to update advert status', severity: 'error' });
    }
  };

  // Handle advert deletion
  const handleDeleteAdvert = async (id) => {
    try {
      await advertAPI.deleteAdvert(id);
      setAdverts(prev => prev.filter(a => a.id !== id));
      enqueueSnackbar('Advert deleted successfully', { variant: 'success' });
      setSnackbar({ open: true, message: 'Advert deleted successfully', severity: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to delete advert', { variant: 'error' });
      setSnackbar({ open: true, message: 'Failed to delete advert', severity: 'error' });
    }
  };

  const toggleExpandAdvert = (advertId) => {
    setExpandedAdvert(expandedAdvert === advertId ? null : advertId);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      target: 'all',
      dateFrom: null,
      dateTo: null
    });
  };

  // Mobile view for adverts
  const renderMobileAdvertCards = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : adverts.length === 0 ? (
        <Typography variant="body1" align="center" p={3}>
          No adverts found
        </Typography>
      ) : (
        adverts.map((advert) => (
          <Card key={advert.id} elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                    {advert.title}
                  </Typography>
                  <Chip 
                    label={advert.status === 'active' ? 'Active' : 'Retired'} 
                    size="small"
                    color={advert.status === 'active' ? 'success' : 'default'}
                  />
                </Box>
                <IconButton onClick={() => toggleExpandAdvert(advert.id)}>
                  {expandedAdvert === advert.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
              <Typography color="text.secondary" gutterBottom>
                {formatDate(advert.start_date)} - {formatDate(advert.end_date)}
              </Typography>
              
              <Collapse in={expandedAdvert === advert.id}>
                <Box sx={{ mt: 2 }}>
                  {advert.image && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>Image:</Typography>
                      <Box sx={{ position: 'relative', width: '100%', maxWidth: '200px' }}>
                        <img 
                          src={advert.image} 
                          alt="Advert image" 
                          style={{ 
                            width: '100%', 
                            height: 'auto', 
                            borderRadius: '4px',
                            border: '1px solid #e0e0e0'
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                  
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                    {advert.content}
                  </Typography>
                  
                  <Typography variant="subtitle2">Target:</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {targetOptions.find(t => t.value === advert.target)?.label || advert.target}
                  </Typography>
                  
                  <Typography variant="subtitle2">Priority:</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {advert.priority}
                  </Typography>
                  
                  {advert.link && (
                    <>
                      <Typography variant="subtitle2">Link:</Typography>
                      <Link href={advert.link} target="_blank" rel="noopener noreferrer">
                        {advert.link}
                      </Link>
                    </>
                  )}
                </Box>
              </Collapse>
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={advert.status === 'active'}
                    onChange={() => toggleAdvertStatus(advert.id)}
                    color="primary"
                  />
                }
                label={advert.status === 'active' ? 'Active' : 'Retired'}
              />
              <Box>
                <Button 
                  size="small" 
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenDialog(advert)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button 
                  size="small" 
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteAdvert(advert.id)}
                  color="error"
                >
                  Delete
                </Button>
              </Box>
            </CardActions>
          </Card>
        ))
      )}
    </Box>
  );

  // Desktop view for adverts
  const renderDesktopAdvertTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Target</TableCell>
            <TableCell>Date Range</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : adverts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography>No adverts found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            adverts.map((advert) => (
              <TableRow 
                key={advert.id} 
                hover 
                sx={{ 
                  '&:hover': { cursor: 'pointer' },
                  backgroundColor: expandedAdvert === advert.id ? 'action.hover' : 'inherit'
                }}
                onClick={() => toggleExpandAdvert(advert.id)}
              >
                <TableCell>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {advert.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={advert.status === 'active' ? 'Active' : 'Retired'} 
                    color={advert.status === 'active' ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  {advert.image ? (
                    <Avatar 
                      src={advert.image}
                      variant="rounded"
                      sx={{ width: 40, height: 40 }}
                    >
                      <ImageIcon />
                    </Avatar>
                  ) : (
                    <Typography variant="body2">No image</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {targetOptions.find(t => t.value === advert.target)?.label || advert.target}
                </TableCell>
                <TableCell>
                  {formatDate(advert.start_date)} - {formatDate(advert.end_date)}
                </TableCell>
                <TableCell>
                  {advert.priority}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title={advert.status === 'active' ? 'Retire Advert' : 'Activate Advert'}>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAdvertStatus(advert.id);
                        }}
                        color={advert.status === 'active' ? 'success' : 'default'}
                      >
                        {advert.status === 'active' ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(advert);
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
                          handleDeleteAdvert(advert.id);
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Advert Management
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          Manage advertisements that appear on the homepage. Active ads will be displayed, retired ads will be archived.
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ mb: 3 }}
          fullWidth={isMobile}
        >
          Create New Advert
        </Button>
        
        {/* Filters Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search adverts..."
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
                label="Status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="retired">Retired</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Target Audience"
                value={filters.target}
                onChange={(e) => handleFilterChange('target', e.target.value)}
              >
                <MenuItem value="all">All Users</MenuItem>
                {targetOptions.filter(t => t.value !== 'all').map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <DatePicker
                label="From Date"
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
                label="To Date"
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
            <Grid item xs={12} sm={6} md={1} sx={{ textAlign: 'right' }}>
              <IconButton onClick={resetFilters}>
                <RefreshIcon />
              </IconButton>
              <IconButton>
                <FilterIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>

        {isMobile ? renderMobileAdvertCards() : renderDesktopAdvertTable()}

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pagination.count}
          rowsPerPage={pagination.rowsPerPage}
          page={pagination.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="md" 
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            {currentAdvert?.id ? 'Edit Advert' : 'Create New Advert'}
          </DialogTitle>
          <DialogContent dividers>
            {renderErrorMessages()}
            
            <TextField
              autoFocus
              margin="dense"
              label="Advert Title"
              fullWidth
              value={currentAdvert?.title || ''}
              onChange={(e) => setCurrentAdvert({...currentAdvert, title: e.target.value})}
              error={!!validationErrors.title}
              helperText={validationErrors.title}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              label="Advert Content"
              fullWidth
              multiline
              rows={4}
              value={currentAdvert?.content || ''}
              onChange={(e) => setCurrentAdvert({...currentAdvert, content: e.target.value})}
              error={!!validationErrors.content}
              helperText={validationErrors.content}
              sx={{ mb: 2 }}
            />
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={currentAdvert?.start_date || new Date()}
                  onChange={(newValue) => setCurrentAdvert({...currentAdvert, start_date: newValue})}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      margin="dense"
                      error={!!validationErrors.start_date || !!validationErrors.dateRange}
                      helperText={validationErrors.start_date || validationErrors.dateRange}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={currentAdvert?.end_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
                  onChange={(newValue) => setCurrentAdvert({...currentAdvert, end_date: newValue})}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      margin="dense"
                      error={!!validationErrors.end_date || !!validationErrors.dateRange}
                      helperText={validationErrors.end_date || validationErrors.dateRange}
                    />
                  )}
                />
              </Grid>
            </Grid>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Target Audience</InputLabel>
                  <Select
                    value={currentAdvert?.target || 'all'}
                    label="Target Audience"
                    onChange={(e) => setCurrentAdvert({...currentAdvert, target: e.target.value})}
                  >
                    {targetOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  margin="dense"
                  label="Priority"
                  fullWidth
                  value={currentAdvert?.priority || 1}
                  onChange={(e) => setCurrentAdvert({...currentAdvert, priority: parseInt(e.target.value)})}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            
            {/* Image Upload Section */}
            <Typography variant="subtitle1" gutterBottom>
              Image (Optional)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {selectedImage && (
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={selectedImage.url}
                  variant="rounded"
                  sx={{ width: 100, height: 100 }}
                >
                  <ImageIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2">{selectedImage.name}</Typography>
                  {selectedImage.size && (
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(selectedImage.size)}
                    </Typography>
                  )}
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleRemoveImage}
                    sx={{ mt: 1 }}
                  >
                    Remove Image
                  </Button>
                </Box>
              </Box>
            )}
            
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-image"
              type="file"
              onChange={handleFileUpload}
            />
            <Tooltip 
              title="Upload an image for this advert (JPG, PNG, GIF under 5MB)" 
              placement="top"
            >
              <label htmlFor="upload-image">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {selectedImage ? 'Replace Image' : 'Upload Image'}
                </Button>
              </label>
            </Tooltip>
            
            <Typography variant="caption" display="block" gutterBottom>
              Upload an image (JPG, PNG, GIF under 5MB)
            </Typography>
            
            <TextField
              margin="dense"
              label="Link URL"
              fullWidth
              value={currentAdvert?.link || ''}
              onChange={(e) => setCurrentAdvert({...currentAdvert, link: e.target.value})}
              error={!!validationErrors.link}
              helperText={validationErrors.link}
              InputProps={{
                startAdornment: <LinkIcon color="action" sx={{ mr: 1 }} />
              }}
              sx={{ mb: 2 }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={currentAdvert?.status === 'active'}
                  onChange={(e) => setCurrentAdvert({
                    ...currentAdvert, 
                    status: e.target.checked ? 'active' : 'retired'
                  })}
                  color="primary"
                />
              }
              label={currentAdvert?.status === 'active' ? 'Active' : 'Retired'}
            />

          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleSaveAdvert} 
              variant="contained" 
              disabled={isSaveDisabled()}
            >
              Save Advert
            </Button>
          </DialogActions>
        </Dialog>
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
      </Box>
    </LocalizationProvider>
  );
};

export default Advertorial;