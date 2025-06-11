import React from 'react';
import { 
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Divider,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const BookingConfirmation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Mock booking data - replace with actual data from your state/API
  const bookingDetails = {
    id: 'BK-2023-05678',
    item: {
      name: 'Professional Camera Kit',
      image: '/assets/listings/camera.jpg',
      owner: 'Alex Johnson',
      ownerAvatar: '/assets/avatars/alex.jpg'
    },
    dates: {
      start: 'June 15, 2023',
      end: 'June 20, 2023',
      days: 5
    },
    location: '123 Main St, New York, NY',
    payment: {
      subtotal: 445.00,
      serviceFee: 44.50,
      total: 489.50,
      method: 'Visa ending in 4242'
    },
    contact: {
      email: 'user@example.com',
      phone: '(555) 123-4567'
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: isMobile ? 2 : 4 }}>
      {/* Success Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckIcon 
          sx={{ 
            fontSize: 80, 
            color: theme.palette.success.main,
            mb: 2
          }} 
        />
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: theme.palette.success.main
          }}
        >
          Booking Confirmed!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Your booking ID: <strong>{bookingDetails.id}</strong>
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          We've sent the details to {bookingDetails.contact.email}
        </Typography>
      </Box>

      {/* Main Content */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: isMobile ? 2 : 4,
          mb: 4,
          borderRadius: 2
        }}
      >
        <Grid container spacing={4}>
          {/* Left Column - Booking Summary */}
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h6" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                mb: 3
              }}
            >
              <CalendarIcon color="primary" sx={{ mr: 1 }} />
              Booking Summary
            </Typography>

            <Box sx={{ display: 'flex', mb: 3 }}>
              <Avatar
                variant="rounded"
                src={bookingDetails.item.image}
                sx={{ 
                  width: 80, 
                  height: 80,
                  mr: 2,
                  borderRadius: 1
                }}
              />
              <Box>
                <Typography variant="h6">{bookingDetails.item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Hosted by {bookingDetails.item.owner}
                </Typography>
                <Chip 
                  label="Upcoming" 
                  color="success" 
                  size="small" 
                  sx={{ mt: 1 }} 
                />
              </Box>
            </Box>

            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CalendarIcon color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Rental Period" 
                  secondary={`${bookingDetails.dates.start} to ${bookingDetails.dates.end} (${bookingDetails.dates.days} days)`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationIcon color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Pickup Location" 
                  secondary={bookingDetails.location}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Host" 
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Avatar 
                        src={bookingDetails.item.ownerAvatar} 
                        sx={{ width: 24, height: 24, mr: 1 }}
                      />
                      {bookingDetails.item.owner}
                    </Box>
                  }
                />
              </ListItem>
            </List>
          </Grid>

          {/* Right Column - Payment Details */}
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h6" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                mb: 3
              }}
            >
              <PaymentIcon color="primary" sx={{ mr: 1 }} />
              Payment Details
            </Typography>

            <List dense sx={{ mb: 3 }}>
              <ListItem>
                <ListItemText primary="Subtotal" />
                <Typography>${bookingDetails.payment.subtotal.toFixed(2)}</Typography>
              </ListItem>
              <ListItem>
                <ListItemText primary="Service Fee" />
                <Typography>${bookingDetails.payment.serviceFee.toFixed(2)}</Typography>
              </ListItem>
              <Divider sx={{ my: 1 }} />
              <ListItem>
                <ListItemText 
                  primary="Total" 
                  primaryTypographyProps={{ fontWeight: 700 }}
                />
                <Typography variant="h6" fontWeight={700}>
                  ${bookingDetails.payment.total.toFixed(2)}
                </Typography>
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Payment Method" 
                  secondary={bookingDetails.payment.method}
                />
              </ListItem>
            </List>

            <Typography 
              variant="h6" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                mt: 4
              }}
            >
              <EmailIcon color="primary" sx={{ mr: 1 }} />
              Contact Information
            </Typography>

            <List dense>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Email" 
                  secondary={bookingDetails.contact.email}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Phone" 
                  secondary={bookingDetails.contact.phone}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>

      {/* Next Steps */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: isMobile ? 2 : 4,
          mb: 4,
          borderRadius: 2,
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.contrastText
        }}
      >
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom
          sx={{ fontWeight: 700, mb: 3 }}
        >
          What's Next?
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ 
                bgcolor: 'background.paper', 
                color: theme.palette.primary.main,
                width: 56, 
                height: 56,
                mb: 1,
                mx: 'auto'
              }}>
                <EmailIcon />
              </Avatar>
              <Typography variant="body2">
                You'll receive a confirmation email with all details
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ 
                bgcolor: 'background.paper', 
                color: theme.palette.primary.main,
                width: 56, 
                height: 56,
                mb: 1,
                mx: 'auto'
              }}>
                <CalendarIcon />
              </Avatar>
              <Typography variant="body2">
                The host will contact you to arrange pickup details
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ 
                bgcolor: 'background.paper', 
                color: theme.palette.primary.main,
                width: 56, 
                height: 56,
                mb: 1,
                mx: 'auto'
              }}>
                <PhoneIcon />
              </Avatar>
              <Typography variant="body2">
                Contact the host if you have any questions
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ 
                bgcolor: 'background.paper', 
                color: theme.palette.primary.main,
                width: 56, 
                height: 56,
                mb: 1,
                mx: 'auto'
              }}>
                <HomeIcon />
              </Avatar>
              <Typography variant="body2">
                Manage your booking in your dashboard
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 2
      }}>
        <Button
          variant="outlined"
          size="large"
          component={Link}
          to="/listings"
          startIcon={<BackIcon />}
          sx={{
            flex: isMobile ? 1 : 'none',
            width: isMobile ? '100%' : 'auto'
          }}
        >
          Browse More Listings
        </Button>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/dashboard"
          sx={{
            flex: isMobile ? 1 : 'none',
            width: isMobile ? '100%' : 'auto'
          }}
        >
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default BookingConfirmation;