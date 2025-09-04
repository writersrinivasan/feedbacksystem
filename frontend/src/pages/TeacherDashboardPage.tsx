import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { teacherDashboardService } from '../../services/teacher-dashboard.service';

export const TeacherDashboardPage = () => {
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['teacherStats'],
    queryFn: () => teacherDashboardService.getTeacherStats(),
  });

  const { data: analysis, isLoading: isAnalysisLoading } = useQuery({
    queryKey: ['feedbackAnalysis'],
    queryFn: () => teacherDashboardService.getFeedbackAnalysis(),
  });

  if (isStatsLoading || isAnalysisLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Teacher Dashboard
      </Typography>
      
      <Box display="flex" flexDirection="column" gap={3}>
        <Box display="flex" gap={2}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Feedback Received
              </Typography>
              <Typography variant="h3" color="primary">
                {stats?.total_feedback || 0}
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Rating
              </Typography>
              <Typography variant="h3" color="secondary">
                {stats?.average_rating?.toFixed(1) || '0.0'}/5
              </Typography>
            </CardContent>
          </Card>
        </Box>
        
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
                  <Typography variant="caption" color="primary">
                    Rating: {feedback.content_rating}/5
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No feedback received yet.
              </Typography>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Common Themes
            </Typography>
            {analysis?.common_themes?.length > 0 ? (
              analysis.common_themes.map((theme: string, index: number) => (
                <Typography key={index} variant="body2" component="li">
                  {theme}
                </Typography>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No themes analyzed yet.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
