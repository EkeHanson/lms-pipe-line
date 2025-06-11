import React, { useState, useRef } from 'react';
import {  Box,  Typography,  TextField,  Button,  Paper,  Divider,  Chip,  Avatar,
  Grid,  FormControl,  InputLabel,  Select,
  MenuItem,  IconButton,  Tooltip,  LinearProgress,
  Dialog,  DialogTitle,  DialogContent,
  DialogActions,  List,  ListItem,  ListItemText,
  Badge,  useTheme,  styled
} from '@mui/material';
import {  Send,  AttachFile,  Cancel,  Person,Close,
  School,  CheckCircle,  Warning,  Error as ErrorIcon,
  Download,  History,  Visibility} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(4),
  boxShadow: theme.shadows[3],
  border: `1px solid ${theme.palette.divider}`,
}));

const AttachmentChip = styled(Chip)(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  borderRadius: '6px',
  backgroundColor: theme.palette.grey[100],
}));

const EQAFeedbackForm = () => {
  const theme = useTheme();
  const [feedbackType, setFeedbackType] = useState('center');
  const [feedbackText, setFeedbackText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [followUpDate, setFollowUpDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Dummy data
  const recipientOptions = [
    { id: 1, name: 'ABC Training Center', type: 'center', avatar: 'AB' },
    { id: 2, name: 'XYZ College', type: 'center', avatar: 'XY' },
    { id: 3, name: 'City Academy', type: 'center', avatar: 'CA' },
    { id: 4, name: 'Global Skills Institute', type: 'center', avatar: 'GS' }
  ];

  const feedbackHistory = [
    {
      id: 1,
      date: '2023-05-15',
      recipient: 'ABC Training Center',
      type: 'Compliance Issue',
      status: 'closed',
      notes: 'Addressed assessment documentation inconsistencies'
    },
    {
      id: 2,
      date: '2023-04-28',
      recipient: 'XYZ College',
      type: 'Recommendation',
      status: 'pending',
      notes: 'Suggested improvements to IQA sampling process'
    },
    {
      id: 3,
      date: '2023-04-10',
      recipient: 'Global Skills Institute',
      type: 'Critical Finding',
      status: 'closed',
      notes: 'Resolved certification delays issue'
    }
  ];

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + attachments.length > 5) {
      alert('Maximum 5 attachments allowed');
      return;
    }
    setAttachments([...attachments, ...files]);
  };

  const handleRemoveAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log({
        feedbackType,
        recipient: selectedRecipient,
        feedbackText,
        attachments: attachments.map(f => f.name),
        followUpDate
      });
      setIsSubmitting(false);
      setSuccessDialogOpen(true);
      resetForm();
    }, 1500);
  };

  const resetForm = () => {
    setFeedbackText('');
    setAttachments([]);
    setSelectedRecipient('');
    setFollowUpDate(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const filteredRecipients = recipientOptions.filter(recipient => 
    recipient.type === 'center'
  );

  const getStatusChip = (status) => {
    switch (status) {
      case 'closed':
        return <Chip label="Closed" color="success" size="small" icon={<CheckCircle />} />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" icon={<Warning />} />;
      case 'critical':
        return <Chip label="Critical" color="error" size="small" icon={<ErrorIcon />} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="600">
            Center Feedback Form
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<History />}
            onClick={() => setHistoryDialogOpen(true)}
          >
            Feedback History
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Left Column - Form Controls */}
          <Grid item xs={12} md={5}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Recipient Center *</InputLabel>
              <Select
                value={selectedRecipient}
                label="Recipient Center *"
                onChange={(e) => setSelectedRecipient(e.target.value)}
                required
              >
                {filteredRecipients.map(center => (
                  <MenuItem key={center.id} value={center.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        mr: 2,
                        bgcolor: theme.palette.secondary.light
                      }}>
                        {center.avatar}
                      </Avatar>
                      <Box>
                        <Typography>{center.name}</Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Feedback Type *</InputLabel>
              <Select
                value={feedbackType}
                label="Feedback Type *"
                onChange={(e) => setFeedbackType(e.target.value)}
                required
              >
                <MenuItem value="center">General Center Feedback</MenuItem>
                <MenuItem value="compliance">Compliance Issue</MenuItem>
                <MenuItem value="recommendation">Recommendation</MenuItem>
                <MenuItem value="critical">Critical Finding</MenuItem>
              </Select>
            </FormControl>

            <DatePicker
              label="Follow-up Date (Optional)"
              value={followUpDate}
              onChange={(newValue) => setFollowUpDate(newValue)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  sx={{ mb: 3 }}
                />
              )}
            />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Attachments ({attachments.length}/5)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<AttachFile />}
                  onClick={triggerFileInput}
                  disabled={attachments.length >= 5}
                  sx={{ mr: 2 }}
                >
                  Add Files
                </Button>
                <Typography variant="caption" color="text.secondary">
                  PDF, DOC, JPG up to 5MB
                </Typography>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  multiple
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </Box>
              
              {attachments.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
                  {attachments.map((file, index) => (
                    <AttachmentChip
                      key={index}
                      label={file.name.length > 20 ? `${file.name.substring(0, 20)}...` : file.name}
                      variant="outlined"
                      onDelete={() => handleRemoveAttachment(index)}
                      deleteIcon={<Cancel />}
                      title={file.name}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Grid>

          {/* Right Column - Feedback Content */}
          <Grid item xs={12} md={7}>
            <TextField
              multiline
              minRows={8}
              maxRows={12}
              fullWidth
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Compose your feedback for the center..."
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Feedback Guidelines
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Be specific and reference evidence where possible
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • For compliance issues, cite the relevant standard
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Provide actionable recommendations for improvement
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleSubmit}
            disabled={!feedbackText || !selectedRecipient || isSubmitting}
            sx={{ minWidth: '120px' }}
          >
            {isSubmitting ? 'Sending...' : 'Send Feedback'}
          </Button>
        </Box>

        {isSubmitting && (
          <LinearProgress sx={{ mt: 2, borderRadius: '4px' }} />
        )}
      </StyledPaper>

      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle color="success" sx={{ mr: 1 }} />
            Feedback Submitted
          </Box>
          <IconButton onClick={() => setSuccessDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Your feedback has been successfully submitted to the center.
          </Typography>
          {followUpDate && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Follow-up scheduled for {new Date(followUpDate).toLocaleDateString()}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Feedback History Dialog */}
      <Dialog 
        open={historyDialogOpen} 
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Feedback History
            <IconButton onClick={() => setHistoryDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <List>
            {feedbackHistory.map(item => (
              <ListItem key={item.id} divider>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography fontWeight="600">{item.recipient}</Typography>
                      {getStatusChip(item.status)}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" component="span" display="block">
                        {item.date} • {item.type}
                      </Typography>
                      {item.notes}
                    </>
                  }
                />
                <IconButton edge="end" onClick={() => console.log('View details', item.id)}>
                  <Visibility />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            startIcon={<Download />}
            onClick={() => console.log('Export history')}
          >
            Export History
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EQAFeedbackForm;