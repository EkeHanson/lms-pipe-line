// components/sections/CategoriesSection.jsx
import { Box, Container, Typography, Grid, Button } from '@mui/material';
// components/sections/HeroSection.jsx
import React, { useState } from 'react'
const CategoriesSection = ({ theme }) => {


  return (
    <Box sx={{ py: 8, backgroundColor: theme.palette.grey[50] }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h4" 
          component="h2" 
          align="center"
          sx={{ 
            fontWeight: 700,
            mb: 6
          }}
        >
          Popular Categories
        </Typography>
        <Grid container spacing={3}>
          {['Photography', 'Events', 'Tools', 'Sports', 'Electronics', 'Outdoors'].map((category, index) => (
            <Grid item xs={6} sm={4} md={2} key={index}>
              <Button
                fullWidth
                variant="outlined"
                sx={{ 
                  p: 3,
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText
                  }
                }}
              >
                <Box 
                  component="img" 
                  src={`/assets/categories/${category.toLowerCase()}.png`} 
                  alt={category}
                  sx={{ 
                    width: 60, 
                    height: 60,
                    mb: 1
                  }}
                />
                <Typography variant="subtitle1">{category}</Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CategoriesSection;