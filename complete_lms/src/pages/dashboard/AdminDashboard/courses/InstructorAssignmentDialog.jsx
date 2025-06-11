import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, List, ListItem, ListItemText,
  Checkbox, FormControlLabel, Divider, Chip, Box,
  useMediaQuery, useTheme, TextField, InputAdornment,
  CircularProgress, Alert
} from '@mui/material';
import { People, School, Search } from '@mui/icons-material';
import { groupsAPI } from '../../../../config'; // Import API

const InstructorAssignmentDialog = ({
  open,
  onClose,
  modules,
  currentAssignment,
  onAssign,
  isMobile
}) => {
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(
    currentAssignment?.instructorId || null
  );
  const [assignmentType, setAssignmentType] = useState(
    currentAssignment?.assignedModules === 'all' ? 'all' : 'specific'
  );
  const [selectedModules, setSelectedModules] = useState(
    currentAssignment?.assignedModules !== 'all' 
      ? currentAssignment?.assignedModules || [] 
      : []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

useEffect(() => {
  if (open) {
    setLoading(true);
    const tryGroupNames = ['trainers', 'instructors', 'teachers'];

    const fetchMembers = async (index = 0) => {
      if (index >= tryGroupNames.length) {
        setError('No instructor groups found (trainers, instructors, teachers)');
        setLoading(false);
        return;
      }
      try {
        const response = await groupsAPI.getGroupMembersByName(tryGroupNames[index]);
        const instructorList = response.data.map(membership => ({
          id: membership.user.id,
          name: `${membership.user.first_name} ${membership.user.last_name}`,
          email: membership.user.email,
          expertise: membership.user.expertise || []
        }));
        setInstructors(instructorList);
        setFilteredInstructors(instructorList);
        setLoading(false);
      } catch (err) {
        fetchMembers(index + 1); // Try next group name
      }
    };

    fetchMembers();
  }
}, [open]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredInstructors(instructors);
    } else {
      const filtered = instructors.filter(instructor => 
        instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.expertise.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredInstructors(filtered);
    }
  }, [searchTerm, instructors]);

  const handleInstructorSelect = (instructorId) => {
    setSelectedInstructor(instructorId);
  };

  const handleAssignmentTypeChange = (e) => {
    setAssignmentType(e.target.checked ? 'specific' : 'all');
    if (!e.target.checked) {
      setSelectedModules([]);
    }
  };

  const toggleModuleSelection = (moduleId) => {
    setSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = () => {
    if (!selectedInstructor) return;

    const instructor = instructors.find(i => i.id === selectedInstructor);
    const assignedModules = assignmentType === 'all' ? 'all' : selectedModules;
    onAssign(instructor, assignedModules);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      fullScreen={isMobileView}
    >
      <DialogTitle sx={{ 
        fontSize: isMobileView ? '1.25rem' : '1.5rem',
        padding: isMobileView ? 2 : 3
      }}>
        {currentAssignment ? 'Edit Instructor Assignment' : 'Assign Instructor'}
      </DialogTitle>
      
      <DialogContent dividers sx={{ 
        padding: isMobileView ? 2 : 3,
        '& .MuiListItem-root': {
          paddingLeft: isMobileView ? 1 : 2,
          paddingRight: isMobileView ? 1 : 2
        }
      }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Typography variant="subtitle1" sx={{ 
          mb: 2, 
          fontWeight: 600,
          fontSize: isMobileView ? '1rem' : 'inherit'
        }}>
          Select Instructor
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search instructors by name, email or expertise..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          size={isMobileView ? 'small' : 'medium'}
        />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ 
            maxHeight: isMobileView ? '40vh' : 200, 
            overflow: 'auto', 
            mb: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1
          }}>
            {filteredInstructors.length === 0 ? (
              <ListItem sx={{ 
                flexDirection: 'column',
                alignItems: 'center',
                padding: isMobileView ? '16px 12px' : '24px 16px'
              }}>
                <People sx={{ 
                  fontSize: isMobileView ? 32 : 40, 
                  color: 'text.disabled', 
                  mb: 1 
                }} />
                <Typography color="text.secondary" align="center">
                  No instructors found
                </Typography>
              </ListItem>
            ) : (
              filteredInstructors.map((instructor) => (
                <ListItem 
                  key={instructor.id}
                  button={true}
                  selected={selectedInstructor === instructor.id}
                  onClick={() => handleInstructorSelect(instructor.id)}
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: isMobileView ? '8px 12px' : '12px 16px',
                    backgroundColor: selectedInstructor === instructor.id 
                      ? theme.palette.action.selected 
                      : 'inherit',
                    borderLeft: selectedInstructor === instructor.id
                      ? `4px solid ${theme.palette.primary.main}`
                      : '4px solid transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography 
                        fontWeight={selectedInstructor === instructor.id ? 700 : 500}
                        color={selectedInstructor === instructor.id ? 'primary.main' : 'text.primary'}
                      >
                        {instructor.name}
                      </Typography>
                    }
                    secondary={
                      <Typography 
                        variant="body2"
                        color={selectedInstructor === instructor.id ? 'primary.main' : 'text.secondary'}
                      >
                        {instructor.email}
                      </Typography>
                    }
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap',
                    gap: 0.5,
                    width: '100%'
                  }}>
                    {instructor.expertise.map(skill => (
                      <Chip 
                        key={skill} 
                        label={skill} 
                        size="small" 
                        sx={{ 
                          fontSize: '0.7rem',
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          backgroundColor: selectedInstructor === instructor.id
                            ? theme.palette.primary.light
                            : theme.palette.grey[200],
                          color: selectedInstructor === instructor.id
                            ? theme.palette.primary.contrastText
                            : 'inherit'
                        }} 
                      />
                    ))}
                  </Box>
                </ListItem>
              ))
            )}
          </List>
        )}

        {selectedInstructor && (
          <>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ 
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              p: 2,
              borderRadius: 1,
              mb: 2
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Selected Instructor: {instructors.find(i => i.id === selectedInstructor)?.name}
              </Typography>
              <Typography variant="body2">{instructors.find(i => i.id === selectedInstructor)?.email}</Typography>
            </Box>

            <Typography variant="subtitle1" sx={{ 
              mb: 2, 
              fontWeight: 600,
              fontSize: isMobileView ? '1rem' : 'inherit'
            }}>
              Assignment Scope
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {assignmentType === 'all' 
                  ? 'This instructor will be assigned to all modules in the course.'
                  : 'Select specific modules to assign this instructor to.'}
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={assignmentType === 'specific'}
                    onChange={handleAssignmentTypeChange}
                    size={isMobileView ? 'small' : 'medium'}
                    color="primary"
                  />
                }
                label="Assign to specific modules only"
              />
            </Box>

            {assignmentType === 'specific' && (
              <>
                {modules.length === 0 ? (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    py: 3,
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 1
                  }}>
                    <School sx={{ 
                      fontSize: isMobileView ? 32 : 40, 
                      color: 'text.disabled', 
                      mb: 1 
                    }} />
                    <Typography color="text.secondary" align="center">
                      No modules available for assignment
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Create modules first to assign specific ones
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Selected: {selectedModules.length} of {modules.length} modules
                    </Typography>
                    <List sx={{ 
                      maxHeight: isMobileView ? '40vh' : 300, 
                      overflow: 'auto',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1
                    }}>
                      {modules.map((module) => (
                        <ListItem 
                          key={module.id}
                          button={true}
                          onClick={() => toggleModuleSelection(module.id)}
                          sx={{
                            padding: isMobileView ? '8px 12px' : '12px 16px',
                            backgroundColor: selectedModules.includes(module.id)
                              ? theme.palette.action.selected
                              : 'inherit'
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography fontWeight={selectedModules.includes(module.id) ? 600 : 400}>
                                {module.title || 'Untitled Module'}
                              </Typography>
                            }
                            primaryTypographyProps={{ 
                              fontSize: isMobileView ? '0.9rem' : 'inherit'
                            }}
                            secondary={module.description || 'No description'}
                            secondaryTypographyProps={{ 
                              fontSize: isMobileView ? '0.8rem' : 'inherit'
                            }}
                            sx={{ mr: 1 }}
                          />
                          <Checkbox
                            edge="end"
                            checked={selectedModules.includes(module.id)}
                            size={isMobileView ? 'small' : 'medium'}
                            color="primary"
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{
        padding: isMobileView ? 2 : 3,
        flexDirection: isMobileView ? 'column-reverse' : 'row',
        gap: isMobileView ? 1 : 0
      }}>
        <Button 
          onClick={onClose} 
          fullWidth={isMobileView}
          size={isMobileView ? 'medium' : 'large'}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!selectedInstructor || (assignmentType === 'specific' && selectedModules.length === 0)}
          variant="contained"
          fullWidth={isMobileView}
          size={isMobileView ? 'medium' : 'large'}
          color="primary"
        >
          {currentAssignment ? 'Update Assignment' : 'Assign Instructor'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InstructorAssignmentDialog;