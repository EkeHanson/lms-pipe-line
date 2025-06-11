
import React, { useState } from 'react';
import {
  Paper, Typography, Box, Button, Grid, Card, CardContent, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, Table, TableHead, TableRow, TableCell, TableBody,
  Snackbar, Alert, Tabs, Tab, TextField, Select, MenuItem
} from '@mui/material';
import { Add, CalendarToday, VideoLibrary, Event, Edit } from '@mui/icons-material';
import { format } from 'date-fns';
import dummyData from './dummyData';

const InstructorSchedule = ({ schedules = dummyData.schedules, attendance = dummyData.attendance }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    duration: '',
    platform: '',
    link: '',
    location: '',
    description: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleAddEvent = () => {
    console.log('Adding event:', newEvent);
    setOpenAddDialog(false);
    setNewEvent({ title: '', date: '', duration: '', platform: '', link: '', location: '', description: '' });
    setSnackbar({ open: true, message: 'Event added successfully', severity: 'success' });
  };

  const upcomingEvents = schedules.filter(event => new Date(event.date) > new Date());
  const pastEvents = schedules.filter(event => new Date(event.date) <= new Date());

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Schedule</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenAddDialog(true)}>
          Add Event
        </Button>
      </Box>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab value="upcoming" label={`Upcoming (${upcomingEvents.length})`} />
        <Tab value="past" label={`Past (${pastEvents.length})`} />
        <Tab value="attendance" label="Attendance" />
      </Tabs>

      {activeTab === 'attendance' ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Students Present</TableCell>
              <TableCell>Attendance Rate</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendance.map(record => (
              <TableRow key={record.id}>
                <TableCell>{record.course}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.studentsPresent.join(', ')}</TableCell>
                <TableCell>{((record.studentsPresent.length / record.totalStudents) * 100).toFixed(1)}%</TableCell>
                <TableCell>
                  <Button size="small" startIcon={<Edit />}>Edit Attendance</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Grid container spacing={2}>
          {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).map(event => (
            <Grid item xs={12} sm={6} key={event.id}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" gutterBottom>{event.title}</Typography>
                    <Chip
                      label={activeTab === 'upcoming' ? 'Upcoming' : 'Completed'}
                      color={activeTab === 'upcoming' ? 'primary' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CalendarToday fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {format(new Date(event.date), 'MMMM dd, yyyy')} • {event.time}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {event.description}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip
                      label={event.platform}
                      icon={event.platform === 'Zoom' ? <VideoLibrary fontSize="small" /> : <Event fontSize="small" />}
                      size="small"
                    />
                    <Button size="small" onClick={() => handleViewEvent(event)}>Details</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedEvent && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>{selectedEvent.title}</DialogTitle>
          <DialogContent>
            <Box mb={2}>
              <Typography variant="subtitle2">Date & Time</Typography>
              <Typography>{format(new Date(selectedEvent.date), 'EEEE, MMMM dd, yyyy')}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle2">Duration</Typography>
              <Typography>{selectedEvent.duration} minutes</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle2">Location/Platform</Typography>
              <Typography>
                {selectedEvent.platform === 'Campus' ?
                  selectedEvent.location :
                  <a href={selectedEvent.link} target="_blank" rel="noopener noreferrer">
                    {selectedEvent.platform} Link
                  </a>
                }
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle2">Description</Typography>
              <Typography>{selectedEvent.description}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle2">Bookings</Typography>
              {selectedEvent.bookings.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Time Slot</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedEvent.bookings.map((booking, index) => (
                      <TableRow key={index}>
                        <TableCell>{booking.student}</TableCell>
                        <TableCell>{booking.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography>No bookings</Typography>
              )}
            </Box>
            {selectedEvent.platform === 'Zoom' && (
              <Button
                variant="contained"
                fullWidth
                startIcon={<VideoLibrary />}
                href={selectedEvent.link}
                target="_blank"
              >
                Join Zoom Meeting
              </Button>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
            <Button variant="contained" startIcon={<Edit />}>Edit</Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            label="Duration (minutes)"
            type="number"
            value={newEvent.duration}
            onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
            margin="normal"
            required
          />
          <Select
            fullWidth
            value={newEvent.platform}
            onChange={(e) => setNewEvent({ ...newEvent, platform: e.target.value })}
            displayEmpty
            margin="normal"
            sx={{ mt: 2 }}
          >
            <MenuItem value="" disabled>Select Platform</MenuItem>
            <MenuItem value="Zoom">Zoom</MenuItem>
            <MenuItem value="Campus">Campus</MenuItem>
          </Select>
          {newEvent.platform === 'Zoom' && (
            <TextField
              fullWidth
              label="Zoom Link"
              value={newEvent.link}
              onChange={(e) => setNewEvent({ ...newEvent, link: e.target.value })}
              margin="normal"
            />
          )}
          {newEvent.platform === 'Campus' && (
            <TextField
              fullWidth
              label="Location"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              margin="normal"
            />
          )}
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddEvent}
            disabled={!newEvent.title || !newEvent.date || !newEvent.duration || !newEvent.platform}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default InstructorSchedule;
