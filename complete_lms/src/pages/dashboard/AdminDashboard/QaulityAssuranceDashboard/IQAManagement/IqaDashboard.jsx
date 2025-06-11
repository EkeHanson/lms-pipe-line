// src/components/QaulityAssuranceDashboard/IqaDashboard.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Button, 
  Divider, 
  Chip,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  FilterList as FilterIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  CheckCircle as ApprovedIcon,
  Warning as IssuesIcon,
  Assignment as ReportIcon
} from '@mui/icons-material';
import IqaSamplingModal from '../IqaSamplingModal';
import IqaFeedbackModal from '../IqaFeedbackModal';

const sampleIqaChecks = [
  {
    id: 'IQA-2023-001',
    course: 'Advanced React Development',
    trainer: 'Dr. Sarah Johnson',
    date: '2023-05-15',
    type: 'Online Session',
    status: 'Completed',
    result: 'Approved',
    issues: 0,
    reviewer: 'Michael Brown'
  },
  {
    id: 'IQA-2023-002',
    course: 'Cybersecurity Fundamentals',
    trainer: 'Prof. James Wilson',
    date: '2023-05-18',
    type: 'Offline Assessment',
    status: 'Completed',
    result: 'Minor Issues',
    issues: 2,
    reviewer: 'Emily Davis'
  },
  {
    id: 'IQA-2023-003',
    course: 'Data Science Bootcamp',
    trainer: 'Dr. Lisa Chen',
    date: '2023-05-20',
    type: 'Course Materials',
    status: 'In Progress',
    result: 'Pending',
    issues: null,
    reviewer: 'Michael Brown'
  },
  {
    id: 'IQA-2023-004',
    course: 'Cloud Architecture',
    trainer: 'Prof. Robert Taylor',
    date: '2023-05-22',
    type: 'Learner Assessments',
    status: 'Scheduled',
    result: 'Pending',
    issues: null,
    reviewer: null
  },
];

const IqaDashboard = () => {
  const theme = useTheme();
  const [openSamplingModal, setOpenSamplingModal] = useState(false);
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleViewDetails = (check) => {
    setSelectedCheck(check);
    setOpenFeedbackModal(true);
  };

  const handleNewSampling = () => {
    setOpenSamplingModal(true);
  };

  const filteredChecks = sampleIqaChecks.filter(check => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'completed' && check.status === 'Completed') ||
                         (filter === 'in-progress' && check.status === 'In Progress') ||
                         (filter === 'scheduled' && check.status === 'Scheduled');
    
    const matchesSearch = searchTerm === '' || 
                         check.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.trainer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: sampleIqaChecks.length,
    completed: sampleIqaChecks.filter(c => c.status === 'Completed').length,
    approved: sampleIqaChecks.filter(c => c.result === 'Approved').length,
    withIssues: sampleIqaChecks.filter(c => c.result === 'Minor Issues' || c.result === 'Major Issues').length,
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
        Internal Quality Assurance (IQA)
      </Typography>
      
      <Paper elevation={0} sx={{ mb: 3, p: 2, backgroundColor: theme.palette.background.paper }}>
        <Typography variant="body1" paragraph>
          Monitor and manage internal quality assurance checks across all training activities. 
          Schedule new quality checks, review completed assessments, and provide feedback to trainers.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleNewSampling}
          >
            New Quality Check
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<ExportIcon />}
          >
            Export Reports
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
          >
            Refresh Data
          </Button>
        </Box>
      </Paper>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary">Total Checks</Typography>
            <Typography variant="h4">{stats.total}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary">Completed</Typography>
            <Typography variant="h4">{stats.completed}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary">Approved</Typography>
            <Typography variant="h4" sx={{ color: theme.palette.success.main }}>
              {stats.approved}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary">With Issues</Typography>
            <Typography variant="h4" sx={{ color: theme.palette.warning.main }}>
              {stats.withIssues}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Recent Quality Checks</Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              placeholder="Search..."
              InputProps={{
                startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />,
              }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Filter</InputLabel>
              <Select
                value={filter}
                label="Filter"
                onChange={(e) => setFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
              </Select>
            </FormControl>
            
            <Tooltip title="More filters">
              <IconButton>
                <FilterIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Check ID</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Trainer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Result</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredChecks.map((check) => (
                <TableRow key={check.id}>
                  <TableCell>{check.id}</TableCell>
                  <TableCell>{check.course}</TableCell>
                  <TableCell>{check.trainer}</TableCell>
                  <TableCell>{check.date}</TableCell>
                  <TableCell>{check.type}</TableCell>
                  <TableCell>
                    <Chip 
                      label={check.status} 
                      size="small" 
                      color={
                        check.status === 'Completed' ? 'success' : 
                        check.status === 'In Progress' ? 'warning' : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {check.result === 'Approved' ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ApprovedIcon fontSize="small" color="success" />
                        <span>Approved</span>
                      </Box>
                    ) : check.result === 'Minor Issues' ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IssuesIcon fontSize="small" color="warning" />
                        <span>Minor Issues ({check.issues})</span>
                      </Box>
                    ) : (
                      <span>{check.result}</span>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View details">
                      <IconButton size="small" onClick={() => handleViewDetails(check)}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {check.status === 'Completed' && (
                      <Tooltip title="Generate report">
                        <IconButton size="small">
                          <ReportIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      <IqaSamplingModal 
        open={openSamplingModal} 
        onClose={() => setOpenSamplingModal(false)} 
      />
      
      <IqaFeedbackModal 
        open={openFeedbackModal} 
        onClose={() => setOpenFeedbackModal(false)} 
        check={selectedCheck}
      />
    </Box>
  );
};

export default IqaDashboard;