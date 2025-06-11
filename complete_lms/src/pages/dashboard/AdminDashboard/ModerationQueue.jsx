import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Stack, TablePagination,
  Grid, LinearProgress, useMediaQuery, Chip,MenuItem 
} from '@mui/material';
import {
  Flag as FlagIcon, Check as CheckIcon, Close as CloseIcon, Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { moderationAPI } from '../../../config';

const ModerationQueue = () => {
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [moderationItems, setModerationItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    page: 1
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    status: 'pending'
  });

  const fetchModerationItems = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: pagination.page,
        page_size: rowsPerPage,
        ...(filters.search && { search: filters.search }),
        status: filters.status
      };
      const response = await moderationAPI.getModerationQueue(params);
      setModerationItems(response.data.results || []);
      setPagination({
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous,
        page: pagination.page
      });
    } catch (error) {
      setError(error.message);
      enqueueSnackbar('Failed to load moderation queue', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModerationItems();
  }, [pagination.page, rowsPerPage, filters]);

  const handleOpenDialog = (item) => {
    setCurrentItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentItem(null);
  };

  const handleModerate = async (action) => {
    try {
      await moderationAPI.moderateItem(currentItem.id, {
        action,
        moderation_notes: currentItem.moderation_notes
      });
      enqueueSnackbar(`Content ${action} successfully`, { variant: 'success' });
      fetchModerationItems();
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar('Error moderating content', { variant: 'error' });
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({ search: '', status: 'pending' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleChangePage = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const renderDesktopTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Content Type</TableCell>
            <TableCell>Content</TableCell>
            <TableCell>Reported By</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {moderationItems.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>{item.content_type}</TableCell>
              <TableCell>{item.content_snippet}</TableCell>
              <TableCell>{item.reported_by.email}</TableCell>
              <TableCell>{item.reason}</TableCell>
              <TableCell>
                <Chip
                  label={item.status}
                  color={item.status === 'pending' ? 'warning' : item.status === 'approved' ? 'success' : 'error'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <IconButton onClick={() => handleOpenDialog(item)}>
                    <FlagIcon />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Moderation Queue
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search content..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'right' }}>
            <IconButton onClick={resetFilters}>
              <RefreshIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>

      {isLoading ? (
        <LinearProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : moderationItems.length === 0 ? (
        <Typography>No items in moderation queue</Typography>
      ) : (
        renderDesktopTable()
      )}

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={pagination.count}
        rowsPerPage={rowsPerPage}
        page={pagination.page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Moderate Content
          <IconButton
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">Content Details</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Type: {currentItem?.content_type}<br />
            Reported By: {currentItem?.reported_by.email}<br />
            Reason: {currentItem?.reason}
          </Typography>
          <TextField
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={currentItem?.content || ''}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            label="Moderation Notes"
            fullWidth
            multiline
            rows={2}
            value={currentItem?.moderation_notes || ''}
            onChange={(e) => setCurrentItem({ ...currentItem, moderation_notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={() => handleModerate('approve')}
            startIcon={<CheckIcon />}
            color="success"
          >
            Approve
          </Button>
          <Button
            onClick={() => handleModerate('reject')}
            startIcon={<CloseIcon />}
            color="error"
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModerationQueue;