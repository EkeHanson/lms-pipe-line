import React from 'react';
import { FiDownload, FiX, FiImage, FiFileText } from 'react-icons/fi';
import { FaFilePdf } from 'react-icons/fa';
import './DownloadOptionsModal.css';

const DownloadOptionsModal = ({ onClose, onDownload }) => {
  return (
    <div className="download-modal-overlay">
      <div className="download-modal">
        <button className="close-button" onClick={onClose}>
          <FiX />
        </button>
        
        <h3>Download Options</h3>
        
        <div className="download-options">
          <button 
            className="download-option"
            onClick={() => onDownload('png')}
          >
            <FiImage className="option-icon" />
            <span>PNG Image</span>
          </button>
          
          <button 
            className="download-option"
            onClick={() => onDownload('jpeg')}
          >
            <FiImage className="option-icon" />
            <span>JPEG Image</span>
          </button>
          
          <button 
            className="download-option"
            onClick={() => onDownload('pdf')}
          >
            <FaFilePdf className="option-icon" />
            <span>PDF Document</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadOptionsModal;