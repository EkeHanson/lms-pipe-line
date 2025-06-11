import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, List, ListItem, ListItemText, ListItemSecondaryAction,useMediaQuery,
  IconButton, TextField, Chip, useTheme, Grid, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Alert, Checkbox, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { Add, Delete, Edit, Star, CloudUpload} from '@mui/icons-material';
import { coursesAPI } from '../../../../config';

const GamificationManager = ({ courseId, isMobile }) => {
  const theme = useTheme();
  const isMobileView = isMobile || useMediaQuery(theme.breakpoints.down('sm'));
  const [badges, setBadges] = useState([]);
  const [pointsConfig, setPointsConfig] = useState({
    course_completion: 100,
    module_completion: 20,
    lesson_completion: 10,
    quiz_score: 5,
    discussion: 2,
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [newBadge, setNewBadge] = useState({
    title: '',
    description: '',
    criteria: { courses_completed: 0 },
    image: null,
  });
  const [editingBadge, setEditingBadge] = useState(null);
  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [badgesResponse, leaderboardResponse] = await Promise.all([
        coursesAPI.getBadges(),
        coursesAPI.getLeaderboard(courseId),
      ]);
      setBadges(badgesResponse.data?.results || []);
      setLeaderboard(leaderboardResponse.data?.results || []);
    } catch (err) {
      setError('Failed to load gamification data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBadge = async () => {
    if (!newBadge.title.trim()) {
      setError('Badge title is required');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', newBadge.title);
      formData.append('description', newBadge.description);
      formData.append('criteria', JSON.stringify(newBadge.criteria));
      if (newBadge.image) formData.append('image', newBadge.image);

      const response = await coursesAPI.createBadge(formData);
      setBadges([...badges, response.data]);
      setNewBadge({ title: '', description: '', criteria: { courses_completed: 0 }, image: null });
      setBadgeDialogOpen(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create badge');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBadge = async () => {
    if (!editingBadge || !newBadge.title.trim()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', newBadge.title);
      formData.append('description', newBadge.description);
      formData.append('criteria', JSON.stringify(newBadge.criteria));
      if (newBadge.image) formData.append('image', newBadge.image);

      const response = await coursesAPI.updateBadge(editingBadge.id, formData);
      setBadges(badges.map(badge => (badge.id === editingBadge.id ? response.data : badge)));
      setEditingBadge(null);
      setNewBadge({ title: '', description: '', criteria: { courses_completed: 0 }, image: null });
      setBadgeDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update badge');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBadge = async (id) => {
    setLoading(true);
    try {
      await coursesAPI.deleteBadge(id);
      setBadges(badges.filter(badge => badge.id !== id));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete badge');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBadge = (badge) => {
    setEditingBadge(badge);
    setNewBadge({
      title: badge.title,
      description: badge.description,
      criteria: badge.criteria,
      image: null,
    });
    setBadgeDialogOpen(true);
  };

  const handlePointsConfigChange = (activity, value) => {
    setPointsConfig(prev => ({ ...prev, [activity]: parseInt(value) || 0 }));
  };

  const savePointsConfig = async () => {
    setLoading(true);
    try {
      await coursesAPI.updatePointsConfig(courseId, pointsConfig);
      setError('');
    } catch (err) {
      setError('Failed to save points configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: isMobileView ? 2 : 3, maxWidth: '100%', overflowX: 'hidden' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Typography variant={isMobileView ? 'h5' : 'h4'} sx={{ mb: 3, fontWeight: 600 }}>
        Gamification Settings
      </Typography>

      {/* Badge Management */}
      <Paper sx={{ p: isMobileView ? 2 : 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {editingBadge ? 'Edit Badge' : 'Create New Badge'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Badge Title"
              value={newBadge.title}
              onChange={e => setNewBadge({ ...newBadge, title: e.target.value })}
              sx={{ mb: 2 }}
              size={isMobileView ? 'small' : 'medium'}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Description"
              value={newBadge.description}
              onChange={e => setNewBadge({ ...newBadge, description: e.target.value })}
              sx={{ mb: 2 }}
              size={isMobileView ? 'small' : 'medium'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Courses to Complete"
              type="number"
              value={newBadge.criteria.courses_completed}
              onChange={e =>
                setNewBadge({
                  ...newBadge,
                  criteria: { ...newBadge.criteria, courses_completed: parseInt(e.target.value) || 0 },
                })
              }
              sx={{ mb: 2 }}
              size={isMobileView ? 'small' : 'medium'}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              size={isMobileView ? 'small' : 'medium'}
            >
              Upload Badge Image
              <input
                type="file"
                hidden
                onChange={e => setNewBadge({ ...newBadge, image: e.target.files[0] })}
                accept="image/*"
              />
            </Button>
            {newBadge.image && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {newBadge.image.name}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          {editingBadge ? (
            <>
              <Button
                variant="outlined"
                onClick={() => {
                  setEditingBadge(null);
                  setNewBadge({ title: '', description: '', criteria: { courses_completed: 0 }, image: null });
                }}
                size={isMobileView ? 'small' : 'medium'}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleUpdateBadge}
                disabled={loading || !newBadge.title.trim()}
                size={isMobileView ? 'small' : 'medium'}
              >
                {loading ? <CircularProgress size={24} /> : 'Update'}
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={handleAddBadge}
              disabled={loading || !newBadge.title.trim()}
              startIcon={<Add />}
              size={isMobileView ? 'small' : 'medium'}
            >
              {loading ? <CircularProgress size={24} /> : 'Add Badge'}
            </Button>
          )}
        </Box>
      </Paper>

      {/* Existing Badges */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Existing Badges
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : badges.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center', mb: 2 }}>
          <Star sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No badges created yet
          </Typography>
        </Paper>
      ) : (
        <List>
          {badges.map(badge => (
            <ListItem key={badge.id} divider>
              <ListItemText
                primary={badge.title}
                secondary={`Criteria: Complete ${badge.criteria.courses_completed} courses`}
                primaryTypographyProps={{ variant: isMobileView ? 'body2' : 'body1' }}
                secondaryTypographyProps={{ variant: isMobileView ? 'caption' : 'body2' }}
              />
              {badge.image && (
                <Avatar src={badge.image} sx={{ width: 40, height: 40, mr: 2 }} />
              )}
              <ListItemSecondaryAction>
                <IconButton onClick={() => handleEditBadge(badge)} size="small">
                  <Edit fontSize={isMobileView ? 'small' : 'medium'} />
                </IconButton>
                <IconButton onClick={() => handleDeleteBadge(badge.id)} size="small">
                  <Delete fontSize={isMobileView ? 'small' : 'medium'} color="error" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {/* Points Configuration */}
      <Paper sx={{ p: isMobileView ? 2 : 3, mb: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Points Configuration
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(pointsConfig).map(([activity, points]) => (
            <Grid item xs={12} sm={6} key={activity}>
              <TextField
                fullWidth
                label={activity.replace('_', ' ').toUpperCase()}
                type="number"
                value={points}
                onChange={e => handlePointsConfigChange(activity, e.target.value)}
                size={isMobileView ? 'small' : 'medium'}
              />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            onClick={savePointsConfig}
            disabled={loading}
            size={isMobileView ? 'small' : 'medium'}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Points Config'}
          </Button>
        </Box>
      </Paper>

      {/* Leaderboard */}
      <Paper sx={{ p: isMobileView ? 2 : 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Leaderboard
        </Typography>
        {leaderboard.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No leaderboard data available
          </Typography>
        ) : (
          <TableContainer>
            <Table size={isMobileView ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell align="right">Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard.map((entry, index) => (
                  <TableRow key={entry.user__username}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{entry.user__username}</TableCell>
                    <TableCell align="right">{entry.total_points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Badge Dialog */}
      <Dialog
        open={badgeDialogOpen}
        onClose={() => setBadgeDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobileView}
      >
        <DialogTitle>{editingBadge ? 'Edit Badge' : 'Add New Badge'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Badge Title"
            value={newBadge.title}
            onChange={e => setNewBadge({ ...newBadge, title: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
            size={isMobileView ? 'small' : 'medium'}
          />
          <TextField
            fullWidth
            label="Description"
            value={newBadge.description}
            onChange={e => setNewBadge({ ...newBadge, description: e.target.value })}
            sx={{ mb: 2 }}
            size={isMobileView ? 'small' : 'medium'}
          />
          <TextField
            fullWidth
            label="Courses to Complete"
            type="number"
            value={newBadge.criteria.courses_completed}
            onChange={e =>
              setNewBadge({
                ...newBadge,
                criteria: { ...newBadge.criteria, courses_completed: parseInt(e.target.value) || 0 },
              })
            }
            sx={{ mb: 2 }}
            size={isMobileView ? 'small' : 'medium'}
          />
          <Button
            fullWidth
            variant="outlined"
            component="label"
            startIcon={<CloudUpload />}
            size={isMobileView ? 'small' : 'medium'}
          >
            Upload Badge Image
            <input
              type="file"
              hidden
              onChange={e => setNewBadge({ ...newBadge, image: e.target.files[0] })}
              accept="image/*"
            />
          </Button>
          {newBadge.image && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {newBadge.image.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBadgeDialogOpen(false)} size={isMobileView ? 'small' : 'medium'}>
            Cancel
          </Button>
          <Button
            onClick={editingBadge ? handleUpdateBadge : handleAddBadge}
            variant="contained"
            disabled={loading || !newBadge.title.trim()}
            size={isMobileView ? 'small' : 'medium'}
          >
            {loading ? <CircularProgress size={20} /> : (editingBadge ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GamificationManager;