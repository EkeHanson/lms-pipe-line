import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem, Snackbar, 
  Tooltip, Link, Chip, Autocomplete, Checkbox, FormControlLabel, 
  FormGroup, Divider, useMediaQuery, IconButton, Stack, 
  Collapse, Card, CardContent, CardActions, List, ListItem, 
  ListItemText, ListItemAvatar, Avatar, TablePagination, Grid,
  LinearProgress, CircularProgress, Badge
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, 
  Send as SendIcon, Email as EmailIcon, Person as PersonIcon,
  Group as GroupIcon, MoreVert as MoreIcon, ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon, MarkEmailRead as ReadIcon,
  MarkEmailUnread as UnreadIcon, Reply as ReplyIcon,
  Forward as ForwardIcon, Attachment as AttachmentIcon,
  Search as SearchIcon, FilterList as FilterIcon, Refresh as RefreshIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { messagingAPI, groupsAPI, userAPI } from '../../../config';
import MessageTypeManager from './MessageTypeManager';
import { debounce } from 'lodash';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const statusOptions = [
  { value: 'sent', label: 'Sent' },
  { value: 'draft', label: 'Draft' },
];

const Messaging = () => {
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [messageTypeDialogOpen, setMessageTypeDialogOpen] = useState(false);
  // State management
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [messageTypes, setMessageTypes] = useState([]); // New state for message types
  const [isUploading, setIsUploading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [replyMode, setReplyMode] = useState(false);
  const [forwardMode, setForwardMode] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const fileInputRef = useRef(null);

  // Pagination state for messages
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    page: 1
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state for messages
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    dateFrom: null,
    dateTo: null,
    readStatus: 'all'
  });

  // WebSocket integration
  const { lastMessage, sendMessage } = useWebSocket(
    `ws://${window.location.host}/ws/messages/`
  );

  // Fetch users with search query
  const fetchUsers = useCallback(async (searchQuery = '') => {
    try {
      const params = {
        search: searchQuery,
        page_size: 50,
      };
      const usersRes = await userAPI.getUsers(params);
      setUsers(usersRes.data.results || []);
    } catch (error) {
      enqueueSnackbar('Failed to load users', { variant: 'error' });
      console.error('Error fetching users:', error);
    }
  }, [enqueueSnackbar]);

  // Debounced user search
  const debouncedFetchUsers = useCallback(
    debounce((query) => {
      fetchUsers(query);
    }, 300),
    [fetchUsers]
  );

  // Handle user search input
  const handleUserSearch = (event, value) => {
    setUserSearchQuery(value);
    debouncedFetchUsers(value);
  };

  // Fetch message types
  const fetchMessageTypes = async () => {
    try {
      const response = await messagingAPI.getMessageTypes();
      // Ensure response.data is an array; fallback to empty array if not
      setMessageTypes(Array.isArray(response.data.results) ? response.data.results : []);
    } catch (error) {
      enqueueSnackbar('Failed to load message types', { variant: 'error' });
      console.error('Error fetching message types:', error);
      setMessageTypes([]); // Fallback to empty array on error
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        page_size: rowsPerPage,
        ...(filters.search && { search: filters.search }),
        ...(filters.type !== 'all' && { type: filters.type }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.readStatus !== 'all' && { read_status: filters.readStatus }),
        ...(filters.dateFrom && { date_from: format(filters.dateFrom, 'yyyy-MM-dd') }),
        ...(filters.dateTo && { date_to: format(filters.dateTo, 'yyyy-MM-dd') })
      };
  
      const [messagesRes, groupsRes, unreadRes, messageTypesRes] = await Promise.all([
        messagingAPI.getMessages(params),
        groupsAPI.getGroups(),
        messagingAPI.getUnreadCount(),
        messagingAPI.getMessageTypes()
      ]);
      setMessages(messagesRes.data.results || []);
      setGroups(groupsRes.data.results || []);
      setUnreadCount(unreadRes.data.count || 0);
      setMessageTypes(messageTypesRes.data.results || []);
      setPagination({
        count: messagesRes.data.count || 0,
        next: messagesRes.data.next,
        previous: messagesRes.data.previous,
        page: pagination.page
      });
  
      await fetchUsers();
    } catch (error) {
      setError(error.message);
      enqueueSnackbar('Failed to load data', { variant: 'error' });
      setMessageTypes([]); // Fallback to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, rowsPerPage, filters]);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      if (data.type === 'new_message') {
        if (pagination.page === 1) {
          setMessages(prev => [data.message, ...prev.slice(0, -1)]);
          setPagination(prev => ({
            ...prev,
            count: prev.count + 1
          }));
        } else {
          setPagination(prev => ({
            ...prev,
            count: prev.count + 1
          }));
        }
        if (!data.message.is_read) {
          setUnreadCount(prev => prev + 1);
        }
      } else if (data.type === 'message_read') {
        setMessages(prev => prev.map(m => 
          m.id === data.message_id ? { ...m, is_read: true } : m
        ));
      }
    }
  }, [lastMessage, pagination.page]);

  // Helper functions
  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'MMM d, yyyy - h:mm a');
  };

  const handleOpenDialog = (message = null, reply = false, forward = false) => {
    const defaultMessage = { 
      subject: '', 
      message_type: messageTypes.length > 0 ? messageTypes[0] : { id: null, value: 'personal', label: 'Personal Message' }, 
      content: '',
      status: 'draft',
      attachments: []
    };

    if (message) {
      if (reply) {
        setCurrentMessage({
          ...defaultMessage,
          subject: `Re: ${message.subject}`,
          content: `\n\n---------- Original Message ----------\nFrom: ${message.sender.first_name} ${message.sender.last_name}\nDate: ${formatDate(message.sent_at)}\nSubject: ${message.subject}\n\n${message.content}`,
          parent_message: message.id
        });
        setSelectedUsers([{ 
          id: message.sender.id, 
          email: message.sender.email,
          first_name: message.sender.first_name,
          last_name: message.sender.last_name
        }]);
        setReplyMode(true);
      } else if (forward) {
        setCurrentMessage({
          ...defaultMessage,
          subject: `Fwd: ${message.subject}`,
          content: `\n\n---------- Forwarded Message ----------\nFrom: ${message.sender.first_name} ${message.sender.last_name}\nDate: ${formatDate(message.sent_at)}\nSubject: ${message.subject}\n\n${message.content}`,
          parent_message: message.id,
          is_forward: true
        });
        setForwardMode(true);
      } else {
        setCurrentMessage(message);
        setSelectedUsers(message.recipients.filter(r => r.recipient).map(r => ({
          id: r.recipient.id,
          email: r.recipient.email,
          first_name: r.recipient.first_name,
          last_name: r.recipient.last_name
        })));
        setSelectedGroups(message.recipients.filter(r => r.recipient_group).map(r => ({
          id: r.recipient_group.id,
          name: r.recipient_group.name
        })));
        setAttachments(message.attachments);
      }
    } else {
      setCurrentMessage(defaultMessage);
      setSelectedUsers([]);
      setSelectedGroups([]);
      setAttachments([]);
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReplyMode(false);
    setForwardMode(false);
    setCurrentMessage(null);
    setSelectedUsers([]);
    setSelectedGroups([]);
    setAttachments([]);
  };

  const handleSendMessage = async () => {
    try {
        const formData = new FormData();
        formData.append('subject', currentMessage.subject);
        formData.append('content', currentMessage.content);
        
        // Ensure message_type is the ID
        formData.append('message_type', currentMessage.message_type.id || currentMessage.message_type);
        
        formData.append('status', 'sent');
        
        if (currentMessage.parent_message) {
            formData.append('parent_message', currentMessage.parent_message);
        }
        
        if (currentMessage.is_forward) {
            formData.append('is_forward', 'true');
        }
        
        selectedUsers.forEach(user => 
            formData.append('recipient_users', user.id)
        );
        
        selectedGroups.forEach(group => 
            formData.append('recipient_groups', group.id)
        );
        
        attachments.forEach(attachment => {
            if (attachment.file) {
                formData.append('attachments', attachment.file);
            }
        });
        
        const response = currentMessage.id 
            ? await messagingAPI.updateMessage(currentMessage.id, formData)
            : await messagingAPI.createMessage(formData);
        
        enqueueSnackbar(
            replyMode ? 'Reply sent successfully!' : 
            forwardMode ? 'Message forwarded successfully!' : 
            'Message sent successfully!',
            { variant: 'success' }
        );
        
        fetchData();
        handleCloseDialog();
    } catch (error) {
        enqueueSnackbar('Error sending message', { variant: 'error' });
        console.error('Error sending message:', error);
    }
};
  const handleSaveDraft = async () => {
    try {
      const formData = new FormData();
      formData.append('subject', currentMessage.subject);
      formData.append('content', currentMessage.content);
      formData.append('message_type', currentMessage.message_type);
      formData.append('status', 'draft');
      
      selectedUsers.forEach(user => 
        formData.append('recipient_users', user.id)
      );
      
      selectedGroups.forEach(group => 
        formData.append('recipient_groups', group.id)
      );
      
      const response = currentMessage.id 
        ? await messagingAPI.updateMessage(currentMessage.id, formData)
        : await messagingAPI.createMessage(formData);
      
      enqueueSnackbar('Draft saved successfully!', { variant: 'success' });
      fetchData();
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar('Error saving draft', { variant: 'error' });
      console.error('Error saving draft:', error);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await messagingAPI.deleteMessage(id);
      enqueueSnackbar('Message deleted successfully!', { variant: 'success' });
      fetchData();
    } catch (error) {
      enqueueSnackbar('Error deleting message', { variant: 'error' });
      console.error('Error deleting message:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await messagingAPI.markAsRead(id);
      setMessages(prev => prev.map(m => 
        m.id === id ? { ...m, is_read: true } : m
      ));
      setUnreadCount(prev => prev - 1);
      sendMessage(JSON.stringify({
        type: 'mark_as_read',
        message_id: id
      }));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleRemoveRecipient = (recipientToRemove) => {
    if (recipientToRemove.email) {
      setSelectedUsers(selectedUsers.filter(user => user.id !== recipientToRemove.id));
    } else {
      setSelectedGroups(selectedGroups.filter(group => group.id !== recipientToRemove.id));
    }
  };

  const toggleExpandMessage = (messageId) => {
    setExpandedMessage(expandedMessage === messageId ? null : messageId);
    if (expandedMessage !== messageId) {
      const message = messages.find(m => m.id === messageId);
      if (message && !message.is_read) {
        handleMarkAsRead(messageId);
      }
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      status: 'all',
      dateFrom: null,
      dateTo: null,
      readStatus: 'all'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleAddAttachment = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const newAttachments = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        newAttachments.push({
          file,
          original_filename: file.name,
          id: `temp-${Date.now()}-${i}`,
          uploaded_at: new Date().toISOString()
        });
      }
      
      setAttachments(prev => [...prev, ...newAttachments]);
    } catch (error) {
      enqueueSnackbar('Error adding attachments', { variant: 'error' });
      console.error('Error adding attachments:', error);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveAttachment = (attachmentId) => {
    setAttachments(prev => prev.filter(a => a.id !== attachmentId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
        return 'primary';
      case 'draft':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleChangePage = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // console.log("messages")
  // console.log(messages)
  // console.log("messages")

  // Mobile view for messages
  const renderMobileMessageCards = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {messages.map((message) => (
        <Card key={message.id} elevation={3}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {message.is_read ? <ReadIcon color="action" /> : <UnreadIcon color="primary" />}
                <Typography variant="subtitle1" component="div" sx={{ fontWeight: message.is_read ? 'normal' : 'bold' }}>
                  {message.subject}
                </Typography>
              </Box>
              <IconButton onClick={() => toggleExpandMessage(message.id)}>
                {expandedMessage === message.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Typography color="text.secondary" gutterBottom>
              From: {message.sender.email}  • {formatDate(message.sent_at)}
            </Typography>
            
            <Collapse in={expandedMessage === message.id}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                  {message.content}
                </Typography>
                
                {message.attachments.length > 0 && (
                  <>
                    <Typography variant="subtitle2">Attachments:</Typography>
                    <List dense>
                      {message.attachments.map((attachment, index) => (
                        <ListItem key={index}>
                          <ListItemAvatar>
                            <Avatar>
                              <AttachmentIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary={attachment.original_filename} 
                            secondary={
                              <Link href={attachment.file} target="_blank" rel="noopener noreferrer">
                                Download
                              </Link>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
                
                <Typography variant="subtitle2" sx={{ mt: 2 }}>Recipients:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                  {message.recipients.map((recipient, i) => (
                    <Chip 
                      key={i} 
                      label={recipient.recipient ? 
                        `${recipient.recipient.first_name} ${recipient.recipient.last_name}` : 
                        recipient.recipient_group.name}
                      size="small" 
                      icon={recipient.recipient_group ? <GroupIcon /> : <PersonIcon />}
                    />
                  ))}
                </Box>
              </Box>
            </Collapse>
          </CardContent>
          <CardActions sx={{ justifyContent: 'space-between' }}>
            <Box>
              <Button 
                size="small" 
                startIcon={<ReplyIcon />}
                onClick={() => handleOpenDialog(message, true)}
                color="secondary"
              >
                Reply
              </Button>
              <Button 
                size="small" 
                startIcon={<ForwardIcon />}
                onClick={() => handleOpenDialog(message, false, true)}
                sx={{ ml: 1 }}
                color="secondary"
              >
                Forward
              </Button>
            </Box>
            <Box>
              {message.status === 'draft' && (
                <Button 
                  size="small" 
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenDialog(message)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
              )}
              <Button 
                size="small" 
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteMessage(message.id)}
                color="error"
              >
                Delete
              </Button>
            </Box>
          </CardActions>
        </Card>
      ))}
    </Box>
  );

  // Desktop view for messages
  // const renderDesktopMessageTable = () => (
  //   <TableContainer component={Paper}>
  //     <Table>
  //       <TableHead>
  //         <TableRow>
  //           <TableCell width="40px"></TableCell>
  //           <TableCell>Subject</TableCell>
  //           <TableCell>Type</TableCell>
  //           <TableCell>From</TableCell>
  //           <TableCell>Date</TableCell>
  //           <TableCell>Recipients</TableCell>
  //           <TableCell>Actions</TableCell>
  //         </TableRow>
  //       </TableHead>
  //       <TableBody>
  //         {messages.map((message) => (
  //           <TableRow 
  //             key={message.id} 
  //             hover 
  //             sx={{ 
  //               '&:hover': { cursor: 'pointer' },
  //               backgroundColor: expandedMessage === message.id ? 'action.hover' : 'inherit'
  //             }}
  //             onClick={() => toggleExpandMessage(message.id)}
  //           >
  //             <TableCell>
  //               {message.is_read ? <ReadIcon color="action" /> : <UnreadIcon color="primary" />}
  //             </TableCell>
  //             <TableCell>
  //               <Typography sx={{ fontWeight: message.is_read ? 'normal' : 'bold' }}>
  //                 {message.subject}
  //               </Typography>
  //             </TableCell>
  //             <TableCell>
  //               <Chip 
  //                 label={messageTypes.find(t => t.value === message.message_type)?.label || message.message_type_display}
  //                 size="small"
  //                 color={getStatusColor(message.status)}
  //               />
  //             </TableCell>
  //             <TableCell>
  //               {message.sender.email}
  //             </TableCell>
  //             <TableCell>{formatDate(message.sent_at)}</TableCell>
  //             <TableCell>
  //               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
  //                 {message.recipients.slice(0, 2).map((recipient, i) => (
  //                   <Chip 
  //                     key={i} 
  //                     label={recipient.recipient ? 
  //                       `${recipient.recipient.first_name} ${recipient.recipient.last_name}` : 
  //                       recipient.recipient_group.name}
  //                     size="small" 
  //                     icon={recipient.recipient_group ? <GroupIcon /> : <PersonIcon />}
  //                   />
  //                 ))}
  //                 {message.recipients.length > 2 && (
  //                   <Chip label={`+${message.recipients.length - 2}`} size="small" />
  //                 )}
  //               </Box>
  //             </TableCell>
  //             <TableCell>
  //               <Stack direction="row" spacing={1}>
  //                 <Tooltip title="Reply">
  //                   <IconButton 
  //                     size="small" 
  //                     onClick={(e) => {
  //                       e.stopPropagation();
  //                       handleOpenDialog(message, true);
  //                     }}
  //                     color="secondary"
  //                   >
  //                     <ReplyIcon />
  //                   </IconButton>
  //                 </Tooltip>
  //                 <Tooltip title="Forward">
  //                   <IconButton 
  //                     size="small" 
  //                     onClick={(e) => {
  //                       e.stopPropagation();
  //                       handleOpenDialog(message, false, true);
  //                     }}
  //                     color="secondary"
  //                   >
  //                     <ForwardIcon />
  //                   </IconButton>
  //                 </Tooltip>
  //                 {message.status === 'draft' && (
  //                   <Tooltip title="Edit">
  //                     <IconButton 
  //                       size="small" 
  //                       onClick={(e) => {
  //                         e.stopPropagation();
  //                         handleOpenDialog(message);
  //                       }}
  //                     >
  //                       <EditIcon />
  //                     </IconButton>
  //                   </Tooltip>
  //                 )}
  //                 <Tooltip title="Delete">
  //                   <IconButton 
  //                     size="small" 
  //                     onClick={(e) => {
  //                       e.stopPropagation();
  //                       handleDeleteMessage(message.id);
  //                     }}
  //                     color="error"
  //                   >
  //                     <DeleteIcon />
  //                   </IconButton>
  //                 </Tooltip>
  //               </Stack>
  //             </TableCell>
  //           </TableRow>
  //         ))}
  //       </TableBody>
  //     </Table>
  //   </TableContainer>
  // );
  const renderDesktopMessageTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width="40px"></TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>From</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Recipients</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {messages.map((message) => (
            <React.Fragment key={message.id}>
              <TableRow 
                hover 
                sx={{ 
                  '&:hover': { cursor: 'pointer' },
                  backgroundColor: expandedMessage === message.id ? 'action.hover' : 'inherit'
                }}
                onClick={() => toggleExpandMessage(message.id)}
              >
                <TableCell>
                  {message.is_read ? <ReadIcon color="action" /> : <UnreadIcon color="primary" />}
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: message.is_read ? 'normal' : 'bold' }}>
                    {message.subject}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={messageTypes.find(t => t.value === message.message_type)?.label || message.message_type_display}
                    size="small"
                    color={getStatusColor(message.status)}
                  />
                </TableCell>
                <TableCell>
                  {message.sender.email}
                </TableCell>
                <TableCell>{formatDate(message.sent_at)}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {message.recipients.slice(0, 2).map((recipient, i) => (
                      <Chip 
                        key={i} 
                        label={recipient.recipient ? 
                          `${recipient.recipient.first_name} ${recipient.recipient.last_name}` : 
                          recipient.recipient_group.name}
                        size="small" 
                        icon={recipient.recipient_group ? <GroupIcon /> : <PersonIcon />}
                      />
                    ))}
                    {message.recipients.length > 2 && (
                      <Chip label={`+${message.recipients.length - 2}`} size="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Reply">
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(message, true);
                        }}
                        color="secondary"
                      >
                        <ReplyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Forward">
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(message, false, true);
                        }}
                        color="secondary"
                      >
                        <ForwardIcon />
                      </IconButton>
                    </Tooltip>
                    {message.status === 'draft' && (
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDialog(message);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(message.id);
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ padding: 0 }} colSpan={7}>
                  <Collapse in={expandedMessage === message.id} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 3, backgroundColor: 'background.paper' }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                        {message.content}
                      </Typography>
                      
                      {message.attachments.length > 0 && (
                        <>
                          <Typography variant="subtitle2" sx={{ mt: 2 }}>Attachments:</Typography>
                          <List dense>
                            {message.attachments.map((attachment, index) => (
                              <ListItem key={index}>
                                <ListItemAvatar>
                                  <Avatar>
                                    <AttachmentIcon />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                  primary={attachment.original_filename} 
                                  secondary={
                                    <Link href={attachment.file} target="_blank" rel="noopener noreferrer">
                                      Download
                                    </Link>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </>
                      )}
                      
                      <Typography variant="subtitle2" sx={{ mt: 2 }}>Recipients:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                        {message.recipients.map((recipient, i) => (
                          <Chip 
                            key={i} 
                            label={recipient.recipient ? 
                              `${recipient.recipient.first_name} ${recipient.recipient.last_name}` : 
                              recipient.recipient_group.name}
                            size="small" 
                            icon={recipient.recipient_group ? <GroupIcon /> : <PersonIcon />}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
  // User Autocomplete rendering
  const renderUserAutocomplete = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        Select Users
      </Typography>
      <Autocomplete
        multiple
        options={users}
        getOptionLabel={(option) =>
          `${option.first_name} ${option.last_name} (${option.email})`
        }
        value={selectedUsers}
        onChange={(event, newValue) => setSelectedUsers(newValue)}
        onInputChange={handleUserSearch}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search users"
            placeholder="Select individual users"
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.id}
              label={`${option.first_name} ${option.last_name}`}
              icon={<PersonIcon />}
              onDelete={() => handleRemoveRecipient(option)}
            />
          ))
        }
      />
    </Box>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Messaging Center
          <Badge badgeContent={unreadCount} color="error" sx={{ ml: 2 }}>
            <EmailIcon />
          </Badge>
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<SendIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ mb: 3 }}
          fullWidth={isMobile}
        >
          New Message
        </Button>

        <Button 
          variant="outlined" 
          startIcon={<EditIcon />}
          onClick={() => setMessageTypeDialogOpen(true)}
          sx={{ mb: 3, ml: 2 }}
        >
          Manage Message Types
        </Button>
      
        {/* Filters Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search messages..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
            <TextField
              select
              margin="dense"
              label="Message Type"
              fullWidth
              value={currentMessage?.message_type?.id || ''}
              onChange={(e) => {
                const selectedType = messageTypes.find(type => type.id === e.target.value);
                setCurrentMessage({...currentMessage, message_type: selectedType});
              }}
              sx={{ mb: 2 }}
              disabled={messageTypes.length === 0}
            >
              {messageTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="sent">Sent</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Read Status"
                value={filters.readStatus}
                onChange={(e) => handleFilterChange('readStatus', e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="read">Read</MenuItem>
                <MenuItem value="unread">Unread</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6} sm={3} md={1}>
              <DatePicker
                label="From"
                value={filters.dateFrom}
                onChange={(newValue) => handleFilterChange('dateFrom', newValue)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={1}>
              <DatePicker
                label="To"
                value={filters.dateTo}
                onChange={(newValue) => handleFilterChange('dateTo', newValue)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={1} sx={{ textAlign: 'right' }}>
              <Tooltip title="Reset Filters">
                <IconButton onClick={resetFilters}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Filter Options">
                <IconButton>
                  <FilterIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>

        {loading ? (
          <LinearProgress />
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography>No messages found</Typography>
          </Box>
        ) : isMobile ? renderMobileMessageCards() : renderDesktopMessageTable()}

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pagination.count}
          rowsPerPage={rowsPerPage}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Message Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="md" 
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            {replyMode ? 'Reply to Message' : forwardMode ? 'Forward Message' : currentMessage?.id ? 'Edit Message' : 'Compose New Message'}
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
              <CloseIcon />
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
              select
              margin="dense"
              label="Message Type"
              fullWidth
              value={currentMessage?.message_type || (messageTypes.length > 0 ? messageTypes[0].value : '')}
              onChange={(e) => setCurrentMessage({...currentMessage, message_type: e.target.value})}
              sx={{ mb: 2 }}
              disabled={messageTypes.length === 0}
            >
              {messageTypes.map((type) => (
                <MenuItem key={type.value} value={type.id}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Recipients
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {renderUserAutocomplete()}

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Select Groups</Typography>
              <Autocomplete
                multiple
                options={groups}
                getOptionLabel={(option) => option.name}
                value={selectedGroups}
                onChange={(event, newValue) => setSelectedGroups(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search groups"
                    placeholder="Select groups"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.id}
                      label={option.name}
                      icon={<GroupIcon />}
                      onDelete={() => handleRemoveRecipient(option)}
                    />
                  ))
                }
              />
            </Box>

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

            <Box sx={{ mb: 2 }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAddAttachment}
                style={{ display: 'none' }}
                multiple
              />
              <Button 
                variant="outlined" 
                startIcon={<AttachmentIcon />}
                onClick={() => fileInputRef.current.click()}
                disabled={isUploading}
              >
                Add Attachment
                {isUploading && (
                  <CircularProgress size={24} sx={{ ml: 1 }} />
                )}
              </Button>
            </Box>

            {attachments.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Attachments:</Typography>
                <List dense>
                  {attachments.map((attachment) => (
                    <ListItem 
                      key={attachment.id}
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          onClick={() => handleRemoveAttachment(attachment.id)}
                        >
                          <CloseIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <AttachmentIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={attachment.original_filename}
                        secondary={attachment.file_url ? (
                          <Link href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                            Download
                          </Link>
                        ) : null}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            {!replyMode && !forwardMode && currentMessage?.status === 'draft' && (
              <Button 
                onClick={handleSaveDraft} 
                color="inherit"
                disabled={isUploading}
              >
                Save Draft
              </Button>
            )}
            <Button 
              onClick={handleCloseDialog} 
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendMessage} 
              variant="contained" 
              startIcon={<SendIcon />}
              disabled={
                !currentMessage?.subject || 
                !currentMessage?.content || 
                !currentMessage?.message_type ||
                (selectedUsers.length === 0 && selectedGroups.length === 0) ||
                isUploading
              }
            >
              {replyMode ? 'Send Reply' : forwardMode ? 'Forward' : 'Send Message'}
            </Button>
          </DialogActions>
        </Dialog>

        <MessageTypeManager
          open={messageTypeDialogOpen}
          onClose={() => setMessageTypeDialogOpen(false)}
          onUpdate={fetchMessageTypes}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default Messaging;