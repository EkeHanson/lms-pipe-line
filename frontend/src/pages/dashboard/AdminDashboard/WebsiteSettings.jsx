import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Switch, 
  FormControlLabel, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const WebsiteSettings = () => {
  const theme = useTheme();
  const [settings, setSettings] = useState({
    websiteName: 'Arts Training',
    websiteTitle: 'Arts Training Academy',
    websiteKeywords: 'Arts Training Academy',
    websiteDescription: 'Study any topic, anytime. explore thousands of courses for the lowest price ever!',
    author: 'nece',
    slogan: 'A course based learning experience',
    systemEmail: 'support@artstraining.co.uk',
    address: 'Sydney, Australia',
    phone: '+143-52-97483',
    youtubeApiKey: 'youtube-and-google-drive-api-key',
    vimeoApiKey: 'vimeo-api-key',
    systemLanguage: 'English',
    studentEmailVerification: false,
    courseAccessibility: 'Public',
    numberOfDevices: 1,
    courseSellingTax: 0,
    googleAnalyticsId: '',
    metaPixelId: '',
    footerText: 'nece TM',
    bannerLink: 'https://example.com/banner',
    timezone: 'Australia/Sydney',
    publicSignup: true,
    canStudentsDisableAccount: false
  });
  const [isExistingData, setIsExistingData] = useState(false);

  // Simulate checking if data exists (e.g., from an API)
  useEffect(() => {
    // Dummy check - in real app, this would be an API call
    const fetchSettings = async () => {
      // Simulate API response
      const response = { data: null }; // Change to some data to simulate existing settings
      if (response.data) {
        setSettings(response.data);
        setIsExistingData(true);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isExistingData ? 'PATCH' : 'POST';
    const url = isExistingData ? '/api/settings/update' : '/api/settings/create';
    
    try {
      // Simulate API call
      console.log(`Sending ${method} request to ${url} with data:`, settings);
      // In real app: await fetch(url, { method, body: JSON.stringify(settings) });
      setIsExistingData(true);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Website Notification Settings
      </Typography>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Website Information */}
            <Grid item xs={12}>
              <Typography variant="h6">Website Information</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Website Name"
                name="websiteName"
                value={settings.websiteName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Website Title"
                name="websiteTitle"
                value={settings.websiteTitle}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Website Keywords"
                name="websiteKeywords"
                value={settings.websiteKeywords}
                onChange={handleChange}
                helperText="Comma-separated keywords"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Website Description"
                name="websiteDescription"
                value={settings.websiteDescription}
                onChange={handleChange}
              />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Typography variant="h6">Contact Information</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Author"
                name="author"
                value={settings.author}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Slogan"
                name="slogan"
                value={settings.slogan}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="System Email"
                name="systemEmail"
                type="email"
                value={settings.systemEmail}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={settings.address}
                onChange={handleChange}
              />
            </Grid>

            {/* API Settings */}
            <Grid item xs={12}>
              <Typography variant="h6">API Settings</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Youtube API Key"
                name="youtubeApiKey"
                value={settings.youtubeApiKey}
                onChange={handleChange}
                helperText={<a href="https://developers.google.com/youtube/v3" target="_blank">Get YouTube API Key</a>}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Vimeo API Key"
                name="vimeoApiKey"
                value={settings.vimeoApiKey}
                onChange={handleChange}
                helperText={<a href="https://developer.vimeo.com/" target="_blank">Get Vimeo API Key</a>}
              />
            </Grid>

            {/* System Configuration */}
            <Grid item xs={12}>
              <Typography variant="h6">System Configuration</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>System Language</InputLabel>
                <Select
                  name="systemLanguage"
                  value={settings.systemLanguage}
                  onChange={handleChange}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Spanish">Spanish</MenuItem>
                  <MenuItem value="French">French</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Course Accessibility</InputLabel>
                <Select
                  name="courseAccessibility"
                  value={settings.courseAccessibility}
                  onChange={handleChange}
                >
                  <MenuItem value="Public">Public</MenuItem>
                  <MenuItem value="Private">Private</MenuItem>
                  <MenuItem value="Restricted">Restricted</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Number of Authorized Devices"
                name="numberOfDevices"
                value={settings.numberOfDevices}
                onChange={handleChange}
                helperText="Devices per account"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Course Selling Tax (%)"
                name="courseSellingTax"
                value={settings.courseSellingTax}
                onChange={handleChange}
                helperText="Enter 0 to disable"
              />
            </Grid>

            {/* Analytics */}
            <Grid item xs={12}>
              <Typography variant="h6">Analytics</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Google Analytics ID"
                name="googleAnalyticsId"
                value={settings.googleAnalyticsId}
                onChange={handleChange}
                helperText="Leave blank to disable"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Meta Pixel ID"
                name="metaPixelId"
                value={settings.metaPixelId}
                onChange={handleChange}
                helperText="Leave blank to disable"
              />
            </Grid>

            {/* Additional Settings */}
            <Grid item xs={12}>
              <Typography variant="h6">Additional Settings</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Footer Text"
                name="footerText"
                value={settings.footerText}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Banner Link"
                name="bannerLink"
                value={settings.bannerLink}
                onChange={handleChange}
                helperText="URL for banner image"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Timezone"
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
              />
            </Grid>

            {/* Switches */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.studentEmailVerification}
                    onChange={handleChange}
                    name="studentEmailVerification"
                  />
                }
                label="Student Email Verification"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.publicSignup}
                    onChange={handleChange}
                    name="publicSignup"
                  />
                }
                label="Public Signup"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.canStudentsDisableAccount}
                    onChange={handleChange}
                    name="canStudentsDisableAccount"
                  />
                }
                label="Can Students Disable Their Own Accounts?"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2, py: 1.5, px: 4 }}
              >
                Save Settings
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default WebsiteSettings;