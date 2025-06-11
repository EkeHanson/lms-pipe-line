import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Divider, 
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { 
  Lock, 
  Person, 
  Visibility, 
  VisibilityOff,
  ArrowBack
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import eqaLogo from '../assets/eqa-logo.png'; // Replace with your logo path

const LoginContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 450,
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: theme.shadows[10],
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.divider}`,
}));

const EQALogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    showPassword: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (prop) => (event) => {
    setCredentials({ ...credentials, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setCredentials({ ...credentials, showPassword: !credentials.showPassword });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validate credentials (in a real app, this would be an API call)
      if (credentials.username === 'eqa' && credentials.password === 'qwerty') {
        // Successful login
        localStorage.setItem('eqaAuthToken', 'dummy-auth-token');
        navigate('/eqa');
      } else {
        throw new Error('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
        p: 2
      }}
    >
      <LoginContainer>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <img 
            src={eqaLogo} 
            alt="EQA Portal" 
            style={{ height: 60, marginBottom: 16 }} 
          />
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            EQA Portal Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            External Quality Assurance Officer Access
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            required
            value={credentials.username}
            onChange={handleChange('username')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={credentials.showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            required
            value={credentials.password}
            onChange={handleChange('password')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {credentials.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={loading}
            sx={{ 
              mt: 3,
              py: 1.5,
              background: 'linear-gradient(90deg, #6e8efb 0%, #a777e3 100%)',
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Login'
            )}
          </Button>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button 
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ color: 'text.secondary' }}
          >
            Back to main site
          </Button>
        </Box>

        <Typography variant="caption" display="block" sx={{ mt: 3, textAlign: 'center' }}>
          For assistance, please contact the Quality Assurance Department
        </Typography>
      </LoginContainer>
    </Box>
  );
};

export default EQALogin;