import React, { useState } from 'react';
import {  Box,  Typography,  Table,
  TableBody,  TableCell,  TableContainer,  TableHead,
  TableRow,  Paper,  Chip,  Avatar,  Pagination,  TextField,
  InputAdornment,  Button,  Dialog,  DialogTitle,  DialogContent,  DialogActions,  Menu,
  MenuItem,  FormControl,  InputLabel,  Select,
  IconButton,  Tooltip,  Badge,  useTheme} from '@mui/material';
import {  Search,  FilterList,  Download,
  Visibility,  Close,  DateRange,  PictureAsPdf,
  GridOn,  CheckCircle,  Warning,  Error as ErrorIcon,
  MoreVert} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const EQAVerificationRecords = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  // Dummy data
  const records = [
    {
      id: 1,
      date: '2023-05-15',
      center: 'ABC Training Center',
      qualification: 'Level 3 Diploma in Business',
      type: 'Initial Verification',
      status: 'approved',
      eqaOfficer: 'John Smith',
      documents: ['report.pdf', 'evidence.zip']
    },
    {
      id: 2,
      date: '2023-05-12',
      center: 'XYZ College',
      qualification: 'Level 2 Certificate in Customer Service',
      type: 'Interim Sampling',
      status: 'minor_issues',
      eqaOfficer: 'Sarah Johnson',
      documents: ['sampling_results.pdf']
    },
    {
      id: 3,
      date: '2023-05-10',
      center: 'Global Skills Institute',
      qualification: 'Level 4 Diploma in Project Management',
      type: 'Summative Assessment',
      status: 'approved',
      eqaOfficer: 'Michael Brown',
      documents: ['final_report.pdf', 'feedback.docx']
    },
    {
      id: 4,
      date: '2023-05-08',
      center: 'City Academy',
      qualification: 'Level 3 Diploma in Health and Social Care',
      type: 'Additional Verification',
      status: 'major_issues',
      eqaOfficer: 'Emily Davis',
      documents: ['action_plan.pdf']
    },
    {
      id: 5,
      date: '2023-05-05',
      center: 'ABC Training Center',
      qualification: 'Level 2 Certificate in Business',
      type: 'Initial Verification',
      status: 'approved',
      eqaOfficer: 'John Smith',
      documents: ['verification_report.pdf']
    },
  ];

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [centerFilter, setCenterFilter] = useState('all');
  const [dateRange, setDateRange] = useState([null, null]);

  const filteredRecords = records.filter(record => {
    const matchesSearch = searchTerm === '' || 
      Object.values(record).some(
        val => val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'all' || 
      record.status === statusFilter;
    
    const matchesType = typeFilter === 'all' || 
      record.type.toLowerCase().includes(typeFilter.toLowerCase());
    
    const matchesCenter = centerFilter === 'all' || 
      record.center.toLowerCase().includes(centerFilter.toLowerCase());
    
    const matchesDateRange = (!dateRange[0] || new Date(record.date) >= dateRange[0]) && 
      (!dateRange[1] || new Date(record.date) <= dateRange[1]);
    
    return matchesSearch && matchesStatus && matchesType && 
           matchesCenter && matchesDateRange;
  });

  const itemsPerPage = 5;
  const pageCount = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const getStatusChip = (status) => {
    switch (status) {
      case 'approved':
        return <Chip label="Approved" color="success" icon={<CheckCircle />} size="small" />;
      case 'minor_issues':
        return <Chip label="Minor Issues" color="warning" icon={<Warning />} size="small" />;
      case 'major_issues':
        return <Chip label="Major Issues" color="error" icon={<ErrorIcon />} size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const handleMenuOpen = (event, recordId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRecordId(recordId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRecordId(null);
  };

  const handleExport = (format) => {
    console.log(`Exporting record ${selectedRecordId} as ${format}`);
    handleMenuClose();
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setCenterFilter('all');
    setDateRange([null, null]);
    setSearchTerm('');
    setPage(1);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                setPage(1);
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
                    minDate={dateRange[0]}
                  />
                </Box>
              </LocalizationProvider>
            </Box>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="minor_issues">Minor Issues</MenuItem>
                <MenuItem value="major_issues">Major Issues</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Verification Type</InputLabel>
              <Select
                value={typeFilter}
                label="Verification Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="initial">Initial Verification</MenuItem>
                <MenuItem value="interim">Interim Sampling</MenuItem>
                <MenuItem value="summative">Summative Assessment</MenuItem>
                <MenuItem value="additional">Additional Verification</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Center</InputLabel>
              <Select
                value={centerFilter}
                label="Center"
                onChange={(e) => setCenterFilter(e.target.value)}
              >
                <MenuItem value="all">All Centers</MenuItem>
                {[...new Set(records.map(r => r.center))].map(center => (
                  <MenuItem key={center} value={center}>{center}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleResetFilters}>Reset All</Button>
            <Button onClick={() => setFilterOpen(false)} variant="contained">Apply Filters</Button>
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
                    <Typography variant="subtitle2">Center</Typography>
                    <Typography variant="body1">{selectedRecord.center}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">EQA Officer</Typography>
                    <Typography variant="body1">{selectedRecord.eqaOfficer}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Date</Typography>
                    <Typography variant="body1">{selectedRecord.date}</Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2">Qualification</Typography>
                  <Typography variant="body1">{selectedRecord.qualification}</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2">Verification Type</Typography>
                  <Typography variant="body1">{selectedRecord.type}</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2">Status</Typography>
                  {getStatusChip(selectedRecord.status)}
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
                        deleteIcon={<Download />}
                        onDelete={() => console.log('Download', doc)}
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
              startIcon={<Download />}
              onClick={() => console.log('Download full report')}
            >
              Download Full Report
            </Button>
          </DialogActions>
        </Dialog>

        {/* Main table */}
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Date</TableCell>
                <TableCell>Center</TableCell>
                <TableCell>Qualification</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>EQA Officer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRecords.map((record) => (
                <TableRow key={record.id} hover>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        mr: 2,
                        bgcolor: theme.palette.secondary.light
                      }}>
                        {record.center.charAt(0)}
                      </Avatar>
                      {record.center}
                    </Box>
                  </TableCell>
                  <TableCell>{record.qualification}</TableCell>
                  <TableCell>{record.type}</TableCell>
                  <TableCell>{record.eqaOfficer}</TableCell>
                  <TableCell>{getStatusChip(record.status)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <Tooltip title="View details">
                        <IconButton onClick={() => setSelectedRecord(record)}>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="More options">
                        <IconButton onClick={(e) => handleMenuOpen(e, record.id)}>
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredRecords.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No records found matching your criteria
            </Typography>
            <Button onClick={handleResetFilters} sx={{ mt: 2 }}>
              Clear Filters
            </Button>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => {
            setSelectedRecord(records.find(r => r.id === selectedRecordId));
            handleMenuClose();
          }}>
            <Visibility sx={{ mr: 1 }} /> View Details
          </MenuItem>
          <MenuItem onClick={() => handleExport('pdf')}>
            <PictureAsPdf sx={{ mr: 1 }} /> Export as PDF
          </MenuItem>
          <MenuItem onClick={() => handleExport('csv')}>
            <GridOn sx={{ mr: 1 }} /> Export as CSV
          </MenuItem>
        </Menu>
      </Box>
    </LocalizationProvider>
  );
};

export default EQAVerificationRecords;