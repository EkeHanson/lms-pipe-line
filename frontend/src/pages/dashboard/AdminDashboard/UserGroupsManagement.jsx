import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, Button, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, Avatar, IconButton, Divider, useTheme, CircularProgress, Alert,
  Snackbar, FormControl, InputLabel, Select, Badge, Tooltip, Grid, 
  FormControlLabel, Checkbox, TablePagination
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  People as PeopleIcon, Search as SearchIcon, Close as CloseIcon,
  Check as CheckIcon, Group as GroupIcon, AdminPanelSettings as AdminIcon,
  School as InstructorIcon, Person as LearnerIcon, Security as SuperAdminIcon
} from '@mui/icons-material';
import { groupsAPI, rolesAPI, userAPI } from '../../../config';

const PERMISSION_OPTIONS = [
  { value: 'create_content', label: 'Create Content' },
  { value: 'edit_content', label: 'Edit Content' },
  { value: 'delete_content', label: 'Delete Content' },
  { value: 'view_content', label: 'View Content' },
  { value: 'grade_assignments', label: 'Grade Assignments' },
  { value: 'manage_courses', label: 'Manage Courses' },
  { value: 'manage_users', label: 'Manage Users' },
  { value: 'view_reports', label: 'View Reports' },
];

const UserGroupsManagement = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [groups, setGroups] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({
    main: true,
    dialog: false,
    action: false,
    users: false
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Pagination state
  const [userPagination, setUserPagination] = useState({
    count: 0,
    currentPage: 1,
    pageSize: 10
  });
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Group state
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const [currentGroup, setCurrentGroup] = useState({
    id: null,
    name: '',
    description: '',
    role: null,
    is_active: true,
    members: []
  });
  
  // Role state
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [currentRole, setCurrentRole] = useState({
    id: null,
    name: '',
    code: '',
    description: '',
    permissions: [],
    is_default: false
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch users with pagination and search
  const fetchUsers = async (search = '') => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const params = {
        page: userPagination.currentPage,
        page_size: userPagination.pageSize,
        ...(search && { search })
      };

      const response = await userAPI.getUsers(params);
      setUsers(response.data?.results || []);
      setUserPagination(prev => ({
        ...prev,
        count: response.data?.count || 0
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(prev => ({ ...prev, main: true }));
        const [groupsResponse, rolesResponse] = await Promise.all([
          groupsAPI.getGroups(),
          rolesAPI.getRoles()
        ]);

        setGroups(groupsResponse.data?.results || []);


        setRoles(rolesResponse.data?.results || []);
        await fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
      } finally {
        setLoading(prev => ({ ...prev, main: false }));
      }
    };

    fetchData();
  }, []);

  // Re-fetch users when pagination or search changes
  useEffect(() => {
    fetchUsers(searchTerm);
  }, [searchTerm, userPagination.currentPage, userPagination.pageSize]);

  // Group handlers
  const handleOpenGroupDialog = (group = null) => {
    if (group) {
      const groupRole = roles.find(r => r.id === (group.role?.id || group.role));
      setCurrentGroup({
        id: group.id,
        name: group.name || '',
        description: group.description || '',
        role: groupRole || null,
        is_active: group.is_active !== undefined ? group.is_active : true,
        members: Array.isArray(group.memberships)
          ? group.memberships.map(m => m.user?.id).filter(Boolean)
          : []
      });
    } else {
      setCurrentGroup({
        id: null,
        name: '',
        description: '',
        role: null,
        is_active: true,
        members: []
      });
    }
    setOpenGroupDialog(true);
  };
  const handleSaveGroup = async () => {
    try {
      setLoading(prev => ({ ...prev, action: true }));
      
      if (!currentGroup.name) throw new Error('Group name is required');
      if (!currentGroup.role?.id && !currentGroup.role) throw new Error('Please select a role');
  
      const groupData = {
        name: currentGroup.name,
        description: currentGroup.description,
        role_id: currentGroup.role?.id,
        is_active: currentGroup.is_active
      };  
      let response;
      if (currentGroup.id) {

        // Update group
        response = await groupsAPI.updateGroup(currentGroup.id, groupData);


        
        // Update members
        const memberIds = Array.isArray(currentGroup.members) ? currentGroup.members.map(id => Number(id)) : [];
        await groupsAPI.updateGroupMembers(response.data.id, { members: memberIds });
        
        const updatedGroup = await groupsAPI.getGroup(response.data.id);
        setGroups(groups.map(g => 
          g.id === currentGroup.id ? updatedGroup.data : g
        ));
      } else {
        // Create group
        // console.log("groupData")
        // console.log(groupData)
        // console.log("groupData")
        response = await groupsAPI.createGroup(groupData);
        
        if (currentGroup.members?.length > 0) {
          const memberIds = Array.isArray(currentGroup.members) ? currentGroup.members.map(id => Number(id)) : [];
          await groupsAPI.updateGroupMembers(response.data.id, { members: memberIds });
        }
        
        alert("Done")



        const newGroup = await groupsAPI.getGroup(response.data.id);
        setGroups([...groups, newGroup.data]);
      }
  
      setSuccessMessage(currentGroup.id ? 'Group updated successfully' : 'Group created successfully');
      setOpenGroupDialog(false);
    } catch (err) {
      console.error("Error saving group:", err);
      setError(err.response?.data?.error || err.message || 'Failed to save group');
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };


  const handleDeleteGroup = async (id) => {
    try {
      setLoading(prev => ({ ...prev, action: true }));
      await groupsAPI.deleteGroup(id);
      setGroups(groups.filter(g => g.id !== id));
      setSuccessMessage('Group deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete group');
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };
  
  // Role handlers
  const handleOpenRoleDialog = (role = null) => {
    if (role) {
      setCurrentRole({
        id: role.id,
        name: role.name || '',
        code: role.code || '',
        description: role.description || '',
        permissions: Array.isArray(role.permissions) ? role.permissions : [],
        is_default: role.is_default || false
      });
    } else {
      setCurrentRole({
        id: null,
        name: '',
        code: '',
        description: '',
        permissions: [],
        is_default: false
      });
    }
    setOpenRoleDialog(true);
  };
  
  const handleSaveRole = async () => {
    try {
      setLoading(prev => ({ ...prev, action: true }));
      
      const roleData = {
        name: currentRole.name,
        code: currentRole.code,
        description: currentRole.description,
        permissions: Array.isArray(currentRole.permissions) ? currentRole.permissions : [],
        is_default: currentRole.is_default
      };
      
      let response;
      if (currentRole.id) {
        response = await rolesAPI.updateRole(currentRole.id, roleData);
        setRoles(roles.map(r => r.id === currentRole.id ? response.data : r));
        setSuccessMessage('Role updated successfully');
      } else {
        response = await rolesAPI.createRole(roleData);
        setRoles([...roles, response.data]);
        setSuccessMessage('Role created successfully');
      }
      setOpenRoleDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save role');
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };
  
  const handleDeleteRole = async (id) => {
    try {
      setLoading(prev => ({ ...prev, action: true }));
      await rolesAPI.deleteRole(id);
      setRoles(roles.filter(r => r.id !== id));
      setSuccessMessage('Role deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete role');
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };
  
  const toggleMember = (userId) => {
    setCurrentGroup(prev => {
      const members = Array.isArray(prev.members) ? [...prev.members] : [];
      const isMember = members.includes(userId);
      
      return {
        ...prev,
        members: isMember 
          ? members.filter(id => id !== userId)
          : [...members, userId]
      };
    });
  };

  const getRoleIcon = (roleCode) => {
    switch (roleCode) {
      case 'superadmin': return <SuperAdminIcon />;
      case 'admin': return <AdminIcon />;
      case 'instructor': return <InstructorIcon />;
      case 'learner': return <LearnerIcon />;
      default: return <PeopleIcon />;
    }
  };

  const filteredGroups = groups.filter(group => {
    const name = group.name || '';
    const description = group.description || '';
    const roleName = group.role?.name || '';
    
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roleName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredRoles = roles.filter(role => {
    return (
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

const getUserById = (idOrUser) => {
  if (typeof idOrUser === 'object' && idOrUser !== null) {
    return idOrUser; // Already a user object
  }
  return users.find(user => user?.id === idOrUser);
};

  if (loading.main && groups.length === 0 && roles.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Notifications */}
      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage(null)}>
        <Alert onClose={() => setSuccessMessage(null)} severity="success">{successMessage}</Alert>
      </Snackbar>
      {/* <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error">{error}</Alert>
      </Snackbar> */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert 
          onClose={() => setError(null)} 
          severity="error"
          sx={{ whiteSpace: 'pre-line' }}  // Preserve newlines in error messages
        >
          {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
        </Alert>
      </Snackbar>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Roles & Groups Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => tabValue === 0 ? handleOpenRoleDialog() : handleOpenGroupDialog()}
          disabled={loading.main}
        >
          New {tabValue === 0 ? 'Role' : 'Group'}
        </Button>
      </Box>
      
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Roles" />
        <Tab label="Groups" />
      </Tabs>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder={`Search ${tabValue === 0 ? 'roles' : 'groups'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
          }}
        />
      </Paper>
      
      {tabValue === 0 ? (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableRow>
                <TableCell>Role Name</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Default</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRoles.length > 0 ? (
                filteredRoles.map((role) => (
                  <TableRow key={role.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getRoleIcon(role.code)}
                        <Typography fontWeight="500">{role.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={role.code} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {role.description || 'No description'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {role.is_default ? (
                        <Chip label="Default" color="success" size="small" />
                      ) : (
                        <Chip label="No" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {role.permissions?.slice(0, 3).map((perm, i) => (
                          <Chip key={i} label={perm} size="small" variant="outlined" />
                        ))}
                        {role.permissions?.length > 3 && (
                          <Chip label={`+${role.permissions.length - 3}`} size="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenRoleDialog(role)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDeleteRole(role.id)}
                        sx={{ ml: 1 }}
                        disabled={role.is_default}
                      >
                        <DeleteIcon color={role.is_default ? "disabled" : "error"} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      {roles.length === 0 ? 'No roles available' : 'No roles found matching your search'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableRow>
                <TableCell>Group Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Members</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <TableRow key={group.id} hover>
                    <TableCell>
                      <Typography fontWeight="500">{group.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {group.description || 'No description'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {group.role && getRoleIcon(group.role.code)}
                        <span>{group.role?.name || 'No role assigned'}</span>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={group.is_active ? 'Active' : 'Inactive'} 
                        size="small" 
                        color={group.is_active ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </TableCell>

                    {/* <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {group.members?.slice(0, 3).map(member => {
                          const user = getUserById(member.user || member); // Handle both formats
                          return user ? (
                            <Tooltip key={user.id} title={`${user.first_name} ${user.last_name}`}>
                              <Avatar src={user.profile_picture}>
                                {user.first_name?.charAt(0)}
                              </Avatar>
                            </Tooltip>
                          ) : null;
                        })}
                        {group.members?.length > 3 && (
                          <Badge badgeContent={`+${group.members.length - 3}`} color="primary">
                            <Avatar><GroupIcon /></Avatar>
                          </Badge>
                        )}
                      </Box>
                    </TableCell> */}

                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {group.memberships?.slice(0, 3).map(membership => {
                          const user = getUserById(membership.user); // Extract user from membership
                          return user ? (
                            <Tooltip key={user.id} title={`${user.first_name} ${user.last_name}`}>
                              <Avatar src={user.profile_picture}>
                                {user.first_name?.charAt(0)}
                              </Avatar>
                            </Tooltip>
                          ) : null;
                        })}
                        {group.memberships?.length > 3 && (
                          <Badge badgeContent={`+${group.memberships.length - 3}`} color="primary">
                            <Avatar><GroupIcon /></Avatar>
                          </Badge>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenGroupDialog(group)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDeleteGroup(group.id)}
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      {groups.length === 0 ? 'No groups available' : 'No groups found matching your search'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Role Dialog */}
      <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          {currentRole.id ? 'Edit Role' : 'Create New Role'}
          <IconButton
            aria-label="close"
            onClick={() => setOpenRoleDialog(false)}
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
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Role Name"
                value={currentRole.name}
                onChange={(e) => setCurrentRole({ ...currentRole, name: e.target.value })}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Code"
                value={currentRole.code}
                onChange={(e) => setCurrentRole({ ...currentRole, code: e.target.value })}
                margin="normal"
                required
                helperText="Short identifier (e.g., admin, instructor)"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={currentRole.description}
                onChange={(e) => setCurrentRole({ ...currentRole, description: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={currentRole.is_default}
                    onChange={(e) => setCurrentRole({ ...currentRole, is_default: e.target.checked })}
                  />
                }
                label="Set as default role for new users"
              />
            </Grid>
            
            {/* Permissions Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Permissions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Paper elevation={0} sx={{ 
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                p: 2,
              }}>
                <Grid container spacing={2}>
                  {PERMISSION_OPTIONS.map((permission) => (
                    <Grid item xs={12} sm={6} key={permission.value}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={currentRole.permissions?.includes(permission.value) || false}
                            onChange={(e) => {
                              const newPermissions = e.target.checked
                                ? [...(currentRole.permissions || []), permission.value]
                                : (currentRole.permissions || []).filter(p => p !== permission.value);
                              setCurrentRole({ ...currentRole, permissions: newPermissions });
                            }}
                          />
                        }
                        label={permission.label}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenRoleDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveRole} 
            variant="contained"
            disabled={!currentRole.name || !currentRole.code || loading.action}
            startIcon={loading.action ? <CircularProgress size={20} /> : null}
          >
            {currentRole.id ? 'Update Role' : 'Create Role'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Group Dialog */}
      <Dialog open={openGroupDialog} onClose={() => setOpenGroupDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>
          {currentGroup.id ? 'Edit Group' : 'Create New Group'}
          <IconButton
            aria-label="close"
            onClick={() => setOpenGroupDialog(false)}
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
        <DialogContent dividers>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Group Name"
              value={currentGroup.name}
              onChange={(e) => setCurrentGroup({ ...currentGroup, name: e.target.value })}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={currentGroup.is_active}
                onChange={(e) => setCurrentGroup({ ...currentGroup, is_active: e.target.value })}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={currentGroup.description}
            onChange={(e) => setCurrentGroup({ ...currentGroup, description: e.target.value })}
            margin="normal"
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              value={currentGroup.role?.id || ''}
              onChange={(e) => {
                const selectedRole = roles.find((r) => r.id === e.target.value);
                setCurrentGroup({ ...currentGroup, role: selectedRole });
              }}
              renderValue={(selected) => {
                const role = roles.find(r => r.id === selected);
                return role ? `${role.name} (${role.code})` : 'Select a role';
              }}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getRoleIcon(role.code)}
                    <span>
                      {role.name} ({role.code})
                    </span>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            Group Members ({currentGroup.members?.length || 0})
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search users by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
            sx={{ mb: 2 }}
          />

          {loading.users ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : users.length > 0 ? (
            <>
              <Paper
                elevation={0}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  p: 2,
                  maxHeight: 300,
                  overflow: 'auto',
                }}
              >
                {users.map((user) => (
                  <Box
                    key={user.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: currentGroup.members?.includes(user.id)
                        ? theme.palette.action.selected
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                        cursor: 'pointer',
                      },
                    }}
                    onClick={() => toggleMember(user.id)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={user.profile_picture}>
                        {user.first_name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography>
                          {user.first_name} {user.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                    {currentGroup.members?.includes(user.id) ? (
                      <CheckIcon color="primary" />
                    ) : (
                      <Box sx={{ width: 24 }} />
                    )}
                  </Box>
                ))}
              </Paper>
              <TablePagination
                component="div"
                count={userPagination.count}
                page={userPagination.currentPage - 1}
                onPageChange={(e, newPage) => {
                  setUserPagination(prev => ({ ...prev, currentPage: newPage + 1 }));
                }}
                rowsPerPage={userPagination.pageSize}
                onRowsPerPageChange={(e) => {
                  setUserPagination(prev => ({
                    ...prev,
                    pageSize: parseInt(e.target.value, 10),
                    currentPage: 1
                  }));
                }}
                rowsPerPageOptions={[10, 25, 50]}
              />
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
              No users found
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenGroupDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSaveGroup}
            variant="contained"
            disabled={!currentGroup.name || !currentGroup.role || loading.action}
            startIcon={loading.action ? <CircularProgress size={20} /> : null}
          >
            {currentGroup.id ? 'Update Group' : 'Create Group'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserGroupsManagement;