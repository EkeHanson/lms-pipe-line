import React from 'react';
import {
  Box, Typography, Divider, List, ListItem, ListItemText,
  Chip, Accordion, AccordionSummary, AccordionDetails,
  useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CompliantIcon,
  Warning as NonCompliantIcon,
  Description as DocumentIcon
} from '@mui/icons-material';

const standardsData = [
  {
    category: 'Internal Quality Assurance',
    standards: [
      {
        name: 'IQA Policy v3.2',
        type: 'Internal',
        status: 'compliant',
        expiry: '2024-12-31',
        link: '/docs/iqa-policy.pdf'
      },
      {
        name: 'Trainer Competency Framework',
        type: 'Internal',
        status: 'compliant',
        expiry: '2025-06-30',
        link: '/docs/trainer-framework.docx'
      }
    ]
  },
  {
    category: 'External Regulations',
    standards: [
      {
        name: 'Ofqual Condition B2 (Assessment)',
        type: 'Government',
        status: 'non-compliant',
        issues: 2,
        expiry: '2023-12-31',
        link: '/docs/ofqual-b2.pdf'
      },
      {
        name: 'ISO 9001:2015 (Quality Management)',
        type: 'International',
        status: 'compliant',
        expiry: '2024-09-15',
        link: '/docs/iso-certificate.pdf'
      }
    ]
  }
];

const StandardsRegistry = () => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Active Standards & Regulations
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        This registry tracks all quality standards applicable to our organization.
      </Typography>

      {standardsData.map((group, index) => (
        <Accordion key={index} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="medium">{group.category}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {group.standards.map((standard, idx) => (
                <React.Fragment key={idx}>
                  <ListItem>
                    <ListItemText
                      primary={standard.name}
                      secondary={
                        <>
                          <span>{standard.type} • Expires: {standard.expiry}</span>
                          {standard.status === 'non-compliant' && (
                            <span> • {standard.issues} unresolved issues</span>
                          )}
                        </>
                      }
                    />
                    <Chip
                      icon={standard.status === 'compliant' ? 
                        <CompliantIcon /> : <NonCompliantIcon />}
                      label={standard.status}
                      color={standard.status === 'compliant' ? 'success' : 'error'}
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  </ListItem>
                  {idx < group.standards.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box sx={{ mt: 3, p: 2, bgcolor: theme.palette.grey[100], borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Need to update a standard?
        </Typography>
        <Typography variant="body2">
          Contact the Quality Team to modify registry entries or upload new documents.
        </Typography>
      </Box>
    </Box>
  );
};

export default StandardsRegistry;