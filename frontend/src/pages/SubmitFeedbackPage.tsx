import { Typography, Box } from '@mui/material';
import { FeedbackForm } from '../components/feedback/FeedbackForm';

export const SubmitFeedbackPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Lecture Feedback
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Your feedback helps professors improve their teaching methods and enhance the learning experience.
        Please be honest and constructive in your feedback.
      </Typography>
      <FeedbackForm />
    </Box>
  );
};
