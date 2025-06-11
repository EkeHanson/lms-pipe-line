import React, { useState } from 'react';
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
  Tabs,
  Tab,
  Chip,
  Badge,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Description as ReportIcon,
  Checklist as SamplingPlanIcon,
  Verified as VerificationIcon
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

// Dummy data for reports
const dummyReports = [
  {
    id: 'RPT-001',
    name: 'Q3 2023 Sampling Summary',
    type: 'Sampling Summary',
    course: 'Health and Safety Level 2',
    createdAt: '2023-09-15T10:30:00',
    documentId: 'doc-001',
    createdBy: 'John Smith'
  },
  {
    id: 'RPT-002',
    name: 'First Aid Verification Report',
    type: 'Verification Report',
    course: 'First Aid at Work',
    createdAt: '2023-09-10T14:15:00',
    documentId: 'doc-002',
    createdBy: 'Sarah Johnson'
  },
  {
    id: 'RPT-003',
    name: 'Annual Compliance Audit',
    type: 'Compliance Audit',
    course: 'All Courses',
    createdAt: '2023-08-28T09:00:00',
    documentId: 'doc-003',
    createdBy: 'Michael Brown'
  },
];

// Dummy data for sampling plans
const dummySamplingPlans = [
  {
    id: 'SP-001',
    name: 'October 2023 Sampling Plan',
    course: 'Health and Safety Level 2',
    assessor: 'Emma Watson',
    sampleSize: 15,
    status: 'Approved',
    createdAt: '2023-09-20T11:20:00'
  },
  {
    id: 'SP-002',
    name: 'First Aid Sampling Plan',
    course: 'First Aid at Work',
    assessor: 'Daniel Radcliffe',
    sampleSize: 10,
    status: 'Pending',
    createdAt: '2023-09-18T15:45:00'
  },
  {
    id: 'SP-003',
    name: 'Food Hygiene Sampling',
    course: 'Food Hygiene',
    assessor: 'Rupert Grint',
    sampleSize: 8,
    status: 'Draft',
    createdAt: '2023-09-15T13:10:00'
  },
];

// Dummy data for verification records
const dummyVerificationRecords = [
  {
    id: 'VR-001',
    course: 'Health and Safety Level 2',
    assessor: 'John Smith',
    verificationDate: '2023-09-12T10:00:00',
    status: 'Approved',
    notes: 'All assessments meet the required standards'
  },
  {
    id: 'VR-002',
    course: 'Manual Handling',
    assessor: 'Sarah Johnson',
    verificationDate: '2023-09-08T14:30:00',
    status: 'Rejected',
    notes: 'Inconsistent grading found in 3 assessments'
  },
  {
    id: 'VR-003',
    course: 'Fire Safety Awareness',
    assessor: 'Michael Brown',
    verificationDate: '2023-09-05T09:15:00',
    status: 'Approved',
    notes: 'Minor feedback provided on assessment criteria'
  },
];

const REPORT_TYPES = [
  'Sampling Summary',
  'Verification Report',
  'Compliance Audit',
  'Standardization Report'
];

const COURSES = [
  'Health and Safety Level 2',
  'First Aid at Work',
  'Manual Handling',
  'Fire Safety Awareness',
  'Food Hygiene',
  'All Courses'
];

const STATUS_OPTIONS = ['All', 'Draft', 'Pending', 'Approved', 'Rejected'];

const IQAReports = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [reports] = useState(dummyReports);
  const [samplingPlans] = useState(dummySamplingPlans);
  const [verificationRecords] = useState(dummyVerificationRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    course: '',
    content: '',
    reportType: 'standard',
    sampleSize: '',
    criteria: '',
    assessor: '',
    notes: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleGenerateReport = () => {
    // Generate a simple PDF with the form data
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text(`IQA ${formData.type || 'Report'}`, 105, 20, { align: 'center' });
    
    // Add metadata
    doc.setFontSize(12);
    doc.text(`Report Name: ${formData.name}`, 20, 40);
    if (formData.course) doc.text(`Course: ${formData.course}`, 20, 50);
    doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 20, 60);
    
    // Add content based on tab
    if (activeTab === 0) {
      doc.text('Report Content:', 20, 80);
      const splitText = doc.splitTextToSize(formData.content || 'Sample report content', 170);
      doc.text(splitText, 20, 90);
    } else if (activeTab === 1) {
      doc.text('Sampling Plan Details:', 20, 80);
      doc.text(`Sample Size: ${formData.sampleSize}%`, 20, 90);
      doc.text('Sampling Criteria:', 20, 100);
      const splitCriteria = doc.splitTextToSize(formData.criteria || 'Random selection of assessments', 170);
      doc.text(splitCriteria, 20, 110);
    } else {
      doc.text('Verification Details:', 20, 80);
      doc.text(`Assessor: ${formData.assessor}`, 20, 90);
      doc.text('Verification Notes:', 20, 100);
      const splitNotes = doc.splitTextToSize(formData.notes || 'Verification findings and recommendations', 170);
      doc.text(splitNotes, 20, 110);
    }

    // Simulate download
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${formData.name || 'document'}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSnackbar({ open: true, message: 'Document generated successfully', severity: 'success' });
    setDialogOpen(false);
    setFormData({
      name: '',
      type: '',
      course: '',
      content: '',
      reportType: 'standard',
      sampleSize: '',
      criteria: '',
      assessor: '',
      notes: ''
    });
  };

  const handleDownload = (id, type = 'report') => {
    // In a real app, this would download the actual document
    // For demo, we'll just show a success message
    setSnackbar({ open: true, message: `Downloading ${type} ${id}`, severity: 'info' });
    
    // Simulate download delay
    setTimeout(() => {
      setSnackbar({ open: true, message: `${type} downloaded successfully`, severity: 'success' });
    }, 1500);
  };

  const filteredData = () => {
    let data = [];
    switch (activeTab) {
      case 0: // Reports
        data = reports.filter(report => 
          report.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (typeFilter === 'all' || report.type === typeFilter) &&
          (courseFilter === 'all' || report.course === courseFilter)
        );
        break;
      case 1: // Sampling Plans
        data = samplingPlans.filter(plan => 
          plan.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (courseFilter === 'all' || plan.course === courseFilter) &&
          (statusFilter === 'All' || plan.status === statusFilter)
        );
        break;
      case 2: // Verification Records
        data = verificationRecords.filter(record => 
          record.assessor.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (courseFilter === 'all' || record.course === courseFilter) &&
          (statusFilter === 'All' || record.status === statusFilter)
        );
        break;
      default:
        data = [];
    }
    return data;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        IQA Documentation Center
      </Typography>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label={
          <Badge badgeContent={reports.length} color="primary">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ReportIcon sx={{ mr: 1 }} /> Reports
            </Box>
          </Badge>
        } />
        <Tab label={
          <Badge badgeContent={samplingPlans.length} color="secondary">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SamplingPlanIcon sx={{ mr: 1 }} /> Sampling Plans
            </Box>
          </Badge>
        } />
        <Tab label={
          <Badge badgeContent={verificationRecords.length} color="info">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <VerificationIcon sx={{ mr: 1 }} /> Verification Records
            </Box>
          </Badge>
        } />
      </Tabs>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder={`Search ${activeTab === 0 ? 'reports' : activeTab === 1 ? 'sampling plans' : 'verification records'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Course</InputLabel>
                <Select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  label="Course"
                >
                  <MenuItem value="all">All Courses</MenuItem>
                  {COURSES.map((course) => (
                    <MenuItem key={course} value={course}>{course}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>
                  {activeTab === 0 ? 'Report Type' : 'Status'}
                </InputLabel>
                <Select
                  value={activeTab === 0 ? typeFilter : statusFilter}
                  onChange={(e) => 
                    activeTab === 0 ? setTypeFilter(e.target.value) : setStatusFilter(e.target.value)
                  }
                  label={activeTab === 0 ? 'Report Type' : 'Status'}
                >
                  {activeTab === 0 ? (
                    <>
                      <MenuItem value="all">All Types</MenuItem>
                      {REPORT_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </>
                  ) : (
                    STATUS_OPTIONS.map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setDialogOpen(true)}
              >
                {activeTab === 0 ? 'New Report' : activeTab === 1 ? 'New Plan' : 'New Record'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ backgroundColor: 'primary.light' }}>
            <TableRow>
              {activeTab === 0 && (
                <>
                  <TableCell sx={{ fontWeight: 'bold' }}>Report Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                </>
              )}
              {activeTab === 1 && (
                <>
                  <TableCell sx={{ fontWeight: 'bold' }}>Plan Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Assessor</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sample Size</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                </>
              )}
              {activeTab === 2 && (
                <>
                  <TableCell sx={{ fontWeight: 'bold' }}>Verification ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Assessor</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData().length > 0 ? (
              filteredData().map((item) => (
                <TableRow key={item.id}>
                  {activeTab === 0 && (
                    <>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.course}</TableCell>
                      <TableCell>{format(new Date(item.createdAt), 'PP')}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Download">
                          <IconButton onClick={() => handleDownload(item.documentId)}>
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </>
                  )}
                  {activeTab === 1 && (
                    <>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.course}</TableCell>
                      <TableCell>{item.assessor}</TableCell>
                      <TableCell>{item.sampleSize} learners</TableCell>
                      <TableCell>
                        <Chip label={item.status} size="small" color={getStatusColor(item.status)} />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Download Plan">
                          <IconButton onClick={() => handleDownload(item.id, 'sampling')}>
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </>
                  )}
                  {activeTab === 2 && (
                    <>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.course}</TableCell>
                      <TableCell>{item.assessor}</TableCell>
                      <TableCell>{format(new Date(item.verificationDate), 'PP')}</TableCell>
                      <TableCell>
                        <Chip label={item.status} size="small" color={getStatusColor(item.status)} />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Download Record">
                          <IconButton onClick={() => handleDownload(item.id, 'verification')}>
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={activeTab === 0 ? 5 : 6} align="center">
                  No {activeTab === 0 ? 'reports' : activeTab === 1 ? 'sampling plans' : 'verification records'} found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Generate New Document Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {activeTab === 0 ? 'Generate New Report' : 
           activeTab === 1 ? 'Create Sampling Plan' : 'Create Verification Record'}
          <IconButton
            onClick={() => setDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={`${activeTab === 0 ? 'Report' : activeTab === 1 ? 'Plan' : 'Record'} Name`}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            
            {activeTab === 0 && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Report Type</InputLabel>
                    <Select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      label="Report Type"
                      required
                    >
                      {REPORT_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Course</InputLabel>
                    <Select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      label="Course"
                      required
                    >
                      {COURSES.map((course) => (
                        <MenuItem key={course} value={course}>{course}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Report Content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    multiline
                    rows={6}
                    placeholder="Enter detailed report content..."
                  />
                </Grid>
              </>
            )}
            
            {activeTab === 1 && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Course</InputLabel>
                    <Select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      label="Course"
                      required
                    >
                      {COURSES.map((course) => (
                        <MenuItem key={course} value={course}>{course}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Sample Size (%)"
                    type="number"
                    inputProps={{ min: 10, max: 100 }}
                    value={formData.sampleSize}
                    onChange={(e) => setFormData({ ...formData, sampleSize: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Sampling Criteria"
                    value={formData.criteria}
                    onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
                    multiline
                    rows={4}
                    placeholder="Enter sampling criteria (e.g., random selection, focus on borderline passes)..."
                  />
                </Grid>
              </>
            )}
            
            {activeTab === 2 && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Course</InputLabel>
                    <Select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      label="Course"
                      required
                    >
                      {COURSES.map((course) => (
                        <MenuItem key={course} value={course}>{course}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Assessor"
                    value={formData.assessor}
                    onChange={(e) => setFormData({ ...formData, assessor: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Verification Notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    multiline
                    rows={6}
                    placeholder="Enter verification details, findings, and recommendations..."
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleGenerateReport}
            disabled={
              !formData.name || 
              (activeTab === 0 && (!formData.type || !formData.course)) ||
              (activeTab === 1 && (!formData.course || !formData.sampleSize)) ||
              (activeTab === 2 && (!formData.course || !formData.assessor))
            }
          >
            {activeTab === 0 ? 'Generate Report' : activeTab === 1 ? 'Create Plan' : 'Create Record'}
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

export default IQAReports;