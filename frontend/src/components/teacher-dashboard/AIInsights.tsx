import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  Warning,
  Lightbulb,
  Tag,
} from '@mui/icons-material';
import type { AIAnalysis } from '../../services/teacher-dashboard.service';

interface AIInsightsProps {
  analysis: AIAnalysis;
  timeframe: 'week' | 'month' | 'all';
  onTimeframeChange: (timeframe: 'week' | 'month' | 'all') => void;
}

export const AIInsights = ({
  analysis,
  timeframe,
  onTimeframeChange,
}: AIInsightsProps) => {
  const getSentimentColor = (score: number) => {
    if (score >= 0.7) return 'success';
    if (score >= 0.4) return 'warning';
    return 'error';
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">AI-Powered Insights</Typography>
          <ToggleButtonGroup
            size="small"
            value={timeframe}
            exclusive
            onChange={(_, value) => value && onTimeframeChange(value)}
          >
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
            <ToggleButton value="all">All Time</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Overall Sentiment Score
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ flexGrow: 1, mr: 2 }}>
              <LinearProgress
                variant="determinate"
                value={analysis.sentiment_score * 100}
                color={getSentimentColor(analysis.sentiment_score)}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {(analysis.sentiment_score * 100).toFixed(0)}%
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Key Strengths
          </Typography>
          <List dense>
            {analysis.strengths.map((strength, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <TrendingUp color="success" />
                </ListItemIcon>
                <ListItemText primary={strength} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Areas for Improvement
          </Typography>
          <List dense>
            {analysis.areas_for_improvement.map((area, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Warning color="warning" />
                </ListItemIcon>
                <ListItemText primary={area} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            AI Suggestions
          </Typography>
          <List dense>
            {analysis.suggestions.map((suggestion, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Lightbulb color="primary" />
                </ListItemIcon>
                <ListItemText primary={suggestion} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Frequently Mentioned Keywords
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {analysis.keywords.map((keyword, index) => (
              <Chip
                key={index}
                icon={<Tag />}
                label={`${keyword.word} (${keyword.frequency})`}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
