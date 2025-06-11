// src/components/HowItWorks.js
import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

const HowItWorks = ({ theme }) => {
  const steps = [
    {
      icon: <SearchIcon fontSize="large" />,
      title: "Search",
      description: "Find the perfect item for your needs"
    },
    {
      icon: <CalendarIcon fontSize="large" />,
      title: "Book",
      description: "Select your dates and make a reservation"
    },
    {
      icon: <CheckIcon fontSize="large" />,
      title: "Enjoy",
      description: "Use the item and return when done"
    }
  ];

  return (
    <Box sx={{ 
      py: 10,
      backgroundColor: '#f8f9fa',
      color: theme.palette.text.primary,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          textAlign: 'center',
          mb: 8,
          position: 'relative',
          zIndex: 1
        }}>
          <Typography 
            variant="h4" 
            component="h2"
            sx={{ 
              fontWeight: 700,
              mb: 2,
              color: theme.palette.primary.dark,
              position: 'relative',
              display: 'inline-block',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 3,
                backgroundColor: '#FFC107'
              }
            }}
          >
            How It Works
          </Typography>
          <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
            Simple steps to get what you need
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                borderTop: `4px solid ${['#4285F4', '#34A853', '#EA4335'][index]}`,
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.12)'
                }
              }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: '#FFF8E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  color: '#FFA000',
                  border: `2px solid #FFC107`
                }}>
                  {React.cloneElement(step.icon, { fontSize: "large" })}
                </Box>
                
                <Typography variant="h5" component="h3" sx={{ 
                  fontWeight: 600,
                  mb: 2,
                  color: theme.palette.primary.dark
                }}>
                  {step.title}
                </Typography>
                
                <Typography variant="body1" sx={{ 
                  color: theme.palette.text.secondary,
                  mb: 3
                }}>
                  {step.description}
                </Typography>
                
                <Box sx={{ 
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: '#FFC107',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.1rem'
                }}>
                  {index + 1}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Decorative elements */}
        <Box sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,193,7,0.1) 0%, rgba(255,193,7,0) 70%)'
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(66,133,244,0.1) 0%, rgba(66,133,244,0) 70%)'
        }} />
      </Container>
    </Box>
  );
};

export default HowItWorks;