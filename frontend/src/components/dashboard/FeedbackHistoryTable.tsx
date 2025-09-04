import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Rating,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import type { FeedbackFormData } from '../../services/feedback.service';
import type { FilterParams } from '../../services/feedback.service';
import { FeedbackFilters } from '../feedback/FeedbackFilters';

interface ExtendedFeedbackFormData extends FeedbackFormData {
  id: number;
}

interface FeedbackHistoryTableProps {
  feedbackList: ExtendedFeedbackFormData[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  subjects?: string[];
  onFilterChange?: (filters: FilterParams) => void;
  filters?: FilterParams;
}

export const FeedbackHistoryTable = ({
  feedbackList,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  subjects = [],
  onFilterChange,
  filters,
}: FeedbackHistoryTableProps) => {
  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  const getAverageRating = (feedback: ExtendedFeedbackFormData) => {
    return (
      (feedback.content_rating + feedback.delivery_rating + feedback.engagement_rating) / 3
    );
  };

  return (
    <Box>
      {filters && subjects && onFilterChange && (
        <FeedbackFilters
          filters={filters}
          subjects={subjects}
          onFilterChange={onFilterChange}
        />
      )}
      
      <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="feedback history table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Topic</TableCell>
                <TableCell align="center">Content</TableCell>
                <TableCell align="center">Delivery</TableCell>
                <TableCell align="center">Engagement</TableCell>
                <TableCell align="center">Average</TableCell>
                <TableCell>Submission Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbackList.map((feedback) => (
                <TableRow hover key={feedback.id}>
                  <TableCell>
                    {new Date(feedback.lecture_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{feedback.subject}</TableCell>
                  <TableCell>{feedback.lecture_topic}</TableCell>
                  <TableCell align="center">
                    <Rating
                      value={feedback.content_rating}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Rating
                      value={feedback.delivery_rating}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Rating
                      value={feedback.engagement_rating}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Rating
                      value={getAverageRating(feedback)}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={feedback.is_anonymous ? 'Anonymous' : 'Named'}
                      color={feedback.is_anonymous ? 'default' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
              {feedbackList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No feedback found matching the criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
