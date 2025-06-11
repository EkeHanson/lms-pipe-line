import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Divider,
  Paper,
  Tabs,
  Tab,
  TextField,
  Avatar,
  Rating,
  useTheme,
  useMediaQuery,
  IconButton,
  Dialog,
  DialogContent,
  Skeleton
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as PriceIcon,
  Person as PersonIcon,
  Verified as VerifiedIcon,
  Image as ImageIcon,
  ChatBubble as ChatIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const ListingDetails = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample listing data
  const listing = {
    id: 1,
    title: 'Professional Camera Kit',
    description: 'High-end DSLR camera with multiple lenses and accessories for professional photography. Perfect for weddings, events, or commercial shoots. Includes Canon EOS R5 body, 24-70mm f/2.8 lens, 70-200mm f/2.8 lens, tripod, flash, and carrying case.',
    price: 89,
    rating: 4.8,
    reviewCount: 124,
    location: 'New York, NY',
    category: 'Photography Equipment',
    availability: [
      { start: '2023-06-10', end: '2023-06-15' },
      { start: '2023-06-20', end: '2023-06-25' },
      { start: '2023-07-01', end: '2023-07-10' }
    ],
    images: [
      '/assets/listings/camera-1.jpg',
      '/assets/listings/camera-2.jpg',
      '/assets/listings/camera-3.jpg',
      '/assets/listings/camera-4.jpg'
    ],
    features: [
      '42.1MP Full-Frame CMOS Sensor',
      '8K Video Recording',
      'In-Body Image Stabilization',
      'Weather-Sealed Body',
      'Includes 3 Lenses',
      'Professional Flash'
    ],
    owner: {
      name: 'Alex Johnson',
      avatar: '/assets/users/alex.jpg',
      joined: 'March 2021',
      rating: 4.9,
      reviewCount: 87,
      verified: true
    },
    reviews: [
      {
        id: 1,
        user: 'Sarah Miller',
        avatar: '/assets/users/sarah.jpg',
        rating: 5,
        date: '2023-05-15',
        comment: 'Excellent camera kit! Everything was in perfect condition and Alex was very helpful with setup instructions.'
      },
      {
        id: 2,
        user: 'Michael Chen',
        avatar: '/assets/users/michael.jpg',
        rating: 4,
        date: '2023-04-22',
        comment: 'Great equipment for my photo shoot. Only minor issue was the battery life, but Alex provided two extra batteries.'
      }
    ]
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenImageDialog(true);
  };

  const calculateTotal = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays * listing.price;
    }
    return 0;
  };

  const handleBookNow = () => {
    setLoading(true);
    // Simulate booking process
    setTimeout(() => {
      setLoading(false);
      // Redirect to booking confirmation or show success message
    }, 1500);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Navigation */}
      <Button 
        startIcon={<BackIcon />} 
        sx={{ mb: 2 }}
        onClick={() => window.history.back()}
      >
        Back to Listings
      </Button>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Column - Images and Details */}
        <Grid item xs={12} md={8}>
          {/* Image Gallery */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    height={isMobile ? 300 : 400}
                    image={listing.images[0]}
                    alt={listing.title}
                    onClick={() => handleImageClick(listing.images[0])}
                    sx={{
                      cursor: 'pointer',
                      objectFit: 'cover'
                    }}
                  />
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {listing.images.slice(1).map((image, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <CardMedia
                          component="img"
                          height={100}
                          image={image}
                          alt={`${listing.title} ${index + 2}`}
                          onClick={() => handleImageClick(image)}
                          sx={{
                            cursor: 'pointer',
                            objectFit: 'cover'
                          }}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>

          {/* Listing Header */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                {listing.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton onClick={handleFavoriteClick}>
                  {isFavorite ? (
                    <FavoriteIcon color="error" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocationIcon fontSize="small" color="action" />
              <Typography variant="body1" color="text.secondary">
                {listing.location}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating
                value={listing.rating}
                precision={0.1}
                readOnly
                size="small"
              />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {listing.rating}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                ({listing.reviewCount} reviews)
              </Typography>
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant={isMobile ? 'scrollable' : 'standard'}
            >
              <Tab label="Description" />
              <Tab label="Features" />
              <Tab label={`Reviews (${listing.reviews.length})`} />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ mb: 4 }}>
            {activeTab === 0 && (
              <Typography variant="body1" paragraph>
                {listing.description}
              </Typography>
            )}
            {activeTab === 1 && (
              <Grid container spacing={2}>
                {listing.features.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon color="primary" fontSize="small" />
                      <Typography>{feature}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
            {activeTab === 2 && (
              <Box>
                {listing.reviews.map((review) => (
                  <Box key={review.id} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                      <Avatar src={review.avatar} alt={review.user} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {review.user}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating value={review.rating} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary">
                            {review.date}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ ml: 7 }}>
                      {review.comment}
                    </Typography>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))}
                <Button variant="outlined" sx={{ mt: 2 }}>
                  Leave a Review
                </Button>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Right Column - Booking Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 20 }}>
            <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
              ${listing.price} <Typography component="span" color="text.secondary">/ day</Typography>
            </Typography>

            {/* Date Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Select Dates
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={12}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: new Date().toISOString().split('T')[0] // Set min date to today
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={!startDate}
                    inputProps={{
                      min: startDate || new Date().toISOString().split('T')[0]
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Pricing Breakdown */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Pricing Breakdown
              </Typography>
              <Box sx={{ 
                backgroundColor: theme.palette.grey[100],
                borderRadius: 1,
                p: 2
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mb: 1
                }}>
                  <Typography variant="body2" color="text.secondary">
                    ${listing.price} x {startDate && endDate ? Math.ceil(Math.abs(new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) : 0} days
                  </Typography>
                  <Typography variant="body2">
                    ${calculateTotal()}
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mb: 1
                }}>
                  <Typography variant="body2" color="text.secondary">
                    Service Fee
                  </Typography>
                  <Typography variant="body2">
                    ${(calculateTotal() * 0.1).toFixed(2)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between'
                }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Total
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    ${(calculateTotal() * 1.1).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Book Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={!startDate || !endDate || loading}
              onClick={handleBookNow}
              sx={{ mb: 3, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Book Now'}
            </Button>

            {/* Owner Profile */}
            <Box sx={{ 
              borderTop: 1, 
              borderColor: 'divider',
              pt: 3
            }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                About the Owner
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Avatar src={listing.owner.avatar} alt={listing.owner.name} sx={{ width: 56, height: 56 }} />
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {listing.owner.name}
                    </Typography>
                    {listing.owner.verified && (
                      <VerifiedIcon color="primary" fontSize="small" />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Member since {listing.owner.joined}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={listing.owner.rating} size="small" readOnly />
                    <Typography variant="body2">
                      {listing.owner.rating} ({listing.owner.reviewCount})
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<ChatIcon />}
                sx={{ mt: 1 }}
              >
                Contact Owner
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Image Dialog */}
      <Dialog
        open={openImageDialog}
        onClose={() => setOpenImageDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <img 
            src={selectedImage} 
            alt="Listing preview" 
            style={{ 
              width: '100%', 
              height: 'auto',
              borderRadius: theme.shape.borderRadius
            }} 
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ListingDetails;