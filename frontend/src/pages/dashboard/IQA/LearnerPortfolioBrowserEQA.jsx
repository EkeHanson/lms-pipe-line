import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Avatar,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Modal,
  Divider,
  IconButton,
  Alert
} from '@mui/material';
import { Search, FilterList, Visibility, Close } from '@mui/icons-material';

// Mock AuthContext for role-based access
const AuthContext = React.createContext();
const useAuth = () => useContext(AuthContext);

// Shared dummy data
const learners = [
  {
    id: 1,
    name: 'John Doe',
    course: 'Level 3 Diploma',
    assessor: 'Sarah Smith',
    status: 'pending',
    lastAssessed: '2023-05-10',
    portfolio: {
      submittedWork: 'Unit 1 Assignment.pdf, Unit 2 Practical Evidence.mp4',
      assessorFeedback: 'Good work on Unit 1, needs more detail in Unit 2.',
      assessmentCriteria: 'Criteria 1.1, 1.2, 2.1 met',
      iqaComments: 'Initial review completed, agree with assessor feedback.'
    }
  },
  {
    id: 2,
    name: 'Jane Smith',
    course: 'Level 2 Certificate',
    assessor: 'Michael Brown',
    status: 'verified',
    lastAssessed: '2023-05-08',
    portfolio: {
      submittedWork: 'Unit 1 Reflective Journal.pdf',
      assessorFeedback: 'Excellent submission, all criteria met.',
      assessmentCriteria: 'Criteria 1.1, 1.2 met',
      iqaComments: 'Verified, no issues found.'
    }
  },
  {
    id: 3,
    name: 'Robert Johnson',
    course: 'Level 4 Diploma',
    assessor: 'Emily Davis',
    status: 'needs_review',
    lastAssessed: '2023-05-05',
    portfolio: {
      submittedWork: 'Unit 3 Case Study.pdf',
      assessorFeedback: 'Incomplete submission, needs resubmission.',
      assessmentCriteria: 'Criteria 3.1 partially met',
      iqaComments: 'Flagged for assessor clarification.'
    }
  },
  {
    id: 4,
    name: 'Emily Wilson',
    course: 'Level 3 Diploma',
    assessor: 'Sarah Smith',
    status: 'pending',
    lastAssessed: '2023-05-12',
    portfolio: {
      submittedWork: 'Unit 1 Essay.pdf',
      assessorFeedback: 'Solid work, minor revisions needed.',
      assessmentCriteria: 'Criteria 1.1 met, 1.2 partially met',
      iqaComments: ''
    }
  },
  {
    id: 5,
    name: 'Michael Lee',
    course: 'Level 2 Certificate',
    assessor: 'Michael Brown',
    status: 'verified',
    lastAssessed: '2023-05-01',
    portfolio: {
      submittedWork: 'Unit 2 Practical Assessment.mp4',
      assessorFeedback: 'All criteria met, well done.',
      assessmentCriteria: 'Criteria 2.1, 2.2 met',
      iqaComments: 'Verification complete.'
    }
  },
];

const LearnerPortfolioBrowserEQA = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userRole, setUserRole] = useState('EQA'); // Default role for development

  const filteredLearners = learners.filter(learner => {
    const matchesSearch = learner.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         learner.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || learner.status === filter;
    return matchesSearch && matchesFilter;
  });

  const itemsPerPage = 4;
  const pageCount = Math.ceil(filteredLearners.length / itemsPerPage);
  const paginatedLearners = filteredLearners.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" />;
      case 'verified':
        return <Chip label="Verified" color="success" size="small" />;
      case 'needs_review':
        return <Chip label="Needs Review" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const handleViewPortfolio = (learner) => {
    setSelectedLearner(learner);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLearner(null);
  };

  return (
    <AuthContext.Provider value={{ userRole }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ flexGrow: 1 }}>
            Learner Portfolios (EQA)
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel>Role (Dev)</InputLabel>
            <Select
              value={userRole}
              label="Role (Dev)"
              onChange={(e) => setUserRole(e.target.value)}
            >
              <MenuItem value="IQA">IQA</MenuItem>
              <MenuItem value="EQA">EQA</MenuItem>
            </Select>
          </FormControl>
          {onBack && (
            <Button variant="outlined" startIcon={<Close />} onClick={onBack}>
              Back to Dashboard
            </Button>
          )}
        </Box>
        
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
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="verified">Verified</MenuItem>
                <MenuItem value="needs_review">Needs Review</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        <TableContainer component={Paper} elevation={3}>
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
                <TableRow key={learner.id}>
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
                      onClick={() => handleViewPortfolio(learner)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {filteredLearners.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No learners found matching your criteria
            </Typography>
          </Box>
        )}
        
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

        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="portfolio-modal-title"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: 800,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {selectedLearner && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography id="portfolio-modal-title" variant="h6">
                    Portfolio: {selectedLearner.name} - {selectedLearner.course}
                  </Typography>
                  <IconButton onClick={handleCloseModal}>
                    <Close />
                  </IconButton>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Typography variant="subtitle1" gutterBottom>
                  Submitted Work
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {selectedLearner.portfolio.submittedWork}
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  Assessor Feedback
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {selectedLearner.portfolio.assessorFeedback}
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  Assessment Criteria
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  {selectedLearner.portfolio.assessmentCriteria}
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  IQA Comments
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {selectedLearner.portfolio.iqaComments || 'No comments available.'}
                </Typography>
                {userRole === 'EQA' && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    You have read-only access to this portfolio.
                  </Alert>
                )}
                {userRole === 'IQA' && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    IQA mode enabled for development testing.
                  </Alert>
                )}
              </>
            )}
          </Box>
        </Modal>
      </Box>
    </AuthContext.Provider>
  );
};

export default LearnerPortfolioBrowserEQA;