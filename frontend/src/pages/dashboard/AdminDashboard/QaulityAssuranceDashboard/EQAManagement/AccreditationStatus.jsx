import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Lock,
  Download,
  CalendarToday,
  Description,
  History,
  VerifiedUser
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const AccreditationStatus = ({ isReadOnly = true }) => {
  const theme = useTheme();
  
  // Mock accreditation data
  const accreditationData = {
    status: 'Active',
    accreditor: "NCFE",
    reference: "QA-2023-456",
    validUntil: "2024-12-31",
    lastReview: "2023-06-15",
    nextReview: "2024-06-01",
    standards: {
      met: 18,
      total: 20,
      requirements: [
        { id: 1, name: 'Assessment Practices', status: 'met', notes: 'Verified in last audit' },
        { id: 2, name: 'IQA Process', status: 'met', notes: 'Robust sampling observed' },
        { id: 3, name: 'Trainer Qualifications', status: 'pending', notes: '2 trainers need renewal' },
        { id: 4, name: 'Facilities', status: 'met', notes: 'Site visit completed' }
      ]
    },
    documents: [
      { id: 1, name: 'Accreditation Certificate', type: 'pdf', uploaded: '2023-01-15' },
      { id: 2, name: 'Last EQA Report', type: 'docx', uploaded: '2023-06-20' }
    ],
    history: [
      { date: '2022-12-01', action: 'Initial Accreditation', by: 'EQA Team A' },
      { date: '2023-06-15', action: 'Annual Review', by: 'EQA Team B' }
    ]
  };

  const statusConfig = {
    Active: { color: 'success', icon: <CheckCircle /> },
    Expired: { color: 'error', icon: <Error /> },
    Pending: { color: 'warning', icon: <Warning /> }
  };

  const handleDownload = (docName) => {
    console.log(`Downloading ${docName}`);
    // Actual implementation would trigger file download
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Accreditation Status
        </Typography>
        {isReadOnly && (
          <Chip
            icon={<Lock fontSize="small" />}
            label="EQA View"
            size="small"
            color="info"
            sx={{ ml: 2 }}
          />
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Status Overview */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip
                  icon={statusConfig[accreditationData.status]?.icon}
                  label={accreditationData.status}
                  color={statusConfig[accreditationData.status]?.color}
                  sx={{ fontSize: '0.875rem', py: 1 }}
                />
                <Typography variant="body2" sx={{ ml: 'auto' }}>
                  Ref: {accreditationData.reference}
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Accrediting Body:</Typography>
                  <Typography>{accreditationData.accreditor}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Valid Until:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>
                      {new Date(accreditationData.validUntil).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Standards Compliance:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    {accreditationData.standards.met}/{accreditationData.standards.total} met
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({Math.round((accreditationData.standards.met / accreditationData.standards.total) * 100)}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(accreditationData.standards.met / accreditationData.standards.total) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              {!isReadOnly && (
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<VerifiedUser />}
                >
                  Request Renewal
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card elevation={3} sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Accreditation Documents
              </Typography>
              <List dense>
                {accreditationData.documents.map((doc) => (
                  <ListItem
                    key={doc.id}
                    secondaryAction={
                      <Tooltip title="Download">
                        <IconButton edge="end" onClick={() => handleDownload(doc.name)}>
                          <Download fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <ListItemIcon>
                      <Description color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={doc.name}
                      secondary={`Uploaded: ${doc.uploaded}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Requirements & History */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Compliance Requirements
              </Typography>
              <List>
                {accreditationData.standards.requirements.map((req) => (
                  <React.Fragment key={req.id}>
                    <ListItem>
                      <ListItemIcon>
                        {req.status === 'met' ? (
                          <CheckCircle color="success" />
                        ) : (
                          <Warning color={req.status === 'pending' ? 'warning' : 'error'} />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={req.name}
                        secondary={isReadOnly ? req.notes : `Status: ${req.status}`}
                      />
                      <Chip
                        label={req.status}
                        size="small"
                        color={req.status === 'met' ? 'success' : req.status === 'pending' ? 'warning' : 'error'}
                        variant="outlined"
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* History */}
          <Card elevation={3} sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Accreditation History
              </Typography>
              <List dense>
                {accreditationData.history.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: theme.palette.grey[300], width: 32, height: 32 }}>
                        {item.by.charAt(0)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={item.action}
                      secondary={`${item.date} • ${item.by}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccreditationStatus;