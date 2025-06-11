import React from 'react';
import {
  Box, Paper, Typography, Grid, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, FormControl, InputLabel, Select, FormControlLabel, Checkbox
} from '@mui/material';

const QuestionForm = ({ question, index, readOnly = false }) => {
  const questionTypes = [
    { value: 'mcq', label: 'Multiple Choice' },
    { value: 'true_false', label: 'True/False' },
    { value: 'short_answer', label: 'Short Answer' },
    { value: 'essay', label: 'Essay' },
    { value: 'matching', label: 'Matching' },
    { value: 'fill_blank', label: 'Fill in the Blank' },
  ];

  return (
    <Paper sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Question {index + 1}</Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Question Text"
            value={question.text}
            multiline
            rows={3}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Question Type</InputLabel>
            <Select
              value={question.question_type}
              label="Question Type"
              readOnly
            >
              {questionTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Points"
            type="number"
            value={question.points}
            inputProps={{ readOnly: true }}
          />
        </Grid>
        {question.explanation && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Explanation"
              value={question.explanation}
              multiline
              rows={2}
              InputProps={{ readOnly: true }}
            />
          </Grid>
        )}
        {(question.question_type === 'mcq' || question.question_type === 'true_false') && (
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>Options</Typography>
            {question.options.map((option, optIndex) => (
              <Box key={optIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  fullWidth
                  label={`Option ${optIndex + 1}`}
                  value={option.text}
                  sx={{ mr: 2 }}
                  InputProps={{ readOnly: true }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={option.is_correct}
                      disabled
                    />
                  }
                  label="Correct"
                />
              </Box>
            ))}
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

const RubricForm = ({ rubric, index, readOnly = false }) => {
  return (
    <Paper sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Rubric Criterion {index + 1}</Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Criterion"
            value={rubric.criterion}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Weight (%)"
            type="number"
            value={rubric.weight}
            inputProps={{ readOnly: true }}
          />
        </Grid>
        {rubric.description && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={rubric.description}
              multiline
              rows={2}
              InputProps={{ readOnly: true }}
            />
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

const AssessmentQuestionList = ({ questions, rubrics, assessmentType }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Questions</Typography>
      {questions.length > 0 ? (
        questions.map((question, index) => (
          <QuestionForm
            key={question.id || index}
            question={question}
            index={index}
            readOnly
          />
        ))
      ) : (
        <Typography color="text.secondary">No questions added.</Typography>
      )}

      {(assessmentType === 'assignment' || assessmentType === 'peer_assessment') && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>Rubrics</Typography>
          {rubrics.length > 0 ? (
            rubrics.map((rubric, index) => (
              <RubricForm
                key={rubric.id || index}
                rubric={rubric}
                index={index}
                readOnly
              />
            ))
          ) : (
            <Typography color="text.secondary">No rubrics added.</Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default AssessmentQuestionList;