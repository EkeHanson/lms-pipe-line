import React, { useState } from 'react';
import {
  Box, Typography, Tabs, Tab, Card, CardContent, CardHeader, Divider,
  Grid, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Avatar, Chip, TextField, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
  MenuItem, FormControl, InputLabel, Select, IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Search as SearchIcon, FilterList as FilterIcon, Add as AddIcon,
  Assignment as ReportsIcon, Person as TrainerIcon,
  Assessment as AssessmentIcon, Feedback as FeedbackIcon,
  Timeline as TimelineIcon, Assignment as AssignmentIcon, Close as CloseIcon
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TrainerMonitoring from './TrainerMonitoring';
import AssessmentSampling from './AssessmentSampling';
import LMSDataAnalysis from './LMSDataAnalysis';
import FeedbackManagement from './FeedbackManagement';
import FeedbackDialog from './FeedbackDialog';
import IQAReports from './IQAReports';

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`iqa-tabpanel-${index}`}
      aria-labelledby={`iqa-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function IQAManagement() {
  // State for tabs and search
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // State for dialogs
  const [openDialog, setOpenDialog] = useState(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  // State for notifications
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  // State for form data
  const [sampleData, setSampleData] = useState({
    course: '',
    trainer: '',
    date: null
  });

  const [observationData, setObservationData] = useState({
    trainer: '',
    date: null,
    type: 'Virtual'
  });

  const [newCheckData, setNewCheckData] = useState({
    checkType: '',
    trainer: '',
    course: '',
    date: null,
    priority: 'Medium'
  });

  // Dummy data
  const trainers = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Sarah Johnson' },
    { id: '3', name: 'Michael Brown' },
    { id: '4', name: 'Emily Davis' }
  ];

  const courses = [
    { id: '1', name: 'Advanced React' },
    { id: '2', name: 'Node.js Fundamentals' },
    { id: '3', name: 'Database Design' },
    { id: '4', name: 'UI/UX Principles' }
  ];

  const recentActivities = [
    { id: 1, trainer: 'John Smith', action: 'Session Observed', date: '2023-06-15', status: 'Completed' },
    { id: 2, trainer: 'Sarah Johnson', action: 'Assessment Sampled', date: '2023-06-14', status: 'Pending Review' },
    { id: 3, trainer: 'Michael Brown', action: 'Feedback Provided', date: '2023-06-12', status: 'Completed' },
    { id: 4, trainer: 'Emily Davis', action: 'Session Scheduled', date: '2023-06-10', status: 'Upcoming' },
  ];

  // Handler functions
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (action) => {
    setOpenDialog(action);
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  const handleSampleSubmit = () => {
    setSnackbar({
      open: true,
      message: `Assessment sampling scheduled for ${sampleData.course} with ${sampleData.trainer}`,
      severity: 'success'
    });
    setSampleData({ course: '', trainer: '', date: null });
    handleCloseDialog();
  };

  const handleObservationSubmit = () => {
    setSnackbar({
      open: true,
      message: `Observation scheduled for ${observationData.trainer} (${observationData.type})`,
      severity: 'success'
    });
    setObservationData({ trainer: '', date: null, type: 'Virtual' });
    handleCloseDialog();
  };

  const handleNewCheckSubmit = () => {
    setSnackbar({
      open: true,
      message: `New ${newCheckData.checkType} check scheduled for ${newCheckData.course}`,
      severity: 'success'
    });
    setNewCheckData({
      checkType: '',
      trainer: '',
      course: '',
      date: null,
      priority: 'Medium'
    });
    handleCloseDialog();
  };

  const generateReport = () => {
    setSnackbar({
      open: true,
      message: 'IQA Report generated and downloaded',
      severity: 'success'
    });
    
    // Simulate report download
    const blob = new Blob(["Sample IQA Report Content"], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'IQA-Report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const giveFeedback = () => {
    setFeedbackDialogOpen(true);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader 
                title="Internal Quality Assurance"
                subheader="Monitor and improve training quality"
                action={
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    size="small"
                    onClick={() => handleOpenDialog('newCheck')}
                  >
                    New IQA Check
                  </Button>
                }
              />
              <Divider />
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                <TextField
                  size="small"
                  placeholder="Search IQA records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button startIcon={<FilterIcon />}>Filters</Button>
              </Box>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Trainer Monitoring" icon={<TrainerIcon fontSize="small" />} />
                <Tab label="Assessment Sampling" icon={<AssessmentIcon fontSize="small" />} />
                <Tab label="LMS Data" icon={<TimelineIcon fontSize="small" />} />
                <Tab label="Feedback" icon={<FeedbackIcon fontSize="small" />} />
                <Tab label="Reports" icon={<ReportsIcon fontSize="small" />} />
              </Tabs>
              <Divider />
              <TabPanel value={tabValue} index={0}>
                <TrainerMonitoring />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <AssessmentSampling />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <LMSDataAnalysis />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <FeedbackManagement />
              </TabPanel>
              <TabPanel value={tabValue} index={4}>
                <IQAReports searchQuery={searchQuery} />
              </TabPanel>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Recent IQA Activities" />
              <Divider />
              <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Trainer</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                              {activity.trainer.charAt(0)}
                            </Avatar>
                            {activity.trainer}
                          </Box>
                        </TableCell>
                        <TableCell>{activity.action}</TableCell>
                        <TableCell>{activity.date}</TableCell>
                        <TableCell>
                          <Chip 
                            label={activity.status}
                            size="small"
                            color={
                              activity.status === 'Completed' ? 'success' :
                              activity.status === 'Pending Review' ? 'warning' : 'info'
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
            
            <Card sx={{ mt: 3 }}>
              <CardHeader title="Quick Actions" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      startIcon={<AssignmentIcon />}
                      onClick={() => handleOpenDialog('sample')}
                    >
                      Sample Assessments
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      startIcon={<FeedbackIcon />}
                      onClick={giveFeedback}
                    >
                      Give Feedback
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      startIcon={<TimelineIcon />}
                      onClick={generateReport}
                    >
                      Generate Report
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      startIcon={<TrainerIcon />}
                      onClick={() => handleOpenDialog('observation')}
                    >
                      Schedule Observation
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Sample Assessments Dialog */}
        <Dialog open={openDialog === 'sample'} onClose={handleCloseDialog}>
          <DialogTitle>
            Schedule Assessment Sampling
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
              <InputLabel>Select Course</InputLabel>
              <Select
                value={sampleData.course}
                onChange={(e) => setSampleData({...sampleData, course: e.target.value})}
                label="Select Course"
              >
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.name}>{course.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Trainer</InputLabel>
              <Select
                value={sampleData.trainer}
                onChange={(e) => setSampleData({...sampleData, trainer: e.target.value})}
                label="Select Trainer"
              >
                {trainers.map((trainer) => (
                  <MenuItem key={trainer.id} value={trainer.name}>{trainer.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <DatePicker
              label="Sampling Date"
              value={sampleData.date}
              onChange={(newValue) => setSampleData({...sampleData, date: newValue})}
              renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleSampleSubmit}
              disabled={!sampleData.course || !sampleData.trainer || !sampleData.date}
            >
              Schedule
            </Button>
          </DialogActions>
        </Dialog>

        {/* Schedule Observation Dialog */}
        <Dialog open={openDialog === 'observation'} onClose={handleCloseDialog}>
          <DialogTitle>
            Schedule Trainer Observation
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
              <InputLabel>Select Trainer</InputLabel>
              <Select
                value={observationData.trainer}
                onChange={(e) => setObservationData({...observationData, trainer: e.target.value})}
                label="Select Trainer"
              >
                {trainers.map((trainer) => (
                  <MenuItem key={trainer.id} value={trainer.name}>{trainer.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Observation Type</InputLabel>
              <Select
                value={observationData.type}
                onChange={(e) => setObservationData({...observationData, type: e.target.value})}
                label="Observation Type"
              >
                <MenuItem value="Virtual">Virtual</MenuItem>
                <MenuItem value="In-Person">In-Person</MenuItem>
              </Select>
            </FormControl>
            <DatePicker
              label="Observation Date"
              value={observationData.date}
              onChange={(newValue) => setObservationData({...observationData, date: newValue})}
              renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleObservationSubmit}
              disabled={!observationData.trainer || !observationData.date}
            >
              Schedule
            </Button>
          </DialogActions>
        </Dialog>

        {/* New IQA Check Dialog */}
        <Dialog open={openDialog === 'newCheck'} onClose={handleCloseDialog}>
          <DialogTitle>
            Schedule New IQA Check
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
              <InputLabel>Check Type</InputLabel>
              <Select
                value={newCheckData.checkType}
                onChange={(e) => setNewCheckData({...newCheckData, checkType: e.target.value})}
                label="Check Type"
              >
                <MenuItem value="Assessment">Assessment Review</MenuItem>
                <MenuItem value="Observation">Training Observation</MenuItem>
                <MenuItem value="Documentation">Documentation Check</MenuItem>
                <MenuItem value="Compliance">Compliance Audit</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Course</InputLabel>
              <Select
                value={newCheckData.course}
                onChange={(e) => setNewCheckData({...newCheckData, course: e.target.value})}
                label="Select Course"
              >
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.name}>{course.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Trainer</InputLabel>
              <Select
                value={newCheckData.trainer}
                onChange={(e) => setNewCheckData({...newCheckData, trainer: e.target.value})}
                label="Select Trainer"
              >
                {trainers.map((trainer) => (
                  <MenuItem key={trainer.id} value={trainer.name}>{trainer.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <DatePicker
              label="Check Date"
              value={newCheckData.date}
              onChange={(newValue) => setNewCheckData({...newCheckData, date: newValue})}
              renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newCheckData.priority}
                onChange={(e) => setNewCheckData({...newCheckData, priority: e.target.value})}
                label="Priority"
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleNewCheckSubmit}
              disabled={!newCheckData.checkType || !newCheckData.course || !newCheckData.date}
            >
              Schedule Check
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({...snackbar, open: false})}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbar({...snackbar, open: false})} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <FeedbackDialog 
          open={feedbackDialogOpen}
          onClose={() => setFeedbackDialogOpen(false)}
          trainers={trainers}
          courses={courses}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default IQAManagement;