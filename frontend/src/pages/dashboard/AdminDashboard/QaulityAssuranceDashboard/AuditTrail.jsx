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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useQAAuth } from '../../../../hooks/useQAAuth';
import axios from 'axios';
import jsPDF from 'jspdf';

const API_URL = '/api/audit-trail';
const DOCUMENT_API_URL = '/api/documents';

const ACTION_TYPES = [
  'Portfolio Verification',
  'Sampling Plan Creation',
  'Sampling Plan Verification',
  'Report Generation',
  'Trainer Feedback',
  'Document Upload',
];

const AuditTrail = () => {
  const { canViewReports, canDownloadEvidence } = useQAAuth();
  const [auditLogs, setAuditLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        
        console.log('API response:', response); // Debug log
        
        if (Array.isArray(response?.data)) {
          setAuditLogs(response.data);
        } else if (Array.isArray(response?.data?.results)) {
          setAuditLogs(response.data.results);
        } else {
          console.error('Invalid API response format:', response.data);
          setSnackbar({ open: true, message: 'Invalid audit logs data format', severity: 'error' });
          setAuditLogs([]);
        }
      } catch (error) {
        console.error('Fetch audit logs error:', error);
        setSnackbar({ open: true, message: 'Failed to fetch audit logs', severity: 'error' });
        setAuditLogs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuditLogs();
  }, []);

  const handleExport = async () => {
    try {
      if (!Array.isArray(auditLogs) || auditLogs.length === 0) {
        setSnackbar({ open: true, message: 'No audit logs to export', severity: 'warning' });
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(12);
      doc.text('Audit Trail Report', 20, 20);
      
      let y = 30;
      filteredLogs.forEach((log, index) => {
        doc.text(
          `${index + 1}. ${log?.actionType || 'N/A'} by ${log?.user || 'Unknown'} on ${log?.timestamp ? new Date(log.timestamp).toLocaleString() : 'Unknown date'}: ${log?.description || 'No description'}`,
          20,
          y
        );
        y += 10;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });

      const pdfBlob = doc.output('blob');
      const form = new FormData();
      form.append('file', pdfBlob, 'audit-trail-report.pdf');
      form.append('name', 'Audit Trail Report');
      form.append('type', 'Audit Report');
      form.append('course', 'N/A');
      form.append('uploadedBy', 'Current User');
      form.append('uploadDate', new Date().toISOString());

      await axios.post(DOCUMENT_API_URL, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'audit-trail-report.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSnackbar({ open: true, message: 'Audit trail exported successfully', severity: 'success' });
    } catch (error) {
      console.error('Export error:', error);
      setSnackbar({ open: true, message: 'Failed to export audit trail', severity: 'error' });
    }
  };

  const filteredLogs = (Array.isArray(auditLogs) ? auditLogs.filter((log) => {
    const matchesSearch = 
      (log?.user?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (log?.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || log?.actionType === typeFilter;
    const matchesDate = dateFilter === 'all' || 
      (dateFilter === 'last7days' && log?.timestamp && new Date(log.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === 'last30days' && log?.timestamp && new Date(log.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    return matchesSearch && matchesType && matchesDate;
  }) : []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Audit Trail
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search audit logs..."
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
            <InputLabel>Action Type</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              label="Action Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              {ACTION_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ width: 200 }}>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              label="Date Range"
            >
              <MenuItem value="all">All Dates</MenuItem>
              <MenuItem value="last7days">Last 7 Days</MenuItem>
              <MenuItem value="last30days">Last 30 Days</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {canViewReports && canDownloadEvidence && (
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={isLoading || filteredLogs.length === 0}
          >
            Export Audit Trail
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell>User</TableCell>
              <TableCell>Action Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading audit logs...
                </TableCell>
              </TableRow>
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No audit logs found
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log?.id || Math.random()}>
                  <TableCell>{log?.user || 'Unknown'}</TableCell>
                  <TableCell>{log?.actionType || 'N/A'}</TableCell>
                  <TableCell>{log?.description || 'No description'}</TableCell>
                  <TableCell>
                    {log?.targetType && log?.targetId ? (
                      <a href={`/${log.targetType}/${log.targetId}`} target="_blank" rel="noopener noreferrer">
                        {log?.targetName || 'View'}
                      </a>
                    ) : (
                      log?.targetName || 'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {log?.timestamp ? new Date(log.timestamp).toLocaleString() : 'Unknown date'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

export default AuditTrail;