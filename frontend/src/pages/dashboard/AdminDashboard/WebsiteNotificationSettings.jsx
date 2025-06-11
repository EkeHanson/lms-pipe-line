import React, { useState, useRef } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  Button, 
  Grid,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  IconButton,
  Divider,
  Chip,
  TextField,
  InputAdornment,
  Tooltip,
  Badge,
  CircularProgress,
  Paper,
  Stack,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Settings as SettingsIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  YouTube as YouTubeIcon,
  Public as PublicIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Palette as PaletteIcon,
  BrandingWatermark as BrandingIcon,
  Article as ArticleIcon,
  ContactMail as ContactMailIcon
} from '@mui/icons-material';
import { Editor } from '@tinymce/tinymce-react';
import { useDropzone } from 'react-dropzone';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: theme.shadows[1],
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
  border: `1px solid ${theme.palette.divider}`,
}));

const DropzoneArea = styled(Paper)(({ theme, isDragActive }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(6),
  textAlign: 'center',
  backgroundColor: isDragActive ? theme.palette.action.hover : theme.palette.background.default,
  cursor: 'pointer',
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s ease',
}));

const StatusPill = styled(Chip)(({ status, theme }) => ({
  backgroundColor: status === 'success' 
    ? theme.palette.success.light 
    : status === 'error' 
      ? theme.palette.error.light 
      : theme.palette.info.light,
  color: status === 'success' 
    ? theme.palette.success.dark 
    : status === 'error' 
      ? theme.palette.error.dark 
      : theme.palette.info.dark,
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
}));

const ImagePreview = styled(Paper)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  '&:hover .image-actions': {
    opacity: 1,
  },
}));

const ImageActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`website-tabpanel-${index}`}
    aria-labelledby={`website-tab-${index}`}
    {...other}
  >
    {value === index && (
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    )}
  </div>
);

const SocialMediaInput = ({ icon, label, value, onChange, prefix, ...props }) => (
  <TextField
    fullWidth
    label={label}
    value={value}
    onChange={onChange}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          {icon}
          <Typography color="textSecondary" sx={{ ml: 1 }}>
            {prefix}
          </Typography>
        </InputAdornment>
      ),
    }}
    {...props}
  />
);

const WebsiteNotificationSettings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [imageNames, setImageNames] = useState({});
  const api_key = "uecltiwl4q2ez3z029492efueixvfffjwigxatfwgpu6gj43"
  const editorRefs = {
    privacyPolicy: useRef(null),
    aboutUs: useRef(null),
    cookiesPolicy: useRef(null),
    refundPolicy: useRef(null),
    termsConditions: useRef(null),
  };

  const [settings, setSettings] = useState({
    privacyPolicy: '<h2>Privacy Policy</h2><p>We respect your privacy and are committed to protecting your personal data.</p>',
    aboutUs: '<h2>About Our Company</h2><p>We are a leading provider of innovative solutions since 2010.</p>',
    cookiesPolicy: '<h2>Cookies Policy</h2><p>We use cookies to enhance your browsing experience.</p>',
    refundPolicy: '<h2>Refund Policy</h2><p>30-day money back guarantee on all products.</p>',
    termsConditions: '<h2>Terms & Conditions</h2><p>By using our services, you agree to these terms.</p>',
    contact: {
      address: '123 Business Ave, Suite 100\nTech City, TC 12345',
      openingHours: 'Monday-Friday: 9am-5pm\nSaturday: 10am-2pm\nSunday: Closed',
      email: 'support@company.com',
      phone: '+1 (555) 123-4567'
    },
    socialMedia: {
      facebook: 'company.page',
      twitter: '@company',
      instagram: '@company.official',
      linkedin: 'company-profile',
      youtube: 'channel/company'
    },
    branding: {
      primaryColor: '#4f46e5',
      secondaryColor: '#10b981',
      fontFamily: 'Inter',
      darkMode: false
    },
    images: [
      { id: 1, name: 'logo-primary.png', url: 'https://via.placeholder.com/300x150?text=Primary+Logo', isPrimary: true },
      { id: 2, name: 'logo-secondary.png', url: 'https://via.placeholder.com/300x150?text=Secondary+Logo', isPrimary: false },
      { id: 3, name: 'favicon.ico', url: 'https://via.placeholder.com/64x64?text=Favicon', isPrimary: false }
    ]
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg']
    },
    onDrop: acceptedFiles => {
      const newImages = acceptedFiles.map(file => ({
        id: Date.now(),
        name: file.name,
        url: URL.createObjectURL(file),
        isPrimary: false
      }));
      setSettings(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditorChange = (content, field) => {
    setSettings(prev => ({
      ...prev,
      [field]: content
    }));
  };

  const handleContactChange = (field) => (event) => {
    setSettings(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: event.target.value
      }
    }));
  };

  const handleSocialMediaChange = (platform) => (event) => {
    setSettings(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: event.target.value
      }
    }));
  };

  const handleBrandingChange = (field) => (event) => {
    setSettings(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        [field]: event.target.value
      }
    }));
  };

  const handleToggleDarkMode = (event) => {
    setSettings(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        darkMode: event.target.checked
      }
    }));
  };

  const handleSetPrimaryImage = (id) => {
    setSettings(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        isPrimary: img.id === id
      }))
    }));
  };

  const handleRemoveImage = (id) => {
    setSettings(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
  };

  const handleImageNameChange = (id, name) => {
    setImageNames(prev => ({
      ...prev,
      [id]: name
    }));
  };

  const handleSaveImageNames = () => {
    setSettings(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        name: imageNames[img.id] || img.name
      }))
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSaveStatus(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveStatus('success');
      console.log('Settings saved:', settings);
    } catch (error) {
      setSaveStatus('error');
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', p: 4, bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
          <SettingsIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Website Configuration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all aspects of your website content and appearance
          </Typography>
        </Box>
      </Box>

      <StyledCard elevation={0}>
        <CardHeader 
          title="Website Settings Dashboard" 
          subheader="Configure your website content, branding, and contact information"
          avatar={<PublicIcon color="primary" />}
          sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
        />
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                minWidth: 120,
              }
            }}
          >
            <Tab label="Content" icon={<ArticleIcon />} iconPosition="start" />
            <Tab label="Branding" icon={<PaletteIcon />} iconPosition="start" />
            <Tab label="Contact" icon={<ContactMailIcon />} iconPosition="start" />
            <Tab label="Media" icon={<BrandingIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Content Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                <InfoIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                About Us Page
              </Typography>

              <Editor
                apiKey={api_key}
                onInit={(evt, editor) => editorRefs.aboutUs.current = editor}
                value={settings.aboutUs}
                onEditorChange={(content) => handleEditorChange(content, 'aboutUs')}
                init={{
                  height: 400,
                  menubar: true,
                  plugins: [
                    'advlist autolink lists link image charmap preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                  ],
                  toolbar: 'undo redo | formatselect | bold italic underline strikethrough | ' +
                    'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ' +
                    'link image media table | forecolor backcolor | code | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
                  skin: settings.branding.darkMode ? 'oxide-dark' : 'oxide',
                  content_css: settings.branding.darkMode ? 'dark' : 'default',
                }}
              />


              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  startIcon={<VisibilityIcon />}
                  sx={{ mr: 2 }}
                >
                  Preview
                </Button>
                <Button variant="contained" startIcon={<EditIcon />}>
                  Edit SEO Settings
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                <InfoIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Privacy Policy
              </Typography>
              <Editor
                apiKey={api_key}
                onInit={(evt, editor) => editorRefs.privacyPolicy.current = editor}
                value={settings.privacyPolicy}
                onEditorChange={(content) => handleEditorChange(content, 'privacyPolicy')}
                init={{
                  height: 400,
                  menubar: false,
                  plugins: ['lists link image charmap', 'wordcount'],
                  toolbar: 'undo redo | bold italic underline | bullist numlist | link image',
                  skin: settings.branding.darkMode ? 'oxide-dark' : 'oxide',
                  content_css: settings.branding.darkMode ? 'dark' : 'default',
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                <InfoIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Terms & Conditions
              </Typography>
              <Editor
                apiKey={api_key}
                onInit={(evt, editor) => editorRefs.termsConditions.current = editor}
                value={settings.termsConditions}
                onEditorChange={(content) => handleEditorChange(content, 'termsConditions')}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: ['lists link', 'wordcount'],
                  toolbar: 'undo redo | bold italic | bullist numlist',
                  skin: settings.branding.darkMode ? 'oxide-dark' : 'oxide',
                  content_css: settings.branding.darkMode ? 'dark' : 'default',
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                <InfoIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Refund Policy
              </Typography>
              <Editor
                apiKey={api_key}
                onInit={(evt, editor) => editorRefs.refundPolicy.current = editor}
                value={settings.refundPolicy}
                onEditorChange={(content) => handleEditorChange(content, 'refundPolicy')}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: ['lists link', 'wordcount'],
                  toolbar: 'undo redo | bold italic | bullist numlist',
                  skin: settings.branding.darkMode ? 'oxide-dark' : 'oxide',
                  content_css: settings.branding.darkMode ? 'dark' : 'default',
                }}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Branding Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                <PaletteIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Color Scheme
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Primary Color"
                    type="color"
                    value={settings.branding.primaryColor}
                    onChange={handleBrandingChange('primaryColor')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '4px',
                            backgroundColor: settings.branding.primaryColor,
                            border: '1px solid',
                            borderColor: 'divider'
                          }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Secondary Color"
                    type="color"
                    value={settings.branding.secondaryColor}
                    onChange={handleBrandingChange('secondaryColor')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '4px',
                            backgroundColor: settings.branding.secondaryColor,
                            border: '1px solid',
                            borderColor: 'divider'
                          }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              
              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel>Font Family</InputLabel>
                <Select
                  value={settings.branding.fontFamily}
                  label="Font Family"
                  onChange={handleBrandingChange('fontFamily')}
                >
                  <MenuItem value="Inter">Inter</MenuItem>
                  <MenuItem value="Roboto">Roboto</MenuItem>
                  <MenuItem value="Open Sans">Open Sans</MenuItem>
                  <MenuItem value="Montserrat">Montserrat</MenuItem>
                  <MenuItem value="Poppins">Poppins</MenuItem>
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.branding.darkMode}
                    onChange={handleToggleDarkMode}
                    color="primary"
                  />
                }
                label="Enable Dark Mode"
                sx={{ mt: 3 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                <ImageIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Logo & Favicon
              </Typography>
              <Box {...getRootProps()}>
                <input {...getInputProps()} />
                <DropzoneArea isDragActive={isDragActive}>
                  <UploadIcon color="primary" fontSize="large" />
                  <Typography variant="h6" gutterBottom>
                    {isDragActive ? 'Drop branding assets here' : 'Drag & drop images here, or click to select'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Supports PNG, JPG, SVG and ICO files (Max 5MB)
                  </Typography>
                </DropzoneArea>
              </Box>
              
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 3, mb: 2 }}>
                Current Brand Assets
              </Typography>
              
              <Grid container spacing={2}>
                {settings.images.map((image) => (
                  <Grid item xs={12} sm={6} key={image.id}>
                    <ImagePreview elevation={2}>
                      <img
                        src={image.url}
                        alt={image.name}
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'contain',
                          backgroundColor: '#f5f5f5'
                        }}
                      />
                      <ImageActions className="image-actions">
                        <TextField
                          size="small"
                          defaultValue={image.name}
                          onChange={(e) => handleImageNameChange(image.id, e.target.value)}
                          sx={{
                            backgroundColor: 'background.paper',
                            borderRadius: 1,
                            '& .MuiInputBase-root': {
                              color: 'common.white',
                            },
                            '& .MuiInputBase-input': {
                              py: 0.5,
                              px: 1,
                            },
                          }}
                        />
                        <Box>
                          <Tooltip title={image.isPrimary ? 'Primary logo' : 'Set as primary'}>
                            <IconButton
                              size="small"
                              color={image.isPrimary ? 'primary' : 'inherit'}
                              onClick={() => handleSetPrimaryImage(image.id)}
                              disabled={image.isPrimary}
                              sx={{ 
                                color: image.isPrimary ? 'primary.main' : 'common.white',
                                '&:hover': {
                                  backgroundColor: 'rgba(255,255,255,0.1)'
                                }
                              }}
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveImage(image.id)}
                              sx={{ 
                                color: 'error.light',
                                '&:hover': {
                                  backgroundColor: 'rgba(255,255,255,0.1)'
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ImageActions>
                    </ImagePreview>
                  </Grid>
                ))}
              </Grid>
              <Button 
                variant="contained" 
                onClick={handleSaveImageNames}
                sx={{ mt: 2 }}
              >
                Save Image Names
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Contact Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                <LocationIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Business Information
              </Typography>
              
              <TextField
                fullWidth
                label="Business Address"
                value={settings.contact.address}
                onChange={handleContactChange('address')}
                multiline
                rows={4}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                label="Opening Hours"
                value={settings.contact.openingHours}
                onChange={handleContactChange('openingHours')}
                multiline
                rows={4}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScheduleIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                <EmailIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Contact Details
              </Typography>
              
              <TextField
                fullWidth
                label="Contact Email"
                value={settings.contact.email}
                onChange={handleContactChange('email')}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                label="Phone Number"
                value={settings.contact.phone}
                onChange={handleContactChange('phone')}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
                <PublicIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Social Media Links
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <SocialMediaInput
                    icon={<FacebookIcon color="primary" />}
                    label="Facebook"
                    value={settings.socialMedia.facebook}
                    onChange={handleSocialMediaChange('facebook')}
                    prefix="facebook.com/"
                  />
                </Grid>
                <Grid item xs={12}>
                  <SocialMediaInput
                    icon={<TwitterIcon color="primary" />}
                    label="Twitter"
                    value={settings.socialMedia.twitter}
                    onChange={handleSocialMediaChange('twitter')}
                    prefix="twitter.com/"
                  />
                </Grid>
                <Grid item xs={12}>
                  <SocialMediaInput
                    icon={<InstagramIcon color="primary" />}
                    label="Instagram"
                    value={settings.socialMedia.instagram}
                    onChange={handleSocialMediaChange('instagram')}
                    prefix="instagram.com/"
                  />
                </Grid>
                <Grid item xs={12}>
                  <SocialMediaInput
                    icon={<LinkedInIcon color="primary" />}
                    label="LinkedIn"
                    value={settings.socialMedia.linkedin}
                    onChange={handleSocialMediaChange('linkedin')}
                    prefix="linkedin.com/company/"
                  />
                </Grid>
                <Grid item xs={12}>
                  <SocialMediaInput
                    icon={<YouTubeIcon color="primary" />}
                    label="YouTube"
                    value={settings.socialMedia.youtube}
                    onChange={handleSocialMediaChange('youtube')}
                    prefix="youtube.com/"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Media Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            <ImageIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
            Media Library
          </Typography>
          
          <Box {...getRootProps()}>
            <input {...getInputProps()} />
            <DropzoneArea isDragActive={isDragActive}>
              <UploadIcon color="primary" fontSize="large" />
              <Typography variant="h6" gutterBottom>
                {isDragActive ? 'Drop media files here' : 'Drag & drop files here, or click to select'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Supports images, videos and documents (Max 10MB per file)
              </Typography>
            </DropzoneArea>
          </Box>
          
          <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 3, mb: 2 }}>
            Uploaded Media Files
          </Typography>
          
          <Grid container spacing={2}>
            {settings.images.map((image) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
                <ImagePreview elevation={2}>
                  <img
                    src={image.url}
                    alt={image.name}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                    }}
                  />
                  <ImageActions className="image-actions">
                    <Typography variant="body2" color="common.white" noWrap>
                      {image.name}
                    </Typography>
                    <Box>
                      <Tooltip title="Rename">
                        <IconButton size="small" sx={{ color: 'common.white' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          sx={{ color: 'error.light' }}
                          onClick={() => handleRemoveImage(image.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ImageActions>
                </ImagePreview>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
        
        <Divider />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 3,
          gap: 2,
          bgcolor: 'background.paper',
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}>
          <Box>
            {saveStatus === 'success' && (
              <StatusPill 
                icon={<CheckCircleIcon fontSize="small" />}
                label="Changes saved successfully"
                status="success"
              />
            )}
            {saveStatus === 'error' && (
              <StatusPill 
                icon={<ErrorIcon fontSize="small" />}
                label="Error saving changes"
                status="error"
              />
            )}
          </Box>
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="inherit"
            >
              Discard Changes
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{ minWidth: 150 }}
            >
              {loading ? 'Saving...' : 'Save All Changes'}
            </Button>
          </Stack>
        </Box>
      </StyledCard>
    </Box>
  );
};

export default WebsiteNotificationSettings; ;