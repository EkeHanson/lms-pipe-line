// Update your ChoiceModal.js
import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Typography, Button, Dialog , DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  Dashboard as DashboardIcon, 
} from '@mui/icons-material';
const ChoiceModal = ({ open, onClose, onNavigateToBuilder, onGenerateToken, loading, error }) => {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Choose Action
          </Typography>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Typography color="error" variant="body2" mb={2}>
              {error}
            </Typography>
          )}
          <Typography variant="body1" mb={2}>
            What would you like to do?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Button 
            variant="outlined" 
            onClick={onNavigateToBuilder}
            sx={{ flex: 1, mr: 1 }}
            disabled={loading}
          >
            Go to Certificate Builder
          </Button>
          <Button 
            variant="contained" 
            onClick={onGenerateToken}
            sx={{ flex: 1, ml: 1 }}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate CMVP Token'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  export default ChoiceModal