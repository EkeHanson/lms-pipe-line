import React, { useState, useEffect } from 'react';
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
  Checkbox,
  Button,
  Chip,
  TextField,
  Grid,
  IconButton,ListItemText,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const complianceRequirements = [
  { id: 1, name: 'Trainer Qualifications', standard: 'Section 4.2', frequency: 'Annual', status: 'compliant' },
  { id: 2, name: 'Assessment Validity', standard: 'Section 5.1', frequency: 'Quarterly', status: 'non-compliant' },
  { id: 3, name: 'Learner Feedback', standard: 'Section 3.4', frequency: 'Monthly', status: 'pending' },
  { id: 4, name: 'IQA Sampling', standard: 'Section 6.3', frequency: 'Quarterly', status: 'compliant' },
  { id: 5, name: 'EQA Response Time', standard: 'Section 7.1', frequency: 'Annual', status: 'compliant' },
  { id: 6, name: 'Document Retention', standard: 'Section 2.5', frequency: 'Monthly', status: 'non-compliant' },
];

const statusColors = {
  compliant: 'success',
  'non-compliant': 'error',
  pending: 'warning'
};

const statusIcons = {
  compliant: <CheckCircleIcon fontSize="small" />,
  'non-compliant': <ErrorIcon fontSize="small" />,
  pending: <WarningIcon fontSize="small" />
};

function ComplianceChecks() {
  const theme = useTheme();
  const [checks, setChecks] = useState(complianceRequirements);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let filtered = complianceRequirements;
    
    if (searchTerm) {
      filtered = filtered.filter(check => 
        check.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        check.standard.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filter !== 'all') {
      filtered = filtered.filter(check => check.status === filter);
    }
    
    setChecks(filtered);
  }, [searchTerm, filter]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(checks.map(check => check.id));
      return;
    }
    setSelected([]);
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleRefresh = () => {
    // In a real app, this would fetch fresh data
    setChecks(complianceRequirements);
    setSelected([]);
  };

  const handleExport = () => {
    // Export logic would go here
    console.log('Exporting selected:', selected);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        EQA Compliance Checks
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search compliance checks..."
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant={filter === 'all' ? 'contained' : 'outlined'}
            onClick={() => setFilter('all')}
            size="small"
          >
            All
          </Button>
          <Button
            variant={filter === 'compliant' ? 'contained' : 'outlined'}
            onClick={() => setFilter('compliant')}
            size="small"
            color="success"
          >
            Compliant
          </Button>
          <Button
            variant={filter === 'non-compliant' ? 'contained' : 'outlined'}
            onClick={() => setFilter('non-compliant')}
            size="small"
            color="error"
          >
            Non-Compliant
          </Button>
          <Button
            variant={filter === 'pending' ? 'contained' : 'outlined'}
            onClick={() => setFilter('pending')}
            size="small"
            color="warning"
          >
            Pending
          </Button>
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      <Paper elevation={2} sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < checks.length}
                    checked={checks.length > 0 && selected.length === checks.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Compliance Requirement</TableCell>
                <TableCell>Standard Reference</TableCell>
                <TableCell>Frequency</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {checks.map((check) => (
                <TableRow
                  key={check.id}
                  hover
                  selected={selected.indexOf(check.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.indexOf(check.id) !== -1}
                      onChange={() => handleSelect(check.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500}>{check.name}</Typography>
                  </TableCell>
                  <TableCell>{check.standard}</TableCell>
                  <TableCell>{check.frequency}</TableCell>
                  <TableCell>
                    <Chip
                      icon={statusIcons[check.status]}
                      label={check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                      color={statusColors[check.status]}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="text">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {selected.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            {selected.length} selected
          </Typography>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Export Selected
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default ComplianceChecks;