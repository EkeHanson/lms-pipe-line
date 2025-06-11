import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  useTheme,
  Card,
  CardHeader,
  Divider,
  Grid
} from '@mui/material';

import IQAManagement from './IQAManagement/IQAManagement';
import EQAManagement from './EQAManagement/EQAManagement';
import QualityMetrics from './shared/QualityMetrics';
import AuditTrail from './AuditTrail';
import QualityStandards from './QualityStandards';
import { Checklist, GppGood, Assignment, School, History} from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`qa-tabpanel-${index}`}
      aria-labelledby={`qa-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function QualityAssuranceDashboard() {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardHeader 
          title="Quality Assurance Center"
          subheader="Monitor and manage all quality assurance activities"
          avatar={<Checklist fontSize="large" />}
        />
        <Divider />
        
        <Grid container spacing={2} sx={{ p: 3 }}>
          <Grid item xs={12} md={6}>
            <QualityMetrics 
              title="EQA Readiness"
              value="72%"
              icon={<GppGood />}
              color="secondary"
              progress={72}
              description="Prepared for external audit"
            />
          </Grid>
        </Grid>
      </Card>

      <Card>
        <Tabs 
          value={value} 
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
              height: 3
            }
          }}
        >
          <Tab label="Internal QA" icon={<School />} iconPosition="start" />
          <Tab label="External QA" icon={<GppGood />} iconPosition="start" />
          <Tab label="Standards" icon={<Assignment />} iconPosition="start" />
          <Tab label="Audit Trail" icon={<History />} iconPosition="start" />

        </Tabs>
        <Divider />

        <TabPanel value={value} index={0}>
          <IQAManagement />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <EQAManagement />
        </TabPanel>
        <TabPanel value={value} index={2}>
          {/* <Typography variant="h6" gutterBottom>
            Quality Standards Configuration
          </Typography>
          <Typography>
            This section will contain the standards management interface
          </Typography> */}
           <QualityStandards />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <AuditTrail />
        </TabPanel>
      </Card>
    </Box>
  );
}

export default QualityAssuranceDashboard;