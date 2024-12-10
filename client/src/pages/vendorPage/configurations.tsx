// src/pages/Configurations.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Define the shape of the configuration data
interface Configuration {
  totalTickets: number;
  ticketReleaseRate: number;
  customerRetrievalRate: number;
  maxTicketCapacity: number;
}

// Define the shape of the errors state
interface ConfigurationErrors {
  totalTickets?: string;
  ticketReleaseRate?: string;
  customerRetrievalRate?: string;
  maxTicketCapacity?: string;
}

const Configurations: React.FC = () => {
  const [config, setConfig] = useState<Configuration>({
    totalTickets: 0,
    ticketReleaseRate: 0,
    customerRetrievalRate: 0,
    maxTicketCapacity: 0,
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errors, setErrors] = useState<ConfigurationErrors>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';  // Add 'info' here
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  
  const navigate = useNavigate();

  // Replace with your actual backend API endpoints
  const API_BASE_URL = 'http://localhost:5000/api'; // Example base URL
  const CONFIG_ENDPOINT = `${API_BASE_URL}/configuration/`;

  // Fetch existing configurations on component mount
// Fetch existing configurations on component mount
useEffect(() => {
  const fetchConfigurations = async () => {
    try {
      const response = await axios.get(CONFIG_ENDPOINT);
      const configData = response.data.data; 

      setConfig(configData);
      setIsEditing(true); // If configurations exist, enable editing
    } catch (error) {
      console.error('Failed to fetch configurations', error);
      setIsEditing(false);
    }
  };

  fetchConfigurations();
}, [CONFIG_ENDPOINT]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: Number(value),
    }));

    // Remove error message upon change
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  // Validate form fields
  const validate = (): boolean => {
    const newErrors: ConfigurationErrors = {};

    if (config.totalTickets === undefined || config.totalTickets < 0) {
      newErrors.totalTickets = 'Total Tickets must be a non-negative number';
    }

    if (
      config.ticketReleaseRate === undefined ||
      config.ticketReleaseRate < 0
    ) {
      newErrors.ticketReleaseRate =
        'Ticket Release Rate must be a non-negative number';
    }

    if (
      config.customerRetrievalRate === undefined ||
      config.customerRetrievalRate < 0
    ) {
      newErrors.customerRetrievalRate =
        'Customer Retrieval Rate must be a non-negative number';
    }

    if (
      config.maxTicketCapacity === undefined ||
      config.maxTicketCapacity < 0
    ) {
      newErrors.maxTicketCapacity =
        'Max Ticket Capacity must be a non-negative number';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle Update configurations
  const handleUpdate = async () => {
    if (!validate()) {
      setSnackbar({
        open: true,
        message: 'Please fix the errors in the form.',
        severity: 'error',
      });
      return;
    }
  
    try {
      await axios.put('http://localhost:5000/api/configuration/update', config);
      setSnackbar({
        open: true,
        message: 'Configurations updated successfully!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update configurations.',
        severity: 'error',
      });
    }
  };
  
  // Handle Next (Navigate to VendorDashboard)
  const handleNext = () => {
    navigate('/vendor-dashboard');
  };

  // Handle Back (Navigate to Vendor Page)
  const handleBack = () => {
    navigate('/vendor-page'); // Replace '/vendor-page' with your actual vendor page route
  };

  // Handle Clear (Reset Form Fields)
  const handleClear = () => {
    setConfig({
      totalTickets: 0,
      ticketReleaseRate: 0,
      customerRetrievalRate: 0,
      maxTicketCapacity: 0,
    });
    setErrors({});
    setSnackbar({
      open: true,
      message: 'Form has been cleared.',
      severity: 'info',
    });
  };

  // Handle Snackbar Close
  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{
        padding: 4,
        minHeight: '100vh',
        backgroundColor: '#f0f4f8',
      }}
    >
      {/* Header */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          color: 'primary.main',
          textAlign: 'center',
          mb: 4,
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
        }}
      >
        Configurations
      </Typography>

      {/* Configuration Form */}
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          maxWidth: 800,
          margin: '0 auto',
        }}
      >
        <Grid container spacing={3}>
          {/* Total Tickets */}
          <Grid item xs={12} sm={6}>
            <TextField
            required
            label="Total Tickets"
            name="totalTickets"
            type="number"
            fullWidth
            variant="outlined"
            value={config.totalTickets}
            onChange={handleChange}
            error={!!errors.totalTickets}
            helperText={errors.totalTickets}
            InputProps={{ inputProps: { min: 0 } }}
            InputLabelProps={{
              shrink: true, // Ensure the label stays above the input
              sx: {
                fontSize: '1.2rem', // Increase font size
                fontWeight: 'bold', // Make label bold
              },
            }}            />
        </Grid>
          {/* Ticket Release Rate */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Ticket Release Rate"
              name="ticketReleaseRate"
              type="number"
              fullWidth
              variant="outlined"
              value={config.ticketReleaseRate}
              onChange={handleChange}
              error={!!errors.ticketReleaseRate}
              helperText={errors.ticketReleaseRate}
              InputProps={{ inputProps: { min: 0 } }}
              InputLabelProps={{
                shrink: true,
                sx: {
                fontSize: '1.2rem', // Increase font size
                fontWeight: 'bold',  // Make label bold
                },
            }}
            />
          </Grid>

          {/* Customer Retrieval Rate */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Customer Retrieval Rate"
              name="customerRetrievalRate"
              type="number"
              fullWidth
              variant="outlined"
              value={config.customerRetrievalRate}
              onChange={handleChange}
              error={!!errors.customerRetrievalRate}
              helperText={errors.customerRetrievalRate}
              InputProps={{ inputProps: { min: 0 } }}
              InputLabelProps={{
                shrink: true,
                sx: {
                fontSize: '1.2rem', // Increase font size
                fontWeight: 'bold',  // Make label bold
                },
            }}
            />
          </Grid>

          {/* Max Ticket Capacity */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Max Ticket Capacity"
              name="maxTicketCapacity"
              type="number"
              fullWidth
              variant="outlined"
              value={config.maxTicketCapacity}
              onChange={handleChange}
              error={!!errors.maxTicketCapacity}
              helperText={errors.maxTicketCapacity}
              InputProps={{ inputProps: { min: 0 } }}
              InputLabelProps={{
                shrink: true,
                sx: {
                fontSize: '1.2rem', // Increase font size
                fontWeight: 'bold',  // Make label bold
                },
            }}
            />
          </Grid>

          {/* Buttons */}
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              mt: 2,
            }}
          >
            {/* Back Button */}
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              style={{
                backgroundColor: '#686e6b',
                color: '#fff',
            }}
            >
              Back
            </Button>

            <Button
                variant="contained"
                startIcon={<UpdateIcon />}
                onClick={handleUpdate}
                style={{
                    backgroundColor: '#26bd73',
                    color: '#fff',
                }}
                >
                Update
            </Button>

            {/* Clear Button */}
            <Button
              variant="outlined"
              color="warning"
              startIcon={<ClearIcon />}
              onClick={handleClear}
              style={{
                backgroundColor: '#db2a41',
                color: '#fff',
            }}
            >
              Clear
            </Button>

            {/* Next Button */}
            <Button
              variant="contained"
              color="primary"
              endIcon={<NavigateNextIcon />}
              onClick={handleNext}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Configurations;
