// src/components/admin/certificateBuilder/SignatureManager.jsx
import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Button, 
  Tabs, 
  Tab, 
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { 
  Close as CloseIcon,
  Image as ImageIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import SignatureCanvas from 'react-signature-canvas';
import { useCertificate } from '../../../../contexts/CertificateContext';

const SignatureManager = () => {
  const { signatures, addSignature } = useCertificate();
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [signerName, setSignerName] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const sigCanvas = useRef(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleClear = () => {
    sigCanvas.current.clear();
  };

  const handleSave = () => {
    if (!signerName.trim()) {
      alert('Please enter signer name');
      return;
    }

    const signatureData = {
      id: Date.now(),
      name: signerName,
      date,
      type: tabValue === 0 ? 'image' : 'drawing',
      data: tabValue === 0 ? '' : sigCanvas.current.toDataURL()
    };

    addSignature(signatureData);
    setOpen(false);
    setSignerName('');
    setDate(new Date().toLocaleDateString());
    if (tabValue === 1) handleClear();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const signatureData = {
        id: Date.now(),
        name: signerName,
        date,
        type: 'image',
        data: event.target.result
      };
      addSignature(signatureData);
      setOpen(false);
      setSignerName('');
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Signature Management
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Button 
        fullWidth 
        variant="contained" 
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Add Signature
      </Button>

      {signatures.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Your Signatures:
          </Typography>
          {signatures.map((signature) => (
            <Box 
              key={signature.id} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                p: 1,
                border: '1px solid #eee',
                borderRadius: 1
              }}
            >
              {signature.type === 'image' || signature.type === 'drawing' ? (
                <img 
                  src={signature.data} 
                  alt={signature.name} 
                  style={{ 
                    width: 100, 
                    height: 50, 
                    objectFit: 'contain',
                    marginRight: 10
                  }} 
                />
              ) : (
                <Box sx={{ width: 100, height: 50, bgcolor: '#f5f5f5', mr: 1 }} />
              )}
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2">{signature.name}</Typography>
                <Typography variant="caption">{signature.date}</Typography>
              </Box>
              <IconButton size="small">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add New Signature
          <IconButton 
            onClick={() => setOpen(false)} 
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Upload Image" />
            <Tab label="Draw Signature" />
          </Tabs>

          <TextField
            fullWidth
            label="Signer Name"
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{ mb: 2 }}
          />

          {tabValue === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="signature-upload"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="signature-upload">
                <Button 
                  variant="outlined" 
                  component="span"
                  startIcon={<ImageIcon />}
                >
                  Upload Signature Image
                </Button>
              </label>
            </Box>
          ) : (
            <Box>
              <Box
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  height: 200,
                  position: 'relative'
                }}
              >
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="black"
                  canvasProps={{
                    width: '100%',
                    height: 200,
                    className: 'sigCanvas'
                  }}
                />
              </Box>
              <Button onClick={handleClear} sx={{ mt: 1 }}>
                Clear
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            disabled={!signerName.trim() || (tabValue === 1 && !sigCanvas.current?.isEmpty())}
          >
            Save Signature
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SignatureManager;