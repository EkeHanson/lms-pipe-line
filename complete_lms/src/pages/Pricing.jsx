import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Stack, Divider, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar/Navbar';
import Footer from '../components/common/Footer/Footer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import BoltIcon from '@mui/icons-material/Bolt';
import DiamondIcon from '@mui/icons-material/Diamond';

const Pricing = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const plans = [
    { 
      title: "Starter", 
      price: "$99", 
      period: "per month",
      features: ["Up to 100 students", "Basic scheduling", "Standard reports", "Email support"],
      cta: "Start Learning",
      icon: <StarIcon color="primary" fontSize="large" />,
      popular: false,
      color: 'primary'
    },
    { 
      title: "Professional", 
      price: "$199", 
      period: "per month",
      features: ["Up to 500 students", "Advanced analytics", "Financial tracking", "Priority support", "API access"],
      cta: "Get Professional",
      icon: <BoltIcon color="warning" fontSize="large" />,
      popular: true,
      color: 'warning'
    },
    { 
      title: "Enterprise", 
      price: "Custom", 
      period: "tailored solution",
      features: ["Unlimited students", "Custom integrations", "Dedicated account manager", "24/7 support", "White-label options"],
      cta: "Contact Sales",
      icon: <DiamondIcon color="secondary" fontSize="large" />,
      popular: false,
      color: 'secondary'
    }
  ];

  return (
    <Box sx={{ 
      backgroundColor: theme.palette.background.default, 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar />
      
      <Box sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        py: 10,
        color: 'white',
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 800, 
              mb: 2,
              fontSize: isMobile ? '2.5rem' : '3.5rem'
            }}
          >
            Simple, transparent pricing
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
            Choose the perfect plan for your educational needs. No hidden fees, cancel anytime.
          </Typography>
          
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            mb: 4
          }}>
            <Button variant="contained" color="secondary" size="large">
              Monthly
            </Button>
            <Button variant="outlined" color="inherit" size="large">
              Annual (Save 20%)
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ 
        py: 8,
        position: 'relative',
        mt: isMobile ? 0 : -8,
        zIndex: 1
      }}>
        <Grid 
          container 
          spacing={4} 
          justifyContent="center"
          alignItems="stretch"
        >
          {plans.map((plan, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              lg={4} 
              key={index}
              sx={{ 
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Card 
                sx={{ 
                  width: '100%',
                  maxWidth: 400,
                  borderRadius: 4,
                  boxShadow: theme.shadows[6],
                  border: plan.popular ? `2px solid ${theme.palette.warning.main}` : 'none',
                  transform: plan.popular ? 'scale(1.02)' : 'none',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: plan.popular ? 'scale(1.05)' : 'scale(1.03)'
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                {plan.popular && (
                  <Box sx={{
                    position: 'absolute',
                    top: 1,
                    right: 20,
                    backgroundColor: theme.palette.warning.main,
                    color: theme.palette.warning.contrastText,
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    Most Popular
                  </Box>
                )}
                
                <CardContent sx={{ 
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1
                }}>
                  <Box sx={{ 
                    textAlign: 'center',
                    mb: 3
                  }}>
                    {plan.icon}
                    <Typography variant="h5" sx={{ 
                      fontWeight: 700, 
                      mt: 1,
                      color: plan.popular ? theme.palette.warning.main : 'inherit'
                    }}>
                      {plan.title}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    textAlign: 'center',
                    mb: 4
                  }}>
                    <Typography variant="h3" sx={{ 
                      fontWeight: 800,
                      mb: 0
                    }}>
                      {plan.price}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {plan.period}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Stack spacing={2} sx={{ mb: 4, flexGrow: 1 }}>
                    {plan.features.map((feature, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon color="primary" sx={{ mr: 1.5 }} />
                        <Typography variant="body1">
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                  
                  <Box sx={{ 
                    mt: 'auto',
                    pt: 2,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: -32,
                      right: -32,
                      height: '1px',
                      backgroundColor: theme.palette.divider
                    }
                  }}>
                    <Button 
                      variant={plan.popular ? 'contained' : 'outlined'} 
                      color={plan.color}
                      size="large"
                      fullWidth
                      sx={{ 
                        py: 2,
                        borderRadius: 2,
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: plan.popular ? theme.shadows[4] : 'none',
                        '&:hover': {
                          boxShadow: plan.popular ? theme.shadows[6] : theme.shadows[2]
                        }
                      }} 
                      onClick={() => navigate(plan.title === 'Enterprise' ? '/contact' : '/signup')}
                    >
                      {plan.cta}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ 
          mt: 8,
          textAlign: 'center',
          backgroundColor: theme.palette.background.paper,
          borderRadius: 4,
          p: 4,
          boxShadow: theme.shadows[2]
        }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Not sure which plan is right for you?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
            Our education experts can help you choose the perfect solution for your institution's needs and budget.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ 
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: theme.shadows[4],
              '&:hover': {
                boxShadow: theme.shadows[6]
              }
            }} 
            onClick={() => navigate('/contact')}
          >
            Talk to an Expert
          </Button>
        </Box>
      </Container>
      
      <Box sx={{ 
        backgroundColor: theme.palette.grey[100],
        py: 6,
        borderTop: `1px solid ${theme.palette.divider}`
      }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Frequently Asked Questions
          </Typography>
          
          <Grid container spacing={3}>
            {[
              "Can I change plans later?",
              "Do you offer discounts for non-profits?",
              "What payment methods do you accept?",
              "Is there a setup fee?",
              "How does the free trial work?",
              "What's your cancellation policy?"
            ].map((question, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {question}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Pricing;