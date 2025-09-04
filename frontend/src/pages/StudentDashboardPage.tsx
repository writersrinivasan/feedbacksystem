import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboard.service';

export const StudentDashboardPage = () => {
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['studentStats'],
    queryFn: () => dashboardService.getStudentStats(),
  });

  if (isStatsLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Student Dashboard
      </Typography>
      
      <Box display="flex" flexDirection="column" gap={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Feedback Given
            </Typography>
            <Typography variant="h3" color="primary">
              {stats?.total_feedback || 0}
            </Typography>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Feedback
            </Typography>
            {stats?.recent_feedback?.length > 0 ? (
              stats.recent_feedback.map((feedback: any, index: number) => (
                <Box key={index} mb={2} p={2} bgcolor="grey.50" borderRadius={1}>
                  <Typography variant="subtitle2">
                    Subject: {feedback.subject}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feedback.comments}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No feedback submitted yet. Start by submitting your first feedback!
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
