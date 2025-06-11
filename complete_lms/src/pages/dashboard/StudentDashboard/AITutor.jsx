import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { Send } from '@mui/icons-material';

const AITutor = () => {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState([]);

  const handleQuery = () => {
    if (query) {
      setResponses([...responses, { question: query, answer: 'This is a sample AI response to your question.' }]);
      setQuery('');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>AI Tutor</Typography>
      <TextField
        fullWidth
        label="Ask a question"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        margin="normal"
        InputProps={{ endAdornment: <Button onClick={handleQuery} startIcon={<Send />}>Ask</Button> }}
      />
      <List>
        {responses.map((res, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`Q: ${res.question}`}
              secondary={`A: ${res.answer}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default AITutor;