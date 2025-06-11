import React, { useState } from 'react';
import { 
  Box, Container, Typography, Button, Grid, 
  Card, CardContent, CardMedia, Chip 
} from '@mui/material';
import { Star as StarIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import Navbar from '../components/common/Navbar/Navbar';
import Footer from '../components/common/Footer/Footer';
// import Logo from "../../../assets/Gold Logo Mockup.jpg"
import image1 from '../assets/facebook.png'
import image2 from '../assets/tesla.png'
import image3 from '../assets/renting.jpg'
import image4 from '../assets/toyota.png'
const Features = ({ theme }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Photography': return { bg: '#E8F0FE', text: '#4285F4' };
      case 'Events': return { bg: '#E6F4EA', text: '#34A853' };
      case 'Sports': return { bg: '#FCE8E6', text: '#EA4335' };
      default: return { bg: '#F3E5F5', text: '#9E69AF' };
    }
  };

  const listings = [
    {
      id: 1,
      title: 'Professional Camera Kit',
      price: 89,
      rating: 4.8,
      reviews: 124,
      location: 'New York, NY',
      image: {image1},
      // image: '../assets/Gold Logo Mockup.jpg',
      category: 'Photography'
    },
    {
      id: 2,
      title: 'Luxury Party Tent',
      price: 250,
      rating: 4.9,
      reviews: 87,
      location: 'Los Angeles, CA',
      image: {image2},
      category: 'Events'
    },
    {
      id: 3,
      title: 'Mountain Bike',
      price: 45,
      rating: 4.7,
      reviews: 56,
      location: 'Denver, CO',
      image: {image3},
      category: 'Sports'
    },
    {
      id: 4,
      title: 'DJ Sound System',
      price: 150,
      rating: 4.9,
      reviews: 98,
      location: 'Miami, FL',
      image: {image4},
      category: 'Entertainment'
    },
    {
      id: 5,
      title: 'Wedding Gown',
      price: 120,
      rating: 4.8,
      reviews: 76,
      location: 'San Francisco, CA',
      image: {image1},
      category: 'Fashion'
    },
    {
      id: 6,
      title: '4K Drone',
      price: 99,
      rating: 4.7,
      reviews: 63,
      location: 'Seattle, WA',
      image: {image4},
      category: 'Photography'
    },
    {
      id: 7,
      title: 'Camping Gear Set',
      price: 80,
      rating: 4.6,
      reviews: 45,
      location: 'Austin, TX',
      image: {image4},
      category: 'Outdoor'
    },
    {
      id: 8,
      title: 'Gaming Console',
      price: 60,
      rating: 4.9,
      reviews: 150,
      location: 'Chicago, IL',
      image: {image3},
      category: 'Entertainment'
    },
    {
      id: 9,
      title: 'Professional Lighting Kit',
      price: 110,
      rating: 4.7,
      reviews: 90,
      location: 'Las Vegas, NV',
      image: {image1},
      category: 'Photography'
    },
    {
      id: 10,
      title: 'Luxury Car Rental',
      price: 300,
      rating: 4.9,
      reviews: 220,
      location: 'Houston, TX',
      image: {image2},
      category: 'Automobile'
    },
    {
      id: 11,
      title: 'Electric Scooter',
      price: 50,
      rating: 4.6,
      reviews: 75,
      location: 'Orlando, FL',
      image: {image4},
      category: 'Transport'
    },
    {
      id: 12,
      title: 'Home Projector',
      price: 70,
      rating: 4.8,
      reviews: 134,
      location: 'San Diego, CA',
      image: {image2},
      category: 'Electronics'
    },
    {
      id: 13,
      title: 'Kayak Boat',
      price: 90,
      rating: 4.7,
      reviews: 48,
      location: 'Portland, OR',
      image: {image1},
      category: 'Water Sports'
    },
    {
      id: 14,
      title: 'VR Headset',
      price: 55,
      rating: 4.9,
      reviews: 88,
      location: 'Boston, MA',
      image: {image1},
      category: 'Gaming'
    },
    {
      id: 15,
      title: 'Catering Equipment',
      price: 200,
      rating: 4.7,
      reviews: 112,
      location: 'Philadelphia, PA',
      image: {image2},
      category: 'Events'
    },
    {
      id: 16,
      title: 'Motorcycle Rental',
      price: 120,
      rating: 4.8,
      reviews: 95,
      location: 'Phoenix, AZ',
      image: {image3},
      category: 'Transport'
    },
    {
      id: 17,
      title: 'Snowboard Set',
      price: 65,
      rating: 4.6,
      reviews: 52,
      location: 'Salt Lake City, UT',
      image: {image4},
      category: 'Winter Sports'
    },
    {
      id: 18,
      title: 'Power Tools Set',
      price: 75,
      rating: 4.9,
      reviews: 78,
      location: 'Dallas, TX',
      image: {image3},
      category: 'DIY & Tools'
    },
    {
      id: 19,
      title: 'Music Instrument Set',
      price: 130,
      rating: 4.8,
      reviews: 83,
      location: 'Nashville, TN',
      image: {image2},
      category: 'Music'
    },
    {
      id: 20,
      title: 'Fishing Boat',
      price: 175,
      rating: 4.7,
      reviews: 67,
      location: 'Tampa, FL',
      image: {image1},
      category: 'Water Sports'
    }
  ];

  const loadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  
  const totalPages = Math.ceil(listings.length / itemsPerPage);
  const currentItems = listings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  return (
    <>
    <Navbar />
    <Box sx={{ 
      py: 10,
      backgroundColor: '#f8f9fa',
      position: 'relative'
    }}>
       

      <Container maxWidth="xl">
        <Box sx={{ 
          textAlign: 'center',
          mb: 8
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
            Featured Listings
          </Typography>
          <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
            Showing {currentItems.length} of {listings.length} items
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          alignItems: 'stretch'
        }}>
          {currentItems.map((item) => {
            const categoryColor = getCategoryColor(item.category);
            return (
              <Grid item key={item.id} sx={{
                display: 'flex',
                flexDirection: 'column'
              }}>

                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)'
                  }
                }}>
                  <Box sx={{
                    height: 220,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <CardMedia
                      component="img"
                      image={item.image}
                      alt={item.title}
                      sx={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                      
                    />
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      backgroundColor: categoryColor.text
                    }} />
                  </Box>
                  <CardContent sx={{ 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Chip 
                      label={item.category} 
                      size="small" 
                      sx={{ 
                        mb: 2,
                        alignSelf: 'flex-start',
                        backgroundColor: categoryColor.bg,
                        color: categoryColor.text,
                        fontWeight: 600
                      }}
                    />
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      component="h3"
                      sx={{ 
                        fontWeight: 600,
                        color: theme.palette.primary.dark,
                        mb: 1.5
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1.5,
                      flexGrow: 1
                    }}>
                      <LocationIcon fontSize="small" sx={{ 
                        color: theme.palette.text.secondary,
                        mr: 1 
                      }} />
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        {item.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <StarIcon fontSize="small" sx={{ 
                          color: '#FFC107',
                          mr: 0.5 
                        }} />
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          {item.rating}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        ({item.reviews} reviews)
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          mt: 8,
          gap: 2,
          alignItems: 'center'
        }}>
          <Button 
            variant="outlined"
            size="large"
            onClick={prevPage}
            disabled={currentPage === 1}
            sx={{
              px: 4,
              fontWeight: 600,
              borderWidth: 2,
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                borderWidth: 2,
                backgroundColor: 'rgba(25, 118, 210, 0.04)'
              },
              '&:disabled': {
                borderColor: theme.palette.grey[400],
                color: theme.palette.grey[400]
              }
            }}
          >
            Previous
          </Button>
          
          <Typography variant="body1" sx={{ mx: 2 }}>
            Page {currentPage} of {totalPages}
          </Typography>
          
          <Button 
            variant="contained"
            size="large"
            onClick={nextPage}
            disabled={currentPage === totalPages}
            sx={{
              px: 4,
              fontWeight: 600,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              },
              '&:disabled': {
                backgroundColor: theme.palette.grey[400]
              }
            }}
          >
            Next
          </Button>
        </Box>
      </Container>
       
    </Box>
    <Footer />
    </>
  );
};

export default Features;