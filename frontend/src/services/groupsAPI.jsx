// config.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Helper function to get CSRF token from cookies
const getCSRFToken = () => {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  return cookieValue || '';
};



// ... rest of your config.js remains the same ...