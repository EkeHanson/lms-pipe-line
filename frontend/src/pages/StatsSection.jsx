// src/components/StatsSection.js
import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  Groups as GroupsIcon, 
  Storefront as StorefrontIcon, 
  EmojiEvents as QualityIcon, 
  SupportAgent as SupportIcon 
} from '@mui/icons-material';

const StatsSection = ({ theme }) => {
  // Stats data
  const stats = [
    {
      icon: <GroupsIcon fontSize="large" />,
      value: "10,000+",
      label: "Happy Customers"
    },
    {
      icon: <StorefrontIcon fontSize="large" />,
      value: "5,000+",
      label: "Items Available"
    },
    {
      icon: <QualityIcon fontSize="large" />,
      value: "4.9/5",
      label: "Average Rating"
    },
    {
      icon: <SupportIcon fontSize="large" />,
      value: "24/7",
      label: "Customer Support"
    }
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box sx={{ 
                textAlign: 'center',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <Box sx={{ 
                  color: theme.palette.primary.main,
                  mb: 2
                }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="subtitle1">
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default StatsSection;