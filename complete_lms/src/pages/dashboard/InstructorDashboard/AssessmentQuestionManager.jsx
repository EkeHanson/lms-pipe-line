import React, { useState, useEffect } from 'react';
import {
  Box, Paper, TextField, MenuItem, Button, IconButton,
  FormControl, InputLabel, Select, FormControlLabel, Checkbox,
  Typography, Grid, Divider, Snackbar, Alert
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { assessmentAPI } from '../../../config';

const AssessmentQuestionManager = ({ 
  assessmentId,
  assessmentType,
  initialQuestions = [],
  initialRubrics = [],
  onSave,
  onPublish
}) => {
  // State management
  const [questions, setQuestions] = useState(initialQuestions);
  const [rubrics, setRubrics] = useState(initialRubrics);
  const [validationErrors, setValidationErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState({
    loading: false,
    error: null,
    success: false
  });
  const queryClient = useQueryClient();

  // Verify assessmentId exists
  useEffect(() => {
    if (!assessmentId) {
      console.error("Assessment ID is required");
      setSaveStatus(prev => ({ ...prev, error: "Assessment ID is missing" }));
    }
  }, [assessmentId]);

  // API mutations
  const updateQuestionMutation = useMutation({
    mutationFn: ({ questionId, data }) => {
      if (!assessmentId) throw new Error("Assessment ID is required");
      return assessmentAPI.updateQuestion(assessmentId, questionId, data);
    },
    onError: (error) => {
      setSaveStatus({ loading: false, error: error.message, success: false });
    }
  });

  const createQuestionMutation = useMutation({
    mutationFn: (data) => {
      if (!assessmentId) throw new Error("Assessment ID is required");
      return assessmentAPI.createQuestion(assessmentId, data);
    },
    onError: (error) => {
      setSaveStatus({ loading: false, error: error.message, success: false });
    }
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (questionId) => {
      if (!assessmentId) throw new Error("Assessment ID is required");
      return assessmentAPI.deleteQuestion(assessmentId, questionId);
    }
  });

  // Question management functions
  const addQuestion = () => {
    const newQuestion = {
      question_type: assessmentType === 'quiz' ? 'mcq' : 'essay',
      text: '',
      points: 1,
      explanation: '',
      options: assessmentType === 'quiz' ? [
        { text: '', is_correct: false, order: 0 },
        { text: '', is_correct: false, order: 1 }
      ] : []
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const updateQuestion = (index, updatedQuestion) => {
    setQuestions(prev => prev.map((q, i) => (i === index ? updatedQuestion : q)));
    clearValidationErrors(`question_${index}`);
  };

  const deleteQuestion = async (index) => {
    const questionToDelete = questions[index];
    if (questionToDelete?.id) {
      await deleteQuestionMutation.mutateAsync(questionToDelete.id);
    }
    setQuestions(prev => prev.filter((_, i) => i !== index));
    clearValidationErrors(`question_${index}`);
  };

  // Validation functions
  const clearValidationErrors = (prefix) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(prev).forEach(key => {
        if (key.startsWith(prefix)) delete newErrors[key];
      });
      return newErrors;
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (questions.length === 0) {
      newErrors.questions = "At least one question is required";
    }

    questions.forEach((question, index) => {
      if (!question.text.trim()) {
        newErrors[`question_${index}_text`] = "Question text is required";
      }
      // Add more validations as needed
    });

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save operations
  const saveQuestions = async () => {
    if (!assessmentId) {
      setSaveStatus({ loading: false, error: "Assessment ID is required", success: false });
      return;
    }

    if (!validateForm()) {
      setSaveStatus({ loading: false, error: "Please fix validation errors", success: false });
      return;
    }

    setSaveStatus({ loading: true, error: null, success: false });

    try {
      // Process all questions
      const savedQuestions = await Promise.all(
        questions.map(async (question) => {
          if (question.id) {
            await updateQuestionMutation.mutateAsync({
              questionId: question.id,
              data: question
            });
            return question;
          } else {
            const response = await createQuestionMutation.mutateAsync(question);
            return response.data;
          }
        })
      );

      setQuestions(savedQuestions);
      setSaveStatus({ loading: false, error: null, success: true });
      onSave?.();
    } catch (error) {
      setSaveStatus({ loading: false, error: error.message, success: false });
    }
  };

  const handlePublish = async () => {
    await saveQuestions();
    if (saveStatus.success) {
      onPublish?.();
    }
  };

  // UI rendering
  return (
    <Box>
      {/* Status notifications */}
      <Snackbar open={!!saveStatus.error} autoHideDuration={6000} onClose={() => setSaveStatus(prev => ({ ...prev, error: null }))}>
        <Alert severity="error">{saveStatus.error}</Alert>
      </Snackbar>

      <Snackbar open={saveStatus.success} autoHideDuration={3000} onClose={() => setSaveStatus(prev => ({ ...prev, success: false }))}>
        <Alert severity="success">Questions saved successfully!</Alert>
      </Snackbar>

      {/* Questions section */}
      <Typography variant="h6" gutterBottom>Questions</Typography>
      {questions.map((question, index) => (
        <QuestionForm
          key={index}
          question={question}
          index={index}
          onUpdate={updateQuestion}
          onDelete={deleteQuestion}
          assessmentType={assessmentType}
          errors={validationErrors}
        />
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={addQuestion}
        sx={{ mt: 2 }}
        disabled={saveStatus.loading || !assessmentId}
      >
        Add Question
      </Button>

      {validationErrors.questions && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
          {validationErrors.questions}
        </Typography>
      )}

      {/* Save buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={saveQuestions}
          disabled={saveStatus.loading || !assessmentId}
        >
          {saveStatus.loading ? 'Saving...' : 'Save Draft'}
        </Button>
        <Button
          variant="contained"
          onClick={handlePublish}
          disabled={saveStatus.loading || !assessmentId}
        >
          {saveStatus.loading ? 'Publishing...' : 'Publish'}
        </Button>
      </Box>
    </Box>
  );
};

const QuestionForm = ({ question, index, onUpdate, onDelete, assessmentType, errors = {} }) => {
  const handleQuestionChange = (field, value) => {
    onUpdate(index, { ...question, [field]: value });
  };

  const handleOptionChange = (optionIndex, field, value) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value };
    onUpdate(index, { ...question, options: newOptions });
  };

  const addOption = () => {
    onUpdate(index, {
      ...question,
      options: [...question.options, { text: '', is_correct: false, order: question.options.length }],
    });
  };

  const removeOption = (optionIndex) => {
    const newOptions = question.options.filter((_, i) => i !== optionIndex).map((opt, i) => ({
      ...opt,
      order: i,
    }));
    onUpdate(index, { ...question, options: newOptions });
  };

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1">Question {index + 1}</Typography>
        <IconButton onClick={() => onDelete(index)} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Question Text"
            value={question.text}
            onChange={(e) => handleQuestionChange('text', e.target.value)}
            multiline
            rows={3}
            required
            error={!!errors[`question_${index}_text`]}
            helperText={errors[`question_${index}_text`]}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth error={!!errors[`question_${index}_type`]}>
            <InputLabel>Question Type</InputLabel>
            <Select
              value={question.question_type}
              onChange={(e) => {
                const newType = e.target.value;
                let newOptions = question.options;
                if (newType === 'true_false') {
                  newOptions = [
                    { text: 'True', is_correct: false, order: 0 },
                    { text: 'False', is_correct: false, order: 1 },
                  ];
                } else if (newType !== 'mcq' && newType !== 'true_false') {
                  newOptions = [];
                }
                handleQuestionChange('question_type', newType);
                handleQuestionChange('options', newOptions);
              }}
              label="Question Type"
              disabled={assessmentType === 'assignment' || assessmentType === 'peer_assessment'}
            >
              {questionTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            {errors[`question_${index}_type`] && (
              <Typography color="error" variant="caption">
                {errors[`question_${index}_type`]}
              </Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Points"
            type="number"
            value={question.points}
            onChange={(e) => handleQuestionChange('points', parseInt(e.target.value) || 1)}
            inputProps={{ min: 1 }}
            required
            error={!!errors[`question_${index}_points`]}
            helperText={errors[`question_${index}_points`]}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Explanation (Optional)"
            value={question.explanation}
            onChange={(e) => handleQuestionChange('explanation', e.target.value)}
            multiline
            rows={2}
          />
        </Grid>
        {(question.question_type === 'mcq' || question.question_type === 'true_false') && (
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>Options</Typography>
            {errors[`question_${index}_options`] && (
              <Typography color="error" variant="caption" sx={{ mb: 1, display: 'block' }}>
                {errors[`question_${index}_options`]}
              </Typography>
            )}
            {errors[`question_${index}_correct`] && (
              <Typography color="error" variant="caption" sx={{ mb: 1, display: 'block' }}>
                {errors[`question_${index}_correct`]}
              </Typography>
            )}
            {question.options.map((option, optIndex) => (
              <Box key={optIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  fullWidth
                  label={`Option ${optIndex + 1}`}
                  value={option.text}
                  onChange={(e) => handleOptionChange(optIndex, 'text', e.target.value)}
                  sx={{ mr: 2 }}
                  required
                  error={!!errors[`question_${index}_option_${optIndex}`]}
                  helperText={errors[`question_${index}_option_${optIndex}`]}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={option.is_correct}
                      onChange={(e) => handleOptionChange(optIndex, 'is_correct', e.target.checked)}
                    />
                  }
                  label="Correct"
                />
                <IconButton
                  onClick={() => removeOption(optIndex)}
                  disabled={question.options.length <= (question.question_type === 'true_false' ? 2 : 2)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            {question.question_type !== 'true_false' && (
              <Button startIcon={<AddIcon />} onClick={addOption}>
                Add Option
              </Button>
            )}
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

const RubricForm = ({ rubric, index, onUpdate, onDelete, errors = {} }) => {
  const handleRubricChange = (field, value) => {
    onUpdate(index, { ...rubric, [field]: value, order: index });
  };

  return (
    <Paper sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1">Rubric Criterion {index + 1}</Typography>
        <IconButton onClick={() => onDelete(index)} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Criterion"
            value={rubric.criterion}
            onChange={(e) => handleRubricChange('criterion', e.target.value)}
            required
            error={!!errors[`rubric_${index}_criterion`]}
            helperText={errors[`rubric_${index}_criterion`]}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Weight (%)"
            type="number"
            value={rubric.weight}
            onChange={(e) => handleRubricChange('weight', parseInt(e.target.value) || 100)}
            inputProps={{ min: 1, max: 100 }}
            required
            error={!!errors[`rubric_${index}_weight`]}
            helperText={errors[`rubric_${index}_weight`]}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description (Optional)"
            value={rubric.description}
            onChange={(e) => handleRubricChange('description', e.target.value)}
            multiline
            rows={2}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
AssessmentQuestionManager.propTypes = {
    assessmentId: PropTypes.string.isRequired,
    assessmentType: PropTypes.string.isRequired,
    initialQuestions: PropTypes.array,
    initialRubrics: PropTypes.array,
    onSave: PropTypes.func,
    onPublish: PropTypes.func
  };
  
  export default AssessmentQuestionManager;