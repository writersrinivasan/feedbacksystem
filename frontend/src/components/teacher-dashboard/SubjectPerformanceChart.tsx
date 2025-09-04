import {
  Card,
  CardContent,
  Typography,
  Grid,
  Rating,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import type { SubjectPerformance } from '../../services/teacher-dashboard.service';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SubjectPerformanceChartProps {
  subjects: SubjectPerformance[];
}

export const SubjectPerformanceChart = ({ subjects }: SubjectPerformanceChartProps) => {
  const chartData = subjects.map((subject) => ({
    name: subject.subject,
    Content: subject.average_ratings.content,
    Delivery: subject.average_ratings.delivery,
    Engagement: subject.average_ratings.engagement,
  }));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Subject-wise Performance
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Content" fill="#8884d8" />
                  <Bar dataKey="Delivery" fill="#82ca9d" />
                  <Bar dataKey="Engagement" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell align="center">Content</TableCell>
                    <TableCell align="center">Delivery</TableCell>
                    <TableCell align="center">Engagement</TableCell>
                    <TableCell align="right">Total Feedback</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subjects.map((subject) => (
                    <TableRow key={subject.subject}>
                      <TableCell component="th" scope="row">
                        {subject.subject}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Rating
                            value={subject.average_ratings.content}
                            precision={0.1}
                            readOnly
                            size="small"
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Rating
                            value={subject.average_ratings.delivery}
                            precision={0.1}
                            readOnly
                            size="small"
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Rating
                            value={subject.average_ratings.engagement}
                            precision={0.1}
                            readOnly
                            size="small"
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="right">{subject.total_feedback}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
