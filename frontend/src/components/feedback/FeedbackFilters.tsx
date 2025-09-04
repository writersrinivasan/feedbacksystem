import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import type { FilterParams as ServiceFilterParams } from '../../services/feedback.service';

export type FilterParams = Required<Omit<ServiceFilterParams, 'page' | 'limit'>>;

interface FeedbackFiltersProps {
  filters: FilterParams;
  subjects: string[];
  onFilterChange: (filters: FilterParams) => void;
}

export const FeedbackFilters = ({
  filters,
  subjects,
  onFilterChange,
}: FeedbackFiltersProps) => {
  const handleChange = (field: keyof FilterParams, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      subject: '',
      dateFrom: null,
      dateTo: null,
      ratingMin: '',
      sortBy: 'date',
    });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Search"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: filters.search && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleChange('search', '')}
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Subject</InputLabel>
            <Select
              value={filters.subject}
              label="Subject"
              onChange={(e: SelectChangeEvent<string>) =>
                handleChange('subject', e.target.value)
              }
            >
              <MenuItem value="">All Subjects</MenuItem>
              {subjects.map((subject) => (
                <MenuItem key={subject} value={subject}>
                  {subject}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <DatePicker
                  label="From Date"
                  value={filters.dateFrom}
                  onChange={(date) => handleChange('dateFrom', date)}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="To Date"
                  value={filters.dateTo}
                  onChange={(date) => handleChange('dateTo', date)}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Minimum Rating</InputLabel>
            <Select
              value={filters.ratingMin}
              label="Minimum Rating"
              onChange={(e) => handleChange('ratingMin', e.target.value)}
            >
              <MenuItem value="">Any Rating</MenuItem>
              {[5, 4, 3, 2, 1].map((rating) => (
                <MenuItem key={rating} value={rating}>
                  {rating}★ & Above
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={1}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sort By"
              onChange={(e) => handleChange('sortBy', e.target.value)}
            >
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="subject">Subject</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {(filters.search ||
        filters.subject ||
        filters.dateFrom ||
        filters.dateTo ||
        filters.ratingMin ||
        filters.sortBy !== 'date') && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {filters.search && (
            <Chip
              label={`Search: ${filters.search}`}
              onDelete={() => handleChange('search', '')}
            />
          )}
          {filters.subject && (
            <Chip
              label={`Subject: ${filters.subject}`}
              onDelete={() => handleChange('subject', '')}
            />
          )}
          {filters.dateFrom && (
            <Chip
              label={`From: ${filters.dateFrom.toLocaleDateString()}`}
              onDelete={() => handleChange('dateFrom', null)}
            />
          )}
          {filters.dateTo && (
            <Chip
              label={`To: ${filters.dateTo.toLocaleDateString()}`}
              onDelete={() => handleChange('dateTo', null)}
            />
          )}
          {filters.ratingMin && (
            <Chip
              label={`${filters.ratingMin}★ & Above`}
              onDelete={() => handleChange('ratingMin', '')}
            />
          )}
          {filters.sortBy !== 'date' && (
            <Chip
              label={`Sort by: ${filters.sortBy}`}
              onDelete={() => handleChange('sortBy', 'date')}
            />
          )}
          <Chip label="Clear All" onDelete={clearFilters} color="primary" />
        </Box>
      )}
    </Box>
  );
};
