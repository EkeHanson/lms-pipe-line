// === File: BulkCertificateControls.jsx ===
import React, { useState, useContext } from 'react';
import { CertificateContext } from '../../../contexts/CertificateContext';
import * as XLSX from 'xlsx';
import { 
  Box, 
  Typography, 
  Button, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Paper,
  Checkbox,
  Divider
} from '@mui/material';
import PreviewModal from '../Certificate/PreviewModal';

const dummyRecipients = [
  { id: 1, fullName: "John Doe", email: "john@example.com", course: "Advanced React" },
  { id: 2, fullName: "Jane Smith", email: "jane@example.com", course: "Node.js Fundamentals" },
  { id: 3, fullName: "Alex Johnson", email: "alex@example.com", course: "UI/UX Design" },
];

const BulkCertificateControls = () => {
  const { certificate, updateCertificate } = useContext(CertificateContext);
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [templateData, setTemplateData] = useState({});
  const [dataSource, setDataSource] = useState('api');
  const [columns, setColumns] = useState([]);
  const [nameColumn, setNameColumn] = useState('fullName');
  const [courseColumn, setCourseColumn] = useState('course');
  const [generatedCertificates, setGeneratedCertificates] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setIsLoading(true);
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        if (jsonData.length > 0) {
          setRecipients(jsonData);
          setColumns(Object.keys(jsonData[0]));
          const firstRow = jsonData[0];
          const autoNameCol = Object.keys(firstRow).find(k => 
            k.match(/name|fullname|student/i)
          );
          const autoCourseCol = Object.keys(firstRow).find(k => 
            k.match(/course|subject|class/i)
          );
          if (autoNameCol) setNameColumn(autoNameCol);
          if (autoCourseCol) setCourseColumn(autoCourseCol);
        }
      } catch (error) {
        console.error("Error processing Excel file:", error);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const toggleRecipientSelection = (id) => {
    setSelectedRecipients(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const saveTemplateData = () => {
    const { recipientName, ...currentTemplate } = certificate;
    setTemplateData(currentTemplate);
  };

  const generateAllCertificates = async () => {
    if (selectedRecipients.length === 0) return;
    
    setIsLoading(true);
    try {
      const certs = selectedRecipients.map(id => {
        const recipient = recipients.find(r => 
          dataSource === 'api' ? r.id === id : r === id
        );
        return {
          ...templateData,
          recipientName: recipient[nameColumn],
          courseName: recipient[courseColumn] || ''
        };
      });

      setGeneratedCertificates(certs);
      
      if (certs.length > 0) {
        updateCertificate(certs[0]);
        setCurrentPreviewIndex(0);
        setShowPreview(true);
      }
    } catch (error) {
      console.error("Error generating certificates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigatePreview = (direction) => {
    let newIndex = currentPreviewIndex;
    if (direction === 'prev' && currentPreviewIndex > 0) {
      newIndex = currentPreviewIndex - 1;
    } else if (direction === 'next' && currentPreviewIndex < generatedCertificates.length - 1) {
      newIndex = currentPreviewIndex + 1;
    }
    
    if (newIndex !== currentPreviewIndex) {
      setCurrentPreviewIndex(newIndex);
      updateCertificate(generatedCertificates[newIndex]);
    }
  };

  const selectAllRecipients = () => {
    if (selectedRecipients.length === recipients.length) {
      setSelectedRecipients([]);
    } else {
      setSelectedRecipients(
        dataSource === 'api' 
          ? recipients.map(r => r.id) 
          : [...recipients]
      );
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Bulk Certificate Generator</Typography>
      
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <RadioGroup 
          row 
          value={dataSource} 
          onChange={(e) => setDataSource(e.target.value)}
        >
          <FormControlLabel 
            value="api" 
            control={<Radio />} 
            label="Use Sample API Data" 
          />
          <FormControlLabel 
            value="excel" 
            control={<Radio />} 
            label="Upload Excel File" 
          />
        </RadioGroup>
      </FormControl>
      
      {dataSource === 'excel' && (
        <Box sx={{ mb: 3 }}>
          <Button 
            variant="contained"
            component="label"
            disabled={isLoading}
          >
            Upload Excel File
            <input 
              type="file" 
              hidden 
              accept=".xlsx, .xls, .csv" 
              onChange={handleFileUpload} 
            />
          </Button>
        </Box>
      )}
      
      {columns.length > 0 && dataSource === 'excel' && (
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Name Column</InputLabel>
            <Select 
              value={nameColumn} 
              onChange={(e) => setNameColumn(e.target.value)}
              disabled={isLoading}
            >
              {columns.map((col, i) => (
                <MenuItem key={i} value={col}>{col}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth size="small">
            <InputLabel>Course Column</InputLabel>
            <Select 
              value={courseColumn} 
              onChange={(e) => setCourseColumn(e.target.value)}
              disabled={isLoading}
            >
              <MenuItem value="">None</MenuItem>
              {columns.map((col, i) => (
                <MenuItem key={i} value={col}>{col}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Typography variant="body2" sx={{ mb: 2 }}>
          {recipients.length} {dataSource === 'api' ? 'sample' : 'uploaded'} recipients available
        </Typography>
      )}
      
      {recipients.length > 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1">
              Select Recipients ({selectedRecipients.length} selected)
            </Typography>
            <Button 
              onClick={selectAllRecipients}
              size="small"
            >
              {selectedRecipients.length === recipients.length ? 'Deselect All' : 'Select All'}
            </Button>
          </Box>
          
          <Paper sx={{ maxHeight: 300, overflow: 'auto', mb: 3 }}>
            {recipients.map((recipient, index) => {
              const id = dataSource === 'api' ? recipient.id : index;
              return (
                <Box 
                  key={dataSource === 'api' ? recipient.id : index}
                  sx={{
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: selectedRecipients.includes(id) ? 'action.selected' : 'background.paper',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      cursor: 'pointer'
                    }
                  }}
                  onClick={() => toggleRecipientSelection(id)}
                >
                  <Checkbox 
                    checked={selectedRecipients.includes(id)}
                    onChange={() => toggleRecipientSelection(id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Box sx={{ ml: 1 }}>
                    <Typography>{recipient[nameColumn]}</Typography>
                    {courseColumn && recipient[courseColumn] && (
                      <Typography variant="body2" color="text.secondary">
                        {recipient[courseColumn]}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Paper>
        </>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button 
          variant="outlined"
          onClick={saveTemplateData} 
          disabled={isLoading}
        >
          Save Template Settings
        </Button>
        
        <Button 
          variant="outlined"
          onClick={() => previewCertificate(selectedRecipients[0])} 
          disabled={selectedRecipients.length === 0 || isLoading}
        >
          Preview Selected Certificate
        </Button>
        
        <Button 
          variant="contained"
          onClick={generateAllCertificates} 
          disabled={selectedRecipients.length === 0 || isLoading}
        >
          {isLoading ? 'Generating...' : `Generate All (${selectedRecipients.length})`}
        </Button>
        
        {generatedCertificates.length > 0 && (
          <>
            <Button 
              variant="outlined"
              onClick={() => {
                setCurrentPreviewIndex(0);
                updateCertificate(generatedCertificates[0]);
                setShowPreview(true);
              }}
            >
              Preview All Certificates
            </Button>
            <Button 
              variant="contained"
              onClick={() => downloadAllCertificates('pdf')}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : `Download All (${generatedCertificates.length})`}
            </Button>
          </>
        )}
      </Box>

      {showPreview && generatedCertificates.length > 0 && (
        <PreviewModal 
          onClose={() => setShowPreview(false)}
          onNavigate={navigatePreview}
          currentIndex={currentPreviewIndex}
          totalCertificates={generatedCertificates.length}
          onDownloadAll={() => downloadAllCertificates('pdf')}
        />
      )}
    </Box>
  );
};

export default BulkCertificateControls;