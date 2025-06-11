import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  TextField,
  Button,
  Chip,
  Badge,
  Tabs,
  Tab
} from '@mui/material';
import {
  Send,
  AttachFile,
  Mail,
  MailOutline,
  Person
} from '@mui/icons-material';

const AssessorCommunicationPanel = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [message, setMessage] = useState('');
  const [activeConversation, setActiveConversation] = useState(1);

  console.log("Overdue")

  // Dummy data
  const conversations = [
    {
      id: 1,
      assessor: 'Sarah Smith',
      lastMessage: 'Regarding John Doe\'s assessment',
      unread: true,
      messages: [
        {
          id: 1,
          sender: 'Sarah Smith',
          date: '2023-05-15 10:30',
          text: 'Hi, I wanted to discuss John Doe\'s recent assessment. There were some aspects I wanted to verify with you.',
          isIQA: false
        },
        {
          id: 2,
          sender: 'You',
          date: '2023-05-15 11:15',
          text: 'Sure, I reviewed it yesterday. What specifically would you like to discuss?',
          isIQA: true
        },
        {
          id: 3,
          sender: 'Sarah Smith',
          date: '2023-05-15 14:45',
          text: 'Mainly the evidence for criterion 2.3. I wasn\'t sure if the business report fully covered all the required elements.',
          isIQA: false
        }
      ]
    },
    {
      id: 2,
      assessor: 'Michael Brown',
      lastMessage: 'Sampling plan for June',
      unread: false,
      messages: [
        {
          id: 1,
          sender: 'Michael Brown',
          date: '2023-05-10 09:20',
          text: 'Have you finalized the sampling plan for June? I need to schedule my assessments accordingly.',
          isIQA: false
        },
        {
          id: 2,
          sender: 'You',
          date: '2023-05-10 13:45',
          text: 'Yes, I\'ll upload it by end of day today. It will cover units 3 and 4 primarily.',
          isIQA: true
        }
      ]
    },
    {
      id: 3,
      assessor: 'Emily Davis',
      lastMessage: 'Standardization meeting',
      unread: false,
      messages: [
        {
          id: 1,
          sender: 'Emily Davis',
          date: '2023-05-05 16:10',
          text: 'Can we schedule a standardization meeting for next week? I have some questions about the new assessment criteria.',
          isIQA: false
        }
      ]
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message to the server
      const conversation = conversations.find(c => c.id === activeConversation);
      if (conversation) {
        conversation.messages.push({
          id: conversation.messages.length + 1,
          sender: 'You',
          date: new Date().toISOString(),
          text: message,
          isIQA: true
        });
      }
      setMessage('');
    }
  };

  const activeMessages = conversations.find(c => c.id === activeConversation)?.messages || [];

  return (
    <Paper elevation={3} sx={{ p: 0 }}>
      <Box sx={{ display: 'flex', height: '600px' }}>
        {/* Conversation list */}
        <Box sx={{ width: 300, borderRight: '1px solid #eee' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="All" />
            <Tab label="Unread" />
          </Tabs>
          
          <List sx={{ overflowY: 'auto', height: 'calc(100% - 48px)' }}>
            {conversations
              .filter(conv => activeTab === 0 || conv.unread)
              .map((conversation) => (
                <React.Fragment key={conversation.id}>
                  <ListItem 
                    button 
                    selected={activeConversation === conversation.id}
                    onClick={() => {
                      setActiveConversation(conversation.id);
                      conversation.unread = false;
                    }}
                  >
                    <ListItemAvatar>
                      <Badge 
                        color="error" 
                        variant="dot" 
                        invisible={!conversation.unread}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                      >
                        <Avatar>
                          <Person />
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={conversation.assessor}
                      secondary={conversation.lastMessage}
                      secondaryTypographyProps={{
                        noWrap: true,
                        style: { width: '200px' }
                      }}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
          </List>
        </Box>
        
        {/* Message area */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {activeConversation ? (
            <>
              <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                <Typography variant="h6">
                  {conversations.find(c => c.id === activeConversation)?.assessor}
                </Typography>
              </Box>
              
              <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                {activeMessages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.isIQA ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        maxWidth: '70%',
                        backgroundColor: msg.isIQA ? '#e3f2fd' : '#f5f5f5'
                      }}
                    >
                      <Typography variant="caption" display="block" color="text.secondary">
                        {msg.sender} • {msg.date}
                      </Typography>
                      <Typography variant="body1">{msg.text}</Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>
              
              <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button startIcon={<AttachFile />}>Attach File</Button>
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    Send
                  </Button>
                </Box>
              </Box>
            </>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              textAlign: 'center',
              p: 3
            }}>
              <MailOutline sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Select a conversation to view messages
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Or start a new conversation with an assessor
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default AssessorCommunicationPanel;