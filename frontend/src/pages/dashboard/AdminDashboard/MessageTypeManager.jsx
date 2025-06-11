import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Tooltip, Typography
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Check as CheckIcon, Close as CloseIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { messagingAPI } from '../../../config';

const MessageTypeManager = ({ open, onClose, onUpdate }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [messageTypes, setMessageTypes] = useState([]);
  const [currentType, setCurrentType] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMessageTypes = async () => {
    setLoading(true);
    try {
      const response = await messagingAPI.getMessageTypes();
      setMessageTypes(response.data.results);
    } catch (error) {
      enqueueSnackbar('Failed to load message types', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMessageTypes();
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await messagingAPI.updateMessageType(currentType.id, {
          value: currentType.value,
          label: currentType.label
        });
        enqueueSnackbar('Message type updated successfully', { variant: 'success' });
      } else {
        await messagingAPI.createMessageType({
          value: currentType.value,
          label: currentType.label
        });
        enqueueSnackbar('Message type created successfully', { variant: 'success' });
      }
      setCurrentType(null);
      setEditMode(false);
      fetchMessageTypes();
      onUpdate();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.detail || 'Operation failed', { variant: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await messagingAPI.deleteMessageType(id);
      enqueueSnackbar('Message type deleted successfully', { variant: 'success' });
      fetchMessageTypes();
      onUpdate();
    } catch (error) {
      enqueueSnackbar('Failed to delete message type', { variant: 'error' });
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await messagingAPI.setDefaultMessageType(id);
      enqueueSnackbar('Default message type set', { variant: 'success' });
      fetchMessageTypes();
      onUpdate();
    } catch (error) {
      enqueueSnackbar('Failed to set default', { variant: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Manage Message Types
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {currentType ? (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Value (internal identifier)"
              value={currentType.value}
              onChange={(e) => setCurrentType({...currentType, value: e.target.value})}
              disabled={editMode}
              helperText="Lowercase letters, numbers and underscores only"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Display Label"
              value={currentType.label}
              onChange={(e) => setCurrentType({...currentType, label: e.target.value})}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                onClick={() => {
                  setCurrentType(null);
                  setEditMode(false);
                }}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                {editMode ? 'Update' : 'Create'}
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCurrentType({ value: '', label: '' })}
              >
                New Message Type
              </Button>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Value</TableCell>
                    <TableCell>Label</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {messageTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell>{type.value}</TableCell>
                      <TableCell>{type.label}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => {
                              setCurrentType(type);
                              setEditMode(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDelete(type.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Set as default">
                          <IconButton
                            onClick={() => handleSetDefault(type.id)}
                            color="primary"
                          >
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageTypeManager;