import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Divider, List, ListItem, ListItemText,
  ListItemIcon, Button, IconButton, Tooltip, TextField, Chip,
  useTheme, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  Description as ReportIcon, PictureAsPdf as PdfIcon,
  InsertDriveFile as DocIcon, CloudDownload as DownloadIcon,
  Search as SearchIcon, FilterList as FilterIcon,
  Warning as WarningIcon, CheckCircle as CheckIcon
} from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import StandardsRegistry from './StandardsRegistry'; // New import

const ComplianceReports = () => {
  const theme = useTheme();
  const [openStandards, setOpenStandards] = useState(false);
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('all');

  // Mock API call
  useEffect(() => {
    // Simulate fetching reports with compliance status
    const mockReports = [
      { 
        id: 1, 
        name: 'Annual IQA Summary 2023', 
        type: 'PDF', 
        date: '2023-12-15', 
        size: '2.4 MB',
        standard: 'ISO 9001:2015',
        status: 'compliant',
        expiry: '2024-12-31'
      },
      { 
        id: 2, 
        name: 'EQA Audit - Q3 2023', 
        type: 'PDF', 
        date: '2023-09-20', 
        size: '3.1 MB',
        standard: 'Ofqual Condition B2',
        status: 'non-compliant',
        issues: 3
      },
      // ... other reports
    ];
    setReports(mockReports);
  }, []);

  const columns = [
    { field: 'name', headerName: 'Report Name', flex: 1 },
    { 
      field: 'standard', 
      headerName: 'Standard', 
      width: 180,
      renderCell: (params) => (
        <Button 
          size="small" 
          onClick={() => setOpenStandards(true)}
          sx={{ textTransform: 'none' }}
        >
          {params.value}
        </Button>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip
          icon={params.value === 'compliant' ? <CheckIcon /> : <WarningIcon />}
          label={params.value}
          color={params.value === 'compliant' ? 'success' : 'error'}
          size="small"
        />
      )
    },
    { field: 'date', headerName: 'Date', width: 120 },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 150,
      renderCell: (params) => (
        <>
          <Tooltip title="Download">
            <IconButton size="small">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          {params.row.status === 'non-compliant' && (
            <Tooltip title="View Issues">
              <IconButton size="small" color="error">
                <WarningIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      )
    },
  ];

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(r => r.status === filter);

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Compliance Reports</Typography>
          <Box>
            <Button 
              variant="outlined" 
              onClick={() => setOpenStandards(true)}
              sx={{ mr: 2 }}
            >
              View Standards
            </Button>
            <Button variant="contained" startIcon={<ReportIcon />}>
              New Report
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Chip 
            label="All" 
            onClick={() => setFilter('all')} 
            color={filter === 'all' ? 'primary' : 'default'}
          />
          <Chip 
            label="Compliant" 
            onClick={() => setFilter('compliant')} 
            color={filter === 'compliant' ? 'primary' : 'default'}
            icon={<CheckIcon />}
          />
          <Chip 
            label="Non-Compliant" 
            onClick={() => setFilter('non-compliant')} 
            color={filter === 'non-compliant' ? 'primary' : 'default'}
            icon={<WarningIcon />}
          />
        </Box>

        <Box sx={{ height: 500 }}>
          <DataGrid
            rows={filteredReports}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            disableSelectionOnClick
          />
        </Box>
      </Paper>

      {/* Standards Registry Dialog */}
      <Dialog 
        open={openStandards} 
        onClose={() => setOpenStandards(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Standards Registry</DialogTitle>
        <DialogContent dividers>
          <StandardsRegistry />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStandards(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComplianceReports;