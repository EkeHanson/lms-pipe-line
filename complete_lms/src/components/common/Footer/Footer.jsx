import React from 'react';
import {
  Box, Container, Typography, Grid, Stack, IconButton, Link, Divider, Button
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box sx={{ 
      backgroundColor: '#1a2b5e', 
      color: 'white',
      pt: 6,
      pb: 2
    }}>
      <Container maxWidth="xl">
        {/* Main Footer Sections */}
        <Grid 
          container 
          spacing={4} 
          justifyContent="space-between" // Spread items across the screen
          sx={{ mb: 4 }}
        >
          {/* Product Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                fontSize: '1.1rem',
                textTransform: 'uppercase',
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              Product
            </Typography>
            <Stack 
              spacing={1} 
              alignItems={{ xs: 'center', md: 'flex-start' }}
            >
              <Link href="/features" color="inherit" underline="hover" sx={{ fontSize: '0.9rem' }}>Features</Link>
              <Link href="/pricing" color="inherit" underline="hover" sx={{ fontSize: '0.9rem' }}>Pricing</Link>
              <Link href="/solutions" color="inherit" underline="hover" sx={{ fontSize: '0.9rem' }}>Solutions</Link>
              <Link href="/integrations" color="inherit" underline="hover" sx={{ fontSize: '0.9rem' }}>Integrations</Link>
              <Link href="/mobile" color="inherit" underline="hover" sx={{ fontSize: '0.9rem' }}>Mobile App</Link>
            </Stack>
          </Grid>
          
          {/* Resources Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                fontSize: '1.1rem',
                textTransform: 'uppercase',
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              Resources
            </Typography>
            <Stack 
              spacing={1} 
              alignItems={{ xs: 'center', md: 'flex-start' }}
            >
              <Link href="#" color="inherit" underline="hover" sx={{ fontSize: '0.9rem' }}>Blog</Link>
              <Link href="#" color="inherit" underline="hover" sx={{ fontSize: '0.9rem' }}>Help Center</Link>
              <Link href="#" color="inherit" underline="hover" sx={{ fontSize: '0.9rem' }}>Webinars</Link>
              <Link href="#" color="inherit" underline="hover" sx={{ fontSize: '0.9rem' }}>Case Studies</Link>
              <Link href="#" color="inherit" underline="hover" sx={{ fontSize: '0.9rem' }}>API Docs</Link>
            </Stack>
          </Grid>
          
          {/* Company Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                fontSize: '1.1rem',
                textTransform: 'uppercase',
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              Company
            </Typography>
            <Stack 
              spacing={1} 
              alignItems={{ xs: 'center', md: 'flex-start' }}
            >
              <Link href="/about" color="inherit" underline="hover" sx={{ fontSize: '0.9rem' }}>About Us</Link>
              <Link href="/careers" color="inherit" underline="hover" sx={{ fontSize: '0.9rem' }}>Careers</Link>
              <Link href="/partners" color="inherit" underline="hover" sx={{ fontSize: '0.9rem' }}>Partners</Link>
              <Link href="/contact" color="inherit" underline="hover" sx={{ fontSize: '0.9rem' }}>Contact Us</Link>
              <Link href="newsroom" color="inherit" underline="hover" sx={{ fontSize: '0.9rem' }}>Newsroom</Link>
            </Stack>
          </Grid>
          
          {/* Get Started Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-start' },
              textAlign: { xs: 'center', md: 'left' }
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  fontSize: '1.1rem',
                  textTransform: 'uppercase'
                }}
              >
                Get Started
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ 
                  mb: 2,
                  backgroundColor: '#ff6b35',
                  '&:hover': { backgroundColor: '#e05a2b' }
                }}
              >
                Request Demo
              </Button>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Ready to transform your school management?
              </Typography>
              <Typography variant="body2">
                Call us: +1 (800) 123-4567
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', my: 3 }} />
        
        {/* Bottom Section */}
        <Grid 
          container 
          spacing={2} 
          justifyContent="space-between" // Spread items across the screen
          alignItems="center"
        >
          {/* Copyright */}
          <Grid item xs={12} md={6}>
            <Stack 
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              alignItems="center"
              flexWrap="wrap"
            >
              <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                © {new Date().getFullYear()} EduManage. All rights reserved.
              </Typography>
              <Link href="/privacy" color="inherit" underline="hover" sx={{ fontSize: '0.8rem' }}>Privacy Policy</Link>
              <Link href="/terms" color="inherit" underline="hover" sx={{ fontSize: '0.8rem' }}>Terms of Service</Link>
              <Link href="/cookies" color="inherit" underline="hover" sx={{ fontSize: '0.8rem' }}>Cookie Policy</Link>
            </Stack>
          </Grid>
          
          {/* Social Media Icons */}
          <Grid item xs={12} md={6}>
            <Stack 
              direction="row" 
              spacing={1} 
              justifyContent={{ xs: 'center', md: 'flex-end' }}
            >
              <IconButton sx={{ color: 'white' }} href="https://facebook.com" aria-label="Facebook">
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton sx={{ color: 'white' }} href="https://twitter.com" aria-label="Twitter">
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton sx={{ color: 'white' }} href="https://www.linkedin.com/in/ekene-onwon-abraham-4370a0228/" aria-label="LinkedIn">
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton sx={{ color: 'white' }} href="https://instagram.com" aria-label="Instagram">
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton sx={{ color: 'white' }} href="https://www.youtube.com/@ekene-onwon_hanson" aria-label="YouTube">
                <YouTubeIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;