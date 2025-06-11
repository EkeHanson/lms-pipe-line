import React from 'react';
import { Paper, Typography, Accordion, AccordionSummary, AccordionDetails, Button, Box } from '@mui/material';
import { ExpandMore, Help as HelpIcon } from '@mui/icons-material';

const StudentSupport = () => {
  const faqs = [
    { question: 'How do I enroll in a course?', answer: 'Go to the Search Courses section, find a course, and click Enroll Now.' },
    { question: 'How can I reset my password?', answer: 'Click Forgot Password on the login page and follow the instructions.' }
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Support</Typography>
      <Box mb={3}>
        <Typography variant="h6">FAQs</Typography>
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <Button variant="contained" startIcon={<HelpIcon />}>
        Open Live Chat
      </Button>
    </Paper>
  );
};

export default StudentSupport;