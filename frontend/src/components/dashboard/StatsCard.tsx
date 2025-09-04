import { Card, CardContent, Typography, Grid } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface StatsCardProps {
  stats: {
    total_feedback_given: number;
    subjects_covered: string[];
    feedback_by_subject: {
      subject: string;
      count: number;
    }[];
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const StatsCard = ({ stats }: StatsCardProps) => {
  const pieData = stats.feedback_by_subject.map((item) => ({
    name: item.subject,
    value: item.count,
  }));

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Total Feedback Given: {stats.total_feedback_given}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Subjects Covered: {stats.subjects_covered.length}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Feedback Distribution by Subject
            </Typography>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
