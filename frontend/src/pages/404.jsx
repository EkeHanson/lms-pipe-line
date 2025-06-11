// src/pages/errors/Unauthorized.jsx
import { Link } from 'react-router-dom';
import { Warning as WarningIcon } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

const Unauthorized = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'grey.50',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: 12,
        px: { xs: 6, sm: 6, lg: 8 },
      }}
    >
      <Box sx={{ maxWidth: 480, mx: 'auto', width: '100%' }}>
        <Box sx={{ textAlign: 'center' }}>
          <WarningIcon sx={{ fontSize: 48, color: 'error.main', mx: 'auto' }} />
          <Typography
            variant="h3"
            sx={{ mt: 6, fontWeight: 800, color: 'grey.900' }}
          >
            403 - Unauthorized Access
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, color: 'grey.600' }}>
            You don't have permission to access this page.
          </Typography>
        </Box>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              fontWeight: 500,
              color: '#4f46e5', // indigo-600 equivalent
              textDecoration: 'none',
            }}
            onMouseOver={(e) => (e.target.style.color = '#4338ca')} // indigo-500 equivalent
            onMouseOut={(e) => (e.target.style.color = '#4f46e5')}
          >
            Return to home page
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Unauthorized;