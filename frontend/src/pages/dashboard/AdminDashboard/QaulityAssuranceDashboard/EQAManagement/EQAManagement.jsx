import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Divider,
  List, ListItem, ListItemIcon, ListItemText, Button,
  Chip, Avatar, LinearProgress, Tabs, Tab, Paper,IconButton ,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, TextField, MenuItem, InputAdornment
} from '@mui/material';
import AccreditationStatus from './AccreditationStatus';
import AuditScheduler from './AuditScheduler';
import {
  Assignment, Gavel, Feedback, CheckCircle, Warning,
  Error as ErrorIcon, Schedule, History, Description,
  CloudDownload, PersonSearch, Edit, Visibility, Lock,
  Add, Close, CalendarToday, Person, Upload
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; 
// or AdapterDateFns, AdapterLuxon, etc. depending on your choice
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

// Dummy Data Store with all necessary functions
const createDataStore = () => {
  let data = {
    accreditation: {
      status: 'Active',
      expiry: '2024-12-31',
      progress: 78,
      details: 'Full accreditation granted with minor conditions'
    },
    audits: [
      { id: 1, type: 'Annual Review', date: '2023-11-15', status: 'scheduled', evidence: [] },
      { id: 2, type: 'Spot Check', date: '2023-09-28', status: 'pending', evidence: [] }
    ],
    learners: [
      { id: 1, name: 'John Smith', course: 'Business L3', status: 'Assessed', lastAssessed: '2023-08-10' },
      { id: 2, name: 'Sarah Lee', course: 'Healthcare L2', status: 'Pending IQA', lastAssessed: '2023-08-08' },
      { id: 3, name: 'Michael Brown', course: 'IT L4', status: 'In Progress', lastAssessed: '2023-08-05' }
    ],
    iqaRecords: [
      { id: 1, assessor: 'Mark Taylor', sampled: 5, date: '2023-08-01', verified: true },
      { id: 2, assessor: 'Emma Wilson', sampled: 3, date: '2023-08-05', verified: false }
    ],
    evidencePacks: [
      { id: 1, name: 'Q1 Compliance Evidence', date: '2023-03-31', size: '4.2MB' },
      { id: 2, name: 'Annual Audit Pack', date: '2022-12-15', size: '12.7MB' }
    ]
  };

  return {
    getData: () => ({ ...data }),
    updateLearnerStatus: (id, status) => {
      data.learners = data.learners.map(learner => 
        learner.id === id ? { ...learner, status, lastAssessed: new Date().toISOString().split('T')[0] } : learner
      );
    },
    addAudit: (audit) => {
      const newId = Math.max(0, ...data.audits.map(a => a.id)) + 1;
      data.audits.push({ ...audit, id: newId, evidence: [] });
      return newId;
    },
    verifyAssessment: (id) => {
      data.learners = data.learners.map(learner => 
        learner.id === id ? { ...learner, status: 'Verified' } : learner
      );
    },
    addNewAssessment: (assessment) => {
      const newId = Math.max(0, ...data.learners.map(l => l.id)) + 1;
      data.learners.push({
        id: newId,
        name: assessment.name,
        course: assessment.course,
        status: 'In Progress',
        lastAssessed: new Date().toISOString().split('T')[0]
      });
      return newId;
    },
    requestAccreditationUpdate: () => {
      data.accreditation.progress = Math.min(100, data.accreditation.progress + 5);
      return data.accreditation.progress;
    },
    downloadEvidencePack: (id) => {
      const pack = data.evidencePacks.find(p => p.id === id);
      return pack || null;
    },
    uploadEvidence: (auditId, file) => {
      const audit = data.audits.find(a => a.id === auditId);
      if (audit) {
        audit.evidence.push({
          name: file.name,
          type: file.type,
          size: file.size,
          uploaded: new Date().toISOString()
        });
      }
    }
  };
};

const dataStore = createDataStore();

const StatusChip = ({ status }) => {
  const config = {
    scheduled: { color: 'info', icon: <Schedule /> },
    pending: { color: 'warning', icon: <Warning /> },
    completed: { color: 'success', icon: <CheckCircle /> },
    Assessed: { color: 'success', icon: <CheckCircle /> },
    Verified: { color: 'success', icon: <CheckCircle /> },
    'Pending IQA': { color: 'warning', icon: <Warning /> },
    'In Progress': { color: 'info', icon: <Schedule /> }
  };

  return (
    <Chip
      icon={config[status]?.icon}
      label={status}
      color={config[status]?.color}
      size="small"
      variant="outlined"
    />
  );
};

const RoleDashboard = ({ role }) => {
  const [tabValue, setTabValue] = useState(0);
  const [data, setData] = useState(dataStore.getData());
  const [openDialog, setOpenDialog] = useState(null);
  const [dialogContent, setDialogContent] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [newAssessment, setNewAssessment] = useState({ name: '', course: '' });
  const [newAudit, setNewAudit] = useState({ type: '', date: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [assessmentComment, setAssessmentComment] = useState('');

  const isEQA = role === 'eqa';
  const isIQA = role === 'iqa';

  const refreshData = () => setData(dataStore.getData());

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Button Action Handlers
  const handleVerifyAssessment = (learnerId) => {
    dataStore.verifyAssessment(learnerId);
    showSnackbar('Assessment verified!', 'success');
    refreshData();
  };

  const handleUpdateLearnerStatus = (learnerId, status) => {
    dataStore.updateLearnerStatus(learnerId, status);
    showSnackbar(`Status updated to ${status}`, 'success');
    setOpenDialog(null);
    refreshData();
  };

  const handleScheduleAudit = () => {
    const id = dataStore.addAudit({
      type: newAudit.type,
      date: newAudit.date,
      status: 'scheduled'
    });
    showSnackbar(`Audit #${id} scheduled!`, 'success');
    setNewAudit({ type: '', date: '' });
    setOpenDialog(null);
    refreshData();
  };

  const handleDownloadReport = () => {
    showSnackbar('Preparing report download...', 'info');
    // Simulate download delay
    setTimeout(() => {
      showSnackbar('Report downloaded successfully!', 'success');
    }, 2000);
  };

  const handleDownloadEvidencePack = (packId) => {
    const pack = dataStore.downloadEvidencePack(packId);
    if (pack) {
      showSnackbar(`Downloading ${pack.name}...`, 'info');
      setTimeout(() => {
        showSnackbar(`Downloaded ${pack.name} (${pack.size})`, 'success');
      }, 1500);
    }
  };

  const handleRequestUpdate = () => {
    const newProgress = dataStore.requestAccreditationUpdate();
    showSnackbar(`Accreditation update requested (${newProgress}% complete)`, 'info');
    refreshData();
  };

  const handleAddNewAssessment = () => {
    const id = dataStore.addNewAssessment(newAssessment);
    showSnackbar(`New assessment added for ${newAssessment.name} (ID: ${id})`, 'success');
    setNewAssessment({ name: '', course: '' });
    setOpenDialog(null);
    refreshData();
  };

  const handleFileUpload = (auditId) => {
    if (selectedFile) {
      dataStore.uploadEvidence(auditId, selectedFile);
      showSnackbar(`${selectedFile.name} uploaded to audit`, 'success');
      setSelectedFile(null);
      setOpenDialog(null);
      refreshData();
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // Dialog Openers
  const openAssessmentDialog = (learner) => {
    setDialogContent({
      title: `Assess ${learner.name}`,
      content: (
        <Box>
          <Typography gutterBottom>Course: {learner.course}</Typography>
          <Typography gutterBottom>Last Assessed: {learner.lastAssessed}</Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Assessment Comments"
            value={assessmentComment}
            onChange={(e) => setAssessmentComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleUpdateLearnerStatus(learner.id, 'Assessed')}
          >
            Submit Assessment
          </Button>
        </Box>
      )
    });
    setOpenDialog('assessment');
  };

  const openAuditDialog = () => {
    setDialogContent({
      title: "Schedule New Audit",
      content: (
        <Box>
          <TextField
            fullWidth
            label="Audit Type"
            select
            value={newAudit.type}
            onChange={(e) => setNewAudit({ ...newAudit, type: e.target.value })}
            sx={{ mb: 2 }}
          >
            <MenuItem value="Annual Review">Annual Review</MenuItem>
            <MenuItem value="Spot Check">Spot Check</MenuItem>
            <MenuItem value="Documentation Audit">Documentation Audit</MenuItem>
          </TextField>
          <DatePicker
            label="Audit Date"
            value={newAudit.date}
            onChange={(date) => setNewAudit({ ...newAudit, date })}
            renderInput={(params) => <TextField fullWidth {...params} sx={{ mb: 2 }} />}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleScheduleAudit}
            disabled={!newAudit.type || !newAudit.date}
          >
            Schedule Audit
          </Button>
        </Box>
      )
    });
    setOpenDialog('audit');
  };

  const openNewAssessmentDialog = () => {
    setDialogContent({
      title: "Add New Assessment",
      content: (
        <Box>
          <TextField
            fullWidth
            label="Learner Name"
            value={newAssessment.name}
            onChange={(e) => setNewAssessment({ ...newAssessment, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Course"
            select
            value={newAssessment.course}
            onChange={(e) => setNewAssessment({ ...newAssessment, course: e.target.value })}
            sx={{ mb: 2 }}
          >
            <MenuItem value="Business L3">Business L3</MenuItem>
            <MenuItem value="Healthcare L2">Healthcare L2</MenuItem>
            <MenuItem value="IT L4">IT L4</MenuItem>
          </TextField>
          <Button
            fullWidth
            variant="contained"
            onClick={handleAddNewAssessment}
            disabled={!newAssessment.name || !newAssessment.course}
          >
            Create Assessment
          </Button>
        </Box>
      )
    });
    setOpenDialog('new-assessment');
  };

  const openEvidenceDialog = (audit) => {
    setDialogContent({
      title: `Manage Evidence for ${audit.type}`,
      content: (
        <Box>
          <Typography gutterBottom>Audit Date: {audit.date}</Typography>
          <Typography gutterBottom>Status: {audit.status}</Typography>
          
          <Box sx={{ mt: 2, mb: 3 }}>
            <Typography variant="subtitle2">Upload Evidence:</Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<Upload />}
              sx={{ mt: 1, mr: 2 }}
            >
              Select File
              <input
                type="file"
                hidden
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </Button>
            {selectedFile && (
              <Typography variant="body2">
                Selected: {selectedFile.name}
              </Typography>
            )}
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              disabled={!selectedFile}
              onClick={() => handleFileUpload(audit.id)}
            >
              Upload Evidence
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2">Existing Evidence:</Typography>
          {audit.evidence.length > 0 ? (
            <List>
              {audit.evidence.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Description />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    secondary={`Uploaded: ${item.uploaded}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No evidence uploaded yet
            </Typography>
          )}
        </Box>
      )
    });
    setOpenDialog('evidence');
  };

  const openAccreditationDetails = () => {
    setDialogContent({
      title: "Accreditation Details",
      content: (
        <Box>
          <Typography gutterBottom><strong>Status:</strong> {data.accreditation.status}</Typography>
          <Typography gutterBottom><strong>Expiry Date:</strong> {data.accreditation.expiry}</Typography>
          <Typography gutterBottom><strong>Progress:</strong> {data.accreditation.progress}%</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography><strong>Details:</strong></Typography>
          <Typography>{data.accreditation.details}</Typography>
          {isIQA && (
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={handleRequestUpdate}
            >
              Request Update
            </Button>
          )}
        </Box>
      )
    });
    setOpenDialog('accreditation');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Role Indicator */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {isEQA ? 'External' : 'Internal'} Quality Assurance Dashboard
        </Typography>
        <Chip
          label={isEQA ? 'EQA Mode' : 'IQA Mode'}
          color={isEQA ? 'secondary' : 'primary'}
          icon={isEQA ? <Lock /> : <Edit />}
          sx={{ ml: 2 }}
        />
      </Box>

      {/* Role-Specific Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Overview" />
          {isIQA && <Tab label="My Sampling" />}
          {isEQA && <Tab label="Audit Center" />}
          <Tab label={isIQA ? "My Learners" : "All Learners"} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Full-width Accreditation Status Section */}
          <Grid item xs={12}>
            <AccreditationStatus 
              isReadOnly={role === 'eqa'}
              status={data.accreditation.status}
              accreditor="NCFE"
              reference={data.accreditation.reference || "QA-2023-001"}
              validUntil={data.accreditation.expiry}
              lastReview={data.accreditation.lastReview || "2023-06-15"}
              standards={{
                met: Math.floor(data.accreditation.progress / 100 * 20),
                total: 20,
                requirements: [
                  { id: 1, name: 'Assessment Practices', status: 'met', notes: 'Verified in last audit' },
                  { id: 2, name: 'IQA Process', status: data.iqaRecords.some(r => !r.verified) ? 'pending' : 'met', 
                    notes: data.iqaRecords.some(r => !r.verified) ? `${data.iqaRecords.filter(r => !r.verified).length} pending verifications` : 'All verified' 
                  },
                  { id: 3, name: 'Trainer Qualifications', status: 'met', notes: 'All trainers certified' },
                  { id: 4, name: 'Facilities', status: 'met', notes: 'Site visit completed' }
                ]
              }}
              documents={data.evidencePacks
                .filter(p => p.name.includes('Accreditation') || p.name.includes('Compliance'))
                .map(p => ({
                  id: p.id,
                  name: p.name,
                  type: p.name.split('.').pop(),
                  uploaded: p.date
                }))
              }
              onDownload={(docName) => {
                const pack = data.evidencePacks.find(p => p.name === docName);
                if (pack) {
                  showSnackbar(`Downloading ${pack.name}...`, 'info');
                  setTimeout(() => {
                    showSnackbar(`Downloaded ${pack.name} (${pack.size})`, 'success');
                  }, 1500);
                }
              }}
            />
          </Grid>

          {/* Role-Specific Middle Card - Reduced width to accommodate full-width accreditation */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                {role === 'iqa' ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        My Sampling Queue
                      </Typography>
                      <Chip 
                        label={`${data.learners.filter(l => l.status === 'Pending IQA').length} pending`} 
                        color="warning" 
                        size="small"
                      />
                    </Box>
                    <List dense>
                      {data.learners
                        .filter(l => l.status === 'Pending IQA')
                        .slice(0, 3) // Show only top 3
                        .map(learner => (
                          <ListItem 
                            key={learner.id}
                            secondaryAction={
                              <Button 
                                size="small" 
                                variant="contained"
                                onClick={() => handleVerifyAssessment(learner.id)}
                              >
                                Verify
                              </Button>
                            }
                          >
                            <ListItemText
                              primary={learner.name}
                              secondary={learner.course}
                            />
                          </ListItem>
                        ))}
                      {data.learners.filter(l => l.status === 'Pending IQA').length > 3 && (
                        <Button 
                          fullWidth 
                          sx={{ mt: 1 }}
                          onClick={() => setTabValue(1)} // Switch to Sampling tab
                        >
                          View All ({data.learners.filter(l => l.status === 'Pending IQA').length})
                        </Button>
                      )}
                    </List>
                  </>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Upcoming Audits
                      </Typography>
                      <Button 
                        size="small" 
                        startIcon={<Add />}
                        onClick={openAuditDialog}
                      >
                        New
                      </Button>
                    </Box>
                    <List dense>
                      {data.audits.map(audit => (
                        <ListItem 
                          key={audit.id}
                          secondaryAction={
                            <Button 
                              size="small"
                              onClick={() => openEvidenceDialog(audit)}
                            >
                              Review
                            </Button>
                          }
                        >
                          <ListItemIcon>
                            <Gavel color="action" />
                          </ListItemIcon>
                          <ListItemText
                            primary={audit.type}
                            secondary={`Scheduled: ${audit.date}`}
                          />
                          <StatusChip status={audit.status} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Card - Activity/Compliance */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {role === 'iqa' ? 'My Recent Actions' : 'Center Compliance'}
                </Typography>
                
                {role === 'iqa' ? (
                  <>
                    <List dense>
                      {data.iqaRecords
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 3)
                        .map(record => (
                          <ListItem key={record.id}>
                            <ListItemIcon>
                              <Avatar sx={{ 
                                bgcolor: record.verified ? 'success.light' : 'warning.light',
                                color: 'common.white',
                                width: 32, 
                                height: 32 
                              }}>
                                {record.verified ? <CheckCircle /> : <Warning />}
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={`${record.assessor} - ${record.sampled} samples`}
                              secondary={`${record.date} • ${record.verified ? 'Verified' : 'Pending'}`}
                            />
                          </ListItem>
                        ))}
                    </List>
                    <Button 
                      fullWidth 
                      sx={{ mt: 1 }}
                      onClick={() => setTabValue(1)} // Switch to Sampling tab
                    >
                      View Full History
                    </Button>
                  </>
                ) : (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        Overall Compliance Score
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={92} 
                        sx={{ height: 10, mb: 1 }} 
                      />
                      <Typography variant="body2" color="text.secondary">
                        92/100 (Excellent)
                      </Typography>
                    </Box>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Button 
                          fullWidth 
                          variant="outlined" 
                          startIcon={<Description />}
                          onClick={handleDownloadReport}
                        >
                          Full Report
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button 
                          fullWidth 
                          variant="outlined" 
                          startIcon={<CloudDownload />}
                          onClick={() => handleDownloadEvidencePack(1)}
                        >
                          Evidence Pack
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* IQA Sampling Tab */}
      {tabValue === 1 && isIQA && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              My Sampling Plan
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<Add />} 
                sx={{ mb: 2 }}
                onClick={openNewAssessmentDialog}
              >
                Add New Assessment
              </Button>
            </Box>
            <List>
              {data.learners.map(learner => (
                <ListItem key={learner.id}>
                  <ListItemText
                    primary={learner.name}
                    secondary={learner.course}
                  />
                  <StatusChip status={learner.status} />
                  <Button 
                    size="small" 
                    sx={{ ml: 2 }} 
                    startIcon={<Edit />}
                    onClick={() => openAssessmentDialog(learner)}
                  >
                    Assess
                  </Button>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* EQA Audit Center Tab */}
        {tabValue === 1 && isEQA && (
        <AuditScheduler 
          isReadOnly={false}
          audits={data.audits}
          onAddAudit={(audit) => {
            const newId = dataStore.addAudit(audit);
            showSnackbar(`Audit #${newId} scheduled!`, 'success');
            refreshData();
          }}
          onUpdateAudit={(audit) => {
            dataStore.updateAudit(audit);
            showSnackbar("Audit updated successfully", 'success');
            refreshData();
          }}
          onDeleteAudit={(id) => {
            dataStore.deleteAudit(id);
            showSnackbar("Audit cancelled", 'warning');
            refreshData();
          }}
          onUploadDocument={(auditId, file) => {
            dataStore.uploadAuditDocument(auditId, file);
            showSnackbar(`${file.name} uploaded`, 'success');
            refreshData();
          }}
        />
      )}

      {/* Learners Tab */}
      {tabValue === (isIQA ? 2 : 1) && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {isIQA ? 'My Learners' : 'All Learner Portfolios'}
            </Typography>
            <Box sx={{ mb: 2 }}>
              {isEQA && (
                <Typography variant="body2" color="text.secondary">
                  Read-only access - sampling only
                </Typography>
              )}
              {isIQA && (
                <Button 
                  variant="outlined" 
                  startIcon={<Add />} 
                  sx={{ mb: 2 }}
                  onClick={openNewAssessmentDialog}
                >
                  Add New Assessment
                </Button>
              )}
            </Box>
            <List>
              {data.learners.map(learner => (
                <ListItem key={learner.id}>
                  <ListItemText
                    primary={learner.name}
                    secondary={learner.course}
                  />
                  <StatusChip status={learner.status} />
                  {isIQA ? (
                    <Button 
                      size="small" 
                      sx={{ ml: 2 }} 
                      startIcon={<Edit />}
                      onClick={() => openAssessmentDialog(learner)}
                    >
                      Assess
                    </Button>
                  ) : (
                    <Button 
                      size="small" 
                      sx={{ ml: 2 }} 
                      startIcon={<Visibility />}
                      onClick={() => {
                        showSnackbar(`Sampling ${learner.name}'s portfolio`, 'info');
                      }}
                    >
                      Sample
                    </Button>
                  )}
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <Dialog open={Boolean(openDialog)} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth>
        {dialogContent && (
          <>
            <DialogTitle>
              {dialogContent.title}
              <IconButton
                aria-label="close"
                onClick={() => setOpenDialog(null)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              {dialogContent.content}
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Demo switcher to show both views
const IqaEqaComparison = () => {
  const [value, setValue] = React.useState(null);
  const [view, setView] = useState('iqa');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Button
          variant={view === 'iqa' ? 'contained' : 'outlined'}
          onClick={() => setView('iqa')}
          sx={{ mr: 2 }}
        >
          View IQA Interface
        </Button>
        <Button
          variant={view === 'eqa' ? 'contained' : 'outlined'}
          onClick={() => setView('eqa')}
        >
          View EQA Interface
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 2 }}>
        {view === 'iqa' ? (
          <RoleDashboard role="iqa" />
        ) : (
          <RoleDashboard role="eqa" />
        )}
      </Paper>
    </Box>
    </LocalizationProvider>
  );
};

export default IqaEqaComparison;