import React, { useState } from 'react';
import {
  Box,  Container,  Typography,  Grid,  TextField,  Button,  Card,
  CardContent,  Divider,  Chip,  useTheme,  useMediaQuery,  Paper,  Link
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Schedule as HoursIcon,
  Send as SendIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import Navbar from '../components/common/Navbar/Navbar';
import Footer from '../components/common/Footer/Footer';

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    submitted: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, submitted: false, error: null });
    
    // Simulate API call
    setTimeout(() => {
      // Replace with actual API call in production
      try {
        // If successful:
        setFormStatus({ submitting: false, submitted: true, error: null });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } catch (err) {
        setFormStatus({ submitting: false, submitted: false, error: err.message });
      }
    }, 1500);
  };

  const contactMethods = [
    {
      icon: <EmailIcon color="primary" fontSize="large" />,
      title: "Email Us",
      value: "support@hiringwebapp.com",
      action: "mailto:support@hiringwebapp.com"
    },
    {
      icon: <PhoneIcon color="primary" fontSize="large" />,
      title: "Call Us",
      value: "+1 (555) 123-4567",
      action: "tel:+15551234567"
    },
    {
      icon: <LocationIcon color="primary" fontSize="large" />,
      title: "Visit Us",
      value: "123 Business Ave, Suite 400\nTech City, TC 10001",
      action: "https://maps.google.com"
    },
    {
      icon: <HoursIcon color="primary" fontSize="large" />,
      title: "Business Hours",
      value: "Monday - Friday: 9am - 6pm\nSaturday: 10am - 4pm\nSunday: Closed"
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Navbar />
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Contact Us
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          We'd love to hear from you! Reach out with questions, feedback, or partnership inquiries.
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Contact Form Column */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            {formStatus.submitted ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <SuccessIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                  Thank You for Your Message!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  We've received your inquiry and will respond within 24 hours.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setFormStatus({ submitting: false, submitted: false, error: null })}
                >
                  Send Another Message
                </Button>
              </Box>
            ) : (
              <>
                <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
                  Send Us a Message
                </Typography>
                
                {formStatus.error && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    mb: 3,
                    p: 2,
                    backgroundColor: theme.palette.error.light,
                    borderRadius: 1
                  }}>
                    <ErrorIcon color="error" />
                    <Typography color="error">
                      {formStatus.error}
                    </Typography>
                  </Box>
                )}

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Your Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        multiline
                        rows={4}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        endIcon={<SendIcon />}
                        disabled={formStatus.submitting}
                        sx={{ py: 1.5, px: 4 }}
                      >
                        {formStatus.submitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </>
            )}
          </Paper>
        </Grid>

        {/* Contact Info Column */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 3 }}>
            {/* Contact Methods */}
            <Card elevation={3} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
                  Contact Information
                </Typography>
                
                <Grid container spacing={3}>
                  {contactMethods.map((method, index) => (
                    <Grid item xs={12} sm={6} md={12} key={index}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ mt: 0.5 }}>
                          {method.icon}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {method.title}
                          </Typography>
                          {method.action ? (
                            <Link 
                              href={method.action} 
                              color="text.primary" 
                              underline="hover"
                              sx={{ whiteSpace: 'pre-line' }}
                            >
                              {method.value}
                            </Link>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                              {method.value}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* FAQ/Support */}
            <Card elevation={3} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
                  Need Help?
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Check out our <Link href="/faq" color="primary">FAQ section</Link> for answers to common questions.
                </Typography>
                <Chip 
                  label="Live Chat Available" 
                  color="success" 
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            {/* <Box sx={{ 
              height: 250, 
              backgroundColor: theme.palette.grey[200],
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <Typography color="text.secondary">
                [Interactive Map Would Appear Here]
              </Typography>
            </Box> */}
          </Box>
        </Grid>
      </Grid>

      {/* Team Contact Section */}
      {/* {!isMobile && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: 4, fontWeight: 700 }}>
            Contact Our Team Directly
          </Typography>
          <Grid container spacing={3}>
            {[
              { name: 'Sales Team', email: 'sales@hiringwebapp.com', description: 'For partnership and business inquiries' },
              { name: 'Support Team', email: 'support@hiringwebapp.com', description: 'For technical issues and account help' },
              { name: 'Press Inquiries', email: 'press@hiringwebapp.com', description: 'For media and publicity questions' }
            ].map((team, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3
                  }
                }}>
                  <Box sx={{ 
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.light,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}>
                    <EmailIcon color="primary" fontSize="large" />
                  </Box>
                  <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                    {team.name}
                  </Typography>
                  <Link 
                    href={`mailto:${team.email}`} 
                    color="primary" 
                    sx={{ mb: 2, fontWeight: 500 }}
                  >
                    {team.email}
                  </Link>
                  <Typography variant="body2" color="text.secondary">
                    {team.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
          
        </Box>
        
      )} */}
      <Footer />
    </Container>
  );
};

export default Contact;