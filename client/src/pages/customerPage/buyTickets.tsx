// src/components/BuyTickets.tsx
import React, { useState, useContext, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  GlobalStyles,
  Button,
  Drawer,
  TextField,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import AuthDialog from '../../components/authDialog';

const BuyTickets: React.FC = () => {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [authDialogOpen, setAuthDialogOpen] = useState<boolean>(false);
  const [hasConfirmed, setHasConfirmed] = useState<boolean>(false);

  const eventTexts = [
    'Holiday', 'Show 9.00AM', '', 'Show 9.00AM', 'Show 9.00AM', '', 'Show 9.00AM',
    'Holiday', '', 'Special Event', '', 'Show 2.00PM', '', '',
    'Holiday', 'Show 9.00AM', 'Show 2.00PM', '', '', '', 'Show 9.00AM',
    'Holiday', '', '', 'Show 9.00AM', 'Show 2.00PM', '', 'Show 9.00AM',
    'Holiday'
  ];

  const handleBack = () => {
    navigate(-1); // Navigate back in history
  };

  const handleConfirmTickets = () => {
    if (ticketQuantity < 1) {
      setSnackbarMessage('Please select at least one ticket.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (authToken) {
      // User is authenticated; proceed with confirmation
      setHasConfirmed(true);
      setSnackbarMessage('Tickets confirmed. Click "Proceed" to finalize your purchase.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } else {
      // User is not authenticated; open Auth Dialog
      setAuthDialogOpen(true);
    }
  };

  const handleProceed = () => {
    // Proceed with ticket purchase logic here
    // For demonstration, we'll show a success message
    setSnackbarMessage(`You have successfully purchased ${ticketQuantity} ticket(s)!`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    setIsDrawerOpen(false);
    // Optionally, navigate to a confirmation page or reset the state
  };

  const handleAuthDialogClose = () => {
    setAuthDialogOpen(false);
  };

  // Watch for changes in authToken to set hasConfirmed after successful login
  useEffect(() => {
    if (authToken && authDialogOpen) {
      setHasConfirmed(true);
      setSnackbarMessage('Tickets confirmed. Click "Proceed" to finalize your purchase.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setAuthDialogOpen(false);
    }
  }, [authToken, authDialogOpen]);

  // const handleSignOut = () => {
  //   signOut();
  //   navigate('/'); // Redirect to home after sign-out
  // };

  return (
    <>
      {/* GlobalStyles to set the background image on the body */}
      <GlobalStyles
        styles={{
          body: {
            margin: 0,
            padding: 0,
            backgroundImage: 'url("/src/assets/images/kepler_art.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
          },
        }}
      />

      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          paddingTop: 4,
          paddingBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Content Container */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '1200px',
            paddingX: 2,
          }}
        >
          {/* Header */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              color: '#ffffff',
              textAlign: 'center',
              textShadow: '2px 2px 4px blue',
              marginBottom: 4,
            }}
          >
            Show Times
          </Typography>

          {/* Show Times Card */}
          <Card
            sx={{
              width: '100%',
              maxWidth: '900px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: 3,
              borderRadius: 2,
              marginX: 'auto',
              paddingLeft: 2,
            }}
          >
            <CardContent>
              <Grid container spacing={2} columns={7}>
                {/* Days of the Week Header */}
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <Grid item xs={1} key={index} sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        backgroundColor: '#1976d2',
                        color: '#ffffff',
                        padding: 2,
                        fontWeight: 'bold',
                        borderRadius: '4px',
                      }}
                    >
                      {day}
                    </Box>
                  </Grid>
                ))}

                {/* Dates and Events */}
                {[...Array(31)].map((_, index) => (
                  <Grid
                    item
                    xs={1}
                    key={index + 7}
                    sx={{
                      height: '100px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      backgroundColor: eventTexts[index]
                        ? ['Holiday', 'Special Event'].includes(eventTexts[index])
                          ? '#ffeb3b'
                          : '#ffffff'
                        : '#ffffff',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 1,
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#000000' }}>
                        {index + 1}
                      </Typography>
                      {eventTexts[index] && (
                        <Typography variant="body2" sx={{ marginTop: 1, color: '#000000' }}>
                          {eventTexts[index]}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Buy Ticket and Back Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 4,
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            {/* Back Button */}
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{
                transition: 'background-color 0.3s, box-shadow 0.3s',
                '&:hover': {
                  backgroundColor: '#1565c0',
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              Back
            </Button>

            {/* Buy Ticket Button */}
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={() => setIsDrawerOpen(true)}
              sx={{
                transition: 'background-color 0.3s, box-shadow 0.3s',
                '&:hover': {
                  backgroundColor: '#1565c0',
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              Buy Ticket
            </Button>
          </Box>

          {/* Drawer Component */}
          <Drawer
            anchor="right"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          >
            <Box
              sx={{
                width: 350,
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
              role="presentation"
            >
              {/* Title */}
              <Typography variant="h5" gutterBottom 
              sx={{ fontWeight: 'bold' }}>
                Ticket Details
              </Typography>

              <Divider sx={{ marginBottom: 2 }} />

              {/* Available Tickets */}
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Available Tickets: 50
              </Typography>

              {/* Description Message */}
              <Typography variant="body2" sx={{ marginTop: 2, fontWeight: 'bold' }}>
                Enter the number of tickets you want to buy:
              </Typography>

              {/* Input Field for Ticket Quantity */}
              <Box sx={{ marginTop: 1 }}>
                <TextField
                  type="number"
                  InputProps={{ inputProps: { min: 1, max: 10 } }}
                  value={ticketQuantity}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 1 && value <= 10) {
                      setTicketQuantity(value);
                    } else if (value < 1) {
                      setTicketQuantity(1);
                    } else if (value > 10) {
                      setTicketQuantity(10);
                    }
                  }}
                  fullWidth
                />
              </Box>

              {/* Spacer to push buttons to the bottom */}
              <Box sx={{ flexGrow: 1 }} />
              <Divider sx={{ marginBottom: 2 }} />

              {/* Total Price Display */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 0 }}>
                <Typography variant="body1">
                  Total Price
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', marginLeft: 2 }}>
                  {ticketQuantity * 100} LKR
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: 1 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    fontWeight: 'bold',
                    flex: 1,
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                    },
                  }}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Close
                </Button> 
                {!hasConfirmed ? (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      flex: 1,
                    }}
                    onClick={handleConfirmTickets}
                  >
                    Confirm Ticket
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      flex: 1,
                    }}
                    onClick={handleProceed}
                  >
                    Proceed
                  </Button>
                )}
              </Box>
            </Box>
          </Drawer>

          {/* Auth Dialog */}
          <AuthDialog open={authDialogOpen} handleClose={handleAuthDialogClose} />

          {/* Snackbar for Notifications */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </>
  );
};

export default BuyTickets;
