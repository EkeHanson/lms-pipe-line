import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Chip,
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge
} from '@mui/material';
import {
  Comment,
  Feedback,
  Warning,
  CheckCircle,
  ExpandMore,
  Reply,
  Add
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const EQAFeedback = () => {
  const theme = useTheme();
  const [feedbackItems, setFeedbackItems] = useState([
    {
      id: 1,
      date: '2023-06-15',
      reviewer: 'Dr. Sarah Johnson',
      category: 'Assessment',
      priority: 'high',
      status: 'open',
      comment: 'The sampling of learner assessments needs to be more comprehensive. Currently only 5% are being reviewed which is below our recommended 10% minimum.',
      response: '',
      resolved: false
    },
    {
      id: 2,
      date: '2023-05-22',
      reviewer: 'Prof. Michael Chen',
      category: 'Documentation',
      priority: 'medium',
      status: 'in-progress',
      comment: 'The IQA policy document is well-structured but needs to include more specific examples of how standards are applied in practice.',
      response: 'We are working on adding more practical examples to section 3.2 and 4.1 of the policy.',
      resolved: false
    },
    {
      id: 3,
      date: '2023-04-10',
      reviewer: 'Ms. Emma Wilson',
      category: 'Trainer Standards',
      priority: 'low',
      status: 'resolved',
      comment: 'Two trainers are missing updated first aid certifications. Please ensure all trainers have current certifications.',
      response: 'Both trainers have now completed their first aid recertification. Certificates uploaded to the system.',
      resolved: true
    }
  ]);

  const [newResponse, setNewResponse] = useState('');
  const [activeFeedback, setActiveFeedback] = useState(null);
  const [newFeedback, setNewFeedback] = useState({
    category: '',
    priority: 'medium',
    comment: ''
  });

  const priorityColors = {
    high: 'error',
    medium: 'warning',
    low: 'info'
  };

  const statusColors = {
    open: 'default',
    'in-progress': 'primary',
    resolved: 'success'
  };

  const handleResponseSubmit = (id) => {
    const updatedItems = feedbackItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          response: newResponse,
          status: newResponse ? 'in-progress' : item.status
        };
      }
      return item;
    });
    setFeedbackItems(updatedItems);
    setNewResponse('');
  };

  const handleResolve = (id) => {
    const updatedItems = feedbackItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'resolved',
          resolved: true
        };
      }
      return item;
    });
    setFeedbackItems(updatedItems);
  };

  const handleAddFeedback = () => {
    // In a real app, this would be for internal notes about EQA feedback
    const newItem = {
      id: feedbackItems.length + 1,
      date: new Date().toISOString().split('T')[0],
      reviewer: 'Internal Note',
      category: newFeedback.category,
      priority: newFeedback.priority,
      status: 'open',
      comment: newFeedback.comment,
      response: '',
      resolved: false
    };
    setFeedbackItems([newItem, ...feedbackItems]);
    setNewFeedback({
      category: '',
      priority: 'medium',
      comment: ''
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        EQA Feedback & Responses
      </Typography>

      <Grid container spacing={3}>
        {/* Feedback List */}
        <Grid item xs={12} md={7}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Feedback Items
                </Typography>
                <Badge 
                  badgeContent={feedbackItems.filter(f => !f.resolved).length} 
                  color="error"
                  sx={{ mr: 2 }}
                >
                  <Typography variant="subtitle1">
                    Pending Actions
                  </Typography>
                </Badge>
              </Box>

              <List sx={{ width: '100%' }}>
                {feedbackItems.map((item) => (
                  <Accordion 
                    key={item.id} 
                    elevation={2}
                    expanded={activeFeedback === item.id}
                    onChange={() => setActiveFeedback(activeFeedback === item.id ? null : item.id)}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <ListItemAvatar>
                        <Avatar>
                          <Feedback />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.comment.substring(0, 60) + (item.comment.length > 60 ? '...' : '')}
                        secondary={
                          <>
                            <Box component="span" sx={{ mr: 1 }}>
                              {item.date} • {item.reviewer}
                            </Box>
                            <Chip
                              label={item.priority}
                              size="small"
                              color={priorityColors[item.priority]}
                              sx={{ mr: 1 }}
                            />
                            <Chip
                              label={item.status}
                              size="small"
                              color={statusColors[item.status]}
                            />
                          </>
                        }
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body1" paragraph>
                        <strong>Category:</strong> {item.category}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        <strong>Feedback:</strong> {item.comment}
                      </Typography>
                      
                      {item.response && (
                        <>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="body1" paragraph>
                            <strong>Your Response:</strong> {item.response}
                          </Typography>
                        </>
                      )}

                      {!item.resolved && (
                        <>
                          <Divider sx={{ my: 2 }} />
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            label="Add your response"
                            value={newResponse}
                            onChange={(e) => setNewResponse(e.target.value)}
                            sx={{ mb: 2 }}
                          />
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button
                              variant="outlined"
                              onClick={() => {
                                setNewResponse('');
                                setActiveFeedback(null);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<Reply />}
                              onClick={() => handleResponseSubmit(item.id)}
                              disabled={!newResponse}
                            >
                              Submit Response
                            </Button>
                            {item.response && (
                              <Button
                                variant="contained"
                                color="success"
                                startIcon={<CheckCircle />}
                                onClick={() => handleResolve(item.id)}
                              >
                                Mark as Resolved
                              </Button>
                            )}
                          </Box>
                        </>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Add Feedback/Stats */}
        <Grid item xs={12} md={5}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Add Internal Note
              </Typography>
              
              <TextField
                fullWidth
                label="Category"
                value={newFeedback.category}
                onChange={(e) => setNewFeedback({...newFeedback, category: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <TextField
                select
                fullWidth
                label="Priority"
                value={newFeedback.priority}
                onChange={(e) => setNewFeedback({...newFeedback, priority: e.target.value})}
                SelectProps={{
                  native: true,
                }}
                sx={{ mb: 2 }}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </TextField>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Note"
                value={newFeedback.comment}
                onChange={(e) => setNewFeedback({...newFeedback, comment: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleAddFeedback}
                disabled={!newFeedback.category || !newFeedback.comment}
              >
                Add Note
              </Button>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Feedback Statistics
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Total Feedback Items:</Typography>
                <Typography fontWeight="bold">{feedbackItems.length}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Open Items:</Typography>
                <Typography fontWeight="bold" color="error">
                  {feedbackItems.filter(f => f.status === 'open').length}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>In Progress:</Typography>
                <Typography fontWeight="bold" color="primary">
                  {feedbackItems.filter(f => f.status === 'in-progress').length}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Resolved:</Typography>
                <Typography fontWeight="bold" color="success">
                  {feedbackItems.filter(f => f.status === 'resolved').length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EQAFeedback;