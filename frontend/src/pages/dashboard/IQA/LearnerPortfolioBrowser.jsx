import React, { useState } from 'react';
import {
  Box,  Typography,  TextField,  Table,
  TableBody,  TableCell,
  TableContainer,  TableHead,
  TableRow,  Paper,  Chip,  Button,  Avatar,  Pagination,
  Select,  MenuItem,  FormControl,
  InputLabel,  Dialog,  DialogTitle,
  DialogContent,  DialogActions,  Tabs,  Tab,
  Divider,  List,  ListItem,  ListItemText,ListItemAvatar,
  IconButton,  Tooltip,  LinearProgress,
  Accordion,  AccordionSummary,  AccordionDetails,
} from '@mui/material';
import {  Search,  FilterList,
  Visibility,  Close,  Download,  Comment,
  CheckCircle,  Warning,ArrowBack,
  Error as ErrorIcon ,
  ExpandMore,  PictureAsPdf,
  InsertDriveFile,  NoteAdd
} from '@mui/icons-material';

const LearnerPortfolioBrowser = ({ onBack }) => {
  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [verificationDecision, setVerificationDecision] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');

  // Dummy data - in a real app, this would come from an API
  const learners = [
    {
      id: 1,
      name: 'John Doe',
      course: 'Level 3 Diploma in Business',
      assessor: 'Sarah Smith',
      status: 'pending_verification',
      lastAssessed: '2023-05-10',
      units: [
        {
          id: 'unit1',
          title: 'Communication in Business Environment',
          status: 'assessed',
          criteria: [
            { id: '1.1', description: 'Understand effective communication', status: 'met', assessorNotes: 'Good understanding demonstrated' },
            { id: '1.2', description: 'Use appropriate communication methods', status: 'met', assessorNotes: 'Used email and report appropriately' },
            { id: '1.3', description: 'Overcome communication barriers', status: 'not_met', assessorNotes: 'Needs more examples of overcoming barriers' }
          ]
        },
        {
          id: 'unit2',
          title: 'Principles of Administration',
          status: 'in_progress',
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
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      course: 'Level 2 Certificate in Customer Service',
      assessor: 'David Lee',
      status: 'verified',
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
      ]
    },
    {
      id: 3,
      name: 'Michael Brown',
      course: 'Level 4 Project Management',
      assessor: 'Laura Adams',
      status: 'in_progress',
      lastAssessed: '2023-07-01',
      units: [
        {
          id: 'unit4',
          title: 'Project Planning Techniques',
          status: 'in_progress',
          criteria: [
            { id: '4.1', description: 'Create project plans', status: 'not_met', assessorNotes: 'Needs to refine plan formatting' },
            { id: '4.2', description: 'Evaluate project risks', status: 'not_met', assessorNotes: 'Risk matrix missing' }
          ]
        }
      ],
      documents: [],
      assessorFeedback: 'Work in progress. Needs to complete risk analysis.',
      iqaHistory: []
    }
  ];
  
  // Filter learners based on search and filter criteria
  const filteredLearners = learners.filter(learner => {
    const matchesSearch = learner.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         learner.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || learner.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const itemsPerPage = 5;
  const pageCount = Math.ceil(filteredLearners.length / itemsPerPage);
  const paginatedLearners = filteredLearners.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Helper functions
  const getStatusChip = (status) => {
    switch (status) {
      case 'pending_verification':
        return <Chip label="Pending Verification" color="warning" icon={<Warning />} />;
      case 'verified':
        return <Chip label="Verified" color="success" icon={<CheckCircle />} />;
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

  const handleVerificationSubmit = () => {
    // In a real app, this would submit to an API
    console.log({
      learnerId: selectedLearner.id,
      decision: verificationDecision,
      notes: verificationNotes
    });
    setVerificationDialogOpen(false);
    setVerificationDecision('');
    setVerificationNotes('');
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
        </DialogTitle>
        
        <DialogContent dividers>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Portfolio" />
            <Tab label="Assessment Details" />
            <Tab label="Documents" />
            <Tab label="Verification History" />
          </Tabs>
          
          <Box sx={{ pt: 3 }}>
            {activeTab === 0 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Assessor: {selectedLearner.assessor}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Assessor Feedback:</strong> {selectedLearner.assessorFeedback}
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<Comment />}
                    onClick={() => setVerificationDialogOpen(true)}
                  >
                    Add Verification Notes
                  </Button>
                </Box>
              </Box>
            )}
            
            {activeTab === 1 && (
              <Box>
                {selectedLearner.units.map(unit => (
                  <Accordion key={unit.id} sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        {unit.title}
                      </Typography>
                      <Chip 
                        label={unit.status.replace('_', ' ')} 
                        color={
                          unit.status === 'assessed' ? 'success' : 
                          unit.status === 'in_progress' ? 'warning' : 'default'
                        } 
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
              </Box>
            )}
            
            {activeTab === 2 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Submitted Work
                </Typography>
                <List>
                  {selectedLearner.documents.map(doc => (
                    <ListItem 
                      key={doc.id}
                      secondaryAction={
                        <IconButton edge="end">
                          <Download />
                        </IconButton>
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
                <Button 
                  variant="outlined" 
                  startIcon={<NoteAdd />}
                  sx={{ mt: 2 }}
                >
                  Upload Additional Evidence
                </Button>
              </Box>
            )}
            
            {activeTab === 3 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Verification History
                </Typography>
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
                  <Typography>No verification history yet</Typography>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setSelectedLearner(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderVerificationDialog = () => (
    <Dialog 
      open={verificationDialogOpen} 
      onClose={() => setVerificationDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Add Verification Decision</DialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Verification Decision</InputLabel>
          <Select
            value={verificationDecision}
            label="Verification Decision"
            onChange={(e) => setVerificationDecision(e.target.value)}
          >
            <MenuItem value="approved">Approved - Meets all requirements</MenuItem>
            <MenuItem value="minor_issues">Minor Issues - Needs small adjustments</MenuItem>
            <MenuItem value="major_issues">Major Issues - Significant rework needed</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          label="Verification Notes"
          multiline
          rows={4}
          fullWidth
          value={verificationNotes}
          onChange={(e) => setVerificationNotes(e.target.value)}
          placeholder="Provide detailed feedback to the assessor..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setVerificationDialogOpen(false)}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleVerificationSubmit}
          disabled={!verificationDecision}
        >
          Submit Verification
        </Button>
      </DialogActions>
    </Dialog>
  );

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

      {/* Filters and Search */}
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
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterList sx={{ mr: 1, color: 'action.active' }} />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter by status</InputLabel>
            <Select
              value={filter}
              label="Filter by status"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="pending_verification">Pending Verification</MenuItem>
              <MenuItem value="verified">Verified</MenuItem>
              <MenuItem value="needs_rework">Needs Rework</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Learner Portfolio Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Learner</TableCell>
              <TableCell>Course</TableCell>
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
      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Modals */}
      {renderLearnerDetail()}
      {renderVerificationDialog()}
    </Box>
  );
};

export default LearnerPortfolioBrowser;