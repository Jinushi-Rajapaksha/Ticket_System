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
  CircularProgress,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import TicketIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import StopIcon from '@mui/icons-material/Block';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh'; // Import Refresh Icon
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import TicketHistory from './ticketHistory';
import SummaryCard from './summaryCard';

// If you have an AuthContext that provides signOut:
import { AuthContext } from '../../context/authContext';

// Define TypeScript interfaces for API responses
interface ConfigurationResponse {
  success: boolean;
  data: {
    maxTicketCapacity: number;
    // ... other configuration fields
  };
  error?: string;
}

interface TicketPoolStatusResponse {
  success: boolean;
  data: {
    soldTickets: number;
    availableTickets: number;
  };
  error?: string;
}

interface HistoryItem {
  id: number;
  count: number;
  date: string;
}

interface VendorHistoryResponse {
  success: boolean;
  data: HistoryItem[];
  error?: string;
}

const VendorDashboard: React.FC = () => {
  // State Variables
  const [maximumTicketCapacity, setMaximumTicketCapacity] = useState<number>(1500);
  const [soldTickets, setSoldTickets] = useState<number>(750);
  const [availableTickets, setAvailableTickets] = useState<number>(0);
  const [isAdding, setIsAdding] = useState<boolean>(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [ticketCount, setTicketCount] = useState<number>(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [isFetching, setIsFetching] = useState<boolean>(false); // Loading state for data fetching

  // Context and Navigation
  const { signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  // Refactored fetchData to include fetching history
  const fetchData = async () => {
    setIsFetching(true); // Start loading
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('Authentication token not found. Please sign in again.');
      }

      // Fetch configuration
      const configResponse = await axios.get<ConfigurationResponse>('http://localhost:5000/api/configuration/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (configResponse.data.success && configResponse.data.data) {
        const configData = configResponse.data.data;
        setMaximumTicketCapacity(configData.maxTicketCapacity);
      } else {
        console.error('Failed to fetch configuration:', configResponse.data.error);
        setSnackbar({
          open: true,
          message: `Configuration Error: ${configResponse.data.error || 'Unknown error'}`,
          severity: 'error',
        });
      }

      // Fetch ticket pool status for soldTickets and availableTickets
      const statusResponse = await axios.get<TicketPoolStatusResponse>('http://localhost:5000/api/ticketPool/status', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (statusResponse.data.success && statusResponse.data.data) {
        setSoldTickets(statusResponse.data.data.soldTickets);
        setAvailableTickets(statusResponse.data.data.availableTickets); // Set availableTickets from API
      } else {
        console.error('Failed to fetch ticket pool status:', statusResponse.data.error);
        setSnackbar({
          open: true,
          message: `Ticket Pool Status Error: ${statusResponse.data.error || 'Unknown error'}`,
          severity: 'error',
        });
      }

      // Fetch ticket release history
      const historyResponse = await axios.get<VendorHistoryResponse>('http://localhost:5000/api/vendor/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (historyResponse.data.success && historyResponse.data.data) {
        setHistory(historyResponse.data.data);
      } else {
        console.error('Failed to fetch ticket history:', historyResponse.data.error);
        setSnackbar({
          open: true,
          message: `History Error: ${historyResponse.data.error || 'Unknown error'}`,
          severity: 'error',
        });
      }
    } catch (error: any) {
      console.error('Error fetching initial data:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Error fetching initial data.',
        severity: 'error',
      });
    } finally {
      setIsFetching(false); // End loading
    }
  };

  // useEffect to fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Handler to open the Release Tickets dialog
  const handleOpenDialog = () => {
    setTicketCount(0);
    setOpenDialog(true);
  };

  // Handler to close the Release Tickets dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handler to release tickets
  const handleReleaseTickets = async () => {
    if (ticketCount <= 0) {
      setSnackbar({ open: true, message: 'Please enter a valid number of tickets.', severity: 'error' });
      return;
    }

    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('Authentication token not found. Please sign in again.');
      }

      // Start the vendor ticket releasing process
      const response = await axios.post(
        'http://localhost:5000/api/vendor/start',
        { ticketAmount: ticketCount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

        // Fetch updated data including history
        await fetchData();
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

  // Handler to stop releasing tickets
  const handleStopTickets = async () => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('Authentication token not found. Please sign in again.');
      }

      const stopResponse = await axios.post('http://localhost:5000/api/vendor/stop', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (stopResponse.data.success) {
        setIsAdding(false);
        setSnackbar({ open: true, message: 'Stopped adding new tickets.', severity: 'info' });

        // Fetch updated data including history
        await fetchData();
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

  // Handler for refreshing data
  const handleRefresh = async () => {
    await fetchData();
    setSnackbar({
      open: true,
      message: 'Data refreshed successfully!',
      severity: 'success',
    });
  };

  // Handler to close the snackbar
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handler for signing out
  const handleSignOut = () => {
    signOut();
    navigate('/'); // Redirect to home after sign-out
  };

  return (
    <Box sx={{ padding: 4, minHeight: '100vh', backgroundColor: '#f5f5f5', position: 'relative' }}>
      {/* Logout Icon Button at the top-right corner */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <IconButton onClick={handleSignOut} color="primary" aria-label="logout">
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
        {/* Refresh Button */}
        <Button
          variant="outlined"
          sx = {{backgroundcolor:"#00E676"}}
          startIcon={isFetching ? <CircularProgress size={20} /> : <RefreshIcon />}
          onClick={handleRefresh}
          disabled={isFetching} // Disable button while fetching
        >
          {isFetching ? 'Refreshing...' : 'Refresh'}
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
