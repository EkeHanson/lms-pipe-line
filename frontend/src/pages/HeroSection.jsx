// components/sections/HeroSection.jsx
import React, { useState } from 'react'
import { Box, Container, Typography, Grid, Paper, InputAdornment, TextField, Button } from '@mui/material';
import { Search as SearchIcon, LocationOn as LocationIcon } from '@mui/icons-material';

const HeroSection = ({ theme, isMobile }) => {
  return (
    <Box sx={{
      background: `linear-gradient(rgba(0, 0, 0, 0.6), url('/assets/hero-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      py: 15,
      textAlign: 'center'
    }}>
      <Container maxWidth="md">
        <Typography 
          variant={isMobile ? "h3" : "h2"} 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            mb: 3
          }}
        >
          Rent What You Need, When You Need It
        </Typography>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          component="p" 
          gutterBottom
          sx={{ 
            mb: 4,
            maxWidth: '700px',
            mx: 'auto'
          }}
        >
          Discover thousands of items available for rent in your area
        </Typography>
        
        <Box component="form" sx={{ maxWidth: '800px', mx: 'auto' }}>
          <Paper elevation={6} sx={{ p: 2, borderRadius: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="What are you looking for?"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    sx: { backgroundColor: 'white' }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Location"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon />
                      </InputAdornment>
                    ),
                    sx: { backgroundColor: 'white' }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ height: '56px' }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;