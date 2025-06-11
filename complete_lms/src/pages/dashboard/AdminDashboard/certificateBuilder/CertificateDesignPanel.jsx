// src/components/admin/certificateBuilder/CertificateDesignPanel.jsx
import React from 'react';
import { Box, Typography, TextField, Divider, Slider, MenuItem, Select } from '@mui/material';
import { useCertificate } from '../../../../contexts/CertificateContext';

const CertificateDesignPanel = () => {
  const {
    title,
    recipientName,
    courseName,
    completionDate,
    completionText,
    borderColor,
    borderWidth,
    borderStyle,
    background,
    updateText,
    updateStyle
  } = useCertificate();

  const borderStyles = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge'];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Design Settings
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <TextField
        label="Certificate Title"
        value={title}
        onChange={(e) => updateText('title', e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Recipient Name Placeholder"
        value={recipientName}
        onChange={(e) => updateText('recipientName', e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Course Name Placeholder"
        value={courseName}
        onChange={(e) => updateText('courseName', e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Completion Text"
        value={completionText}
        onChange={(e) => updateText('completionText', e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={2}
      />

      <Typography variant="subtitle2" sx={{ mt: 2 }}>
        Border Settings
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
        <TextField
          label="Border Color"
          type="color"
          value={borderColor}
          onChange={(e) => updateStyle('borderColor', e.target.value)}
          sx={{ width: 100 }}
        />

        <Select
          value={borderStyle}
          onChange={(e) => updateStyle('borderStyle', e.target.value)}
          sx={{ minWidth: 120 }}
        >
          {borderStyles.map((style) => (
            <MenuItem key={style} value={style}>
              {style}
            </MenuItem>
          ))}
        </Select>

        <Box sx={{ flexGrow: 1 }}>
          <Typography gutterBottom>Width: {borderWidth}px</Typography>
          <Slider
            value={borderWidth}
            onChange={(e, value) => updateStyle('borderWidth', value)}
            min={0}
            max={10}
            step={1}
          />
        </Box>
      </Box>

      <TextField
        label="Background Color"
        type="color"
        value={background}
        onChange={(e) => updateStyle('background', e.target.value)}
        fullWidth
        margin="normal"
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

// Make sure to include this default export
export default CertificateDesignPanel;