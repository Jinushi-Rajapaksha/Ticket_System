import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
  Paper,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

interface HistoryEntry {
  id: number;
  count: number;
  date: string;
}

interface TicketHistoryProps {
  history: HistoryEntry[];
}

const TicketHistory: React.FC<TicketHistoryProps> = ({ history }) => {
  return (
    <Paper sx={{ p: 2, boxShadow: 3, borderRadius: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Ticket Release History
      </Typography>
      <List>
        {history.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No ticket releases yet.
          </Typography>
        )}
        {history.map((entry) => (
          <React.Fragment key={entry.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <HistoryIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`Released ${entry.count} Tickets`}
                secondary={entry.date}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default TicketHistory;
