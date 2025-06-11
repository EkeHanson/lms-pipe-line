import React, { useContext, useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { CertificateContext } from '../../../contexts/CertificateContext';
import './SignatureManager.css';

const SignatureManager = () => {
  const { certificate, addSignature, updateSignature, removeSignature } = useContext(CertificateContext);
  const [newSignature, setNewSignature] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    image: ''
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const fileInputRef = useRef(null);
  const sigCanvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('add');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSignature(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewSignature(prev => ({
          ...prev,
          image: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSignature = () => {
    if (newSignature.name && newSignature.image) {
      addSignature({
        ...newSignature,
        position: { 
          x: 100 + (certificate.signatures.length * 200), 
          y: 400 
        }
      });
      setNewSignature({
        name: '',
        date: new Date().toISOString().split('T')[0],
        image: ''
      });
      if (sigCanvasRef.current) {
        sigCanvasRef.current.clear();
      }
    }
  };

  const openDrawingPanel = () => {
    setIsDrawing(true);
  };

  const closeDrawingPanel = () => {
    setIsDrawing(false);
  };

  const trimCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    const copy = document.createElement('canvas').getContext('2d');
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const l = pixels.data.length;
    let i, bound = {
      top: null,
      left: null,
      right: null,
      bottom: null
    };
    
    for (i = 0; i < l; i += 4) {
      if (pixels.data[i+3] !== 0) {
        const x = (i / 4) % canvas.width;
        const y = Math.floor((i / 4) / canvas.width);
        
        if (bound.top === null) bound.top = y;
        if (bound.left === null || x < bound.left) bound.left = x;
        if (bound.right === null || x > bound.right) bound.right = x;
        if (bound.bottom === null || y > bound.bottom) bound.bottom = y;
      }
    }
    
    const trimHeight = bound.bottom - bound.top;
    const trimWidth = bound.right - bound.left;
    const trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);
    
    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = trimWidth;
    trimmedCanvas.height = trimHeight;
    trimmedCanvas.getContext('2d').putImageData(trimmed, 0, 0);
    
    return trimmedCanvas;
  };

  const saveDrawing = () => {
    if (sigCanvasRef.current) {
      const canvas = sigCanvasRef.current.getCanvas();
      const trimmedCanvas = trimCanvas(canvas);
      const signatureData = trimmedCanvas.toDataURL('image/png');
      
      setNewSignature(prev => ({
        ...prev,
        image: signatureData
      }));
      setIsDrawing(false);
    }
  };

  const clearDrawing = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
    }
  };

  return (
    <div className="signature-manager">
      <div className="manager-header">
        <h2>Signature Manager</h2>
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            Add Signature
          </button>
          <button 
            className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            Manage Signatures
          </button>
        </div>
      </div>

      {isDrawing && (
        <div className="drawing-modal">
          <div className="drawing-panel">
            <div className="drawing-header">
              <h3>Draw Your Signature</h3>
              <button className="close-btn" onClick={closeDrawingPanel}>
                &times;
              </button>
            </div>
            <div className="signature-canvas-container">
              <SignatureCanvas
                ref={sigCanvasRef}
                penColor="black"
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: 'signature-canvas'
                }}
              />
            </div>
            <div className="drawing-controls">
              <button className="clear-btn" onClick={clearDrawing}>
                Clear
              </button>
              <button className="save-btn" onClick={saveDrawing}>
                Save Signature
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'add' ? (
        <div className="signature-form-container">
          <div className="form-section">
            <div className="form-group">
              <label>Signer's Name</label>
              <input
                type="text"
                name="name"
                value={newSignature.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={newSignature.date}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Signature Method</label>
              <div className="upload-options">
                <button 
                  className="upload-btn"
                  onClick={() => fileInputRef.current.click()}
                >
                  <i className="icon-upload"></i> Upload Image
                </button>
                <button 
                  className="draw-btn"
                  onClick={openDrawingPanel}
                >
                  <i className="icon-draw"></i> Draw Signature
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {newSignature.image && (
            <div className="preview-section">
              <h4>Signature Preview</h4>
              <div className="signature-preview">
                <div className="signature-preview-box">
                  <img 
                    src={newSignature.image} 
                    alt="Signature Preview" 
                    onError={(e) => {
                      e.target.src = '';
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="signature-details">
                  <p><strong>Name:</strong> {newSignature.name || 'Not specified'}</p>
                  <p><strong>Date:</strong> {newSignature.date}</p>
                </div>
              </div>
              <button 
                className="add-signature-btn"
                onClick={handleAddSignature}
                disabled={!newSignature.name || !newSignature.image}
              >
                Add Signature to Document
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="existing-signatures">
          {certificate.signatures.length === 0 ? (
            <div className="empty-state">
              <i className="icon-empty"></i>
              <p>No signatures added yet</p>
            </div>
          ) : (
            <div className="signatures-grid">
              {certificate.signatures.map((sig, index) => (
                <div key={index} className="signature-card">
                  <div className="signature-image-container">
                    <img src={sig.image} alt={`Signature ${index + 1}`} />
                  </div>
                  <div className="signature-info">
                    <h4>{sig.name}</h4>
                    <p className="signature-date">{sig.date}</p>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeSignature(index)}
                  >
                    <i className="icon-delete"></i> Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SignatureManager;