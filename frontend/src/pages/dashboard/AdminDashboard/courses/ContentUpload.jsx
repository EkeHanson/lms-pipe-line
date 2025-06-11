import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  IconButton,
  useTheme
} from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';

const ContentUpload = ({ label, onFileChange }) => {
  const theme = useTheme();
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      onFileChange(selectedFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
    onFileChange(null);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        {label}
      </Typography>
      
      {file ? (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 1, 
          border: `1px dashed ${theme.palette.divider}`,
          borderRadius: 1
        }}>
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {file.name}
          </Typography>
          <IconButton onClick={handleRemove} size="small">
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Button
          component="label"
          variant="outlined"
          fullWidth
          startIcon={<CloudUpload />}
        >
          Upload File
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept="image/*"
          />
        </Button>
      )}
    </Box>
  );
};

export default ContentUpload;