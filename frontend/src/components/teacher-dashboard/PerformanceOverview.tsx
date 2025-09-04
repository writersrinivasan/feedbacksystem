import { Card, CardContent, Typography, Grid, Rating, Box } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { TeacherStats } from '../../services/teacher-dashboard.service';

interface PerformanceOverviewProps {
  stats: TeacherStats;
}

export const PerformanceOverview = ({ stats }: PerformanceOverviewProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Performance Overview
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Overall Rating
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating
                  value={stats.average_ratings.overall}
                  precision={0.1}
                  readOnly
                />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {stats.average_ratings.overall.toFixed(1)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Content Quality
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating
                  value={stats.average_ratings.content}
                  precision={0.1}
                  readOnly
                />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {stats.average_ratings.content.toFixed(1)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Delivery Effectiveness
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating
                  value={stats.average_ratings.delivery}
                  precision={0.1}
                  readOnly
                />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {stats.average_ratings.delivery.toFixed(1)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Student Engagement
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating
                  value={stats.average_ratings.engagement}
                  precision={0.1}
                  readOnly
                />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {stats.average_ratings.engagement.toFixed(1)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Rating Trends
            </Typography>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart
                  data={stats.feedback_trends}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis domain={[0, 5]} />
                  <Tooltip
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    formatter={(value: number) => [value.toFixed(2), 'Rating']}
                  />
                  <Line
                    type="monotone"
                    dataKey="average_rating"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Total Feedback Received: {stats.total_feedback_received}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Subjects Taught: {stats.subjects_taught.join(', ')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
