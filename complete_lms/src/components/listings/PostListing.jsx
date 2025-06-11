import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  TextField,
  Paper,
  Divider,
  Chip,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Slider,
  FormControlLabel,
  Checkbox,
  FormGroup
} from '@mui/material';
import {
  AddPhotoAlternate as AddPhotoIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Apartment as ApartmentIcon,
  DirectionsCar as CarIcon,
  CameraAlt as CameraIcon,
  Event as EventIcon,
  AttachMoney as MoneyIcon,
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const PostListing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [images, setImages] = useState([]);
  const [availability, setAvailability] = useState({
    startDate: null,
    endDate: null,
    alwaysAvailable: false
  });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: 0,
    location: '',
    itemCondition: 'excellent',
    rules: [],
    deliveryOptions: []
  });

  const [errors, setErrors] = useState({
    title: false,
    category: false,
    description: false,
    price: false,
    location: false
  });

  // Categories data
  const categories = [
    { value: 'electronics', label: 'Electronics', icon: <CameraIcon /> },
    { value: 'vehicles', label: 'Vehicles', icon: <CarIcon /> },
    { value: 'property', label: 'Property', icon: <HomeIcon /> },
    { value: 'equipment', label: 'Equipment', icon: <ApartmentIcon /> },
    { value: 'clothing', label: 'Clothing', icon: <ApartmentIcon /> },
    { value: 'other', label: 'Other', icon: <ApartmentIcon /> }
  ];

  // Condition options
  const conditions = [
    { value: 'new', label: 'Brand New' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  // Rules options
  const rulesOptions = [
    'No smoking',
    'No pets',
    'No parties/events',
    'Suitable for children',
    'Security deposit required'
  ];

  // Delivery options
  const deliveryOptions = [
    'Owner delivery',
    'Pickup only',
    'Third-party shipping available'
  ];

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages([...images, ...newImages]);
  };

  // Remove image
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: false
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (name, value) => {
    const currentValues = [...formData[name]];
    const index = currentValues.indexOf(value);
    
    if (index === -1) {
      currentValues.push(value);
    } else {
      currentValues.splice(index, 1);
    }

    setFormData({
      ...formData,
      [name]: currentValues
    });
  };

  // Handle next step
  const handleNext = () => {
    // Validate current step before proceeding
    if (activeStep === 0) {
      const newErrors = {
        title: !formData.title,
        category: !formData.category,
        description: !formData.description
      };
      
      setErrors(newErrors);
      
      if (Object.values(newErrors).some(error => error)) {
        return;
      }
    } else if (activeStep === 1) {
      const newErrors = {
        price: !formData.price || formData.price <= 0,
        location: !formData.location
      };
      
      setErrors(newErrors);
      
      if (Object.values(newErrors).some(error => error)) {
        return;
      }
    }
    
    setActiveStep(activeStep + 1);
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Final validation
    if (images.length === 0) {
      alert('Please upload at least one image');
      return;
    }
    
    // Submit form data
    console.log('Submitting:', { ...formData, availability, images });
    // Here you would typically send the data to your backend
    alert('Listing created successfully!');
  };

  // Steps for the stepper
  const steps = ['Basic Information', 'Pricing & Location', 'Availability', 'Review & Publish'];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
          Create a New Listing
        </Typography>
        
        {/* Stepper */}
        <Paper elevation={2} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Form Content */}
        <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, mb: 4, borderRadius: 2 }}>
          {/* Step 1: Basic Information */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Tell us about your item
              </Typography>
              
              <Grid container spacing={3}>
                {/* Title */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Listing Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    error={errors.title}
                    helperText={errors.title ? 'Title is required' : 'Make it descriptive (e.g., "Professional DSLR Camera with Lenses")'}
                    variant="outlined"
                  />
                </Grid>
                
                {/* Category */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      label="Category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.value} value={category.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {category.icon}
                            <Box sx={{ ml: 1 }}>{category.label}</Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category && <FormHelperText>Category is required</FormHelperText>}
                  </FormControl>
                </Grid>
                
                {/* Condition */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Item Condition</InputLabel>
                    <Select
                      label="Item Condition"
                      name="itemCondition"
                      value={formData.itemCondition}
                      onChange={handleChange}
                    >
                      {conditions.map((condition) => (
                        <MenuItem key={condition.value} value={condition.value}>
                          {condition.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    error={errors.description}
                    helperText={errors.description ? 'Description is required' : 'Include details about features, specifications, and any included accessories'}
                    variant="outlined"
                    multiline
                    rows={4}
                  />
                </Grid>
                
                {/* Images Upload */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, mb: 1 }}>
                    Photos
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Upload at least 3 photos. First image will be the cover photo.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                    {images.map((image, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <Avatar
                          variant="rounded"
                          src={image.preview}
                          sx={{ width: 100, height: 100 }}
                        />
                        <IconButton
                          size="small"
                          sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            right: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(0,0,0,0.7)'
                            }
                          }}
                          onClick={() => handleRemoveImage(index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        {index === 0 && (
                          <Chip 
                            label="Cover" 
                            size="small" 
                            color="primary" 
                            sx={{ 
                              position: 'absolute', 
                              bottom: 5, 
                              left: 5 
                            }} 
                          />
                        )}
                      </Box>
                    ))}
                    
                    {images.length < 10 && (
                      <Button
                        variant="outlined"
                        component="label"
                        sx={{ 
                          width: 100, 
                          height: 100,
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <AddPhotoIcon />
                        <Typography variant="caption">Add Photo</Typography>
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                        />
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Step 2: Pricing & Location */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Set your price and location
              </Typography>
              
              <Grid container spacing={3}>
                {/* Price */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Daily Price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    error={errors.price}
                    helperText={errors.price ? 'Price must be greater than 0' : 'Set your daily rental rate'}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <MoneyIcon color="action" sx={{ mr: 1 }} />
                      )
                    }}
                  />
                </Grid>
                
                {/* Location */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    error={errors.location}
                    helperText={errors.location ? 'Location is required' : 'Where will renters pick up the item?'}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <LocationIcon color="action" sx={{ mr: 1 }} />
                      )
                    }}
                  />
                </Grid>
                
                {/* Delivery Options */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                    Delivery Options
                  </Typography>
                  <FormGroup>
                    {deliveryOptions.map((option) => (
                      <FormControlLabel
                        key={option}
                        control={
                          <Checkbox 
                            checked={formData.deliveryOptions.includes(option)}
                            onChange={() => handleCheckboxChange('deliveryOptions', option)}
                          />
                        }
                        label={option}
                      />
                    ))}
                  </FormGroup>
                </Grid>
                
                {/* Rules */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                    Rental Rules
                  </Typography>
                  <FormGroup>
                    {rulesOptions.map((rule) => (
                      <FormControlLabel
                        key={rule}
                        control={
                          <Checkbox 
                            checked={formData.rules.includes(rule)}
                            onChange={() => handleCheckboxChange('rules', rule)}
                          />
                        }
                        label={rule}
                      />
                    ))}
                  </FormGroup>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Step 3: Availability */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Set availability
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={availability.alwaysAvailable}
                        onChange={(e) => setAvailability({
                          ...availability,
                          alwaysAvailable: e.target.checked
                        })}
                      />
                    }
                    label="This item is always available (no specific dates needed)"
                  />
                </Grid>
                
                {!availability.alwaysAvailable && (
                  <>
                    <Grid item xs={12} md={6}>
                      <DatePicker
                        label="Available from"
                        value={availability.startDate}
                        onChange={(newValue) => setAvailability({
                          ...availability,
                          startDate: newValue
                        })}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            fullWidth 
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <EventIcon color="action" sx={{ mr: 1 }} />
                              )
                            }}
                          />
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <DatePicker
                        label="Available until"
                        value={availability.endDate}
                        onChange={(newValue) => setAvailability({
                          ...availability,
                          endDate: newValue
                        })}
                        minDate={availability.startDate}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            fullWidth 
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <EventIcon color="action" sx={{ mr: 1 }} />
                              )
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          )}

          {/* Step 4: Review & Publish */}
          {activeStep === 3 && (
            <Box>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Review your listing
              </Typography>
              
              <Grid container spacing={4}>
                {/* Left Column - Listing Details */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Listing Details
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formData.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {categories.find(c => c.value === formData.category)?.label} • {conditions.find(c => c.value === formData.itemCondition)?.label}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formData.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {images.slice(0, 3).map((image, index) => (
                      <Avatar
                        key={index}
                        variant="rounded"
                        src={image.preview}
                        sx={{ width: 80, height: 80 }}
                      />
                    ))}
                    {images.length > 3 && (
                      <Avatar
                        variant="rounded"
                        sx={{ width: 80, height: 80, bgcolor: 'grey.200' }}
                      >
                        +{images.length - 3}
                      </Avatar>
                    )}
                  </Box>
                </Grid>
                
                {/* Right Column - Pricing & Availability */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Pricing
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    ${formData.price} <Typography component="span" variant="body2" color="text.secondary">per day</Typography>
                  </Typography>
                  
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
                    Location
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formData.location}
                  </Typography>
                  
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
                    Availability
                  </Typography>
                  {availability.alwaysAvailable ? (
                    <Typography variant="body1">Always available</Typography>
                  ) : (
                    <Typography variant="body1">
                      {availability.startDate?.toLocaleDateString() || 'Not set'} to {availability.endDate?.toLocaleDateString() || 'Not set'}
                    </Typography>
                  )}
                  
                  {formData.deliveryOptions.length > 0 && (
                    <>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
                        Delivery Options
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {formData.deliveryOptions.map((option, index) => (
                          <Chip key={index} label={option} size="small" />
                        ))}
                      </Box>
                    </>
                  )}
                  
                  {formData.rules.length > 0 && (
                    <>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
                        Rental Rules
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {formData.rules.map((rule, index) => (
                          <Chip key={index} label={rule} size="small" />
                        ))}
                      </Box>
                    </>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<BackIcon />}
            sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              endIcon={<CheckIcon />}
              size="large"
            >
              Publish Listing
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<NextIcon />}
              size="large"
            >
              Next
            </Button>
          )}
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default PostListing;