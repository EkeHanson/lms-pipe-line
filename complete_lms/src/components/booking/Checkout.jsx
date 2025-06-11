import React, { useState } from 'react';
import { 
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  CalendarToday as DateIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Mock booking data - replace with actual data from your state/API
  const bookingDetails = {
    item: {
      id: 'ITM-2023-0456',
      name: 'Professional Camera Kit',
      image: '/assets/listings/camera.jpg',
      dailyRate: 89.00,
      deposit: 200.00,
      owner: 'Alex Johnson'
    },
    dates: {
      start: 'June 15, 2023',
      end: 'June 20, 2023',
      days: 5
    },
    location: '123 Main St, New York, NY',
    subtotal: 445.00,
    serviceFee: 44.50,
    insurance: 25.00,
    total: 514.50
  };

  const steps = ['Rental Details', 'Payment Method', 'Review & Confirm'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleTermsChange = (event) => {
    setAgreeToTerms(event.target.checked);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Rental Period
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  value={bookingDetails.dates.start}
                  InputProps={{
                    startAdornment: <DateIcon color="action" sx={{ mr: 1 }} />,
                    readOnly: true
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  value={bookingDetails.dates.end}
                  InputProps={{
                    startAdornment: <DateIcon color="action" sx={{ mr: 1 }} />,
                    readOnly: true
                  }}
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
              Pickup Location
            </Typography>
            <TextField
              fullWidth
              value={bookingDetails.location}
              InputProps={{
                startAdornment: <LocationIcon color="action" sx={{ mr: 1 }} />,
                readOnly: true
              }}
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
              Contact Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  defaultValue="John"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  defaultValue="Doe"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  defaultValue="john.doe@example.com"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Phone Number"
                  type="tel"
                  defaultValue="(555) 123-4567"
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Select Payment Method
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="payment method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={handlePaymentChange}
              >
                <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                  <FormControlLabel
                    value="credit"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CreditCardIcon sx={{ mr: 1 }} />
                        Credit/Debit Card
                      </Box>
                    }
                  />
                  {paymentMethod === 'credit' && (
                    <Box sx={{ ml: 4, mt: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            label="Card Number"
                            placeholder="1234 5678 9012 3456"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            label="Expiration Date"
                            placeholder="MM/YY"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            label="CVV"
                            placeholder="123"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            label="Name on Card"
                            placeholder="John Doe"
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Paper>

                <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                  <FormControlLabel
                    value="paypal"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PaymentIcon sx={{ mr: 1 }} />
                        PayPal
                      </Box>
                    }
                  />
                </Paper>

                <Paper elevation={2} sx={{ p: 2 }}>
                  <FormControlLabel
                    value="bank"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ReceiptIcon sx={{ mr: 1 }} />
                        Bank Transfer
                      </Box>
                    }
                  />
                </Paper>
              </RadioGroup>
            </FormControl>

            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={agreeToTerms}
                    onChange={handleTermsChange}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the Terms of Service and Rental Agreement
                  </Typography>
                }
              />
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Order Summary
            </Typography>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={bookingDetails.item.image} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={bookingDetails.item.name}
                    secondary={`Hosted by ${bookingDetails.item.owner}`}
                  />
                  <Chip 
                    label={`${bookingDetails.dates.days} days`} 
                    color="primary" 
                    variant="outlined"
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <List dense>
                <ListItem>
                  <ListItemText primary="Subtotal" />
                  <Typography>${bookingDetails.subtotal.toFixed(2)}</Typography>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Service Fee" />
                  <Typography>${bookingDetails.serviceFee.toFixed(2)}</Typography>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Damage Deposit" />
                  <Typography>${bookingDetails.item.deposit.toFixed(2)}</Typography>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Insurance" />
                  <Typography>${bookingDetails.insurance.toFixed(2)}</Typography>
                </ListItem>
                <Divider sx={{ my: 1 }} />
                <ListItem>
                  <ListItemText 
                    primary="Total" 
                    primaryTypographyProps={{ fontWeight: 700 }}
                  />
                  <Typography variant="h6" fontWeight={700}>
                    ${bookingDetails.total.toFixed(2)}
                  </Typography>
                </ListItem>
              </List>
            </Paper>

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Payment Method
            </Typography>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <Typography>
                {paymentMethod === 'credit' && 'Credit/Debit Card ending in •••• 4242'}
                {paymentMethod === 'paypal' && 'PayPal'}
                {paymentMethod === 'bank' && 'Bank Transfer'}
              </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Contact Information
            </Typography>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography>John Doe</Typography>
              <Typography>john.doe@example.com</Typography>
              <Typography>(555) 123-4567</Typography>
            </Paper>
          </Box>
        );
      default:
        throw new Error('Unknown step');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
      {/* Header with Stepper */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ fontWeight: 700, mb: 2 }}
        >
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
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
        {getStepContent(activeStep)}
      </Paper>

      {/* Navigation Buttons */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        flexDirection: isMobile ? 'column-reverse' : 'row',
        gap: 2
      }}>
        <Button
          variant="outlined"
          size="large"
          onClick={activeStep === 0 ? () => window.history.back() : handleBack}
          startIcon={<BackIcon />}
          sx={{
            flex: isMobile ? 1 : 'none',
            width: isMobile ? '100%' : 'auto'
          }}
        >
          {activeStep === 0 ? 'Back to Listing' : 'Previous'}
        </Button>
        
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/booking-confirmed"
            disabled={!agreeToTerms}
            endIcon={<CheckIcon />}
            sx={{
              flex: isMobile ? 1 : 'none',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            Confirm Booking
          </Button>
        ) : (
          <Button
            variant="contained"
            size="large"
            onClick={handleNext}
            sx={{
              flex: isMobile ? 1 : 'none',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            Next
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default Checkout;