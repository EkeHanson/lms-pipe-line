import React, { useState, useMemo, useEffect } from 'react';
import { format as formatDate } from 'date-fns'; // Correct import
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
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormLabel,
  RadioGroup,
  Radio,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
  Stack
} from '@mui/material';
import {
  Description,
  Download,
  PictureAsPdf,
  InsertDriveFile,
  CalendarToday,
  FilterList,
  Refresh,
  HelpOutline,
  Visibility
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Sample data service
const reportService = {
  getQualifications: async () => [
    { id: 'all', name: 'All Qualifications' },
    { id: 'l2b', name: 'Level 2 Certificate in Business' },
    { id: 'l3ba', name: 'Level 3 Diploma in Business Administration' },
    { id: 'l4bm', name: 'Level 4 Diploma in Business Management' }
  ],
  getReportTypes: async () => [
    { id: 'sampling', name: 'Sampling Activities', description: 'Detailed records of internal verification sampling' },
    { id: 'verification', name: 'Verification Decisions', description: 'Summary of IQA decisions and outcomes' },
    { id: 'assessor', name: 'Assessor Feedback', description: 'Aggregated feedback provided to assessors' },
    { id: 'compliance', name: 'Compliance Report', description: 'Compliance with awarding body requirements' },
    { id: 'eqa', name: 'EQA Preparation', description: 'Documents for external quality assurance review' }
  ],
  generateReport: async (params) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, message: 'Report generated successfully' };
  }
};

const ReportStatusChip = ({ status }) => {
  const statusConfig = {
    generated: { color: 'success', label: 'Generated' },
    pending: { color: 'warning', label: 'Pending' },
    failed: { color: 'error', label: 'Failed' }
  };

  return (
    <Chip
      label={statusConfig[status]?.label || status}
      color={statusConfig[status]?.color || 'default'}
      size="small"
    />
  );
};

const ReportsGenerator = () => {
  const [reportType, setReportType] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [qualification, setQualification] = useState('');
  const [format, setFormat] = useState('pdf');
  const [selectedColumns, setSelectedColumns] = useState({
    learner: true,
    assessor: true,
    date: true,
    status: true,
    notes: true,
    criteria: true,
    unit: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportStatus, setReportStatus] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [reportTypes, setReportTypes] = useState([]);
  const [selectedReportTypeInfo, setSelectedReportTypeInfo] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [quals, types] = await Promise.all([
          reportService.getQualifications(),
          reportService.getReportTypes()
        ]);
        setQualifications(quals);
        setReportTypes(types);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (reportType && reportTypes.length) {
      const typeInfo = reportTypes.find(t => t.id === reportType);
      setSelectedReportTypeInfo(typeInfo);
    }
  }, [reportType, reportTypes]);

  const availableColumns = useMemo(() => {
    const baseColumns = [
      { id: 'learner', label: 'Learner Name', disabled: false },
      { id: 'assessor', label: 'Assessor', disabled: false },
      { id: 'date', label: 'Date', disabled: false },
      { id: 'status', label: 'Status', disabled: false }
    ];

    if (reportType === 'sampling' || reportType === 'verification') {
      baseColumns.push(
        { id: 'unit', label: 'Unit', disabled: false },
        { id: 'criteria', label: 'Criteria', disabled: false },
        { id: 'notes', label: 'Notes', disabled: false }
      );
    }

    if (reportType === 'assessor') {
      baseColumns.push(
        { id: 'feedback', label: 'Feedback', disabled: false },
        { id: 'actions', label: 'Actions', disabled: false }
      );
    }

    if (reportType === 'compliance') {
      baseColumns.push(
        { id: 'requirement', label: 'Requirement', disabled: false },
        { id: 'evidence', label: 'Evidence', disabled: false },
        { id: 'status', label: 'Compliance Status', disabled: false }
      );
    }

    return baseColumns;
  }, [reportType]);

  const sampleReportData = useMemo(() => {
    if (!reportType) return [];

    const baseData = [
      {
        learner: 'John Doe',
        assessor: 'Sarah Smith',
        date: formatDate(new Date(), 'yyyy-MM-dd'),
        status: 'Approved',
        notes: 'All criteria met',
        unit: 'Unit 1: Business Environment',
        criteria: '1.1, 1.2, 1.3',
        feedback: 'Excellent assessment practice',
        actions: 'No action required',
        requirement: 'Standardization meetings',
        evidence: 'Minutes from 05/05/2023'
      },
      {
        learner: 'Jane Smith',
        assessor: 'Michael Brown',
        date: formatDate(new Date(), 'yyyy-MM-dd'),
        status: 'Minor Issues',
        notes: 'Additional evidence required for criterion 2.3',
        unit: 'Unit 2: Administration',
        criteria: '2.1, 2.2, 2.3',
        feedback: 'Ensure consistent application of grading criteria',
        actions: 'Follow-up scheduled',
        requirement: 'Assessment records',
        evidence: 'Portfolio review 12/05/2023'
      }
    ];

    return baseData;
  }, [reportType]);

  const handleColumnToggle = (column) => {
    setSelectedColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setReportStatus(null);
    
    try {
      const params = {
        reportType,
        startDate: startDate ? formatDate(startDate, 'yyyy-MM-dd') : null,
        endDate: endDate ? formatDate(endDate, 'yyyy-MM-dd') : null,
        qualification,
        format,
        columns: Object.keys(selectedColumns).filter(key => selectedColumns[key])
      };

      const result = await reportService.generateReport(params);
      setReportStatus('generated');
    } catch (error) {
      console.error('Report generation failed:', error);
      setReportStatus('failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetForm = () => {
    setReportType('');
    setStartDate(null);
    setEndDate(null);
    setQualification('');
    setFormat('pdf');
    setSelectedColumns({
      learner: true,
      assessor: true,
      date: true,
      status: true,
      notes: true,
      criteria: true,
      unit: true
    });
    setReportStatus(null);
  };

  const isFormValid = reportType && qualification;
  const isReportGenerated = reportStatus === 'generated';

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4 
        }}>
          <Typography variant="h4" fontWeight="600">
            IQA Reports Generator
          </Typography>
          <Box>
            <Tooltip title="Reset form">
              <IconButton onClick={handleResetForm} sx={{ mr: 1 }}>
                <Refresh />
              </IconButton>
            </Tooltip>
            {isReportGenerated && (
              <Button
                variant="contained"
                color="success"
                startIcon={<Download />}
                sx={{ ml: 1 }}
              >
                Download Report
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center' 
                }}>
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

                {selectedReportTypeInfo && (
                  <Paper elevation={0} sx={{ 
                    p: 2, 
                    mb: 3, 
                    backgroundColor: 'action.hover',
                    borderRadius: 1
                  }}>
                    <Typography variant="body2">
                      {selectedReportTypeInfo.description}
                    </Typography>
                  </Paper>
                )}

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
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={setEndDate}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        minDate={startDate}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Qualification *</InputLabel>
                  <Select
                    value={qualification}
                    label="Qualification *"
                    onChange={(e) => setQualification(e.target.value)}
                    required
                  >
                    {qualifications.map((qual) => (
                      <MenuItem key={qual.id} value={qual.id}>
                        {qual.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <FormLabel component="legend">Output Format</FormLabel>
                  <RadioGroup
                    row
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                  >
                    <FormControlLabel
                      value="pdf"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PictureAsPdf sx={{ mr: 1 }} />
                          PDF
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="excel"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <InsertDriveFile sx={{ mr: 1 }} />
                          Excel
                        </Box>
                      }
                    />
                  </RadioGroup>
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
                  <Box sx={{ 
                    mt: 2, 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ReportStatusChip status={reportStatus} />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Column Selection
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {reportType ? (
                  <>
                    <FormGroup row sx={{ mb: 3, gap: 2 }}>
                      {availableColumns.map((column) => (
                        <FormControlLabel
                          key={column.id}
                          control={
                            <Checkbox
                              checked={selectedColumns[column.id] ?? false}
                              onChange={() => handleColumnToggle(column.id)}
                              disabled={column.disabled}
                            />
                          }
                          label={column.label}
                        />
                      ))}
                    </FormGroup>

                    <Typography variant="subtitle1" gutterBottom sx={{ 
                      display: 'flex', 
                      alignItems: 'center'
                    }}>
                      Report Preview
                      <Tooltip title="This shows a sample of how your report will look">
                        <HelpOutline sx={{ ml: 1, fontSize: 16 }} color="action" />
                      </Tooltip>
                    </Typography>

                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            {availableColumns.map(
                              (column) =>
                                selectedColumns[column.id] && (
                                  <TableCell key={column.id}>{column.label}</TableCell>
                                )
                            )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {sampleReportData.map((row, index) => (
                            <TableRow key={index}>
                              {availableColumns.map(
                                (column) =>
                                  selectedColumns[column.id] && (
                                    <TableCell key={column.id}>
                                      {row[column.id]}
                                    </TableCell>
                                  )
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => window.print()}
                      >
                        Print Preview
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Download />}
                        disabled={!isReportGenerated}
                      >
                        Export Data
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <Paper elevation={0} sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    backgroundColor: 'action.hover'
                  }}>
                    <Description sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      Select a report type to configure columns and preview
                    </Typography>
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default ReportsGenerator;