// src/components/admin/certificateBuilder/BulkGenerator.jsx
import React, { useState } from 'react';
import { 
  Box, Typography, Divider, Button, 
  Stepper, Step, StepLabel, Paper,
  Grid, TextField, MenuItem, Table,
  TableBody, TableCell, TableContainer,
  TableHead, TableRow, Checkbox, 
  FormControlLabel, CircularProgress
} from '@mui/material';
import { Upload as UploadIcon, Download as DownloadIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { useCertificate } from '../../../../contexts/CertificateContext';

const steps = ['Select Data Source', 'Map Fields', 'Review & Generate'];

const BulkGenerator = () => {
  const { template } = useCertificate();
  const [activeStep, setActiveStep] = useState(0);
  const [dataSource, setDataSource] = useState('sample');
  const [fileData, setFileData] = useState(null);
  const [mappedFields, setMappedFields] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCertificates, setGeneratedCertificates] = useState([]);

  const sampleData = [
    { id: 1, fullName: 'John Doe', course: 'Advanced React', completionDate: '2023-05-15' },
    { id: 2, fullName: 'Jane Smith', course: 'Node.js Fundamentals', completionDate: '2023-06-20' },
    { id: 3, fullName: 'Bob Johnson', course: 'Database Design', completionDate: '2023-07-10' },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      
      setFileData(jsonData);
      // Auto-map fields if possible
      const firstRow = jsonData[0];
      const autoMapped = {};
      if (firstRow) {
        Object.keys(firstRow).forEach(key => {
          if (key.toLowerCase().includes('name')) autoMapped.recipientName = key;
          if (key.toLowerCase().includes('course')) autoMapped.courseName = key;
          if (key.toLowerCase().includes('date')) autoMapped.completionDate = key;
        });
      }
      setMappedFields(autoMapped);
    };
    
    reader.readAsArrayBuffer(file);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = (dataSource === 'sample' ? sampleData : fileData).map((row) => row.id);
      setSelectedRows(newSelected);
      return;
    }
    setSelectedRows([]);
  };

  const handleSelectRow = (id) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedRows, id];
    } else {
      newSelected = selectedRows.filter((rowId) => rowId !== id);
    }

    setSelectedRows(newSelected);
  };

  const generateCertificates = () => {
    setIsGenerating(true);
    
    // Simulate generation process
    setTimeout(() => {
      const data = dataSource === 'sample' ? sampleData : fileData;
      const filteredData = data.filter(item => selectedRows.includes(item.id));
      
      const certificates = filteredData.map(item => ({
        ...item,
        certificateData: {
          recipientName: mappedFields.recipientName ? item[mappedFields.recipientName] : '',
          courseName: mappedFields.courseName ? item[mappedFields.courseName] : '',
          completionDate: mappedFields.completionDate ? item[mappedFields.completionDate] : '',
          template: template
        }
      }));
      
      setGeneratedCertificates(certificates);
      setIsGenerating(false);
      handleNext();
    }, 2000);
  };

  const downloadAll = () => {
    // In a real implementation, this would generate and zip all certificates
    alert(`Preparing to download ${generatedCertificates.length} certificates`);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select Data Source
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={dataSource === 'sample'}
                        onChange={() => setDataSource('sample')}
                      />
                    }
                    label="Use Sample Data"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Generate certificates using our built-in sample data for testing.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={dataSource === 'file'}
                        onChange={() => setDataSource('file')}
                      />
                    }
                    label="Upload Excel File"
                  />
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    sx={{ mt: 1 }}
                    disabled={dataSource !== 'file'}
                  >
                    Upload File
                    <input 
                      type="file" 
                      hidden 
                      accept=".xlsx,.xls,.csv" 
                      onChange={handleFileUpload}
                    />
                  </Button>
                  {fileData && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {fileData.length} records loaded
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        const data = dataSource === 'sample' ? sampleData : fileData;
        
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Map Fields and Select Recipients
            </Typography>
            
            {data && (
              <>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      select
                      fullWidth
                      label="Recipient Name"
                      value={mappedFields.recipientName || ''}
                      onChange={(e) => setMappedFields({...mappedFields, recipientName: e.target.value})}
                    >
                      {Object.keys(data[0]).map((field) => (
                        <MenuItem key={field} value={field}>
                          {field}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      select
                      fullWidth
                      label="Course Name"
                      value={mappedFields.courseName || ''}
                      onChange={(e) => setMappedFields({...mappedFields, courseName: e.target.value})}
                    >
                      {Object.keys(data[0]).map((field) => (
                        <MenuItem key={field} value={field}>
                          {field}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      select
                      fullWidth
                      label="Completion Date"
                      value={mappedFields.completionDate || ''}
                      onChange={(e) => setMappedFields({...mappedFields, completionDate: e.target.value})}
                    >
                      {Object.keys(data[0]).map((field) => (
                        <MenuItem key={field} value={field}>
                          {field}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
                
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Select recipients ({selectedRows.length} selected)
                </Typography>
                
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                            checked={selectedRows.length === data.length}
                            onChange={handleSelectAll}
                          />
                        </TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Recipient</TableCell>
                        <TableCell>Course</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.slice(0, 10).map((row) => (
                        <TableRow key={row.id}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedRows.indexOf(row.id) !== -1}
                              onChange={() => handleSelectRow(row.id)}
                            />
                          </TableCell>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>
                            {mappedFields.recipientName ? row[mappedFields.recipientName] : 'Not mapped'}
                          </TableCell>
                          <TableCell>
                            {mappedFields.courseName ? row[mappedFields.courseName] : 'Not mapped'}
                          </TableCell>
                          <TableCell>
                            {mappedFields.completionDate ? row[mappedFields.completionDate] : 'Not mapped'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Generation Complete
            </Typography>
            
            {isGenerating ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Generating certificates...</Typography>
              </Box>
            ) : (
              <>
                <Typography sx={{ mb: 2 }}>
                  Successfully generated {generatedCertificates.length} certificates.
                </Typography>
                
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={downloadAll}
                  sx={{ mt: 2 }}
                >
                  Download All Certificates
                </Button>
                
                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                  Preview of first certificate:
                </Typography>
                
                {generatedCertificates.length > 0 && (
                  <Paper sx={{ p: 2 }}>
                    <Typography><strong>Recipient:</strong> {generatedCertificates[0].certificateData.recipientName}</Typography>
                    <Typography><strong>Course:</strong> {generatedCertificates[0].certificateData.courseName}</Typography>
                    <Typography><strong>Date:</strong> {generatedCertificates[0].certificateData.completionDate}</Typography>
                    <Typography><strong>Template:</strong> {generatedCertificates[0].certificateData.template}</Typography>
                  </Paper>
                )}
              </>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Bulk Certificate Generator
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {renderStepContent(activeStep)}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        
        {activeStep === steps.length - 1 ? null : (
          <Button
            variant="contained"
            onClick={activeStep === 1 ? generateCertificates : handleNext}
            disabled={
              (activeStep === 0 && !dataSource) ||
              (activeStep === 1 && selectedRows.length === 0)
            }
          >
            {activeStep === 1 ? 'Generate Certificates' : 'Next'}
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default BulkGenerator;