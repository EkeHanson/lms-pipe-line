import React, { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
// Add these imports at the top
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { 
  Box, Container, Typography, Button, Grid, Paper, Card, CardContent, CardMedia, 
  Avatar, Chip, Divider, IconButton, useScrollTrigger, Fade, Slide, Zoom,
  TextField, InputAdornment, SvgIcon, Tabs, Tab, Badge, Stack, styled
} from '@mui/material';
import { 
  Search, PlayCircle, Star, StarBorder, CheckCircle, 
  AccessTime, People, School, MenuBook, TrendingUp,
  Facebook, Twitter, LinkedIn, Instagram, YouTube,
  KeyboardArrowRight, KeyboardArrowDown
} from '@mui/icons-material';
import Navbar from '../components/common/Navbar/Navbar';
import Footer from '../components/common/Footer/Footer';
import Advertorial from './dashboard/AdminDashboard/Advertorial/Advertorial';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css';
import logo7 from '../assets/history.png'
import logo6 from '../assets/power.png'
import logo5 from '../assets/renting.jpg'
import logo4 from '../assets/facebook.png'
import logo2 from '../assets/tesla.png'
import logo3 from '../assets/toyota.png'
import logo1 from '../assets/amazon.png'

const Home = () => {
  const [value, setValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const carouselRef = useRef(null);
// Inside your component, add these hooks before the return statement
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  
  const testimonials = [
    {
      quote: "This platform transformed how we manage our school. The analytics alone have saved us hundreds of hours.",
      name: "Sarah Johnson",
      title: "Principal, Greenfield Academy",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "The most intuitive school management system I've used in my 20 years as an administrator.",
      name: "Michael Chen",
      title: "Director, Lakeside School District",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "Our teachers love the simplicity and our IT team loves the security features. A win-win!",
      name: "Emma Rodriguez",
      title: "Superintendent, City Public Schools",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg"
    },
    {
      quote: "Implementation was seamless and the training resources were exceptional.",
      name: "David Wilson",
      title: "IT Director, Charter Schools Network",
      avatar: "https://randomuser.me/api/portraits/men/65.jpg"
    }
  ];
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <ChevronRight color="primary" />,
    prevArrow: <ChevronLeft color="primary" />,
    responsive: [
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };


  // Replace your TestimonialCard with this styled component
  const TestimonialCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    margin: theme.spacing(0, 2),
    height: '100%',
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3]
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const categories = [
    { name: 'Development', icon: <School /> },
    { name: 'Business', icon: <TrendingUp /> },
    { name: 'Design', icon: <MenuBook /> },
    { name: 'Marketing', icon: <People /> }
  ];

  const courses = [
    {
      id: 1,
      title: 'Advanced React Patterns',
      instructor: 'Sarah Johnson',
      rating: 4.9,
      students: 12500,
      duration: '28 hours',
      price: 'NGN 1800009',
      discount: 'NGN 155,000',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      badge: 'Bestseller'
    },
    {
      id: 2,
      title: 'UX/UI Design Masterclass',
      instructor: 'Michael Chen',
      rating: 4.8,
      students: 8700,
      duration: '35 hours',
      price: 'NGN 140,0009',
      discount: 'NGN 135,000',
      image: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      badge: 'Hot'
    },
    {
      id: 3,
      title: 'Data Science Fundamentals',
      instructor: 'David Wilson',
      rating: 4.7,
      students: 15300,
      duration: '42 hours',
      price: 'NGN 170,000',
      discount: 'NGN 150,000',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      badge: 'New'
    },
    {
      id: 4,
      title: 'Digital Marketing Strategy',
      instructor: 'Emma Rodriguez',
      rating: 4.6,
      students: 9800,
      duration: '24 hours',
      price: 'NGN 100009',
      discount: 'NGN 90000',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    }
  ];



  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: 'background.default'
    }}>
      {/* Floating Action Button */}
      <Slide direction="up" in={!trigger} mountOnEnter unmountOnExit>
        <Box sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            startIcon={<PlayCircle />}
            sx={{
              borderRadius: 8,
              boxShadow: 4,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            Free Trial
          </Button>
        </Box>
      </Slide>

      {/* Animated Navbar */}
      <Navbar scrollTrigger={trigger} />

      {/* Hero Section with Parallax Effect */}
      <Box sx={{ 
        position: 'relative',
        height: '90vh',
        minHeight: 600,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'common.white',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
          zIndex: 1
        }
      }}>
        <Box 
          component="img"
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
          alt="Students learning"
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'brightness(0.8)'
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={isVisible} timeout={800}>
                <Box>
                  <Chip 
                    label="TRUSTED BY 500+ COMPANIES" 
                    color="secondary"
                    size="small"
                    sx={{ mb: 2, fontWeight: 'bold' }}
                  />
                  <Typography
                    variant="h1"
                    sx={{ 
                      fontWeight: 900,
                      fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                      lineHeight: 1.2,
                      mb: 3
                    }}
                  >
                    Unlock Your <Box component="span" sx={{ color: 'secondary.main' }}>Potential</Box> With Our Courses
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 4,
                      opacity: 0.9,
                      fontWeight: 300
                    }}
                  >
                    Join over 120 students advancing their careers with our expert-led courses and hands-on projects.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large"
                      endIcon={<KeyboardArrowRight />}
                      sx={{
                        borderRadius: 8,
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      Explore Courses
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="inherit" 
                      size="large"
                      sx={{
                        borderRadius: 8,
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      How It Works
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Zoom in={isVisible} timeout={1000}>
                <Card sx={{ 
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: 6,
                  maxWidth: 500,
                  ml: 'auto'
                }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image="https://images.unsplash.com/photo-1542621334-a254cf47733d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    alt="Online learning"
                  />
                  <CardContent sx={{ 
                    backgroundColor: 'background.paper',
                    p: 4
                  }}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Start Learning Today
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Search courses..."
                      variant="outlined"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 4 }
                      }}
                      sx={{ mb: 3 }}
                    />
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Popular Categories:
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {categories.map((category, index) => (
                          <Chip
                            key={index}
                            icon={category.icon}
                            label={category.name}
                            variant="outlined"
                            clickable
                            sx={{ borderRadius: 4 }}
                          />
                        ))}
                      </Stack>
                    </Box>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="secondary"
                      size="large"
                      sx={{
                        borderRadius: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      Get Personalized Recommendations
                    </Button>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Trust Badges */}
      <Box sx={{ 
        py: 4,
        backgroundColor: 'background.paper',
        boxShadow: 2,
        position: 'relative',
        zIndex: 10
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            {[logo1, logo2, logo3, logo4, logo5, logo6, logo7].map((logo, index) => (
              <Grid item key={index} xs={6} sm={4} md={2}>
                <Box 
                  component="img"
                  src={logo}
                  alt="Trusted company"
                  sx={{ 
                    height: 40,
                    width: '100%',
                    objectFit: 'contain',
                    filter: 'grayscale(100%)',
                    opacity: 0.7,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      filter: 'grayscale(0%)',
                      opacity: 1
                    }
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Courses Section */}
      <Box sx={{ py: 10, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" sx={{ 
              color: 'secondary.main',
              fontWeight: 'bold',
              letterSpacing: 1.5
            }}>
              LEARN NEW SKILLS
            </Typography>
            <Typography variant="h3" sx={{ 
              fontWeight: 'bold',
              mt: 1,
              mb: 3
            }}>
              Featured Courses
            </Typography>
            <Typography variant="subtitle1" sx={{ 
              maxWidth: 600,
              mx: 'auto',
              color: 'text.secondary'
            }}>
              Discover our most popular courses taught by industry experts
            </Typography>
          </Box>

          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ 
              mb: 6,
              '& .MuiTabs-indicator': {
                backgroundColor: 'secondary.main',
                height: 4,
                borderRadius: 2
              }
            }}
          >
            <Tab label="All Categories" />
            <Tab label="Development" />
            <Tab label="Business" />
            <Tab label="Design" />
            <Tab label="Marketing" />
            <Tab label="Data Science" />
          </Tabs>

          <Grid container spacing={4}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={course.image}
                      alt={course.title}
                    />
                    {course.badge && (
                      <Chip
                        label={course.badge}
                        color="secondary"
                        size="small"
                        sx={{ 
                          position: 'absolute',
                          top: 16,
                          left: 16,
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'common.white',
                        '&:hover': {
                          backgroundColor: 'secondary.main'
                        }
                      }}
                    >
                      <PlayCircle />
                    </IconButton>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      By {course.instructor}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <Star color="warning" fontSize="small" />
                        <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 'bold' }}>
                          {course.rating}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        ({course.students.toLocaleString()}+)
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTime fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {course.duration}
                      </Typography>
                    </Box>
                  </CardContent>
                  <Box sx={{ 
                    p: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        {course.price}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        {course.discount}
                      </Typography>
                    </Box>
                    <Button 
                      variant="contained" 
                      color="primary"
                      size="small"
                      sx={{
                        borderRadius: 4,
                        textTransform: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      Enroll Now
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              endIcon={<KeyboardArrowRight />}
              sx={{
                borderRadius: 8,
                px: 6,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              View All Courses
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Learning Paths Section */}
      <Box sx={{ py: 10, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" sx={{ 
              color: 'secondary.main',
              fontWeight: 'bold',
              letterSpacing: 1.5
            }}>
              STRUCTURED LEARNING
            </Typography>
            <Typography variant="h3" sx={{ 
              fontWeight: 'bold',
              mt: 1,
              mb: 3
            }}>
              Career Learning Paths
            </Typography>
            <Typography variant="subtitle1" sx={{ 
              maxWidth: 600,
              mx: 'auto',
              color: 'text.secondary'
            }}>
              Follow curated paths to master skills for in-demand careers
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                title: 'Full-Stack Developer',
                description: 'Master both frontend and backend development to build complete web applications',
                steps: 12,
                courses: 45,
                image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
              },
              {
                title: 'Data Scientist',
                description: 'Learn statistical analysis, machine learning, and data visualization',
                steps: 10,
                courses: 38,
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
              },
              {
                title: 'UX/UI Designer',
                description: 'Create beautiful, intuitive interfaces with user-centered design principles',
                steps: 8,
                courses: 32,
                image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
              }
            ].map((path, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: 3,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}>
                  <Box sx={{ position: 'relative', height: 180 }}>
                    <CardMedia
                      component="img"
                      height="100%"
                      image={path.image}
                      alt={path.title}
                    />
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 2,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
                    }}>
                      <Typography variant="h5" sx={{ color: 'common.white', fontWeight: 'bold' }}>
                        {path.title}
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {path.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircle color="secondary" fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {path.steps} Steps
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MenuBook color="secondary" fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {path.courses} Courses
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2 }}>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      color="primary"
                      endIcon={<KeyboardArrowRight />}
                      sx={{
                        borderRadius: 4,
                        textTransform: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      Explore Path
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ 
        py: 10,
        backgroundColor: 'primary.main',
        color: 'common.white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, transparent 100%)',
          zIndex: 1
        }
      }}>
        <Box 
          component="img"
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
          alt="Background pattern"
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.15
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6}>
            {[
              { value: '250K+', label: 'Active Students' },
              { value: '10K+', label: 'Courses Available' },
              { value: '500+', label: 'Expert Instructors' },
              { value: '95%', label: 'Satisfaction Rate' }
            ].map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ 
                    fontWeight: 'bold',
                    mb: 1
                  }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    opacity: 0.9,
                    fontWeight: 300
                  }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>


      {/* Testimonials Carousel Section */}
      <Box sx={{ py: 10, backgroundColor: theme.palette.background.default }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" sx={{ 
              color: 'secondary.main',
              fontWeight: 'bold',
              letterSpacing: 1.5
            }}>
              SUCCESS STORIES
            </Typography>
            <Typography variant="h3" sx={{ 
              fontWeight: 'bold',
              mt: 1,
              mb: 3
            }}>
              What Our Students Say
            </Typography>
            <Typography variant="subtitle1" sx={{ 
              maxWidth: 600,
              mx: 'auto',
              color: 'text.secondary'
            }}>
              Don't just take our word for it - hear from our community
            </Typography>
          </Box>
          
          <Box sx={{ px: isMobile ? 0 : 4 }}>
            <Slider {...sliderSettings}>
              {[
                {
                  id: 1,
                  quote: "This platform completely transformed my career. The quality of instruction is unparalleled.",
                  name: "Alex Thompson",
                  role: "Senior Developer",
                  avatar: "https://randomuser.me/api/portraits/men/32.jpg"
                },
                {
                  id: 2,
                  quote: "I doubled my salary within 6 months of completing the Data Science program. Worth every penny!",
                  name: "Priya Patel",
                  role: "Data Scientist",
                  avatar: "https://randomuser.me/api/portraits/women/44.jpg"
                },
                {
                  id: 3,
                  quote: "The hands-on projects gave me the portfolio I needed to land my dream design job.",
                  name: "Jamal Williams",
                  role: "UX Designer",
                  avatar: "https://randomuser.me/api/portraits/men/75.jpg"
                },
                {
                  id: 4,
                  quote: "The instructors are industry experts who provide practical knowledge you can't find in textbooks.",
                  name: "Maria Garcia",
                  role: "Product Manager",
                  avatar: "https://randomuser.me/api/portraits/women/63.jpg"
                }
              ].map((testimonial) => (
                <Box key={testimonial.id} sx={{ px: 1 }}>
                  <TestimonialCard>
                    <Box sx={{ display: 'flex', mb: 3 }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} color="warning" />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ 
                      fontStyle: 'italic',
                      mb: 3,
                      position: 'relative',
                      '&::before, &::after': {
                        content: '"\\201C"',
                        fontSize: '3rem',
                        lineHeight: 1,
                        color: 'divider',
                        position: 'absolute',
                        opacity: 0.3
                      },
                      '&::before': {
                        top: -20,
                        left: -10
                      },
                      '&::after': {
                        content: '"\\201D"',
                        bottom: -40,
                        right: -10
                      }
                    }}>
                      {testimonial.quote}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </TestimonialCard>
                </Box>
              ))}
            </Slider>
          </Box>
        </Container>
      </Box>


      {/* CTA Section */}
      <Box sx={{ 
        py: 12,
        backgroundColor: 'background.paper',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box 
          component="img"
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
          alt="CTA background"
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.1
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Paper elevation={0} sx={{ 
            p: 6,
            borderRadius: 4,
            textAlign: 'center',
            backgroundColor: 'transparent',
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.7))'
          }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 'bold',
              mb: 3
            }}>
              Ready to Transform Your Career?
            </Typography>
            <Typography variant="h6" sx={{ 
              mb: 4,
              color: 'text.secondary'
            }}>
              Join thousands of students who have accelerated their careers with our courses.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                endIcon={<KeyboardArrowRight />}
                sx={{
                  borderRadius: 8,
                  px: 6,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
              >
                Get Started
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                size="large"
                sx={{
                  borderRadius: 8,
                  px: 6,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
              >
                Speak to an Advisor
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Home;