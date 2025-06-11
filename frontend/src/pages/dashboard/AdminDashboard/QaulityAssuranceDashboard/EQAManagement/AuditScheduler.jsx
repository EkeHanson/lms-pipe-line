import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid,
  Button, Chip, TextField, Divider, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, MenuItem, List, ListItem, ListItemIcon,
  ListItemText, Accordion, AccordionSummary, AccordionDetails,
  Tabs, Tab, Tooltip, Badge
} from '@mui/material';
import {
  CalendarToday, Add, Edit, Delete, Visibility,
  Download, CheckCircle, Warning, Error as ErrorIcon,
  FilterList, ExpandMore, Description, CloudUpload,
  Gavel, History
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';

const statusConfig = {
  scheduled: { color: 'info', icon: <CalendarToday />, label: 'Scheduled' },
  'in-progress': { color: 'warning', icon: <Warning />, label: 'In Progress' },
  completed: { color: 'success', icon: <CheckCircle />, label: 'Completed' },
  cancelled: { color: 'error', icon: <ErrorIcon />, label: 'Cancelled' }
};

const focusAreaOptions = [
  "Assessment Practices",
  "IQA Process",
  "Trainer Qualifications",
  "Facilities",
  "Documentation",
  "Learner Support",
  "Certification"
];

const AuditScheduler = ({ 
  isReadOnly = false, 
  audits = [], 
  onAddAudit, 
  onUpdateAudit, 
  onDeleteAudit,
  onUploadDocument
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAudit, setCurrentAudit] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleOpenCreate = () => {
    setCurrentAudit({
      title: "",
      type: "partial",
      status: "scheduled",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      auditor: "",
      focusAreas: [],
      documents: [],
      sampledLearners: [],
      notes: "",
      findings: []
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (audit) => {
    setCurrentAudit({ ...audit });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentAudit(null);
    setSelectedFile(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAudit(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setCurrentAudit(prev => ({ 
      ...prev, 
      [name]: date ? date.toISOString().split('T')[0] : "" 
    }));
  };

  const handleSubmitAudit = () => {
    if (currentAudit.id) {
      onUpdateAudit(currentAudit);
    } else {
      onAddAudit(currentAudit);
    }
    handleCloseDialog();
  };

  const handleDeleteAudit = (id) => {
    onDeleteAudit(id);
  };

  const handleOpenDetails = (audit) => {
    setSelectedAudit(audit);
    setOpenDetails(true);
  };

  const handleFileUpload = () => {
    if (selectedFile && selectedAudit) {
      onUploadDocument(selectedAudit.id, selectedFile);
      setSelectedFile(null);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const StatusChip = ({ status }) => (
    <Chip
      icon={statusConfig[status]?.icon}
      label={statusConfig[status]?.label}
      color={statusConfig[status]?.color}
      size="small"
      variant="outlined"
    />
  );

  return (
    <Box sx={{ p: 0 }}>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Upcoming Audits" icon={<CalendarToday />} />
        <Tab label="Audit History" icon={<History />} />
      </Tabs>

      {!isReadOnly && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleOpenCreate}
          >
            Schedule New Audit
          </Button>
        </Box>
      )}

      {tabValue === 0 ? (
        <Card elevation={3}>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Audit Title</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Dates</TableCell>
                    <TableCell>Auditor</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {audits
                    .filter(audit => audit.status !== 'completed')
                    .map((audit) => (
                      <TableRow key={audit.id}>
                        <TableCell>{audit.title}</TableCell>
                        <TableCell>
                          <Chip 
                            label={audit.type} 
                            size="small" 
                            color={audit.type === "full" ? "primary" : "secondary"} 
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(audit.startDate).toLocaleDateString()} - 
                          {new Date(audit.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{audit.auditor}</TableCell>
                        <TableCell>
                          <StatusChip status={audit.status} />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              onClick={() => handleOpenDetails(audit)}
                              color="primary"
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {!isReadOnly && (
                            <>
                              <Tooltip title="Edit">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleOpenEdit(audit)}
                                  color="secondary"
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cancel">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteAudit(audit.id)}
                                  color="error"
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ) : (
        <Card elevation={3}>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Audit Title</TableCell>
                    <TableCell>Date Completed</TableCell>
                    <TableCell>Findings</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {audits
                    .filter(audit => audit.status === 'completed')
                    .map((audit) => (
                      <TableRow key={audit.id}>
                        <TableCell>{audit.title}</TableCell>
                        <TableCell>
                          {new Date(audit.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {audit.findings.length} issues found
                        </TableCell>
                        <TableCell>
                          <StatusChip status={audit.status} />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Report">
                            <IconButton size="small" color="primary">
                              <Description fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download Evidence">
                            <IconButton size="small" color="secondary">
                              <Download fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Audit Details Dialog */}
      <Dialog 
        open={openDetails} 
        onClose={() => setOpenDetails(false)} 
        maxWidth="md"
        fullWidth
      >
        {selectedAudit && (
          <>
            <DialogTitle>
              {selectedAudit.title}
              <Chip
                label={selectedAudit.type}
                color={selectedAudit.type === "full" ? "primary" : "secondary"}
                size="small"
                sx={{ ml: 2 }}
              />
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Audit Details
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Dates:
                    </Typography>
                    <Typography>
                      {new Date(selectedAudit.startDate).toLocaleDateString()} - 
                      {new Date(selectedAudit.endDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Auditor:
                    </Typography>
                    <Typography>{selectedAudit.auditor}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Status:
                    </Typography>
                    <StatusChip status={selectedAudit.status} />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Focus Areas:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {selectedAudit.focusAreas.map((area, index) => (
                        <Chip key={index} label={area} size="small" />
                      ))}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Documents & Evidence
                  </Typography>
                  {selectedAudit.documents.length > 0 ? (
                    <List dense>
                      {selectedAudit.documents.map((doc, index) => (
                        <ListItem 
                          key={index}
                          secondaryAction={
                            <IconButton edge="end">
                              <Download />
                            </IconButton>
                          }
                        >
                          <ListItemIcon>
                            <Description />
                          </ListItemIcon>
                          <ListItemText primary={doc.name} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No documents uploaded yet
                    </Typography>
                  )}
                  {!isReadOnly && (
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<CloudUpload />}
                        component="label"
                      >
                        Upload Document
                        <input
                          type="file"
                          hidden
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                        />
                      </Button>
                      {selectedFile && (
                        <>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Selected: {selectedFile.name}
                          </Typography>
                          <Button
                            variant="contained"
                            sx={{ mt: 1 }}
                            onClick={handleFileUpload}
                          >
                            Confirm Upload
                          </Button>
                        </>
                      )}
                    </Box>
                  )}
                </Grid>
              </Grid>

              {selectedAudit.notes && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body1">
                    {selectedAudit.notes}
                  </Typography>
                </>
              )}

              {selectedAudit.findings.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Findings
                  </Typography>
                  <List dense>
                    {selectedAudit.findings.map((finding, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {finding.severity === 'critical' ? (
                            <ErrorIcon color="error" />
                          ) : finding.severity === 'major' ? (
                            <Warning color="warning" />
                          ) : (
                            <Warning color="info" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={finding.description}
                          secondary={`Severity: ${finding.severity} • Status: ${finding.resolved ? 'Resolved' : 'Pending'}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDetails(false)}>Close</Button>
              {!isReadOnly && selectedAudit.status === 'scheduled' && (
                <Button 
                  variant="contained"
                  onClick={() => {
                    onUpdateAudit({
                      ...selectedAudit,
                      status: 'in-progress'
                    });
                    setOpenDetails(false);
                  }}
                >
                  Start Audit
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Create/Edit Audit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentAudit?.id ? "Edit Audit" : "Schedule New Audit"}
        </DialogTitle>
        <DialogContent>
          {currentAudit && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Audit Title"
                name="title"
                value={currentAudit.title}
                onChange={handleInputChange}
                sx={{ mb: 3 }}
              />
              
              <TextField
                select
                fullWidth
                label="Audit Type"
                name="type"
                value={currentAudit.type}
                onChange={handleInputChange}
                sx={{ mb: 3 }}
              >
                <MenuItem value="full">Full Audit</MenuItem>
                <MenuItem value="partial">Partial Audit</MenuItem>
                <MenuItem value="documentation">Documentation Review</MenuItem>
              </TextField>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <DatePicker
                    label="Start Date"
                    value={currentAudit.startDate}
                    onChange={(date) => handleDateChange('startDate', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    label="End Date"
                    value={currentAudit.endDate}
                    onChange={(date) => handleDateChange('endDate', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
              </Grid>
              
              <TextField
                fullWidth
                label="Auditor/Team"
                name="auditor"
                value={currentAudit.auditor}
                onChange={handleInputChange}
                sx={{ mb: 3 }}
              />
              
              <TextField
                select
                fullWidth
                label="Focus Areas"
                name="focusAreas"
                value={currentAudit.focusAreas}
                onChange={(e) => {
                  setCurrentAudit(prev => ({
                    ...prev,
                    focusAreas: e.target.value
                  }));
                }}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )
                }}
                sx={{ mb: 3 }}
              >
                {focusAreaOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={currentAudit.notes}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitAudit}
            variant="contained"
            color="primary"
            disabled={!currentAudit?.title || !currentAudit?.auditor}
          >
            {currentAudit?.id ? "Update" : "Schedule"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuditScheduler;