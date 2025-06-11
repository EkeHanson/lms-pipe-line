import React from 'react';
import { Box, Container, Typography, Paper, useTheme, Avatar, IconButton } from '@mui/material';
import { Star as StarIcon, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Testimonials = ({ isMobile }) => {
  const theme = useTheme(); // Get theme from hook

  // Custom arrow components as inner components to access theme
  const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <IconButton
        className={className}
        sx={{ 
          position: 'absolute',
          right: -40,
          zIndex: 1,
          color: theme.palette.primary.main,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)'
          }
        }}
        onClick={onClick}
      >
        <ArrowForwardIos fontSize="medium" />
      </IconButton>
    );
  };

  const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <IconButton
        className={className}
        sx={{ 
          position: 'absolute',
          left: -40,
          zIndex: 1,
          color: theme.palette.primary.main,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)'
          }
        }}
        onClick={onClick}
      >
        <ArrowBackIos fontSize="medium" />
      </IconButton>
    );
  };

  const testimonials = [
    {
      id: 1,
      quote: "This platform saved me so much money! I rented a professional camera for my vacation instead of buying one.",
      name: "Sarah Johnson",
      location: "New York, NY",
      rating: 5,
      avatar: "/assets/testimonials/user-1.jpg"
    },
    {
      id: 2,
      quote: "The rental process was seamless and the owner was very helpful. Will definitely use again!",
      name: "Michael Chen",
      location: "San Francisco, CA",
      rating: 5,
      avatar: "/assets/testimonials/user-2.jpg"
    },
    {
      id: 3,
      quote: "Found exactly what I needed at a fraction of the purchase price. Highly recommend!",
      name: "Emily Rodriguez",
      location: "Chicago, IL",
      rating: 4,
      avatar: "/assets/testimonials/user-3.jpg"
    },
    {
      id: 4,
      quote: "Great selection of items and easy booking process. Customer support was excellent.",
      name: "David Wilson",
      location: "Austin, TX",
      rating: 5,
      avatar: "/assets/testimonials/user-4.jpg"
    },
    {
      id: 5,
      quote: "Perfect solution for my one-time need. Saved me hundreds of dollars.",
      name: "Jessica Kim",
      location: "Seattle, WA",
      rating: 5,
      avatar: "/assets/testimonials/user-5.jpg"
    }
  ];
  const carouselSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: 1,
    autoplay: false,
    pauseOnHover: true,
    arrows: !isMobile,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    swipe: true,
    draggable: true,
    responsive: [
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 2,
          arrows: !isMobile
        }
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
          arrows: false
        }
      }
    ]
  };
 
  return (
    <Box sx={{ 
      py: 8, 
      backgroundColor: theme.palette.grey[50],
      position: 'relative',
      overflow: 'hidden'
    }}>
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
          What Our Customers Say
        </Typography>
        
        <Box sx={{ 
          position: 'relative',
          '& .slick-slider': {
            overflow: 'visible'
          },
          '& .slick-list': {
            overflow: 'visible',
            padding: '20px 0',
            margin: '0 -15px'
          },
          '& .slick-slide > div': {
            padding: '0 15px'
          },
          '& .slick-dots': {
            bottom: -40,
            '& li button:before': {
              fontSize: '12px',
              color: theme.palette.primary.main
            },
            '& li.slick-active button:before': {
              color: theme.palette.primary.main,
              opacity: 1
            }
          },
          '& .slick-arrow': {
            width: 40,
            height: 40,
            borderRadius: '50%',
            '&:before': {
              display: 'none'
            },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)'
            }
          }
        }}>
          <Slider {...carouselSettings}>
            {testimonials.map((testimonial) => (
              <Box key={testimonial.id}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    minHeight: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4
                    }
                  }}
                  >
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} color="warning" />
                    ))}
                    {testimonial.rating < 5 && (
                      [...Array(5 - testimonial.rating)].map((_, i) => (
                        <StarIcon key={i + testimonial.rating} color="disabled" />
                      ))
                    )}
                  </Box>
                  <Typography 
                    sx={{ 
                      mb: 3, 
                      fontStyle: 'italic',
                      flexGrow: 1,
                      fontSize: isMobile ? '0.9rem' : '1rem'
                    }}
                  >
                    "{testimonial.quote}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                    <Avatar 
                      src={testimonial.avatar} 
                      sx={{ 
                        width: 56, 
                        height: 56, 
                        mr: 2,
                        border: `2px solid ${theme.palette.primary.main}`
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.location}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            ))}
          </Slider>
        </Box>
      </Container>
    </Box>
  );
};

export default Testimonials;