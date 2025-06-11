// BarcodeGenerator.jsx
import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const BarcodeGenerator = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (data && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, data, { width: 120 }, (error) => {
        if (error) console.error('Error generating QR code:', error);
      });
    }
  }, [data]);

  return <canvas ref={canvasRef} />;
};

export default BarcodeGenerator;