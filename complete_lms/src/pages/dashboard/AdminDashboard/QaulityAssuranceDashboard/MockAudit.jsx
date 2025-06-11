import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Avatar,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Badge
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Checklist as ChecklistIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Add as AddIcon,
  PlayArrow as StartIcon,
  FileDownload as ExportIcon
} from '@mui/icons-material';

// Mock data
const mockAuditTemplates = [
  {
    id: 'template-1',
    name: 'Ofqual Compliance Audit',
    description: 'Full review against Ofqual Conditions of Recognition',
    criteria: 28,
    lastUsed: '2023-05-15',
    frequency: 'Annual'
  },
  {
    id: 'template-2',
    name: 'ISO 9001 Internal Audit',
    description: 'Quality management system verification',
    criteria: 42,
    lastUsed: '2023-03-10',
    frequency: 'Biannual'
  }
];

const auditStatuses = {
  draft: { color: 'default', icon: <AssignmentIcon /> },
  planned: { color: 'info', icon: <ScheduleIcon /> },
  inProgress: { color: 'warning', icon: <WarningIcon /> },
  completed: { color: 'success', icon: <CheckCircleIcon /> }
};

const activeAudits = [
  {
    id: 'audit-2023-2',
    name: 'Q3 2023 Quality Audit',
    template: 'Ofqual Compliance Audit',
    status: 'inProgress',
    startDate: '2023-07-01',
    endDate: '2023-09-30',
    progress: 65,
    findings: {
      critical: 2,
      major: 5,
      minor: 12
    },
    team: [
      { name: 'QA Lead', role: 'Lead Auditor' },
      { name: 'Compliance Officer', role: 'Document Reviewer' }
    ]
  }
];

const MockAudit = () => {
  const [audits, setAudits] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [newAuditDialog, setNewAuditDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API fetch
    setTemplates(mockAuditTemplates);
    setAudits(activeAudits);
  }, []);

  const handleStartAudit = () => {
    setNewAuditDialog(true);
  };

  const handleTemplateSelect = (event) => {
    setSelectedTemplate(event.target.value);
    setActiveStep(1);
  };

  const handleCompleteSetup = () => {
    const newAudit = {
      id: `audit-${Date.now()}`,
      name: `New Audit - ${selectedTemplate}`,
      template: selectedTemplate,
      status: 'planned',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      progress: 0,
      findings: { critical: 0, major: 0, minor: 0 },
      team: []
    };
    setAudits([...audits, newAudit]);
    setNewAuditDialog(false);
    setSelectedTemplate('');
    setActiveStep(0);
  };

  const getStatusBadge = (status) => {
    const statusInfo = auditStatuses[status] || auditStatuses.draft;
    return (
      <Chip
        icon={statusInfo.icon}
        label={status}
        color={statusInfo.color}
        variant="outlined"
        sx={{ textTransform: 'capitalize' }}
      />
    );
  };

  const filteredAudits = audits.filter(audit =>
    audit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audit.template.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Mock Audit Management"
              subheader="Simulate external audits to proactively identify compliance gaps"
              action={
                <Box display="flex" gap={2}>
                  <TextField
                    size="small"
                    placeholder="Search audits..."
                    InputProps={{
                      startAdornment: <SearchIcon color="action" />,
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: 250 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleStartAudit}
                  >
                    New Mock Audit
                  </Button>
                </Box>
              }
            />
            <Divider />
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Audit Name</TableCell>
                      <TableCell>Template</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Progress</TableCell>
                      <TableCell>Findings</TableCell>
                      <TableCell>Team</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAudits.map((audit) => (
                      <TableRow key={audit.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{audit.name}</TableCell>
                        <TableCell>{audit.template}</TableCell>
                        <TableCell>{getStatusBadge(audit.status)}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box width="100%" maxWidth={100}>
                              <progress value={audit.progress} max="100" style={{ width: '100%' }} />
                            </Box>
                            <Typography variant="body2">{audit.progress}%</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Chip label={`C: ${audit.findings.critical}`} color="error" size="small" />
                            <Chip label={`M: ${audit.findings.major}`} color="warning" size="small" />
                            <Chip label={`m: ${audit.findings.minor}`} color="info" size="small" />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex">
                            {audit.team.slice(0, 2).map((member, index) => (
                              <Tooltip key={index} title={`${member.name} (${member.role})`}>
                                <Avatar sx={{ width: 32, height: 32, ml: index > 0 ? -1 : 0 }}>
                                  <PersonIcon fontSize="small" />
                                </Avatar>
                              </Tooltip>
                            ))}
                            {audit.team.length > 2 && (
                              <Avatar sx={{ width: 32, height: 32, ml: -1, bgcolor: 'grey.300' }}>
                                +{audit.team.length - 2}
                              </Avatar>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<StartIcon />}
                            sx={{ mr: 1 }}
                          >
                            Continue
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ExportIcon />}
                          >
                            Export
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* New Mock Audit Dialog */}
      <Dialog open={newAuditDialog} onClose={() => setNewAuditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Mock Audit</DialogTitle>
        <DialogContent dividers>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel>Select Audit Template</StepLabel>
              <StepContent>
                <TextField
                  select
                  fullWidth
                  label="Audit Template"
                  value={selectedTemplate}
                  onChange={handleTemplateSelect}
                  sx={{ mt: 2 }}
                >
                  {templates.map((template) => (
                    <MenuItem key={template.id} value={template.name}>
                      {template.name} - {template.description}
                    </MenuItem>
                  ))}
                </TextField>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Configure Audit Parameters</StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Configuration options would appear here based on selected template
                </Typography>
              </StepContent>
            </Step>
          </Stepper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewAuditDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCompleteSetup}
            disabled={!selectedTemplate}
          >
            Create Mock Audit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MockAudit;