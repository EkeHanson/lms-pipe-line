import React from 'react';
import { Paper, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { Star } from '@mui/icons-material';

const StudentGamification = ({ gamification }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Achievements</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Points</Typography>
              <Typography variant="h4">{gamification.points}</Typography>
              <Typography variant="body2">Rank #{gamification.leaderboardRank} on Leaderboard</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Badges</Typography>
              {gamification.badges.map((badge, index) => (
                <Typography key={index} variant="body2"><Star sx={{ verticalAlign: 'middle' }} /> {badge}</Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Button variant="contained" sx={{ mt: 3 }}>View Leaderboard</Button>
    </Paper>
  );
};

export default StudentGamification;