import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useQAAuth } from './AuthContext';
import axios from 'axios';

// Mock API endpoint (replace with your backend API)
const API_URL = '/api/documents';

// Sample document types and courses (replace with dynamic data from backend)
const DOCUMENT_TYPES = ['Sampling Plan', 'IQA Report', 'Verification Record', 'Other'];
const COURSES = [
  'Health and Safety Level 2',
  'First Aid at Work',
  'Manual Handling',
  'Fire Safety Awareness',
  'Food Hygiene',
];

const DocumentRepository = () => {
  const { canUploadDocuments, canDownloadEvidence } = useQAAuth();
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    file: null,
    name: '',
    type: '',
    course: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch documents from backend
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        setDocuments(response.data);
      } catch (error) {
        console.error('Fetch documents error:', error);
        setSnackbar({ open: true, message: 'Failed to fetch documents', severity: 'error' });
      }
    };
    fetchDocuments();
  }, []);

  // Handle file upload
  const handleUpload = async () => {
    if (!formData.file || !formData.name || !formData.type) {
      setSnackbar({ open: true, message: 'Please complete all required fields', severity: 'warning' });
      return;
    }
    try {
      const form = new FormData();
      form.append('file', formData.file);
      form.append('name', formData.name);
      form.append('type', formData.type);
      form.append('course', formData.course || 'N/A');
      form.append('uploadedBy', 'Current User'); // Replace with user ID from AuthContext
      form.append('uploadDate', new Date().toISOString());

      const response = await axios.post(API_URL, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setDocuments((prev) => [...prev, response.data]);
      setSnackbar({ open: true, message: 'Document uploaded successfully', severity: 'success' });
      setUploadDialogOpen(false);
      setFormData({ file: null, name: '', type: '', course: '' });
    } catch (error) {
      console.error('Upload error:', error);
      setSnackbar({ open: true, message: 'Failed to upload document', severity: 'error' });
    }
  };

  // Handle document download
  const handleDownload = async (documentId) => {
    try {
      const response = await axios.get(`${API_URL}/${documentId}/download`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `document-${documentId}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setSnackbar({ open: true, message: 'Document downloaded successfully', severity: 'success' });
    } catch (error) {
      console.error('Download error:', error);
      setSnackbar({ open: true, message: 'Failed to download document', severity: 'error' });
    }
  };

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesCourse = courseFilter === 'all' || doc.course === courseFilter;
    return matchesSearch && matchesType && matchesCourse;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Document Repository
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <FormControl size="small" sx={{ width: 200 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              label="Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              {DOCUMENT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ width: 200 }}>
            <InputLabel>Course</InputLabel>
            <Select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              label="Course"
            >
              <MenuItem value="all">All Courses</MenuItem>
              {COURSES.map((course) => (
                <MenuItem key={course} value={course}>
                  {course}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {canUploadDocuments && (
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload Document
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Uploaded By</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.course || 'N/A'}</TableCell>
                <TableCell>{doc.uploadedBy}</TableCell>
                <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  {canDownloadEvidence && (
                    <Tooltip title="Download">
                      <IconButton onClick={() => handleDownload(doc.id)}>
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Upload Document
          <IconButton
            onClick={() => setUploadDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Document Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Document Type</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              label="Document Type"
              required
            >
              {DOCUMENT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Associated Course</InputLabel>
            <Select
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              label="Associated Course"
            >
              <MenuItem value="">None</MenuItem>
              {COURSES.map((course) => (
                <MenuItem key={course} value={course}>
                  {course}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
            style={{ marginTop: '16px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpload}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DocumentRepository;