// src/pages/VendorDashboard.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import TicketHistory from './ticketHistory';
import TicketIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import StopIcon from '@mui/icons-material/Block';
import SummaryCard from './summaryCard';
import axios from 'axios';

const VendorDashboard: React.FC = () => {
  // State variables
  const [totalTickets, setTotalTickets] = useState<number>(1500);
  const [soldTickets, setSoldTickets] = useState<number>(750);
  const [isAdding, setIsAdding] = useState<boolean>(true);
  const [history, setHistory] = useState<{ id: number; count: number; date: string }[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [ticketCount, setTicketCount] = useState<number>(0);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Handlers for Dialog
  const handleOpenDialog = () => {
    setTicketCount(0);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleReleaseTickets = async () => {
    if (ticketCount <= 0) {
      setSnackbar({ open: true, message: 'Please enter a valid number of tickets.', severity: 'error' });
      return;
    }
  
    try {
      // 1. Start the vendor ticket releasing process on the backend
      const response = await axios.post('http://localhost:5000/api/vendor/start', {
        ticketAmount: ticketCount
      });
  
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: `${ticketCount} tickets release process started successfully!`,
          severity: 'success',
        });
        setIsAdding(true);
        setOpenDialog(false);
  
        // 2. Fetch the updated history from the backend
        try {
          const historyResponse = await axios.get('http://localhost:5000/api/vendor/history');
          if (historyResponse.data.success) {
            setHistory(historyResponse.data.data);
          } else {
            console.error('Failed to fetch updated history:', historyResponse.data.error);
          }
        } catch (historyError: any) {
          console.error('Error fetching updated history:', historyError);
        }
      } else {
        setSnackbar({ open: true, message: 'Failed to start releasing tickets.', severity: 'error' });
      }
    } catch (error: any) {
      console.error('Error starting vendor ticket release:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Failed to start releasing tickets.',
        severity: 'error',
      });
    }
  };
  
  const handleStopTickets = () => {
    setIsAdding(false);
    setSnackbar({ open: true, message: 'Stopped adding new tickets.', severity: 'info' });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Calculate remaining tickets
  const remainingTickets = totalTickets - soldTickets;

  return (
    <Box sx={{ padding: 4, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Welcome Message */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          color: 'primary.main',
          textAlign: 'center',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          mb: 4,
        }}
      >
        Welcome to the Vendor Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={4}>
        {/* Total Tickets */}
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard
            title="Total Tickets"
            value={totalTickets}
            icon={<ConfirmationNumberIcon />}
            color="#1976d2" // MUI primary color
          />
        </Grid>

        {/* Sold Tickets */}
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard
            title="Sold Tickets"
            value={soldTickets}
            icon={<EventBusyIcon />}
            color="#d32f2f" // MUI error color
          />
        </Grid>

        {/* Remaining Tickets */}
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard
            title="Remaining Tickets"
            value={remainingTickets}
            icon={<EventAvailableIcon />}
            color="#388e3c" // MUI success color
          />
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
          startIcon={<TicketIcon />}
        >
          Start Release Tickets
        </Button>
        <Button
              variant="outlined"
              color="warning"
              startIcon={<StopIcon />}
              onClick={handleStopTickets}
              style={{
                backgroundColor: '#db2a41',
                color: '#fff',
            }}
        >
          Stop Release Tickets
        </Button>
      </Box>

      {/* Ticket Release Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Release New Tickets</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Number of Tickets"
            type="number"
            fullWidth
            variant="standard"
            value={ticketCount}
            onChange={(e) => setTicketCount(parseInt(e.target.value, 10))}
            InputProps={{ inputProps: { min: 1 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleReleaseTickets} variant="contained" color="primary">
            Release
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ticket History */}
      <TicketHistory history={history} />

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VendorDashboard;
