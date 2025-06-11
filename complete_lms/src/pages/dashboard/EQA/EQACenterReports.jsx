import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Divider,
  FormControl,
  FormLabel,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Badge,
  Tabs,
  Tab,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  useTheme,
  styled,
  CircularProgress
} from '@mui/material';
import {
  PictureAsPdf,
  GridOn,
  Download,
  FilterList,
  Refresh,
  HelpOutline,
  Visibility,
  CalendarToday,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  ArrowBack,
  Description,
  Close
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PieChart, BarChart } from '@mui/x-charts';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const ReportStatusChip = ({ status }) => {
  const statusConfig = {
    generated: { color: 'success', label: 'Generated', icon: <CheckCircle /> },
    pending: { color: 'warning', label: 'Pending', icon: <Warning /> },
    failed: { color: 'error', label: 'Failed', icon: <ErrorIcon /> }
  };

  return (
    <Chip
      icon={statusConfig[status]?.icon}
      label={statusConfig[status]?.label || status}
      color={statusConfig[status]?.color || 'default'}
      size="small"
      variant="outlined"
    />
  );
};

const EQACenterReports = () => {
  const theme = useTheme();
  const [reportType, setReportType] = useState('compliance');
  const [center, setCenter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [format, setFormat] = useState('pdf');
  const [selectedColumns, setSelectedColumns] = useState({
    center: true,
    date: true,
    status: true,
    findings: true,
    recommendations: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportStatus, setReportStatus] = useState(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedReport, setSelectedReport] = useState(null);

  // Dummy data
  const centers = [
    { id: 'all', name: 'All Centers' },
    { id: 'ab123', name: 'ABC Training Center' },
    { id: 'xy456', name: 'XYZ College' },
    { id: 'gs789', name: 'Global Skills Institute' }
  ];

  const reportTypes = [
    { id: 'compliance', name: 'Compliance Report', description: 'Detailed analysis of center compliance with standards' },
    { id: 'sampling', name: 'Sampling Report', description: 'Summary of verification sampling activities' },
    { id: 'findings', name: 'Findings Report', description: 'Aggregated findings from quality reviews' },
    { id: 'annual', name: 'Annual Review', description: 'Comprehensive annual quality assessment' }
  ];

  const generatedReports = [
    {
      id: 1,
      name: 'Q2 2023 Compliance Report - ABC Training',
      type: 'compliance',
      center: 'ABC Training Center',
      date: '2023-06-15',
      status: 'generated',
      findings: 12,
      recommendations: 8
    },
    {
      id: 2,
      name: 'May 2023 Sampling Report - All Centers',
      type: 'sampling',
      center: 'All Centers',
      date: '2023-05-31',
      status: 'generated',
      findings: 23,
      recommendations: 15
    },
    {
      id: 3,
      name: 'Annual Review 2022 - XYZ College',
      type: 'annual',
      center: 'XYZ College',
      date: '2023-01-20',
      status: 'generated',
      findings: 42,
      recommendations: 28
    }
  ];

  const sampleReportData = {
    compliance: [
      { criterion: 'Assessment Practices', status: 'Compliant', notes: 'All standards met' },
      { criterion: 'IQA Processes', status: 'Partial Compliance', notes: 'Sampling frequency needs improvement' },
      { criterion: 'Documentation', status: 'Non-Compliant', notes: 'Missing assessment records' }
    ],
    sampling: [
      { assessment: 'Business Admin L3', sampled: 8, verified: 7, issues: 1 },
      { assessment: 'Customer Service L2', sampled: 12, verified: 10, issues: 2 },
      { assessment: 'Project Management L4', sampled: 5, verified: 5, issues: 0 }
    ]
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setReportStatus(null);
    
    try {
      const params = {
        reportType,
        center,
        startDate: startDate ? new Date(startDate).toISOString().split('T')[0] : null,
        endDate: endDate ? new Date(endDate).toISOString().split('T')[0] : null,
        format,
        columns: Object.keys(selectedColumns).filter(key => selectedColumns[key])
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Report generated with params:', params);
      setReportStatus('generated');
    } catch (error) {
      console.error('Report generation failed:', error);
      setReportStatus('failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportReport = (report) => {
    console.log('Exporting report:', report.id);
    setExportDialogOpen(false);
    alert(`Exporting report: ${report.name}`);
  };

  const handleColumnToggle = (column) => {
    setSelectedColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const handleResetForm = () => {
    setReportType('compliance');
    setCenter('');
    setStartDate(null);
    setEndDate(null);
    setFormat('pdf');
    setReportStatus(null);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'compliant': return 'success';
      case 'partial compliance': return 'warning';
      case 'non-compliant': return 'error';
      default: return 'default';
    }
  };

  const isFormValid = reportType && center;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="600">
            Center Reports
          </Typography>
          <Box>
            <Tooltip title="Reset form">
              <IconButton onClick={handleResetForm} sx={{ mr: 1 }}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Generate Report" />
          <Tab label="View Reports" />
        </Tabs>

        {activeTab === 0 ? (
          <Grid container spacing={3}>
            {/* Configuration Column */}
            <Grid item xs={12} md={5}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    Report Configuration
                    <Tooltip title="Select report parameters and generate">
                      <HelpOutline sx={{ ml: 1, fontSize: 18 }} color="action" />
                    </Tooltip>
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Report Type *</InputLabel>
                    <Select
                      value={reportType}
                      label="Report Type *"
                      onChange={(e) => setReportType(e.target.value)}
                      required
                    >
                      {reportTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {reportType && (
                    <Paper elevation={0} sx={{ 
                      p: 2, 
                      mb: 3, 
                      backgroundColor: 'action.hover',
                      borderRadius: 1
                    }}>
                      <Typography variant="body2">
                        {reportTypes.find(t => t.id === reportType)?.description}
                      </Typography>
                    </Paper>
                  )}

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Center *</InputLabel>
                    <Select
                      value={center}
                      label="Center *"
                      onChange={(e) => setCenter(e.target.value)}
                      required
                    >
                      {centers.map((center) => (
                        <MenuItem key={center.id} value={center.id}>
                          {center.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Date Range
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <DatePicker
                          label="Start Date"
                          value={startDate}
                          onChange={setStartDate}
                          slotProps={{ textField: { fullWidth: true } }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <DatePicker
                          label="End Date"
                          value={endDate}
                          onChange={setEndDate}
                          minDate={startDate}
                          slotProps={{ textField: { fullWidth: true } }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <FormControl component="fieldset" sx={{ mb: 3 }}>
                    <FormLabel component="legend">Output Format</FormLabel>
                    <Grid container spacing={1}>
                      <Grid item>
                        <Button
                          variant={format === 'pdf' ? 'contained' : 'outlined'}
                          startIcon={<PictureAsPdf />}
                          onClick={() => setFormat('pdf')}
                        >
                          PDF
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant={format === 'excel' ? 'contained' : 'outlined'}
                          startIcon={<GridOn />}
                          onClick={() => setFormat('excel')}
                        >
                          Excel
                        </Button>
                      </Grid>
                    </Grid>
                  </FormControl>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={
                      isGenerating ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <Description />
                      )
                    }
                    onClick={handleGenerateReport}
                    disabled={!isFormValid || isGenerating}
                    sx={{ py: 1.5 }}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Report'}
                  </Button>

                  {reportStatus && (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ReportStatusChip status={reportStatus} />
                    </Box>
                  )}
                </CardContent>
              </StyledCard>
            </Grid>

            {/* Preview Column */}
            <Grid item xs={12} md={7}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Report Preview
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  {reportType && center ? (
                    <>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                          {reportTypes.find(t => t.id === reportType)?.name} - {centers.find(c => c.id === center)?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {startDate && endDate 
                            ? `Date range: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`
                            : 'All dates'}
                        </Typography>
                      </Box>

                      {reportType === 'compliance' && (
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Criterion</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell>Notes</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {sampleReportData.compliance.map((row, index) => (
                                <TableRow key={index}>
                                  <TableCell>{row.criterion}</TableCell>
                                  <TableCell align="center">
                                    <Chip 
                                      label={row.status} 
                                      size="small" 
                                      color={getStatusColor(row.status)}
                                      variant="outlined"
                                    />
                                  </TableCell>
                                  <TableCell>{row.notes}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}

                      {reportType === 'sampling' && (
                        <Box>
                          <Box sx={{ height: 300, mb: 3 }}>
                            <BarChart
                              series={[
                                { data: [8, 12, 5], label: 'Sampled' },
                                { data: [7, 10, 5], label: 'Verified' },
                              ]}
                              xAxis={[{ data: ['Business Admin', 'Customer Service', 'Project Mgmt'], scaleType: 'band' }]}
                              colors={[theme.palette.primary.main, theme.palette.success.main]}
                            />
                          </Box>
                          <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Assessment</TableCell>
                                  <TableCell align="right">Sampled</TableCell>
                                  <TableCell align="right">Verified</TableCell>
                                  <TableCell align="right">Issues</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {sampleReportData.sampling.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{row.assessment}</TableCell>
                                    <TableCell align="right">{row.sampled}</TableCell>
                                    <TableCell align="right">{row.verified}</TableCell>
                                    <TableCell align="right">
                                      <Chip 
                                        label={row.issues} 
                                        size="small" 
                                        color={row.issues > 0 ? 'error' : 'success'}
                                        variant="outlined"
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      )}

                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Included Columns
                        </Typography>
                        <FormGroup row sx={{ gap: 2 }}>
                          {Object.entries(selectedColumns).map(([column, checked]) => (
                            <FormControlLabel
                              key={column}
                              control={
                                <Checkbox
                                  checked={checked}
                                  onChange={() => handleColumnToggle(column)}
                                />
                              }
                              label={column.charAt(0).toUpperCase() + column.slice(1)}
                            />
                          ))}
                        </FormGroup>
                      </Box>
                    </>
                  ) : (
                    <Paper elevation={0} sx={{ 
                      p: 4, 
                      textAlign: 'center',
                      backgroundColor: 'action.hover'
                    }}>
                      <Description sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        Select report type and center to preview
                      </Typography>
                    </Paper>
                  )}
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        ) : (
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generated Reports
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Report Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Center</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Findings</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {generatedReports.map((report) => (
                      <TableRow key={report.id} hover>
                        <TableCell>{report.name}</TableCell>
                        <TableCell>
                          <Chip 
                            label={report.type.charAt(0).toUpperCase() + report.type.slice(1)} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{report.center}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>
                          <Badge badgeContent={report.findings} color="error" max={999}>
                            <Warning color="action" />
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <ReportStatusChip status={report.status} />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View report">
                            <IconButton onClick={() => setSelectedReport(report)}>
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton onClick={() => setExportDialogOpen(true)}>
                              <Download />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {generatedReports.length === 0 && (
                <Paper elevation={0} sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  backgroundColor: 'action.hover',
                  mt: 2
                }}>
                  <Description sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No reports have been generated yet
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </StyledCard>
        )}

        {/* Report Detail Dialog */}
        <Dialog 
          open={!!selectedReport} 
          onClose={() => setSelectedReport(null)} 
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              {selectedReport?.name}
              <IconButton onClick={() => setSelectedReport(null)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            {selectedReport && (
              <Box>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2">Report Type</Typography>
                    <Typography>{selectedReport.type.charAt(0).toUpperCase() + selectedReport.type.slice(1)}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2">Center</Typography>
                    <Typography>{selectedReport.center}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2">Generated Date</Typography>
                    <Typography>{selectedReport.date}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2">Status</Typography>
                    <ReportStatusChip status={selectedReport.status} />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Summary
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Key Findings
                      </Typography>
                      <Typography variant="body2" paragraph>
                        • {selectedReport.findings} quality issues identified
                      </Typography>
                      <Typography variant="body2" paragraph>
                        • Assessment documentation needs improvement
                      </Typography>
                      <Typography variant="body2">
                        • IQA sampling frequency below recommended standard
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Recommendations
                      </Typography>
                      <Typography variant="body2" paragraph>
                        • {selectedReport.recommendations} improvement actions suggested
                      </Typography>
                      <Typography variant="body2" paragraph>
                        • Increase sampling rate to 20% of assessments
                      </Typography>
                      <Typography variant="body2">
                        • Provide additional assessor training
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Detailed Analysis
                </Typography>
                
                {selectedReport.type === 'compliance' && (
                  <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Standard</TableCell>
                          <TableCell align="center">Status</TableCell>
                          <TableCell>Evidence</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sampleReportData.compliance.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.criterion}</TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={row.status} 
                                size="small" 
                                color={getStatusColor(row.status)}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>{row.notes}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {selectedReport.type === 'sampling' && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ height: 300 }}>
                      <BarChart
                        series={[
                          { data: [8, 12, 5], label: 'Sampled' },
                          { data: [7, 10, 5], label: 'Verified' },
                        ]}
                        xAxis={[{ data: ['Business Admin', 'Customer Service', 'Project Mgmt'], scaleType: 'band' }]}
                        colors={[theme.palette.primary.main, theme.palette.success.main]}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedReport(null)}>Close</Button>
            <Button 
              variant="contained" 
              startIcon={<Download />}
              onClick={() => setExportDialogOpen(true)}
            >
              Export Report
            </Button>
          </DialogActions>
        </Dialog>

        {/* Export Dialog */}
        <Dialog 
          open={exportDialogOpen} 
          onClose={() => setExportDialogOpen(false)} 
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              Export Report
              <IconButton onClick={() => setExportDialogOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Export Format
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant={format === 'pdf' ? 'contained' : 'outlined'}
                    startIcon={<PictureAsPdf />}
                    onClick={() => setFormat('pdf')}
                  >
                    PDF
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant={format === 'excel' ? 'contained' : 'outlined'}
                    startIcon={<GridOn />}
                    onClick={() => setFormat('excel')}
                  >
                    Excel
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Options
              </Typography>
              <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Include executive summary" />
                <FormControlLabel control={<Checkbox defaultChecked />} label="Include detailed findings" />
                <FormControlLabel control={<Checkbox defaultChecked />} label="Include recommendations" />
                <FormControlLabel control={<Checkbox />} label="Include raw data" />
              </FormGroup>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={() => selectedReport && handleExportReport(selectedReport)}
            >
              Export Report
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default EQACenterReports;