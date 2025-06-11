import React, { useState, useContext } from 'react'; // Added useContext import here
import { CertificateContext } from '../../../contexts/CertificateContext';
import { FaFileAlt, FaDownload, FaUndo, FaRedo, FaSave, FaShareAlt } from 'react-icons/fa';
import PreviewModal from '../Certificate/PreviewModal';
import './Toolbar.css';

const Toolbar = () => {
  const { certificate, updateCertificate } = useContext(CertificateContext);
  const [showPreview, setShowPreview] = useState(false);

  const handleNewCertificate = () => {
    if (window.confirm('Are you sure you want to create a new certificate? All current changes will be lost.')) {
      updateCertificate({
        title: "Certificate of Completion",
        recipientName: "",
        courseName: "",
        date: new Date().toLocaleDateString(),
        signatures: [],
        logos: [],
        template: "classic",
        barcodeData: "https://cmvp.net/verification/4b832a6e-bba1-4e15-b7d5-6da5657512f0/ARTS/"
      });
    }
  };

  const handleSave = () => {
    // First save to local storage
    localStorage.setItem('certificateData', JSON.stringify(certificate));
    // Then show preview
    setShowPreview(true);
  };

  const handleLoad = () => {
    const savedData = localStorage.getItem('certificateData');
    if (savedData) {
      if (window.confirm('Load saved certificate? Current changes will be lost.')) {
        updateCertificate(JSON.parse(savedData));
      }
    } else {
      alert('No saved certificate found');
    }
  };

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-left">
          <h1 className="app-title">Certificate Builder</h1>
        </div>
        
        <div className="toolbar-center">
          <button className="toolbar-button" onClick={handleNewCertificate}>
            <FaFileAlt className="toolbar-icon" />
            <span>New</span>
          </button>
          
          <button className="toolbar-button" onClick={handleSave}>
            <FaSave className="toolbar-icon" />
            <span>Preview & Save </span>
          </button>
          
          <button className="toolbar-button" onClick={handleLoad}>
            <FaFileAlt className="toolbar-icon" />
            <span>Load</span>
          </button>
        </div>
      </div>

      {showPreview && (
        <PreviewModal onClose={() => setShowPreview(false)} />
      )}
    </>
  );
};

export default Toolbar;