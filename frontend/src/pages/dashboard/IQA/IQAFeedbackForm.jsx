import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Chip,
  Avatar,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  InputAdornment,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled
} from '@mui/material';
import {
  Send,
  AttachFile,
  Cancel,
  Person,
  School,
  Description,
  CheckCircle,
  Close
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Styled components for premium look
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(4),
  boxShadow: theme.shadows[3],
  background: 'white',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[6]
  }
}));

const AttachmentChip = styled(Chip)(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  borderRadius: '6px',
  backgroundColor: theme.palette.grey[100],
  '& .MuiChip-deleteIcon': {
    color: theme.palette.grey[500],
    '&:hover': {
      color: theme.palette.error.main
    }
  }
}));

const IQAFeedbackForm = () => {
  // State management
  const [feedbackType, setFeedbackType] = useState('assessor');
  const [feedbackText, setFeedbackText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [followUpDate, setFollowUpDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Dummy data
  const recipientOptions = [
    { id: 1, name: 'Sarah Smith', role: 'Assessor', avatar: 'SS' },
    { id: 2, name: 'Michael Brown', role: 'Assessor', avatar: 'MB' },
    { id: 3, name: 'John Doe', role: 'Learner', avatar: 'JD' },
    { id: 4, name: 'Jane Smith', role: 'Learner', avatar: 'JS' }
  ];

  // Handlers
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
      // Reset form
      setFeedbackText('');
      setAttachments([]);
      setSelectedRecipient('');
      setFollowUpDate(null);
    }, 1500);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const filteredRecipients = recipientOptions.filter(person => 
    (feedbackType === 'assessor' && person.role === 'Assessor') ||
    (feedbackType === 'learner' && person.role === 'Learner')
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="600">
            Quality Feedback Form
          </Typography>
          <Chip 
            label={feedbackType === 'assessor' ? 'Assessor Feedback' : 
                  feedbackType === 'learner' ? 'Learner Feedback' : 'General Note'}
            color="primary"
            size="small"
          />
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Left Column - Form Controls */}
          <Grid item xs={12} md={5}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Feedback Type</InputLabel>
              <Select
                value={feedbackType}
                label="Feedback Type"
                onChange={(e) => {
                  setFeedbackType(e.target.value);
                  setSelectedRecipient('');
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: '8px',
                      marginTop: '4px'
                    }
                  }
                }}
              >
                <MenuItem value="assessor">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1, fontSize: '20px' }} />
                    To Assessor
                  </Box>
                </MenuItem>
                <MenuItem value="learner">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <School sx={{ mr: 1, fontSize: '20px' }} />
                    To Learner
                  </Box>
                </MenuItem>
                <MenuItem value="general">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Description sx={{ mr: 1, fontSize: '20px' }} />
                    General Note
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            {feedbackType !== 'general' && (
              <>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Recipient</InputLabel>
                  <Select
                    value={selectedRecipient}
                    label="Recipient"
                    onChange={(e) => setSelectedRecipient(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: '8px',
                          marginTop: '4px'
                        }
                      }
                    }}
                  >
                    {filteredRecipients.map(person => (
                      <MenuItem key={person.id} value={person.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ 
                            width: 32, 
                            height: 32, 
                            mr: 2,
                            fontSize: '0.875rem',
                            bgcolor: feedbackType === 'assessor' ? 'primary.light' : 'secondary.light'
                          }}>
                            {person.avatar}
                          </Avatar>
                          <Box>
                            <Typography>{person.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {person.role}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
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
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton>
                              <DatePicker.OpenButton />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </>
            )}
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
              placeholder={`Compose your ${feedbackType === 'assessor' ? 'assessor' : 
                          feedbackType === 'learner' ? 'learner' : 'general'} feedback...`}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <Box sx={{ mb: 3 }}>
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
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleSubmit}
            disabled={!feedbackText || (feedbackType !== 'general' && !selectedRecipient)}
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
            Your quality feedback has been successfully submitted.
          </Typography>
          {followUpDate && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Follow-up scheduled for {new Date(followUpDate).toLocaleDateString()}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setSuccessDialogOpen(false);
              // Reset form for new feedback
              setFeedbackType('assessor');
            }}
          >
            New Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default IQAFeedbackForm;