import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Snackbar,
  Alert,
  useTheme,
  styled,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Visibility as VisibilityIcon,
  AttachFile as AttachFileIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  Slideshow as PptIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: theme.shadows[4],
  background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[8],
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '12px',
  border: `1px solid ${theme.palette.grey[200]}`,
  backgroundColor: theme.palette.background.default,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 3),
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
  '&:hover': {
    background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[6],
  },
}));

const DescriptionBox = styled(Box)(({ theme }) => ({
  maxHeight: '200px',
  overflowY: 'auto',
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: '8px',
  backgroundColor: theme.palette.grey[50],
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
}));

const FileChip = styled(Chip)(({ theme }) => ({
  borderRadius: '8px',
  backgroundColor: theme.palette.grey[100],
  border: `1px solid ${theme.palette.grey[300]}`,
  fontWeight: 500,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}));

const PreviewDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '80vw',
    maxWidth: '1000px',
    height: '80vh',
    borderRadius: '16px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[6],
  },
}));

const QualityStandards = () => {
  const theme = useTheme();
  const [standards, setStandards] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [currentStandard, setCurrentStandard] = useState(null);
  const [viewStandard, setViewStandard] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    complianceLevel: 'required',
    applicableTo: 'all',
    files: [],
  });

  // Sample data with file URLs
  useEffect(() => {
    const sampleStandards = [
      {
        id: 1,
        name: 'Assessment Fairness',
        description: 'All assessments must be graded fairly and consistently.',
        category: 'Assessment',
        complianceLevel: 'required',
        applicableTo: 'all',
        lastUpdated: '2023-05-15',
        files: [
          {
            name: 'Assessment_Guidelines.pdf',
            type: 'application/pdf',
            size: 1200000,
            url: '/files/Assessment_Guidelines.pdf', // Placeholder URL
          },
          {
            name: 'Fairness_Policy.docx',
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            size: 80000,
            url: '/files/Fairness_Policy.docx',
          },
        ],
      },
      {
        id: 2,
        name: 'Trainer Qualifications',
        description: 'All trainers must hold current certifications.',
        category: 'Trainer',
        complianceLevel: 'required',
        applicableTo: 'instructors',
        lastUpdated: '2023-04-20',
        files: [],
      },
      {
        id: 3,
        name: 'Content Review Cycle',
        description: 'All course content must be reviewed annually.',
        category: 'Content',
        complianceLevel: 'recommended',
        applicableTo: 'content',
        lastUpdated: '2023-03-10',
        files: [
          {
            name: 'Review_Process.pptx',
            type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            size: 2500000,
            url: '/files/Review_Process.pptx',
          },
        ],
      },
    ];
    setStandards(sampleStandards);
  }, []);

  const handleOpenDialog = (standard = null) => {
    if (standard) {
      setCurrentStandard(standard);
      setFormData({
        name: standard.name,
        description: standard.description,
        category: standard.category,
        complianceLevel: standard.complianceLevel,
        applicableTo: standard.applicableTo,
        files: standard.files || [],
      });
    } else {
      setCurrentStandard(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        complianceLevel: 'required',
        applicableTo: 'all',
        files: [],
      });
    }
    setOpenDialog(true);
  };

  const handleOpenViewDialog = (standard) => {
    setViewStandard(standard);
    setOpenViewDialog(true);
  };

  const handleOpenPreviewDialog = (file) => {
    if (!file.url) {
      setError('File URL is missing.');
      setOpenSnackbar(true);
      return;
    }
    if (file.type.includes('pdf')) {
      setPreviewFile(file);
      setOpenPreviewDialog(true);
    } else {
      // For DOCX/PPT, open in new tab or download
      window.open(file.url, '_blank');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentStandard(null);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setViewStandard(null);
  };

  const handleClosePreviewDialog = () => {
    setOpenPreviewDialog(false);
    setPreviewFile(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'description' && value.length > 10000) {
      return; // Limit description to 10,000 characters
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 5;

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        setError(`${file.name} is not an allowed file type.`);
        setOpenSnackbar(true);
        return false;
      }
      if (file.size > maxSize) {
        setError(`${file.name} exceeds the 10MB size limit.`);
        setOpenSnackbar(true);
        return false;
      }
      return true;
    });

    if (formData.files.length + validFiles.length > maxFiles) {
      setError(`Cannot add more than ${maxFiles} files.`);
      setOpenSnackbar(true);
      return;
    }

    const newFiles = validFiles.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: `/files/${file.name}`, // Simulate URL; replace with actual backend URL
    }));

    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
    }));
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.category) {
      setError('Please fill in all required fields.');
      setOpenSnackbar(true);
      return;
    }
    if (currentStandard) {
      setStandards((prev) =>
        prev.map((std) =>
          std.id === currentStandard.id
            ? { ...std, ...formData, lastUpdated: new Date().toISOString().split('T')[0] }
            : std
        )
      );
    } else {
      const newStandard = {
        id: standards.length + 1,
        ...formData,
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      setStandards((prev) => [...prev, newStandard]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    setStandards((prev) => prev.filter((std) => std.id !== id));
  };

  const getComplianceColor = (level) => {
    switch (level) {
      case 'required':
        return 'success';
      case 'recommended':
        return 'warning';
      case 'optional':
        return 'info';
      default:
        return 'default';
    }
  };

  const truncateDescription = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return <PdfIcon />;
    if (type.includes('word')) return <DocIcon />;
    if (type.includes('powerpoint') || type.includes('presentation')) return <PptIcon />;
    return <AttachFileIcon />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: theme.palette.grey[50], minHeight: '100%' }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          <StyledCard>
            <CardHeader
              title={
                <Typography variant="h5" fontWeight="700" align="center">
                  Quality Standards Configuration
                </Typography>
              }
              action={
                <StyledButton
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                  aria-label="Add new standard"
                >
                  Add Standard
                </StyledButton>
              }
              sx={{ pb: 2 }}
            />
            <Divider sx={{ mb: 2 }} />
            <CardContent>
              <StyledTableContainer component={Paper}>
                <Table aria-label="Quality standards table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Standard Name</TableCell>
                     
                      <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Compliance</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Applicable To</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Files</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Last Updated</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {standards.map((standard) => (
                      <TableRow
                        key={standard.id}
                        sx={{
                          '&:hover': { backgroundColor: theme.palette.grey[50] },
                        }}
                      >
                        <TableCell>{standard.name}</TableCell>
                     
                        <TableCell>
                          <Chip
                            label={standard.category}
                            variant="outlined"
                            sx={{ borderRadius: '8px' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={
                              standard.complianceLevel === 'required' ? (
                                <CheckCircleIcon />
                              ) : (
                                <WarningIcon />
                              )
                            }
                            label={standard.complianceLevel}
                            color={getComplianceColor(standard.complianceLevel)}
                            sx={{ borderRadius: '8px' }}
                          />
                        </TableCell>
                        <TableCell>{standard.applicableTo}</TableCell>
                        <TableCell>
                          {standard.files?.length > 0 ? (
                            <Tooltip
                              title={standard.files.map((file) => file.name).join(', ')}
                              placement="top"
                            >
                              <Chip
                                label={`${standard.files.length} File${standard.files.length > 1 ? 's' : ''}`}
                                icon={<AttachFileIcon />}
                                sx={{ borderRadius: '8px' }}
                              />
                            </Tooltip>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>{standard.lastUpdated}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="View">
                            <IconButton
                              onClick={() => handleOpenViewDialog(standard)}
                              aria-label={`View ${standard.name}`}
                            >
                              <VisibilityIcon color="info" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleOpenDialog(standard)}
                              aria-label={`Edit ${standard.name}`}
                            >
                              <EditIcon color="primary" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleDelete(standard.id)}
                              aria-label={`Delete ${standard.name}`}
                            >
                              <DeleteIcon color="error" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Add/Edit Dialog */}
      <StyledDialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>
          {currentStandard ? 'Edit Quality Standard' : 'Add New Quality Standard'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Standard Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  aria-label="Standard name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  required
                  variant="outlined"
                  inputProps={{ maxLength: 10000 }}
                  aria-label="Standard description"
                  helperText={`${formData.description.length}/10000 characters`}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  aria-label="Standard category"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="compliance-level-label">Compliance Level</InputLabel>
                  <Select
                    labelId="compliance-level-label"
                    name="complianceLevel"
                    value={formData.complianceLevel}
                    onChange={handleInputChange}
                    label="Compliance Level"
                    required
                    aria-label="Compliance level"
                  >
                    <MenuItem value="required">Required</MenuItem>
                    <MenuItem value="recommended">Recommended</MenuItem>
                    <MenuItem value="optional">Optional</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="applicable-to-label">Applicable To</InputLabel>
                  <Select
                    labelId="applicable-to-label"
                    name="applicableTo"
                    value={formData.applicableTo}
                    onChange={handleInputChange}
                    label="Applicable To"
                    required
                    aria-label="Applicable to"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="instructors">Instructors</MenuItem>
                    <MenuItem value="content">Content</MenuItem>
                    <MenuItem value="assessments">Assessments</MenuItem>
                    <MenuItem value="processes">Processes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="600" sx={{ mr: 2 }}>
                    Attachments
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AttachFileIcon />}
                    component="label"
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 500,
                      borderColor: theme.palette.grey[300],
                      bgcolor: theme.palette.grey[50],
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        bgcolor: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText,
                      },
                    }}
                  >
                    Add Files
                    <input
                      type="file"
                      hidden
                      multiple
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      onChange={handleFileUpload}
                      aria-label="Upload files"
                    />
                  </Button>
                </Box>
                {formData.files.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {formData.files.map((file, index) => (
                      <FileChip
                        key={index}
                        icon={getFileIcon(file.type)}
                        label={`${file.name} (${formatFileSize(file.size)})`}
                        onDelete={() => handleRemoveFile(index)}
                        deleteIcon={<DeleteIcon />}
                        aria-label={`Remove ${file.name}`}
                      />
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button
              onClick={handleCloseDialog}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 500 }}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <StyledButton
              type="submit"
              variant="contained"
              aria-label={currentStandard ? 'Update standard' : 'Create standard'}
            >
              {currentStandard ? 'Update' : 'Create'}
            </StyledButton>
          </DialogActions>
        </form>
      </StyledDialog>

      {/* View Dialog */}
      <StyledDialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>
          View Quality Standard
        </DialogTitle>
        <DialogContent dividers>
          {viewStandard && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Standard Name
                </Typography>
                <Typography variant="h6" fontWeight="600">
                  {viewStandard.name}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <DescriptionBox aria-label="Standard description">
                  {viewStandard.description}
                </DescriptionBox>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Category
                </Typography>
                <Chip
                  label={viewStandard.category}
                  variant="outlined"
                  sx={{ borderRadius: '8px' }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Compliance Level
                </Typography>
                <Chip
                  icon={
                    viewStandard.complianceLevel === 'required' ? (
                      <CheckCircleIcon />
                    ) : (
                      <WarningIcon />
                    )
                  }
                  label={viewStandard.complianceLevel}
                  color={getComplianceColor(viewStandard.complianceLevel)}
                  sx={{ borderRadius: '8px' }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Applicable To
                </Typography>
                <Typography variant="body1">{viewStandard.applicableTo}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Attached Files
                </Typography>
                {viewStandard.files?.length > 0 ? (
                  <Box
                    sx={{
                      maxHeight: '150px',
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                    }}
                  >
                    {viewStandard.files.map((file, index) => (
                      <Box
                        key={index}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <FileChip
                          icon={getFileIcon(file.type)}
                          label={`${file.name} (${formatFileSize(file.size)})`}
                          sx={{ flexGrow: 1 }}
                          aria-label={`File ${file.name}`}
                        />
                        <StyledButton
                          size="small"
                          startIcon={<OpenInNewIcon />}
                          onClick={() => handleOpenPreviewDialog(file)}
                          aria-label={`View ${file.name}`}
                        >
                          View
                        </StyledButton>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No files attached
                  </Typography>
                )}
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Last Updated
                </Typography>
                <Typography variant="body1">{viewStandard.lastUpdated}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <StyledButton
            onClick={handleCloseViewDialog}
            variant="contained"
            aria-label="Close view dialog"
          >
            Close
          </StyledButton>
        </DialogActions>
      </StyledDialog>

      {/* PDF Preview Dialog */}
      <PreviewDialog
        open={openPreviewDialog}
        onClose={handleClosePreviewDialog}
        maxWidth={false}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 700, bgcolor: theme.palette.primary.light, color: theme.palette.primary.contrastText }}>
          File Preview: {previewFile?.name}
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
          {previewFile && (
            <iframe
              src={previewFile.url}
              title={previewFile.name}
              style={{ width: '100%', height: '100%', border: 'none' }}
              aria-label={`Preview of ${previewFile.name}`}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            href={previewFile?.url}
            download
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 500 }}
            aria-label={`Download ${previewFile?.name}`}
          >
            Download
          </Button>
          <StyledButton
            onClick={handleClosePreviewDialog}
            variant="contained"
            aria-label="Close preview dialog"
          >
            Close
          </StyledButton>
        </DialogActions>
      </PreviewDialog>

      {/* Error Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: '100%', borderRadius: '8px' }}
          aria-label="Error message"
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QualityStandards;