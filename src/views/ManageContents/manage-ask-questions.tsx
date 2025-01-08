'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Stack,
  IconButton,
  Grid,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import GetPaperComponent from 'components/dashboard/CreatePaperComponents/getPaperComponent';

interface FormField {
  id: string;
  value: string;
  error: boolean;
  helperText: string;
}

interface Paper {
  _id: string;
  displayName: string;
}

const ManageAskQuestions: React.FC = () => {
  const [fields, setFields] = useState<FormField[]>([
    { id: 'Si', value: '', error: false, helperText: '' },
    { id: 'Prompt', value: '', error: false, helperText: '' },
    { id: 'Sp', value: '', error: false, helperText: '' },
    { id: 'Model', value: '', error: false, helperText: '' }
  ]);

  const [additionalFields, setAdditionalFields] = useState<FormField[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [formError, setFormError] = useState<string>('');

  const validateField = (value: string, fieldId: string): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: `${fieldId} is required` };
    }

    // Add specific validation rules for different fields
    switch (fieldId) {
      case 'Si':
        if (value.length < 3) {
          return { isValid: false, message: 'Si must be at least 3 characters' };
        }
        break;
      case 'Model':
        if (value.length < 3) {
          return { isValid: false, message: 'Please enter a valid model name' };
        }
        break;
      case 'Prompt':
        if (value.length < 10) {
          return { isValid: false, message: 'Prompt must be at least 10 characters' };
        }
        break;
    }

    return { isValid: true, message: '' };
  };

  const handleFieldChange = (id: string, newValue: string) => {
    const validation = validateField(newValue, id);
    setFields(fields.map(field =>
      field.id === id ? {
        ...field,
        value: newValue,
        error: !validation.isValid,
        helperText: validation.message
      } : field
    ));
  };

  const handleAdditionalFieldChange = (index: number, newValue: string) => {
    const validation = validateField(newValue, `Additional Field ${index + 1}`);
    setAdditionalFields(additionalFields.map((field, i) =>
      i === index ? {
        ...field,
        value: newValue,
        error: !validation.isValid,
        helperText: validation.message
      } : field
    ));
  };

  const handlePaperChange = (paper: Paper | null) => {
    setSelectedPaper(paper);
    setFormError('');
  };

  const addNewField = () => {
    setAdditionalFields([
      ...additionalFields,
      { id: `additional-${additionalFields.length}`, value: '', error: false, helperText: '' }
    ]);
  };

  const removeAdditionalField = (index: number) => {
    setAdditionalFields(additionalFields.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validate paper selection
    if (!selectedPaper) {
      setFormError('Please select a paper');
      return false;
    }

    // Validate main fields
    const updatedFields = fields.map(field => {
      const validation = validateField(field.value, field.id);
      if (!validation.isValid) isValid = false;
      return {
        ...field,
        error: !validation.isValid,
        helperText: validation.message
      };
    });
    setFields(updatedFields);

    // Validate additional fields
    const updatedAdditionalFields = additionalFields.map(field => {
      const validation = validateField(field.value, field.id);
      if (!validation.isValid) isValid = false;
      return {
        ...field,
        error: !validation.isValid,
        helperText: validation.message
      };
    });
    setAdditionalFields(updatedAdditionalFields);

    return isValid;
  };

  const handleSubmit = () => {
    setFormError('');
    
    if (validateForm()) {
      // Proceed with submission
      console.log('Submit', {
        fields,
        additionalFields,
        selectedPaper
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <GetPaperComponent
        onPaperChange={handlePaperChange}
        selectedPaper={selectedPaper}
      />
      
      {formError && (
        <Alert severity="error" sx={{ mt: 1, mb: 1 }}>
          {formError}
        </Alert>
      )}

      <Stack spacing={2}>
        {fields.map((field) => (
          <TextField
            key={field.id}
            fullWidth
            label={field.id}
            value={field.value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            variant="outlined"
            error={field.error}
            helperText={field.helperText}
            required
          />
        ))}

        {additionalFields.map((field, index) => (
          <Box key={field.id} sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              label={`Additional Token ${index + 1}`}
              value={field.value}
              onChange={(e) => handleAdditionalFieldChange(index, e.target.value)}
              variant="outlined"
              error={field.error}
              helperText={field.helperText}
              required
            />
            <IconButton
              onClick={() => removeAdditionalField(index)}
              color="error"
              sx={{ mt: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        <Grid container justifyContent="center" spacing={2} sx={{ mt: 2 }}>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addNewField}
            >
              Add Token
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
};

export default ManageAskQuestions;