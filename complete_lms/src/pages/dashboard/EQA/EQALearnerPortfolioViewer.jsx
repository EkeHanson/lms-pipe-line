import React, { useState } from 'react';
import {
  Box,  Typography,  Table,  TableBody,  TableCell,  TableContainer,  TableHead,
  TableRow,  Paper,  Chip,  Avatar,
  Button,  IconButton,  Tooltip,  Dialog,  DialogTitle,  DialogContent,  DialogActions,  Divider,
  List,  ListItem,  ListItemText,  ListItemAvatar,  Accordion,
  AccordionSummary,  AccordionDetails,  TextField,  InputAdornment,Tabs,Tab,
  Pagination,  useTheme} from '@mui/material';
import {  Search,Close,  Visibility,  Download,  PictureAsPdf,
  InsertDriveFile,  ExpandMore,  CheckCircle,  Warning,
  Error as ErrorIcon,  ArrowBack} from '@mui/icons-material';

const EQALearnerPortfolioViewer = ({ onBack }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Dummy data - in a real app, this would come from an API
  const learners = [
    {
      id: 1,
      name: 'John Doe',
      course: 'Level 3 Diploma in Business',
      center: 'ABC Training Center',
      assessor: 'Sarah Smith',
      status: 'verified',
      lastAssessed: '2023-05-10',
      units: [
        {
          id: 'unit1',
          title: 'Communication in Business Environment',
          status: 'assessed',
          criteria: [
            { id: '1.1', description: 'Understand effective communication', status: 'met', assessorNotes: 'Good understanding demonstrated' },
            { id: '1.2', description: 'Use appropriate communication methods', status: 'met', assessorNotes: 'Used email and report appropriately' },
            { id: '1.3', description: 'Overcome communication barriers', status: 'met', assessorNotes: 'Needs more examples of overcoming barriers' }
          ]
        },
        {
          id: 'unit2',
          title: 'Principles of Administration',
          status: 'assessed',
          criteria: [
            { id: '2.1', description: 'Understand administrative functions', status: 'met', assessorNotes: 'Clear understanding shown' },
            { id: '2.2', description: 'Use office equipment', status: 'met', assessorNotes: 'Competent use demonstrated' }
          ]
        }
      ],
      documents: [
        { id: 1, name: 'Business Report.pdf', type: 'pdf', uploaded: '2023-05-05' },
        { id: 2, name: 'Presentation Notes.docx', type: 'doc', uploaded: '2023-05-08' }
      ],
      assessorFeedback: 'John has shown good progress but needs to provide more evidence for criterion 1.3.',
      iqaHistory: [
        { date: '2023-03-15', action: 'Initial verification', outcome: 'approved', notes: 'All criteria met for Unit 1' }
      ],
      eqaHistory: [
        { date: '2023-04-20', action: 'External verification', outcome: 'approved', notes: 'Assessment meets standards' }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      course: 'Level 2 Certificate in Customer Service',
      center: 'XYZ College',
      assessor: 'Michael Brown',
      status: 'pending',
      lastAssessed: '2023-06-12',
      units: [
        {
          id: 'unit3',
          title: 'Customer Service Principles',
          status: 'assessed',
          criteria: [
            { id: '3.1', description: 'Identify customer needs', status: 'met', assessorNotes: 'Great attention to detail' },
            { id: '3.2', description: 'Handle complaints effectively', status: 'met', assessorNotes: 'Used real examples' }
          ]
        }
      ],
      documents: [
        { id: 3, name: 'Customer Interview.mp4', type: 'video', uploaded: '2023-06-10' }
      ],
      assessorFeedback: 'Jane has demonstrated excellent customer handling skills.',
      iqaHistory: [
        { date: '2023-06-20', action: 'Final verification', outcome: 'approved', notes: 'Assessment evidence complete' }
      ],
      eqaHistory: []
    }
  ];

  const filteredLearners = learners.filter(learner => 
    learner.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    learner.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedLearners = filteredLearners.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const getStatusChip = (status) => {
    switch (status) {
      case 'verified':
        return <Chip label="Verified" color="success" icon={<CheckCircle />} />;
      case 'pending':
        return <Chip label="Pending" color="warning" icon={<Warning />} />;
      case 'needs_rework':
        return <Chip label="Needs Rework" color="error" icon={<ErrorIcon />} />;
      default:
        return <Chip label={status} />;
    }
  };

  const getCriteriaStatusIcon = (status) => {
    switch (status) {
      case 'met':
        return <CheckCircle color="success" fontSize="small" />;
      case 'not_met':
        return <ErrorIcon color="error" fontSize="small" />;
      default:
        return <Warning color="warning" fontSize="small" />;
    }
  };

  const renderLearnerDetail = () => {
    if (!selectedLearner) return null;

    return (
      <Dialog 
        open={!!selectedLearner} 
        onClose={() => setSelectedLearner(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {selectedLearner.name} - {selectedLearner.course}
            </Typography>
            <IconButton onClick={() => setSelectedLearner(null)}>
              <Close />
            </IconButton>
          </Box>
          <Typography variant="subtitle2">
            Center: {selectedLearner.center} | Assessor: {selectedLearner.assessor}
          </Typography>
        </DialogTitle>
        
        <DialogContent dividers>
          <Tabs value={0} onChange={() => {}}>
            <Tab label="Portfolio Overview" />
          </Tabs>
          
          <Box sx={{ pt: 3 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                Assessor Feedback
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography>{selectedLearner.assessorFeedback}</Typography>
              </Paper>
            </Box>
            
            <Typography variant="subtitle1" gutterBottom>
              Units & Criteria
            </Typography>
            {selectedLearner.units.map(unit => (
              <Accordion key={unit.id} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    {unit.title}
                  </Typography>
                  <Chip 
                    label={unit.status.replace('_', ' ')} 
                    color={unit.status === 'assessed' ? 'success' : 'warning'} 
                    size="small"
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Criteria</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Assessor Notes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {unit.criteria.map(criterion => (
                        <TableRow key={criterion.id}>
                          <TableCell>{criterion.id}</TableCell>
                          <TableCell>{criterion.description}</TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              {getCriteriaStatusIcon(criterion.status)}
                              <Box ml={1}>{criterion.status.replace('_', ' ')}</Box>
                            </Box>
                          </TableCell>
                          <TableCell>{criterion.assessorNotes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionDetails>
              </Accordion>
            ))}
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                Submitted Work
              </Typography>
              <List>
                {selectedLearner.documents.map(doc => (
                  <ListItem 
                    key={doc.id}
                    secondaryAction={
                      <Tooltip title="Download">
                        <IconButton edge="end">
                          <Download />
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <ListItemAvatar>
                      {doc.type === 'pdf' ? <PictureAsPdf /> : <InsertDriveFile />}
                    </ListItemAvatar>
                    <ListItemText
                      primary={doc.name}
                      secondary={`Uploaded: ${doc.uploaded}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                Quality Assurance History
              </Typography>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Internal Verification</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {selectedLearner.iqaHistory.length > 0 ? (
                    <List>
                      {selectedLearner.iqaHistory.map((record, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${record.action} - ${record.outcome}`}
                            secondary={
                              <>
                                <Typography component="span" display="block">
                                  {record.date}
                                </Typography>
                                {record.notes}
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography>No internal verification history</Typography>
                  )}
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>External Verification</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {selectedLearner.eqaHistory.length > 0 ? (
                    <List>
                      {selectedLearner.eqaHistory.map((record, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${record.action} - ${record.outcome}`}
                            secondary={
                              <>
                                <Typography component="span" display="block">
                                  {record.date}
                                </Typography>
                                {record.notes}
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography>No external verification history</Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setSelectedLearner(null)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              // In a real app, this would open the EQA feedback form
              console.log('Provide EQA feedback for', selectedLearner.id);
            }}
          >
            Add EQA Feedback
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Navigation Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Tooltip title="Back to Dashboard">
          <IconButton onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
        </Tooltip>
        <Typography variant="h4">Learner Portfolios</Typography>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search learners or courses..."
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 400 }}
        />
      </Box>

      {/* Learner Portfolio Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Learner</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Center</TableCell>
              <TableCell>Assessor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Assessed</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedLearners.map((learner) => (
              <TableRow key={learner.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                      {learner.name.charAt(0)}
                    </Avatar>
                    {learner.name}
                  </Box>
                </TableCell>
                <TableCell>{learner.course}</TableCell>
                <TableCell>{learner.center}</TableCell>
                <TableCell>{learner.assessor}</TableCell>
                <TableCell>{getStatusChip(learner.status)}</TableCell>
                <TableCell>{learner.lastAssessed}</TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<Visibility />}
                    onClick={() => setSelectedLearner(learner)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Empty State */}
      {filteredLearners.length === 0 && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No learners found matching your criteria
          </Typography>
        </Box>
      )}

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={Math.ceil(filteredLearners.length / rowsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* Modals */}
      {renderLearnerDetail()}
    </Box>
  );
};

export default EQALearnerPortfolioViewer;