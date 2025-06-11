import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography, FormControl, InputLabel, Select, MenuItem, Switch,
  TextField, CircularProgress, Alert,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, Paper,
  useTheme, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { paymentAPI, paymentMethods, currencies } from '../../../config';

function PaymentSettings() {
  const theme = useTheme();
  const [paymentConfigs, setPaymentConfigs] = useState([]);
  const [currency, setCurrency] = useState('');
  const [newMethod, setNewMethod] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [hasExistingPaymentConfig, setHasExistingPaymentConfig] = useState(false);
  const [hasExistingSiteConfig, setHasExistingSiteConfig] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch configs on mount
  useEffect(() => {
    const fetchConfigs = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch payment config
        const paymentResponse = await paymentAPI.getPaymentConfig();
        const paymentData = paymentResponse.data;
        if (Object.keys(paymentData).length > 0) {
          setPaymentConfigs(paymentData.configs || []);
          setHasExistingPaymentConfig(true);
        }

        // Fetch site config
        const siteResponse = await paymentAPI.getSiteConfig();
        const siteData = siteResponse.data;
        if (Object.keys(siteData).length > 0) {
          setCurrency(siteData.currency || 'USD');
          setHasExistingSiteConfig(true);
        }
      } catch (err) {
        setError('Failed to fetch configurations. Please try again.');
        console.error('Error fetching configs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfigs();
  }, []);

  // Add a new payment method
  const handleAddMethod = () => {
    if (newMethod && !paymentConfigs.some(config => config.method === newMethod)) {
      const methodConfig = {
        method: newMethod,
        config: {},
        isActive: false,
      };
      setPaymentConfigs([...paymentConfigs, methodConfig]);
      setNewMethod('');
      setSuccess(`Added ${newMethod} to the configuration. Save to persist changes.`);
    }
  };

  // Update a field in a payment method
  const handleFieldChange = (methodIndex, key, value) => {
    setPaymentConfigs(prev => {
      const newConfigs = [...prev];
      newConfigs[methodIndex] = {
        ...newConfigs[methodIndex],
        config: {
          ...newConfigs[methodIndex].config,
          [key]: value,
        },
      };
      return newConfigs;
    });
  };

  // Toggle isActive status
  const handleToggleActive = (index) => {
    setPaymentConfigs(prev => {
      const newConfigs = [...prev];
      newConfigs[index] = {
        ...newConfigs[index],
        isActive: !newConfigs[index].isActive,
      };
      return newConfigs;
    });
    setSuccess('Changes made. Save to persist changes.');
  };

  // Delete a payment method
  const handleDeleteMethod = (index) => {
    const methodName = paymentConfigs[index].method;
    setPaymentConfigs(prev => prev.filter((_, i) => i !== index));
    setSuccess(`Removed ${methodName} from the configuration. Save to persist changes.`);
  };

  // Open save confirmation dialog
  const handleSave = () => {
    setOpenConfirm(true);
  };

  // Save configurations
  const handleConfirmSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Save payment config
      const paymentData = { configs: paymentConfigs };
      if (hasExistingPaymentConfig) {
        await paymentAPI.updatePaymentConfig(paymentData);
      } else {
        await paymentAPI.createPaymentConfig(paymentData);
      }

      // Save site config
      const siteData = { currency };
      if (hasExistingSiteConfig) {
        await paymentAPI.updateSiteConfig(siteData);
      } else {
        await paymentAPI.createSiteConfig(siteData);
      }

      setHasExistingPaymentConfig(true);
      setHasExistingSiteConfig(true);
      setSuccess('Payment settings saved successfully!');
      setOpenConfirm(false);
    } catch (err) {
      setError('Failed to save configurations. Please try again.');
      console.error('Error saving configs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete entire payment configuration
  const handleDeleteConfig = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await paymentAPI.deletePaymentConfig();
      setPaymentConfigs([]);
      setHasExistingPaymentConfig(false);
      setSuccess('Payment configuration deleted successfully!');
    } catch (err) {
      setError('Failed to delete payment configuration. Please try again.');
      console.error('Error deleting config:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Payment Settings
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3, maxWidth: 800 }}>
        {/* Currency Selection */}
        <FormControl fullWidth sx={{ mb: 3, maxWidth: 200 }}>
          <InputLabel>Currency</InputLabel>
          <Select
            value={currency}
            label="Currency"
            onChange={(e) => {
              setCurrency(e.target.value);
              setSuccess('Currency changed. Save to persist changes.');
            }}
          >
            {currencies.map(curr => (
              <MenuItem key={curr} value={curr}>
                {curr}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Add Payment Method */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200, mr: 2 }}>
            <InputLabel>Add Payment Method</InputLabel>
            <Select
              value={newMethod}
              label="Add Payment Method"
              onChange={(e) => setNewMethod(e.target.value)}
            >
              <MenuItem value="">
                <em>Select a method</em>
              </MenuItem>
              {paymentMethods
                .filter(method => !paymentConfigs.some(config => config.method === method.name))
                .map(method => (
                  <MenuItem key={method.name} value={method.name}>
                    {method.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddMethod}
            disabled={!newMethod}
          >
            Add Method
          </Button>
        </Box>

        {/* Payment Methods List */}
        <List>
          {paymentConfigs.map((config, index) => {
            const methodDetails = paymentMethods.find(m => m.name === config.method);
            return (
              <ListItem
                key={config.method}
                sx={{
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  mb: 2,
                  bgcolor: 'background.default',
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
                  <ListItemText
                    primary={config.method}
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                  <Box>
                    <Switch
                      checked={config.isActive}
                      onChange={() => handleToggleActive(index)}
                      color="primary"
                      sx={{ mr: 1 }}
                    />
                    <IconButton
                      onClick={() => handleDeleteMethod(index)}
                      edge="end"
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                {methodDetails.fields.map(field => (
                  <TextField
                    key={field.key}
                    fullWidth
                    label={field.label}
                    value={config.config[field.key] || ''}
                    onChange={(e) => handleFieldChange(index, field.key, e.target.value)}
                    sx={{ mb: 2 }}
                    variant="outlined"
                    type={field.key.toLowerCase().includes('secret') ? 'password' : 'text'}
                  />
                ))}
              </ListItem>
            );
          })}
        </List>

        {/* Action Buttons */}
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading || (!currency && paymentConfigs.length === 0)}
          >
            Save Settings
          </Button>
          {hasExistingPaymentConfig && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteConfig}
              disabled={loading}
            >
              Delete Configuration
            </Button>
          )}
        </Box>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', mb: 2 }}>
          Confirm Changes
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {hasExistingPaymentConfig || hasExistingSiteConfig ? 'update' : 'save'} these payment settings?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenConfirm(false)}
            variant="outlined"
            sx={{ mr: 1 }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSave}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PaymentSettings;