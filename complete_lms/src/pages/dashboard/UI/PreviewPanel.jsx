import React, { useContext } from 'react';
import { CertificateContext } from '../../contexts/CertificateContext';
import { toPng, toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';
import Certificate from '../Certificate/Certificate';
import './PreviewPanel.css';

const PreviewPanel = () => {
  const { certificate } = useContext(CertificateContext);
  const certificateRef = React.useRef(null);

  const downloadCertificate = async (format) => {
    if (!certificateRef.current) return;

    try {
      let dataUrl;
      const options = {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      };

      switch (format) {
        case 'png':
          dataUrl = await toPng(certificateRef.current, options);
          saveAs(dataUrl, `${certificate.recipientName || 'certificate'}.png`);
          break;
        case 'jpeg':
          dataUrl = await toJpeg(certificateRef.current, options);
          saveAs(dataUrl, `${certificate.recipientName || 'certificate'}.jpg`);
          break;
        case 'pdf':
          alert('PDF export would be implemented with jsPDF');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  return (
    <div className="preview-panel">
      <h3>Preview & Export</h3>
      
      <div className="preview-container">
        <div className="certificate-preview" ref={certificateRef}>
          <Certificate isPreview={true} />
        </div>
      </div>

      <div className="export-options">
        <h4>Export Options</h4>
        <div className="export-buttons">
          <button onClick={() => downloadCertificate('png')}>PNG</button>
          <button onClick={() => downloadCertificate('jpeg')}>JPEG</button>
          <button onClick={() => downloadCertificate('pdf')}>PDF</button>
        </div>
      </div>

      <div className="certificate-info">
        <h4>Certificate Details</h4>
        <ul>
          <li><strong>Recipient:</strong> {certificate.recipientName || "Not specified"}</li>
          <li><strong>Course:</strong> {certificate.courseName || "Not specified"}</li>
          <li><strong>Date:</strong> {certificate.date}</li>
          <li><strong>Signatures:</strong> {certificate.signatures.length}</li>
          <li><strong>Logos:</strong> {certificate.logos.length}</li>
        </ul>
      </div>
    </div>
  );
};

export default PreviewPanel;