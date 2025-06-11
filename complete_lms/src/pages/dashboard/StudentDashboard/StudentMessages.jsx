import React, { useState, useEffect, useCallback } from 'react';
import { 
  Paper, Typography, List, ListItem, ListItemIcon, 
  ListItemText, Chip, Button, CircularProgress, 
  Badge, IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Avatar, ListItemAvatar,
  Divider, Tooltip, Box
} from '@mui/material';
import { 
  Message as MessageIcon, Refresh, Send, Close,
  Reply, Forward, Attachment, MarkEmailRead, 
  MarkEmailUnread, Email
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import { messagingAPI } from '../../../config';

const StudentMessages = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [replyMode, setReplyMode] = useState(false);
  const [forwardMode, setForwardMode] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState(null);

  // Fetch messages for the current user
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const [messagesRes, unreadRes] = await Promise.all([
        messagingAPI.getMessages({
          read_status: 'all',
          page_size: 50
        }),
        messagingAPI.getUnreadCount()
      ]);
      setMessages(messagesRes.data.results || []);
      setUnreadCount(unreadRes.data.count || 0);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages. Please try again.');
      enqueueSnackbar('Failed to load messages', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  // Mark a message as read
  const markAsRead = async (messageId) => {
    try {
      await messagingAPI.markAsRead(messageId);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, is_read: true } : msg
      ));
      setUnreadCount(prev => prev - 1);
    } catch (err) {
      console.error('Failed to mark message as read:', err);
    }
  };

  // Handle message click
  const handleMessageClick = (messageId) => {
    setExpandedMessage(expandedMessage === messageId ? null : messageId);
    const message = messages.find(m => m.id === messageId);
    if (message && !message.is_read) {
      markAsRead(messageId);
    }
  };

  // Handle opening dialog for reply/forward/compose
  const handleOpenDialog = (message = null, reply = false, forward = false) => {
    if (message) {
      if (reply) {
        setCurrentMessage({
          subject: `Re: ${message.subject}`,
          content: `\n\n---------- Original Message ----------\nFrom: ${message.sender.first_name} ${message.sender.last_name}\nDate: ${format(new Date(message.sent_at), 'MMM d, yyyy - h:mm a')}\nSubject: ${message.subject}\n\n${message.content}`,
          parent_message: message.id
        });
        setReplyMode(true);
      } else if (forward) {
        setCurrentMessage({
          subject: `Fwd: ${message.subject}`,
          content: `\n\n---------- Forwarded Message ----------\nFrom: ${message.sender.first_name} ${message.sender.last_name}\nDate: ${format(new Date(message.sent_at), 'MMM d, yyyy - h:mm a')}\nSubject: ${message.subject}\n\n${message.content}`,
          parent_message: message.id,
          is_forward: true
        });
        setForwardMode(true);
      }
    } else {
      setCurrentMessage({
        subject: '',
        content: '',
        attachments: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReplyMode(false);
    setForwardMode(false);
    setCurrentMessage(null);
  };

  // Send message handler
  const handleSendMessage = async () => {
    try {
      const formData = new FormData();
      formData.append('subject', currentMessage.subject);
      formData.append('content', currentMessage.content);
      formData.append('status', 'sent');
      
      if (currentMessage.parent_message) {
        formData.append('parent_message', currentMessage.parent_message);
      }
      
      if (currentMessage.is_forward) {
        formData.append('is_forward', 'true');
      }
      
      await messagingAPI.createMessage(formData);
      
      enqueueSnackbar(
        replyMode ? 'Reply sent successfully!' : 
        forwardMode ? 'Message forwarded successfully!' : 
        'Message sent successfully!',
        { variant: 'success' }
      );
      
      fetchMessages();
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar('Error sending message', { variant: 'error' });
      console.error('Error sending message:', error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />}
          onClick={fetchMessages}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Paper>
    );
  }

  if (messages.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography>No messages found</Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            Messages
            <Badge badgeContent={unreadCount} color="error" sx={{ ml: 2 }}>
              <Email fontSize="small" />
            </Badge>
          </Typography>
          <Box>
            <Button 
              variant="contained" 
              startIcon={<Send />}
              onClick={() => handleOpenDialog()}
              size="small"
              sx={{ mr: 1 }}
            >
              New Message
            </Button>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchMessages}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <List>
          {messages.map(msg => (
            <React.Fragment key={msg.id}>
              <ListItem
                sx={{
                  borderLeft: msg.important ? '3px solid red' : 'none',
                  bgcolor: !msg.is_read ? '#e3f2fd' : 'inherit',
                  mb: 1,
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
                onClick={() => handleMessageClick(msg.id)}
              >
                <ListItemIcon>
                  {msg.is_read ? (
                    <MarkEmailRead color="action" />
                  ) : (
                    <MarkEmailUnread color="primary" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ fontWeight: msg.is_read ? 'normal' : 'bold', flexGrow: 1 }}
                      >
                        {msg.subject}
                      </Typography>
                      <Chip 
                        label={msg.message_type_display}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" noWrap>
                        From: {msg.sender.first_name} {msg.sender.last_name}
                      </Typography>
                      <Typography variant="caption">
                        {format(new Date(msg.sent_at), 'MMM dd, h:mm a')}
                      </Typography>
                    </>
                  }
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Reply">
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(msg, true);
                      }}
                      color="secondary"
                    >
                      <Reply fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Forward">
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(msg, false, true);
                      }}
                      color="secondary"
                    >
                      <Forward fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ListItem>
              
              {expandedMessage === msg.id && (
                <Box sx={{ pl: 9, pr: 2, pb: 2 }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                    {msg.content}
                  </Typography>
                  
                  {msg.attachments.length > 0 && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle2">Attachments:</Typography>
                      <List dense>
                        {msg.attachments.map((attachment, index) => (
                          <ListItem key={index}>
                            <ListItemAvatar>
                              <Avatar>
                                <Attachment />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                              primary={attachment.original_filename}
                              secondary={
                                <a href={attachment.file} target="_blank" rel="noopener noreferrer">
                                  Download
                                </a>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                  
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2">Recipients:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {msg.recipients.map((recipient, i) => (
                      <Chip 
                        key={i} 
                        label={recipient.recipient ? 
                          `${recipient.recipient.first_name} ${recipient.recipient.last_name}` : 
                          recipient.recipient_group.name}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Message Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          {replyMode ? 'Reply to Message' : forwardMode ? 'Forward Message' : 'Compose New Message'}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            label="Subject"
            fullWidth
            value={currentMessage?.subject || ''}
            onChange={(e) => setCurrentMessage({...currentMessage, subject: e.target.value})}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Message Content"
            fullWidth
            multiline
            rows={8}
            value={currentMessage?.content || ''}
            onChange={(e) => setCurrentMessage({...currentMessage, content: e.target.value})}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage} 
            variant="contained" 
            startIcon={<Send />}
            disabled={!currentMessage?.subject || !currentMessage?.content}
          >
            {replyMode ? 'Send Reply' : forwardMode ? 'Forward' : 'Send Message'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StudentMessages;
