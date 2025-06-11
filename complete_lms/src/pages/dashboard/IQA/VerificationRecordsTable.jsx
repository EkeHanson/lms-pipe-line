import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Pagination,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,FormControlLabel,
  Checkbox,
  ListItemText,FormGroup ,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  Visibility,
  Close,
  DateRange,
  PictureAsPdf,
  GridOn,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const VerificationRecordsTable = () => {
  // Dummy data
  const allRecords = [
    {
      id: 1,
      date: '2023-05-15',
      learner: 'John Doe',
      qualification: 'Level 3 Diploma',
      assessor: 'Sarah Smith',
      type: 'Initial',
      status: 'Approved',
      notes: 'All criteria met',
      documents: ['assessment.pdf', 'feedback.docx']
    },
    {
      id: 2,
      date: '2023-05-12',
      learner: 'Jane Smith',
      qualification: 'Level 2 Certificate',
      assessor: 'Michael Brown',
      type: 'Interim',
      status: 'Minor Issues',
      notes: 'Needs additional evidence for criteria 2.3',
      documents: ['project_submission.pdf']
    },
    {
      id: 3,
      date: '2023-05-10',
      learner: 'Robert Johnson',
      qualification: 'Level 4 Diploma',
      assessor: 'Emily Davis',
      type: 'Summative',
      status: 'Approved',
      notes: 'Excellent work, meets all standards',
      documents: ['final_assessment.pdf', 'rubric.docx']
    },
    {
      id: 4,
      date: '2023-05-08',
      learner: 'Emily Wilson',
      qualification: 'Level 3 Diploma',
      assessor: 'Sarah Smith',
      type: 'Additional',
      status: 'Major Issues',
      notes: 'Significant inconsistencies found',
      documents: ['resubmission.pdf']
    },
    {
      id: 5,
      date: '2023-05-05',
      learner: 'Michael Lee',
      qualification: 'Level 2 Certificate',
      assessor: 'Michael Brown',
      type: 'Initial',
      status: 'Approved',
      notes: 'Meets all requirements',
      documents: ['initial_assessment.pdf']
    },
  ];

  // State management
  const [records, setRecords] = useState(allRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Filter states
  const [statusFilter, setStatusFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);
  const [qualificationFilter, setQualificationFilter] = useState([]);
  const [assessorFilter, setAssessorFilter] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [expandedFilters, setExpandedFilters] = useState(false);

  // Export states
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportColumns, setExportColumns] = useState({
    date: true,
    learner: true,
    qualification: true,
    assessor: true,
    type: true,
    status: true,
    notes: true
  });

  // Unique values for filters
  const statusOptions = ['Approved', 'Minor Issues', 'Major Issues'];
  const typeOptions = ['Initial', 'Interim', 'Summative', 'Additional'];
  const qualificationOptions = [...new Set(allRecords.map(r => r.qualification))];
  const assessorOptions = [...new Set(allRecords.map(r => r.assessor))];

  // Filter records based on all filter criteria
  const applyFilters = () => {
    let filtered = allRecords.filter(record => {
      const matchesSearch = searchTerm === '' || 
        Object.values(record).some(
          val => val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesStatus = statusFilter.length === 0 || 
        statusFilter.includes(record.status);
      
      const matchesType = typeFilter.length === 0 || 
        typeFilter.includes(record.type);
      
      const matchesQualification = qualificationFilter.length === 0 || 
        qualificationFilter.includes(record.qualification);
      
      const matchesAssessor = assessorFilter.length === 0 || 
        assessorFilter.includes(record.assessor);
      
      const matchesDateRange = (!dateRange[0] || new Date(record.date) >= dateRange[0]) && 
        (!dateRange[1] || new Date(record.date) <= dateRange[1]);
      
      return matchesSearch && matchesStatus && matchesType && 
             matchesQualification && matchesAssessor && matchesDateRange;
    });
    
    setRecords(filtered);
    setPage(1); // Reset to first page when filters change
    setFilterOpen(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setStatusFilter([]);
    setTypeFilter([]);
    setQualificationFilter([]);
    setAssessorFilter([]);
    setDateRange([null, null]);
    setSearchTerm('');
    setRecords(allRecords);
    setPage(1);
  };

  // Handle export
  const handleExport = () => {
    // In a real app, this would generate the export file
    console.log('Exporting data:', {
      format: exportFormat,
      columns: exportColumns,
      data: records
    });
    setExportOpen(false);
    alert(`Exporting ${records.length} records as ${exportFormat.toUpperCase()}`);
  };

  // Get status chip with appropriate color
  const getStatusChip = (status) => {
    switch (status) {
      case 'Approved':
        return <Chip label={status} color="success" size="small" />;
      case 'Minor Issues':
        return <Chip label={status} color="warning" size="small" />;
      case 'Major Issues':
        return <Chip label={status} color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // Pagination
  const paginatedRecords = records.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header and controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Verification Records</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              applyFilters();
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setFilterOpen(true)}
          >
            Filters
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => setExportOpen(true)}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Filter Dialog */}
      <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Filter Records
            <IconButton onClick={() => setFilterOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <DatePicker
                  label="From Date"
                  value={dateRange[0]}
                  onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                <DatePicker
                  label="To Date"
                  value={dateRange[1]}
                  onChange={(newValue) => setDateRange([dateRange[0], newValue])}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Box>
            </LocalizationProvider>
          </Box>

          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                multiple
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                renderValue={(selected) => selected.join(', ')}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    <Checkbox checked={statusFilter.includes(status)} />
                    <ListItemText primary={status} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Verification Type</InputLabel>
              <Select
                multiple
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                renderValue={(selected) => selected.join(', ')}
              >
                {typeOptions.map((type) => (
                  <MenuItem key={type} value={type}>
                    <Checkbox checked={typeFilter.includes(type)} />
                    <ListItemText primary={type} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {expandedFilters && (
              <>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Qualification</InputLabel>
                  <Select
                    multiple
                    value={qualificationFilter}
                    onChange={(e) => setQualificationFilter(e.target.value)}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {qualificationOptions.map((qual) => (
                      <MenuItem key={qual} value={qual}>
                        <Checkbox checked={qualificationFilter.includes(qual)} />
                        <ListItemText primary={qual} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Assessor</InputLabel>
                  <Select
                    multiple
                    value={assessorFilter}
                    onChange={(e) => setAssessorFilter(e.target.value)}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {assessorOptions.map((assessor) => (
                      <MenuItem key={assessor} value={assessor}>
                        <Checkbox checked={assessorFilter.includes(assessor)} />
                        <ListItemText primary={assessor} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            <Button 
              onClick={() => setExpandedFilters(!expandedFilters)}
              startIcon={expandedFilters ? <ExpandLess /> : <ExpandMore />}
            >
              {expandedFilters ? 'Show Less Filters' : 'Show More Filters'}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetFilters}>Reset All</Button>
          <Button onClick={applyFilters} variant="contained">Apply Filters</Button>
        </DialogActions>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportOpen} onClose={() => setExportOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Export Records
            <IconButton onClick={() => setExportOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Export Format
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant={exportFormat === 'pdf' ? 'contained' : 'outlined'}
                startIcon={<PictureAsPdf />}
                onClick={() => setExportFormat('pdf')}
              >
                PDF
              </Button>
              <Button
                variant={exportFormat === 'csv' ? 'contained' : 'outlined'}
                startIcon={<GridOn />}
                onClick={() => setExportFormat('csv')}
              >
                CSV
              </Button>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Columns to Include
            </Typography>
            <FormGroup>
              {Object.keys(exportColumns).map((column) => (
                <FormControlLabel
                  key={column}
                  control={
                    <Checkbox
                      checked={exportColumns[column]}
                      onChange={(e) => 
                        setExportColumns({
                          ...exportColumns,
                          [column]: e.target.checked
                        })
                      }
                    />
                  }
                  label={column.charAt(0).toUpperCase() + column.slice(1)}
                />
              ))}
            </FormGroup>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportOpen(false)}>Cancel</Button>
          <Button onClick={handleExport} variant="contained">
            Export {records.length} Records
          </Button>
        </DialogActions>
      </Dialog>

      {/* Record Detail Dialog */}
      <Dialog 
        open={!!selectedRecord} 
        onClose={() => setSelectedRecord(null)} 
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Verification Details
            <IconButton onClick={() => setSelectedRecord(null)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Box>
              <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                <Box>
                  <Typography variant="subtitle2">Learner</Typography>
                  <Typography variant="body1">{selectedRecord.learner}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Assessor</Typography>
                  <Typography variant="body1">{selectedRecord.assessor}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Qualification</Typography>
                  <Typography variant="body1">{selectedRecord.qualification}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Date</Typography>
                  <Typography variant="body1">{selectedRecord.date}</Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2">Verification Type</Typography>
                <Typography variant="body1">{selectedRecord.type}</Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2">Status</Typography>
                {getStatusChip(selectedRecord.status)}
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2">Notes</Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body1">{selectedRecord.notes}</Typography>
                </Paper>
              </Box>

              <Box>
                <Typography variant="subtitle2">Attached Documents</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  {selectedRecord.documents.map((doc, index) => (
                    <Chip 
                      key={index} 
                      label={doc} 
                      variant="outlined" 
                      onClick={() => console.log('Download', doc)}
                      onDelete={() => console.log('Delete', doc)}
                      deleteIcon={<Download />}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedRecord(null)}>Close</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              // Action to take on the record
              console.log('Action taken on record:', selectedRecord.id);
              setSelectedRecord(null);
            }}
          >
            Take Action
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Date</TableCell>
              <TableCell>Learner</TableCell>
              <TableCell>Qualification</TableCell>
              <TableCell>Assessor</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRecords.map((record) => (
              <TableRow key={record.id} hover>
                <TableCell>{record.date}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                      {record.learner.charAt(0)}
                    </Avatar>
                    {record.learner}
                  </Box>
                </TableCell>
                <TableCell>{record.qualification}</TableCell>
                <TableCell>{record.assessor}</TableCell>
                <TableCell>{record.type}</TableCell>
                <TableCell>{getStatusChip(record.status)}</TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  <Tooltip title={record.notes}>
                    <Typography noWrap>{record.notes}</Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => setSelectedRecord(record)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {records.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No records found matching your criteria
          </Typography>
          <Button onClick={resetFilters} sx={{ mt: 2 }}>
            Clear Filters
          </Button>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={Math.ceil(records.length / rowsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default VerificationRecordsTable;