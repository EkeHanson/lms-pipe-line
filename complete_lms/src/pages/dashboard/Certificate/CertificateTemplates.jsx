import React, { useContext, useState } from 'react';
import { CertificateContext } from '../../../contexts/CertificateContext';
import './CertificateTemplates.css';

// Static imports
import classicImg from '../../../assets/templates/classic.jpg'; 
import modernImg from '../../../assets/templates/modern.jpg';
import elegantImg from '../../../assets/templates/elegant.png';
import minimalImg from '../../../assets/templates/minimal.jpg';

const CertificateTemplates = () => {
  const { certificate, updateCertificate } = useContext(CertificateContext);
  const [customTemplates, setCustomTemplates] = useState([]);

  const templates = [
    {
      id: 'classic',
      name: 'Classic',
      thumbnail: classicImg,
      image: classicImg
    },
    {
      id: 'modern',
      name: 'Modern', 
      thumbnail: modernImg,
      image: modernImg
    },
    {
      id: 'elegant',
      name: 'Elegant',
      thumbnail: elegantImg,
      image: elegantImg
    },
    {
      id: 'minimal',
      name: 'Minimal',
      thumbnail: minimalImg,
      image: minimalImg
    },
    ...customTemplates
  ];

  const handleTemplateSelect = (template) => {
    updateCertificate({
      template: template.id,
      templateImage: template.image
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const newTemplate = {
        id: `custom-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        thumbnail: e.target.result,
        image: e.target.result
      };
      setCustomTemplates(prev => [...prev, newTemplate]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="templates-container">
      <h3 className="templates-title">Select Template</h3>
      
      <div className="template-upload">
        <label className="upload-button">
          Upload Custom Template
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>
      </div>
      
      <div className="templates-scrollable">
        <div className="templates-grid">
          {templates.map(template => (
            <div
              key={template.id}
              className={`template-card ${certificate.template === template.id ? 'active' : ''}`}
              onClick={() => handleTemplateSelect(template)}
            >
              <img
                src={template.thumbnail}
                alt={template.name}
                className="template-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/120x80?text=Template';
                }}
              />
              <span className="template-label">{template.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplates;