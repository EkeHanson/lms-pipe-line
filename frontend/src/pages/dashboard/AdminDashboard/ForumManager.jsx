import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, IconButton, Stack,
  Collapse, Card, CardContent, CardActions, List, ListItem, ListItemText, TablePagination,
  Grid, LinearProgress, useMediaQuery, FormControlLabel, Checkbox,Autocomplete 
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Forum as ForumIcon,
  ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, Search as SearchIcon,
  Refresh as RefreshIcon, Close as CloseIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { forumAPI, groupsAPI, userAPI } from '../../../config';
import { debounce } from 'lodash';

const ForumManager = () => {
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [forums, setForums] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentForum, setCurrentForum] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [expandedForum, setExpandedForum] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    page: 1
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    isActive: true
  });

  // Fetch forums
  const fetchForums = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: pagination.page,
        page_size: rowsPerPage,
        ...(filters.search && { search: filters.search }),
        is_active: filters.isActive
      };
      const [forumsRes, groupsRes] = await Promise.all([
        forumAPI.getForums(params),
        groupsAPI.getGroups()
      ]);
      setForums(forumsRes.data.results || []);
      setGroups(groupsRes.data.results || []);
      setPagination({
        count: forumsRes.data.count || 0,
        next: forumsRes.data.next,
        previous: forumsRes.data.previous,
        page: pagination.page
      });
    } catch (error) {
      setError(error.message);
      enqueueSnackbar('Failed to load forums', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForums();
  }, [pagination.page, rowsPerPage, filters]);

  const handleOpenDialog = (forum = null) => {
    if (forum) {
      setCurrentForum(forum);
      setSelectedGroups(forum.allowed_groups || []);
    } else {
      setCurrentForum({ title: '', description: '', is_active: true });
      setSelectedGroups([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentForum(null);
    setSelectedGroups([]);
  };

  const handleSaveForum = async () => {
    try {
      const forumData = {
        ...currentForum,
        allowed_groups: selectedGroups.map(g => g.id)
      };
      const response = currentForum.id
        ? await forumAPI.updateForum(currentForum.id, forumData)
        : await forumAPI.createForum(forumData);
      enqueueSnackbar(currentForum.id ? 'Forum updated successfully!' : 'Forum created successfully!', { variant: 'success' });
      fetchForums();
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar('Error saving forum', { variant: 'error' });
    }
  };

  const handleDeleteForum = async (id) => {
    try {
      await forumAPI.deleteForum(id);
      enqueueSnackbar('Forum deleted successfully!', { variant: 'success' });
      fetchForums();
    } catch (error) {
      enqueueSnackbar('Error deleting forum', { variant: 'error' });
    }
  };

  const toggleExpandForum = (forumId) => {
    setExpandedForum(expandedForum === forumId ? null : forumId);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({ search: '', isActive: true });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleChangePage = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const renderMobileForumCards = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {forums.map((forum) => (
        <Card key={forum.id} elevation={3}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ForumIcon color={forum.is_active ? 'primary' : 'disabled'} />
                <Typography variant="subtitle1">{forum.title}</Typography>
              </Box>
              <IconButton onClick={() => toggleExpandForum(forum.id)}>
                {expandedForum === forum.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Typography color="text.secondary" gutterBottom>
              Posts: {forum.post_count} | Last activity: {forum.last_activity}
            </Typography>
            <Collapse in={expandedForum === forum.id}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>{forum.description}</Typography>
                <Typography variant="subtitle2">Allowed Groups:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {forum.allowed_groups.map((group, i) => (
                    <Chip key={i} label={group.name} size="small" />
                  ))}
                </Box>
              </Box>
            </Collapse>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => handleOpenDialog(forum)}
            >
              Edit
            </Button>
            <Button
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => handleDeleteForum(forum.id)}
              color="error"
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );

  const renderDesktopForumTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Posts</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Allowed Groups</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {forums.map((forum) => (
            <TableRow
              key={forum.id}
              hover
              sx={{ '&:hover': { cursor: 'pointer' } }}
              onClick={() => toggleExpandForum(forum.id)}
            >
              <TableCell>{forum.title}</TableCell>
              <TableCell>{forum.description.substring(0, 100)}...</TableCell>
              <TableCell>{forum.post_count}</TableCell>
              <TableCell>
                <Chip
                  label={forum.is_active ? 'Active' : 'Inactive'}
                  color={forum.is_active ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {forum.allowed_groups.slice(0, 2).map((group, i) => (
                    <Chip key={i} label={group.name} size="small" />
                  ))}
                  {forum.allowed_groups.length > 2 && (
                    <Chip label={`+${forum.allowed_groups.length - 2}`} size="small" />
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <IconButton onClick={() => handleOpenDialog(forum)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteForum(forum.id)} color="error">
                    <DeleteIcon />
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
        Forum Manager
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        sx={{ mb: 3 }}
      >
        Create Forum
      </Button>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search forums..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.isActive}
                  onChange={(e) => handleFilterChange('isActive', e.target.checked)}
                />
              }
              label="Show Active Forums Only"
            />
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
      ) : forums.length === 0 ? (
        <Typography>No forums found</Typography>
      ) : isMobile ? (
        renderMobileForumCards()
      ) : (
        renderDesktopForumTable()
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentForum?.id ? 'Edit Forum' : 'Create Forum'}
          <IconButton
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={currentForum?.title || ''}
            onChange={(e) => setCurrentForum({ ...currentForum, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={currentForum?.description || ''}
            onChange={(e) => setCurrentForum({ ...currentForum, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={currentForum?.is_active || false}
                onChange={(e) => setCurrentForum({ ...currentForum, is_active: e.target.checked })}
              />
            }
            label="Active"
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle2" gutterBottom>Select Groups</Typography>
          <Autocomplete
            multiple
            options={groups}
            getOptionLabel={(option) => option.name}
            value={selectedGroups}
            onChange={(event, newValue) => setSelectedGroups(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Allowed Groups" placeholder="Select groups" />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option.id} label={option.name} />
              ))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveForum}
            variant="contained"
            disabled={!currentForum?.title}
          >
            {currentForum?.id ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ForumManager;