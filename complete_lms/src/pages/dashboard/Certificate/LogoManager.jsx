import React, { useContext, useState, useRef } from 'react';
import  {CertificateContext}  from '../../../contexts/CertificateContext';
import './Certificate.css';

const LogoManager = () => {
  const { certificate, addLogo, removeLogo } = useContext(CertificateContext);
  const fileInputRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        addLogo({
          image: event.target.result,
          position: getDefaultLogoPosition(certificate.logos.length)
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getDefaultLogoPosition = (index) => {
    const positions = [
      { x: 50, y: 50 },        // Top-left
      { x: '80%', y: 50 },     // Top-right
      { x: 50, y: '80%' },     // Bottom-left
      { x: '80%', y: '80%' }  // Bottom-right (but we'll use this for barcode)
    ];
    return positions[index] || { x: 50, y: 50 };
  };

  return (
    <div className="logo-manager">
      <h3>Add Logos</h3>
      <p>You can add up to 3 logos that will be placed in the corners of the certificate.</p>
      
      <div className="logo-controls">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleLogoUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <button 
          onClick={() => fileInputRef.current.click()}
          disabled={certificate.logos.length >= 3}
        >
          Add Logo
        </button>
      </div>

      <div className="existing-logos">
        <h3>Current Logos</h3>
        {certificate.logos.length === 0 ? (
          <p>No logos added yet</p>
        ) : (
          <div className="logo-grid">
            {certificate.logos.map((logo, index) => (
              <div key={index} className="logo-item">
                <img src={logo.image} alt={`Logo ${index + 1}`} />
                <button 
                  onClick={() => removeLogo(index)}
                  className="danger"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoManager;