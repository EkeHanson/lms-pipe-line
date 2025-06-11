
import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const ModuleForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    order: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log('Submitting module:', formData);
    onSubmit();
    setFormData({ title: '', order: '' });
  };

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>Add New Module</Typography>
      <TextField
        fullWidth
        label="Module Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Order"
        name="order"
        type="number"
        value={formData.order}
        onChange={handleChange}
        margin="normal"
        required
      />
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmit}
        disabled={!formData.title || !formData.order}
      >
        Add Module
      </Button>
    </Box>
  );
};

export default ModuleForm;
