import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  Chip
} from '@mui/material';
import {
  AssignmentTurnedIn as CompletedIcon,
  EventAvailable as EventIcon,
  Feedback as FeedbackIcon,
  Gavel as StandardsIcon
} from '@mui/icons-material';

const timelineEvents = [
  {
    date: '2023-05-15',
    title: 'IQA Cycle Started',
    description: 'New internal quality assurance cycle initiated',
    icon: <EventIcon />,
    type: 'event',
    status: 'completed'
  },
  {
    date: '2023-05-20',
    title: 'Trainer Assessments Sampled',
    description: '15 trainer assessments selected for review',
    icon: <StandardsIcon />,
    type: 'assessment',
    status: 'completed'
  },
  {
    date: '2023-05-25',
    title: 'Feedback Provided',
    description: 'Feedback sent to 5 trainers requiring improvement',
    icon: <FeedbackIcon />,
    type: 'feedback',
    status: 'completed'
  },
  {
    date: '2023-06-01',
    title: 'EQA Preparation',
    description: 'Gathering evidence for upcoming external review',
    icon: <StandardsIcon />,
    type: 'preparation',
    status: 'current'
  },
  {
    date: '2023-06-15',
    title: 'EQA Visit Scheduled',
    description: 'External quality assurers visiting on this date',
    icon: <EventIcon />,
    type: 'event',
    status: 'upcoming'
  }
];

function TimelineView() {
  const theme = useTheme();

  const getDotColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'current':
        return 'primary';
      case 'upcoming':
        return 'grey';
      default:
        return 'default';
    }
  };

  const getTypeChip = (type) => {
    let label = '';
    let color = 'default';

    switch (type) {
      case 'event':
        label = 'Event';
        color = 'primary';
        break;
      case 'assessment':
        label = 'Assessment';
        color = 'secondary';
        break;
      case 'feedback':
        label = 'Feedback';
        color = 'info';
        break;
      case 'preparation':
        label = 'Preparation';
        color = 'warning';
        break;
      default:
        label = 'General';
    }

    return <Chip label={label} color={color} size="small" sx={{ ml: 1 }} />;
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1]
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Quality Assurance Timeline
      </Typography>

      <Timeline position="alternate">
        {timelineEvents.map((event, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot color={getDotColor(event.status)}>
                {React.cloneElement(event.icon, { fontSize: 'small' })}
              </TimelineDot>
              {index < timelineEvents.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: theme.palette.grey[100]
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {event.title}
                  </Typography>
                  {getTypeChip(event.type)}
                </Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {event.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
}

export default TimelineView;