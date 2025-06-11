import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar,
  useTheme,
  useMediaQuery, 
  Button,
  Stack,
  Divider
} from '@mui/material';
import {
  Groups as TeamIcon,
  Bolt as MissionIcon,
  History as HistoryIcon,
  Public as ReachIcon,
  EmojiEvents as ValuesIcon,
  CheckCircle as CheckIcon,
  ThumbUp as SatisfactionIcon
} from '@mui/icons-material';

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Feature cards data
  const features = [
    {
      icon: <MissionIcon fontSize="large" color="primary" />,
      title: "Our Mission",
      description: "To revolutionize the rental industry with a seamless, trustworthy platform connecting people with quality items and services.",
      color: theme.palette.primary.main
    },
    {
      icon: <ValuesIcon fontSize="large" color="secondary" />,
      title: "Our Values",
      description: "Integrity, innovation, and customer satisfaction drive everything we do.",
      color: theme.palette.secondary.main
    },
    {
      icon: <HistoryIcon fontSize="large" sx={{ color: theme.palette.success.main }} />,
      title: "Our Story",
      description: "Founded in 2023 with a simple vision: make renting as easy as online shopping.",
      color: theme.palette.success.main
    },
    {
      icon: <ReachIcon fontSize="large" sx={{ color: theme.palette.info.main }} />,
      title: "Our Reach",
      description: "Serving customers globally with plans for continuous expansion.",
      color: theme.palette.info.main
    }
  ];

  // Team members data
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      avatar: "/assets/team/alex.jpg",
      bio: "Visionary leader with 10+ years in tech startups"
    },
    {
      name: "Sarah Williams",
      role: "CTO",
      avatar: "/assets/team/sarah.jpg",
      bio: "Tech innovator specializing in scalable platforms"
    },
    {
      name: "Michael Chen",
      role: "Head of Product",
      avatar: "/assets/team/michael.jpg",
      bio: "User experience expert and product strategist"
    },
    {
      name: "Emily Davis",
      role: "Marketing Director",
      avatar: "/assets/team/emily.jpg",
      bio: "Brand builder with a passion for community"
    }
  ];

  // Stats data
  const stats = [
    { value: "10K+", label: "Happy Customers", icon: <TeamIcon /> },
    { value: "5K+", label: "Items Listed", icon: <CheckIcon /> },
    { value: "50+", label: "Cities Served", icon: <ReachIcon /> },
    { value: "99%", label: "Satisfaction", icon: <SatisfactionIcon /> }
  ];

  return (
    <Box sx={{ 
      py: { xs: 4, md: 8 },
      backgroundColor: theme.palette.background.default
    }}>
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: { xs: 6, md: 10 },
          py: { xs: 4, md: 8 },
          px: { xs: 2, md: 4 },
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          boxShadow: 3,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url(/assets/about-pattern.svg) center/cover',
            opacity: 0.1
          }
        }}>
          <Typography 
            variant={isMobile ? "h3" : "h2"} 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 800,
              position: 'relative',
              mb: 3
            }}
          >
            About Our Platform
          </Typography>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="p"
            sx={{ 
              maxWidth: '800px',
              mx: 'auto',
              position: 'relative'
            }}
          >
            We're transforming how people access the things they need through our trusted rental marketplace
          </Typography>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              textAlign: 'center', 
              mb: { xs: 4, md: 6 },
              fontWeight: 700,
              color: theme.palette.text.primary
            }}
          >
            Why We Stand Out
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  borderLeft: `4px solid ${feature.color}`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}>
                  <CardContent sx={{ 
                    flexGrow: 1,
                    textAlign: 'center',
                    py: 4,
                    px: 3
                  }}>
                    <Box sx={{ 
                      mb: 3,
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '50%',
                      backgroundColor: `${feature.color}20`
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 700,
                        color: feature.color
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Stats Section */}
        <Box sx={{ 
          mb: { xs: 6, md: 10 },
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 4 },
          borderRadius: 4,
          backgroundColor: theme.palette.background.paper,
          boxShadow: 1
        }}>
          <Grid container spacing={4} alignItems="center">
            {stats.map((stat, index) => (
              <React.Fragment key={index}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ 
                    textAlign: 'center',
                    p: 2
                  }}>
                    <Typography 
                      variant="h3" 
                      component="div" 
                      sx={{ 
                        fontWeight: 800,
                        mb: 1,
                        color: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1
                      }}
                    >
                      {stat.icon}
                      {stat.value}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
                {index < stats.length - 1 && !isMobile && (
                  <Grid item xs={12} sm="auto" sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Divider orientation="vertical" flexItem sx={{ height: '60px', mx: 'auto' }} />
                  </Grid>
                )}
              </React.Fragment>
            ))}
          </Grid>
        </Box>

        {/* Team Section */}
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              textAlign: 'center', 
              mb: { xs: 4, md: 6 },
              fontWeight: 700
            }}
          >
            Meet The Team
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                  border: 'none',
                  boxShadow: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 6
                  }
                }}>
                  <Avatar
                    alt={member.name}
                    src={member.avatar}
                    sx={{ 
                      width: 140, 
                      height: 140,
                      mb: 3,
                      border: `4px solid ${theme.palette.primary.light}`,
                      boxShadow: 3
                    }}
                  />
                  <CardContent>
                    <Typography 
                      variant="h6" 
                      component="h3"
                      sx={{ 
                        fontWeight: 700,
                        mb: 1
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      color="primary"
                      sx={{ 
                        mb: 2,
                        fontWeight: 600
                      }}
                    >
                      {member.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box sx={{ 
          py: { xs: 6, md: 8 },
          px: { xs: 3, md: 6 },
          borderRadius: 4,
          textAlign: 'center',
          background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 3
        }}>
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            zIndex: 1
          }} />
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 800,
                mb: 3
              }}
            >
              Ready to Join Our Community?
            </Typography>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              component="p" 
              sx={{ 
                mb: 4,
                maxWidth: '700px',
                mx: 'auto'
              }}
            >
              Whether you're looking to rent items or list your own, we've got you covered.
            </Typography>
            <Stack 
              direction={isMobile ? "column" : "row"} 
              spacing={2} 
              justifyContent="center"
            >
              <Button 
                variant="contained" 
                color="inherit" 
                size="large"
                sx={{ 
                  color: theme.palette.primary.dark,
                  fontWeight: 700,
                  px: 4,
                  '&:hover': {
                    backgroundColor: 'white'
                  }
                }}
              >
                Sign Up Now
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                size="large"
                sx={{ 
                  borderWidth: 2,
                  fontWeight: 700,
                  px: 4,
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Learn More
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default About;