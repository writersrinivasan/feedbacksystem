import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Rating,
  FormControlLabel,
  Switch,
  MenuItem,
  Typography,
  Alert,
  Grid,
  Paper,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useQuery, useMutation } from '@tanstack/react-query';
import { feedbackService, FeedbackFormData } from '../../services/feedback.service';

export const FeedbackForm = () => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    teacher_id: 0,
    subject: '',
    lecture_topic: '',
    lecture_date: new Date().toISOString().split('T')[0],
    content_rating: 0,
    delivery_rating: 0,
    engagement_rating: 0,
    comments: '',
    is_anonymous: false,
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => feedbackService.getTeachers(),
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => feedbackService.getSubjects(),
  });

  const submitMutation = useMutation({
    mutationFn: (data: FeedbackFormData) => feedbackService.submitFeedback(data),
    onSuccess: () => {
      setSubmitSuccess(true);
      setSubmitError('');
      // Reset form
      setFormData({
        teacher_id: 0,
        subject: '',
        lecture_topic: '',
        lecture_date: new Date().toISOString().split('T')[0],
        content_rating: 0,
        delivery_rating: 0,
        engagement_rating: 0,
        comments: '',
        is_anonymous: false,
      });
    },
    onError: (error: any) => {
      setSubmitError(error.response?.data?.detail || 'Failed to submit feedback');
      setSubmitSuccess(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const handleChange = (field: keyof FeedbackFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Submit Feedback
      </Typography>
      
      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Feedback submitted successfully!
        </Alert>
      )}
      
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              required
              fullWidth
              label="Teacher"
              value={formData.teacher_id}
              onChange={handleChange('teacher_id')}
            >
              {teachers.map((teacher: any) => (
                <MenuItem key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              required
              fullWidth
              label="Subject"
              value={formData.subject}
              onChange={handleChange('subject')}
            >
              {subjects.map((subject: string) => (
                <MenuItem key={subject} value={subject}>
                  {subject}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Lecture Topic"
              value={formData.lecture_topic}
              onChange={handleChange('lecture_topic')}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Lecture Date"
                value={new Date(formData.lecture_date)}
                onChange={(newValue) => {
                  if (newValue) {
                    setFormData((prev) => ({
                      ...prev,
                      lecture_date: newValue.toISOString().split('T')[0],
                    }));
                  }
                }}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <Typography component="legend">Content Quality</Typography>
            <Rating
              name="content_rating"
              value={formData.content_rating}
              onChange={(_, value) => {
                setFormData((prev) => ({
                  ...prev,
                  content_rating: value || 0,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography component="legend">Delivery Effectiveness</Typography>
            <Rating
              name="delivery_rating"
              value={formData.delivery_rating}
              onChange={(_, value) => {
                setFormData((prev) => ({
                  ...prev,
                  delivery_rating: value || 0,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography component="legend">Student Engagement</Typography>
            <Rating
              name="engagement_rating"
              value={formData.engagement_rating}
              onChange={(_, value) => {
                setFormData((prev) => ({
                  ...prev,
                  engagement_rating: value || 0,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Comments and Suggestions"
              value={formData.comments}
              onChange={handleChange('comments')}
              placeholder="Please provide detailed feedback about the lecture..."
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_anonymous}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_anonymous: e.target.checked,
                    }))
                  }
                />
              }
              label="Submit Anonymously"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitMutation.isLoading}
            >
              {submitMutation.isLoading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
