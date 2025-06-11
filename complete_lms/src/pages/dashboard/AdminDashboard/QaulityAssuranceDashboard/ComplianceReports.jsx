import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  IconButton,
  Tooltip,TextField,
  useTheme
} from '@mui/material';
import {
  Description as ReportIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as DocIcon,
  CloudDownload as DownloadIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const ComplianceReports = () => {
  const theme = useTheme();

  // Mock data for compliance reports
  const reports = [
    { id: 1, name: 'Annual IQA Summary 2022', type: 'PDF', date: '2023-01-15', size: '2.4 MB' },
    { id: 2, name: 'EQA Audit Report - March 2023', type: 'PDF', date: '2023-03-20', size: '3.1 MB' },
    { id: 3, name: 'Trainer Competency Analysis', type: 'DOC', date: '2023-04-05', size: '1.8 MB' },
    { id: 4, name: 'Learner Satisfaction Survey Results', type: 'XLS', date: '2023-05-10', size: '4.2 MB' },
    { id: 5, name: 'Compliance Action Tracker', type: 'DOC', date: '2023-06-01', size: '1.2 MB' },
  ];

  const columns = [
    { field: 'name', headerName: 'Report Name', flex: 1 },
    { field: 'type', headerName: 'Type', width: 100 },
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'size', headerName: 'Size', width: 100 },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 150,
      renderCell: (params) => (
        <IconButton size="small">
          <DownloadIcon />
        </IconButton>
      )
    },
  ];

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Compliance Documentation</Typography>
        <Typography variant="body1" paragraph>
          This section contains all compliance reports, audit documentation, and quality assurance records.
          Maintain organized records to demonstrate compliance with internal and external standards.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button variant="contained" startIcon={<ReportIcon />}>
            Generate New Report
          </Button>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Export All
          </Button>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search reports..."
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
            }}
            sx={{ flexGrow: 1, mr: 2 }}
          />
          <Tooltip title="Filter">
            <IconButton>
              <FilterIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Box sx={{ height: 400 }}>
          <DataGrid
            rows={reports}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            components={{ Toolbar: GridToolbar }}
            disableSelectionOnClick
          />
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Quick Access</Typography>
        <List>
          <ListItem button>
            <ListItemIcon>
              <PdfIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Quality Assurance Policy" secondary="Latest version: 3.2" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <DocIcon color="info" />
            </ListItemIcon>
            <ListItemText primary="IQA Procedures Manual" secondary="Updated June 2023" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <PdfIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="EQA Requirements Checklist" secondary="For next audit" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <DocIcon color="info" />
            </ListItemIcon>
            <ListItemText primary="Trainer Assessment Forms" secondary="Templates for use" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default ComplianceReports;