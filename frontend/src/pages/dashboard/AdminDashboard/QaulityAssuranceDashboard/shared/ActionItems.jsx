// import React from 'react';
// import {
//   Box,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemAvatar,
//   Avatar,
//   Typography,
//   Chip,
//   useTheme,
//   Divider,
//   IconButton
// } from '@mui/material';
// import {
//   Assignment as AssignmentIcon,
//   Check as CheckIcon,
//   PriorityHigh as PriorityIcon,
//   MoreVert as MoreVertIcon
// } from '@mui/icons-material';

// const actionItems = [
//   {
//     id: 1,
//     title: 'Update assessment rubric for Module 3',
//     assignedTo: 'Sarah Johnson',
//     dueDate: '2023-06-15',
//     priority: 'high',
//     status: 'pending'
//   },
//   {
//     id: 2,
//     title: 'Review trainer feedback from last IQA cycle',
//     assignedTo: 'Michael Chen',
//     dueDate: '2023-06-10',
//     priority: 'medium',
//     status: 'in-progress'
//   },
//   {
//     id: 3,
//     title: 'Prepare evidence for EQA visit',
//     assignedTo: 'Emma Davis',
//     dueDate: '2023-06-20',
//     priority: 'high',
//     status: 'pending'
//   },
//   {
//     id: 4,
//     title: 'Analyze learner completion rates',
//     assignedTo: 'David Wilson',
//     dueDate: '2023-06-05',
//     priority: 'low',
//     status: 'completed'
//   }
// ];

// function ActionItems() {
//   const theme = useTheme();

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high':
//         return 'error';
//       case 'medium':
//         return 'warning';
//       case 'low':
//         return 'success';
//       default:
//         return 'default';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'completed':
//         return <CheckIcon color="success" />;
//       case 'in-progress':
//         return <PriorityIcon color="warning" />;
//       default:
//         return <AssignmentIcon color="action" />;
//     }
//   };

//   return (
//     <Box
//       sx={{
//         p: 3,
//         borderRadius: 2,
//         backgroundColor: theme.palette.background.paper,
//         boxShadow: theme.shadows[1]
//       }}
//     >
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//         <Typography variant="h6" sx={{ fontWeight: 600 }}>
//           Action Items
//         </Typography>
//         <Chip label={`${actionItems.length} Total`} size="small" />
//       </Box>

//       <List sx={{ width: '100%' }}>
//         {actionItems.map((item, index) => (
//           <React.Fragment key={item.id}>
//             <ListItem
//               secondaryAction={
//                 <IconButton edge="end" aria-label="more">
//                   <MoreVertIcon />
//                 </IconButton>
//               }
//               sx={{ py: 2 }}
//             >
//               <ListItemAvatar>
//                 <Avatar sx={{ bgcolor: theme.palette.grey[200] }}>
//                   {getStatusIcon(item.status)}
//                 </Avatar>
//               </ListItemAvatar>
//               <ListItemText
//                 primary={
//                   <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
//                     {item.title}
//                   </Typography>
//                 }
//                 secondary={
//                   <>
//                     <Box component="span" sx={{ display: 'block' }}>
//                       Assigned to: {item.assignedTo}
//                     </Box>
//                     <Box component="span" sx={{ display: 'block' }}>
//                       Due: {new Date(item.dueDate).toLocaleDateString()}
//                     </Box>
//                   </>
//                 }
//               />
//               <Chip
//                 label={item.priority}
//                 color={getPriorityColor(item.priority)}
//                 size="small"
//                 sx={{ ml: 2 }}
//               />
//             </ListItem>
//             {index < actionItems.length - 1 && <Divider variant="inset" component="li" />}
//           </React.Fragment>
//         ))}
//       </List>
//     </Box>
//   );
// }

// export default ActionItems;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import { Assignment, Check, PriorityHigh } from '@mui/icons-material';
import { useQAAuth } from '../../../../../config';
import axios from 'axios';

// API endpoints
const API_URL = '/api/action-items';
const AUDIT_TRAIL_API_URL = '/api/audit-trail';

const ActionItems = () => {
  const { canViewReports } = useQAAuth();
  const [actionItems, setActionItems] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch action items
  useEffect(() => {
    const fetchActionItems = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        setActionItems(response.data);

        // Log view action
        await axios.post(
          AUDIT_TRAIL_API_URL,
          {
            actionType: 'Action Items View',
            description: `Viewed action items`,
            targetType: 'action-items',
            targetId: '',
            targetName: 'Action Items List',
          },
          { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
        );
      } catch (error) {
        console.error('Fetch action items error:', error);
        setSnackbar({ open: true, message: 'Failed to fetch action items', severity: 'error' });
      }
    };
    if (canViewReports) fetchActionItems();
  }, [canViewReports]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Check color="success" />;
      case 'in-progress':
        return <PriorityHigh color="warning" />;
      default:
        return <Assignment color="action" />;
    }
  };

  if (!canViewReports) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Unauthorized access
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Action Items</Typography>
          <Chip label={`${actionItems.length} Total`} size="small" />
        </Box>

        <List>
          {actionItems.map((item) => (
            <ListItem key={item.id}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: (theme) => theme.palette.grey[200] }}>
                  {getStatusIcon(item.status)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle1">{item.title}</Typography>}
                secondary={
                  <>
                    <Typography component="span" variant="body2" display="block">
                      Assigned to: {item.assignedTo}
                    </Typography>
                    <Typography component="span" variant="body2" display="block">
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </Typography>
                    {item.source && (
                      <Typography component="span" variant="body2" display="block">
                        Source: {item.source}
                      </Typography>
                    )}
                  </>
                }
              />
              <Chip
                label={item.priority}
                color={getPriorityColor(item.priority)}
                size="small"
                sx={{ ml: 2 }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ActionItems;