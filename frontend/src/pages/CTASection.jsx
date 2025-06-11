// src/components/CTASection.js
import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';

const CTASection = ({ theme }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={{ 
        py: 10,
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        color: 'white',
        textAlign: 'center'
      }}>
        <Container maxWidth="sm">
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 3
            }}
          >
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Join thousands of happy customers who rent what they need
          </Typography>
          <Stack 
            direction={isMobile ? "column" : "row"} 
            spacing={2} 
            justifyContent="center"
          >
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              sx={{ 
                px: 4,
                fontWeight: 600
              }}
            >
              Browse Listings
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              size="large"
              sx={{ 
                px: 4,
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2
                }
              }}
            >
              List Your Item
            </Button>
          </Stack>
        </Container>
      </Box>
  );
};

export default CTASection;