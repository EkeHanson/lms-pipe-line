
import React, { useState } from 'react';
import {
  Paper, Typography, Box, Tabs, Tab, List, ListItem, ListItemText, ListItemAvatar, Avatar,
  ListItemSecondaryAction, IconButton, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, Snackbar, Alert
} from '@mui/material';
import { Message as MessageIcon, Send, Delete, Announcement } from '@mui/icons-material';
import { format } from 'date-fns';
import dummyData from './dummyData';

const InstructorMessages = ({ messages = dummyData.messages }) => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [openDialog, setOpenDialog] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ course: '', content: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleSendAnnouncement = () => {
    console.log('Sending announcement:', newAnnouncement);
    setOpenDialog(false);
    setNewAnnouncement({ course: '', content: '' });
    setSnackbar({ open: true, message: 'Announcement sent successfully', severity: 'success' });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Messages</Typography>
        <Button
          variant="contained"
          startIcon={<Announcement />}
          onClick={() => setOpenDialog(true)}
        >
          New Announcement
        </Button>
      </Box>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab value="inbox" label="Inbox" />
        <Tab value="sent" label="Sent" />
        <Tab value="announcements" label="Announcements" />
      </Tabs>

      <List>
        {messages.map(message => (
          <ListItem key={message.id} sx={{ bgcolor: message.read ? 'inherit' : 'action.selected' }}>
            <ListItemAvatar>
              <Avatar>
                <MessageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${message.sender} (${message.course})`}
              secondary={
                <>
                  <Typography variant="body2">{message.content}</Typography>
                  <Typography variant="caption">
                    {format(new Date(message.date), 'MMM dd, yyyy h:mm a')}
                  </Typography>
                </>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end">
                <Send />
              </IconButton>
              <IconButton edge="end">
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>New Announcement</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            value={newAnnouncement.course}
            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, course: e.target.value })}
            displayEmpty
            margin="normal"
            sx={{ mt: 2 }}
          >
            <MenuItem value="" disabled>Select Course</MenuItem>
            {dummyData.courses.map(c => (
              <MenuItem key={c.id} value={c.title}>{c.title}</MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            label="Announcement Content"
            multiline
            rows={4}
            value={newAnnouncement.content}
            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSendAnnouncement}
            disabled={!newAnnouncement.course || !newAnnouncement.content}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default InstructorMessages;
