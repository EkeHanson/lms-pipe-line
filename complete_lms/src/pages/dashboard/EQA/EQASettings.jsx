import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  useTheme
} from '@mui/material';
import {
  Lock as PasswordIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const EQASettings = () => {
  const theme = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    name: 'EQA Officer',
    email: 'eqa.officer@awardingbody.com',
    phone: '+44 1234 567890',
    language: 'en',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'de', name: 'German' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to an API
    console.log('Saving settings:', userData);
    setEditMode(false);
  };

  const handleCancel = () => {
    // Reset to original data
    setUserData({
      name: 'EQA Officer',
      email: 'eqa.officer@awardingbody.com',
      phone: '+44 1234 567890',
      language: 'en',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    });
    setEditMode(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Profile Information</Typography>
          {editMode ? (
            <Box>
              <Button
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{ backgroundColor: theme.palette.secondary.main }}
              >
                Save Changes
              </Button>
            </Box>
          ) : (
            <Button
              startIcon={<EditIcon />}
              onClick={() => setEditMode(true)}
              sx={{ backgroundColor: theme.palette.secondary.main }}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                fontSize: 48,
                mb: 2,
                bgcolor: theme.palette.secondary.main
              }}
            >
              {userData.name.charAt(0)}
            </Avatar>
            {editMode && (
              <Button variant="outlined" size="small">
                Change Photo
              </Button>
            )}
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              margin="normal"
              disabled={!editMode}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              margin="normal"
              disabled={!editMode}
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={userData.phone}
              onChange={handleInputChange}
              margin="normal"
              disabled={!editMode}
            />
            <FormControl fullWidth margin="normal" disabled={!editMode}>
              <InputLabel>Language</InputLabel>
              <Select
                name="language"
                value={userData.language}
                label="Language"
                onChange={handleInputChange}
                startAdornment={<LanguageIcon color="action" />}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notification Preferences
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={userData.notifications.email}
                onChange={handleNotificationChange}
                name="email"
                disabled={!editMode}
              />
            }
            label="Email Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={userData.notifications.sms}
                onChange={handleNotificationChange}
                name="sms"
                disabled={!editMode}
              />
            }
            label="SMS Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={userData.notifications.push}
                onChange={handleNotificationChange}
                name="push"
                disabled={!editMode}
              />
            }
            label="Push Notifications"
          />
        </FormGroup>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Security
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Change Password"
              secondary="Last changed 3 months ago"
            />
            <ListItemSecondaryAction>
              <Button
                variant="outlined"
                startIcon={<PasswordIcon />}
                onClick={() => alert('Password change dialog')}
              >
                Change
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Two-Factor Authentication"
              secondary="Currently disabled"
            />
            <ListItemSecondaryAction>
              <Button
                variant="outlined"
                onClick={() => alert('2FA setup dialog')}
              >
                Enable
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mt: 3, borderLeft: `4px solid ${theme.palette.error.main}` }}>
        <Typography variant="h6" gutterBottom color="error">
          Danger Zone
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => alert('Account deletion confirmation')}
        >
          Delete Account
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          This action cannot be undone. All your data will be permanently deleted.
        </Typography>
      </Paper>
    </Box>
  );
};

export default EQASettings;