import React, { useState } from 'react';
import { 
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Avatar,
  TextField,
  Grid,
  IconButton,
  Tooltip,
  useTheme,
  Accordion,ListItemText,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ExpandMore as ExpandMoreIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Description as ReportIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Timeline as TimelineIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import ProgressTracker from '../shared/ProgressTracker';

const auditLogs = [
  {
    id: 1,
    date: '2023-10-15',
    auditor: 'Jane Smith',
    type: 'Annual Review',
    status: 'passed',
    findings: 2,
    notes: 'Overall compliance is good, minor issues with documentation',
    details: [
      { finding: 'Missing trainer qualification for John Doe', action: 'Provide certification', resolved: false },
      { finding: 'Outdated assessment for Course 101', action: 'Update assessment materials', resolved: true }
    ],
    process: [
      { label: 'Initial Submission', status: 'completed', date: '2023-10-01' },
      { label: 'Document Review', status: 'completed', date: '2023-10-05' },
      { label: 'On-site Visit', status: 'completed', date: '2023-10-10' },
      { label: 'Final Report', status: 'completed', date: '2023-10-15' }
    ]
  },
  {
    id: 2,
    date: '2023-07-22',
    auditor: 'Michael Johnson',
    type: 'Spot Check',
    status: 'failed',
    findings: 5,
    notes: 'Significant issues with assessment sampling process',
    details: [
      { finding: 'Inconsistent grading practices', action: 'Retrain assessors', resolved: true },
      { finding: 'Incomplete learner records', action: 'Update LMS data', resolved: true },
      { finding: 'No IQA records for Q2', action: 'Conduct retrospective IQA', resolved: false }
    ],
    process: [
      { label: 'Initial Submission', status: 'completed', date: '2023-07-15' },
      { label: 'Document Review', status: 'completed', date: '2023-07-18' },
      { label: 'On-site Visit', status: 'completed', date: '2023-07-20' },
      { label: 'Final Report', status: 'completed', date: '2023-07-22' },
      { label: 'Remediation', status: 'pending', date: 'Due 2023-08-22' }
    ]
  },
  {
    id: 3,
    date: '2023-04-05',
    auditor: 'Sarah Williams',
    type: 'Documentation Audit',
    status: 'passed',
    findings: 0,
    notes: 'All documentation complete and up-to-date',
    details: [],
    process: [
      { label: 'Initial Submission', status: 'completed', date: '2023-03-20' },
      { label: 'Document Review', status: 'completed', date: '2023-04-03' },
      { label: 'Final Report', status: 'completed', date: '2023-04-05' }
    ]
  }
];

const statusConfig = {
  passed: { color: 'success', icon: <CheckIcon /> },
  failed: { color: 'error', icon: <ErrorIcon /> },
  warning: { color: 'warning', icon: <WarningIcon /> }
};

function EQAAudit() {
  const theme = useTheme();
  const [expanded, setExpanded] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const handleExpand = (id) => {
    if (expanded.includes(id)) {
      setExpanded(expanded.filter(item => item !== id));
    } else {
      setExpanded([...expanded, id]);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredLogs = auditLogs.filter(log =>
    log.auditor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        EQA Audit Management
      </Typography>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        sx={{ mb: 3 }}
      >
        <Tab label="Audit History" icon={<HistoryIcon />} />
        <Tab label="Current Audits" icon={<TimelineIcon />} />
      </Tabs>

      {tabValue === 0 ? (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search audit logs..."
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button variant="outlined" startIcon={<FilterListIcon />}>
                Filters
              </Button>
              <Button variant="contained" color="primary">
                New Audit
              </Button>
            </Grid>
          </Grid>

          {filteredLogs.map((log) => (
            <Accordion
              key={log.id}
              expanded={expanded.includes(log.id)}
              onChange={() => handleExpand(log.id)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Avatar sx={{ bgcolor: theme.palette.grey[300], mr: 2 }}>
                      {statusConfig[log.status].icon}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600}>{log.type}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(log.date).toLocaleDateString()} • {log.auditor}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={log.status.toUpperCase()}
                      color={statusConfig[log.status].color}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      icon={<ReportIcon fontSize="small" />}
                      label={`${log.findings} findings`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography paragraph sx={{ mb: 2 }}>
                  <strong>Auditor Notes:</strong> {log.notes}
                </Typography>

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Audit Process
                </Typography>
                <ProgressTracker 
                  steps={log.process.map(step => ({
                    label: step.label,
                    status: step.status,
                    description: step.date,
                    content: (
                      <Typography variant="body2">
                        Completed on {new Date(step.date).toLocaleDateString()}
                      </Typography>
                    )
                  }))}
                  activeStep={log.process.findIndex(step => step.status !== 'completed')}
                  orientation="horizontal"
                  showProgress={false}
                  showStatusChips={true}
                />

                {log.details.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Findings and Actions
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Finding</TableCell>
                            <TableCell>Required Action</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {log.details.map((detail, index) => (
                            <TableRow key={index}>
                              <TableCell>{detail.finding}</TableCell>
                              <TableCell>{detail.action}</TableCell>
                              <TableCell>
                                <Chip
                                  label={detail.resolved ? 'Resolved' : 'Pending'}
                                  color={detail.resolved ? 'success' : 'warning'}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button variant="outlined" size="small">
                    View Full Report
                  </Button>
                  <Button variant="contained" size="small">
                    Add Follow-up
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Ongoing Audit Processes
          </Typography>
          
          {auditLogs.filter(log => log.process.some(step => step.status !== 'completed')).map(log => (
            <Paper key={log.id} sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="div">
                  {log.type} Audit
                </Typography>
                <Chip
                  label={log.status.toUpperCase()}
                  color={statusConfig[log.status].color}
                  variant="outlined"
                />
              </Box>
              
              <ProgressTracker 
                steps={log.process.map(step => ({
                  label: step.label,
                  status: step.status,
                  description: step.date.startsWith('Due') ? step.date : `Completed on ${new Date(step.date).toLocaleDateString()}`,
                  content: (
                    <Typography variant="body2">
                      {step.date.startsWith('Due') ? 'Pending completion' : `Completed on ${new Date(step.date).toLocaleDateString()}`}
                    </Typography>
                  )
                }))}
                activeStep={log.process.findIndex(step => step.status !== 'completed')}
                showProgress={true}
                showStatusChips={true}
              />
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" size="small" startIcon={<CalendarIcon />}>
                  View Schedule
                </Button>
                <Button variant="contained" size="small">
                  View Details
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default EQAAudit;