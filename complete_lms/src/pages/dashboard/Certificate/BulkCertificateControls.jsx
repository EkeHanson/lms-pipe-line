import React, { useState, useContext, useEffect } from 'react';
import { CertificateContext } from '../../../contexts/CertificateContext';
import * as XLSX from 'xlsx';
import PreviewModal from '../Certificate/PreviewModal';
import './BulkCertificateControls.css';

const dummyRecipients = [
  { id: 1, fullName: "John Doe", email: "john@example.com", course: "Advanced React" },
  { id: 2, fullName: "Jane Smith", email: "jane@example.com", course: "Node.js Fundamentals" },
  { id: 3, fullName: "Alex Johnson", email: "alex@example.com", course: "UI/UX Design" },
  { id: 4, fullName: "Alex Ekwueme", email: "john@example.com", course: "Advanced React" },
  { id: 5, fullName: "Sarah Williams", email: "sarah@example.com", course: "Data Science" },
  { id: 6, fullName: "Michael Brown", email: "michael@example.com", course: "DevOps Engineering" },
  { id: 7, fullName: "Emily Davis", email: "emily@example.com", course: "Cloud Computing" },
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

  useEffect(() => {
    if (dataSource === 'api') {
      const fetchRecipients = async () => {
        setIsLoading(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          setRecipients(dummyRecipients);
          setColumns(['id', 'fullName', 'email', 'course']);
        } catch (error) {
          console.error("Error fetching recipients:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecipients();
    }
  }, [dataSource]);

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
        alert("Error processing Excel file. Please check the format.");
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
    alert('Template settings saved! These will be applied to all generated certificates.');
  };

  const previewCertificate = (recipientId) => {
    const recipient = recipients.find(r => 
      dataSource === 'api' ? r.id === recipientId : r === recipientId
    );
    if (recipient) {
      updateCertificate({
        ...templateData,
        recipientName: recipient[nameColumn],
        courseName: recipient[courseColumn] || ''
      });
    }
  };

  const generateAllCertificates = async () => {
    if (selectedRecipients.length === 0) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
      alert(`Successfully processed ${certs.length} certificates!`);
      
      if (certs.length > 0) {
        updateCertificate(certs[0]);
        setCurrentPreviewIndex(0);
        setShowPreview(true);
      }
    } catch (error) {
      console.error("Error generating certificates:", error);
      alert("Failed to generate certificates. Please try again.");
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

  const downloadAllCertificates = async (format) => {
    if (generatedCertificates.length === 0) return;
    
    setIsLoading(true);
    try {
      for (let i = 0; i < generatedCertificates.length; i++) {
        const cert = generatedCertificates[i];
        updateCertificate(cert);
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log(`Would download certificate for ${cert.recipientName} as ${format}`);
      }
      alert(`Download process completed for ${generatedCertificates.length} certificates!`);
    } catch (error) {
      console.error("Error downloading certificates:", error);
      alert("Failed to download certificates. Please try again.");
    } finally {
      setIsLoading(false);
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
    <div className="bulk-certificate-controls">
      <h3>Bulk Certificate Generator</h3>
      
      <div className="data-source-selector">
        <label>
          <input
            type="radio"
            checked={dataSource === 'api'}
            onChange={() => setDataSource('api')}
          />
          Use Sample API Data
        </label>
        <label>
          <input
            type="radio"
            checked={dataSource === 'excel'}
            onChange={() => setDataSource('excel')}
          />
          Upload Excel File
        </label>
      </div>
      
      {dataSource === 'excel' && (
        <div className="form-group">
          <label>Upload Excel File</label>
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            onChange={handleFileUpload} 
            disabled={isLoading}
          />
        </div>
      )}
      
      {columns.length > 0 && dataSource === 'excel' && (
        <div className="column-mapping">
          <div className="form-group">
            <label>Name Column</label>
            <select 
              value={nameColumn} 
              onChange={(e) => setNameColumn(e.target.value)}
              disabled={isLoading}
            >
              {columns.map((col, i) => (
                <option key={i} value={col}>{col}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Course Column (optional)</label>
            <select 
              value={courseColumn} 
              onChange={(e) => setCourseColumn(e.target.value)}
              disabled={isLoading}
            >
              <option value="">None</option>
              {columns.map((col, i) => (
                <option key={i} value={col}>{col}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      
      <div className="api-status">
        {isLoading ? (
          <div className="loading-indicator">Loading data...</div>
        ) : (
          <div className="success-message">
            {recipients.length} {dataSource === 'api' ? 'sample' : 'uploaded'} recipients available
          </div>
        )}
      </div>
      
      {recipients.length > 0 && (
        <>
          <div className="recipients-header">
            <h4>Select Recipients ({selectedRecipients.length} selected)</h4>
            <button 
              onClick={selectAllRecipients}
              className="select-all-btn"
            >
              {selectedRecipients.length === recipients.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="recipients-scroll">
            {recipients.map((recipient, index) => {
              const id = dataSource === 'api' ? recipient.id : index;
              return (
                <div 
                  key={dataSource === 'api' ? recipient.id : index}
                  className={`recipient-item ${selectedRecipients.includes(id) ? 'selected' : ''}`}
                  onClick={() => toggleRecipientSelection(id)}
                >
                  <div className="recipient-name">{recipient[nameColumn]}</div>
                  {courseColumn && recipient[courseColumn] && (
                    <div className="recipient-course">{recipient[courseColumn]}</div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
      
      <div className="bulk-actions">
        <button 
          onClick={saveTemplateData} 
          className="secondary"
          disabled={isLoading}
        >
          Save Template Settings
        </button>
        
        <button 
          onClick={() => previewCertificate(selectedRecipients[0])} 
          disabled={selectedRecipients.length === 0 || isLoading}
        >
          Preview Selected Certificate
        </button>
        
        <button 
          onClick={generateAllCertificates} 
          disabled={selectedRecipients.length === 0 || isLoading}
          className="primary"
        >
          {isLoading ? 'Generating...' : `Generate All (${selectedRecipients.length})`}
        </button>
        
        {generatedCertificates.length > 0 && (
          <>
            <button 
              onClick={() => {
                setCurrentPreviewIndex(0);
                updateCertificate(generatedCertificates[0]);
                setShowPreview(true);
              }}
              className="secondary"
            >
              Preview All Certificates
            </button>
            <button 
              onClick={() => downloadAllCertificates('pdf')}
              className="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : `Download All (${generatedCertificates.length})`}
            </button>
          </>
        )}
      </div>

      {showPreview && generatedCertificates.length > 0 && (
        <PreviewModal 
          onClose={() => setShowPreview(false)}
          onNavigate={navigatePreview}
          currentIndex={currentPreviewIndex}
          totalCertificates={generatedCertificates.length}
          onDownloadAll={() => downloadAllCertificates('pdf')}
        />
      )}
    </div>
  );
};

export default BulkCertificateControls;