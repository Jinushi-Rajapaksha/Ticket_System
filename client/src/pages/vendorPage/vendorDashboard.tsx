// src/pages/VendorDashboard.tsx
import React, { useState, useEffect, useContext } from 'react';
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
  IconButton,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import TicketIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import StopIcon from '@mui/icons-material/Block';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import TicketHistory from './ticketHistory';
import SummaryCard from './summaryCard';

// If you have an AuthContext that provides signOut:
import { AuthContext } from '../../context/authContext';

const VendorDashboard: React.FC = () => {
  const [maximumTicketCapacity, setMaximumTicketCapacity] = useState<number>(1500);
  const [soldTickets, setSoldTickets] = useState<number>(750);
  const [isAdding, setIsAdding] = useState<boolean>(true);
  const [history, setHistory] = useState<{ id: number; count: number; date: string }[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [ticketCount, setTicketCount] = useState<number>(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info'
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        // Fetch configuration
        const configResponse = await axios.get('http://localhost:5000/api/configuration/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (configResponse.data.success && configResponse.data.data) {
          const configData = configResponse.data.data;
          setMaximumTicketCapacity(configData.maxTicketCapacity);
        } else {
          console.error('Failed to fetch configuration:', configResponse.data.error);
        }

        // Fetch ticket pool status for soldTickets
        const statusResponse = await axios.get('http://localhost:5000/api/ticketPool/status', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (statusResponse.data.success && statusResponse.data.data) {
          setSoldTickets(statusResponse.data.data.soldTickets);
        } else {
          console.error('Failed to fetch ticket pool status:', statusResponse.data.error);
        }
      } catch (error: any) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchData();
  }, []);

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
      const token = localStorage.getItem('authToken');

      // Start the vendor ticket releasing process
      const response = await axios.post('http://localhost:5000/api/vendor/start',
        { ticketAmount: ticketCount },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: `${ticketCount} tickets release process started successfully!`,
          severity: 'success',
        });
        setIsAdding(true);
        setOpenDialog(false);

        // Fetch updated history
        try {
          const historyToken = localStorage.getItem('authToken');
          const historyResponse = await axios.get('http://localhost:5000/api/vendor/history', {
            headers: {
              Authorization: `Bearer ${historyToken}`
            }
          });

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

  const handleStopTickets = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const stopResponse = await axios.post('http://localhost:5000/api/vendor/stop', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (stopResponse.data.success) {
        setIsAdding(false);
        setSnackbar({ open: true, message: 'Stopped adding new tickets.', severity: 'info' });
      } else {
        setSnackbar({ open: true, message: 'Failed to stop releasing tickets.', severity: 'error' });
      }
    } catch (error: any) {
      console.error('Error stopping vendor ticket release:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Failed to stop releasing tickets.',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSignOut = () => {
    signOut();
    navigate('/'); // Redirect to home after sign-out
  };

  // Calculate available tickets
  const availableTickets = maximumTicketCapacity - soldTickets;

  return (
    <Box sx={{ padding: 4, minHeight: '100vh', backgroundColor: '#f5f5f5', position: 'relative' }}>
      {/* Logout Icon Button at the top-right corner */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <IconButton
          onClick={handleSignOut}
          color="primary"
          aria-label="logout"
        >
          <LogoutIcon />
        </IconButton>
      </Box>

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
        {/* Maximum Ticket Capacity */}
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard
            title="Maximum Ticket Capacity"
            value={maximumTicketCapacity}
            icon={<ConfirmationNumberIcon />}
            color="#1976d2"
          />
        </Grid>

        {/* Sold Tickets */}
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard
            title="Sold Tickets"
            value={soldTickets}
            icon={<EventBusyIcon />}
            color="#d32f2f"
          />
        </Grid>

        {/* Available Tickets */}
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard
            title="Available Tickets"
            value={availableTickets}
            icon={<EventAvailableIcon />}
            color="#388e3c"
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
