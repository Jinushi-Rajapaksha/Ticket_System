// src/components/BuyTickets.tsx
import React, { useState, useContext, useEffect } from 'react';
import TicketIcon from '@mui/icons-material/ConfirmationNumberOutlined';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import AuthDialog from '../../components/authDialog';
import { CancelPresentationTwoTone } from '@mui/icons-material';
import axios from 'axios';

interface PurchasedTicket {
  ticketId: string;
  soldAt?: string;
  vendorId?: string;
}

const BuyTickets: React.FC = () => {
  const { authToken, signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [authDialogOpen, setAuthDialogOpen] = useState<boolean>(false);
  const [hasConfirmed, setHasConfirmed] = useState<boolean>(false);
  const [availableTickets, setAvailableTickets] = useState<number>(0);

  // State for Purchased Tickets Dialog
  const [purchasedDialogOpen, setPurchasedDialogOpen] = useState<boolean>(false);
  const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>([]);

  // State for Cancel Ticket Dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);
  const [cancelTicketId, setCancelTicketId] = useState<string>('');

  const eventTexts = [
    'Holiday', 'Show 9.00AM', '', 'Show 9.00AM', 'Show 9.00AM', '', 'Show 9.00AM',
    'Holiday', '', 'Special Event', '', 'Show 2.00PM', '', '',
    'Holiday', 'Show 9.00AM', 'Show 2.00PM', '', '', '', 'Show 9.00AM',
    'Holiday', '', '', 'Show 9.00AM', 'Show 2.00PM', '', 'Show 9.00AM',
    'Holiday'
  ];

  // Fetch availableTickets from the backend when component mounts or when authToken changes
  useEffect(() => {
    const fetchAvailableTickets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/ticketPool/status');

        if (response.data.success && response.data.data) {
          setAvailableTickets(response.data.data.availableTickets);
        } else {
          console.error('Failed to fetch available tickets:', response.data.error);
        }
      } catch (error: any) {
        console.error('Error fetching available tickets:', error);
      }
    };

    fetchAvailableTickets();
  }, [authToken]);

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const handleConfirmTickets = async () => {
    if (ticketQuantity < 1) {
      setSnackbarMessage('Please select at least one ticket.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (authToken) {
      try {
        const token = authToken;
        const response = await axios.post('http://localhost:5000/api/customer/purchase',
          { ticketAmount: ticketQuantity },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          setHasConfirmed(true);
          setSnackbarMessage('Tickets confirmed. Click "Proceed" to finalize your purchase.');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage('Failed to confirm tickets.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      } catch (error: any) {
        console.error('Error confirming tickets:', error);
        setSnackbarMessage('Failed to confirm tickets.Invalid user role.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } else {
      // User is not authenticated; open Auth Dialog
      setAuthDialogOpen(true);
    }
  };

  const handleProceed = () => {
    setSnackbarMessage(`You have successfully purchased ${ticketQuantity} ticket(s)!`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    setIsDrawerOpen(false);
  };

  // Open the cancel ticket dialog
  const handleCancelTickets = () => {
    if (!authToken) {
      setSnackbarMessage('You must be logged in to cancel tickets.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    setCancelDialogOpen(true);
  };

  // Confirm button in the cancel dialog
  const handleCancelTicketConfirm = async () => {
    if (!authToken) {
      setSnackbarMessage('You must be logged in to cancel tickets.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!cancelTicketId.trim()) {
      setSnackbarMessage('Please enter a ticket ID to cancel.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const token = authToken;
      // Call cancel endpoint with ticketId
      const response = await axios.post('http://localhost:5000/api/customer/cancel',
        { ticketId: cancelTicketId.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSnackbarMessage(`Ticket ${cancelTicketId} canceled successfully!`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setCancelDialogOpen(false);
        setCancelTicketId('');
      } else {
        setSnackbarMessage(response.data.error || 'Failed to cancel ticket.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error: any) {
      console.error('Error canceling ticket:', error);
      setSnackbarMessage('Failed to cancel ticket.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleAuthDialogClose = () => {
    setAuthDialogOpen(false);
  };

  // Fetch purchased tickets when the "Purchased Tickets" button is clicked
  const handleViewPurchasedTickets = async () => {
    if (!authToken) {
      setSnackbarMessage('You must be logged in to view purchased tickets.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const token = authToken;
      const response = await axios.get('http://localhost:5000/api/customer/purchased-tickets', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success && response.data.data) {
        setPurchasedTickets(response.data.data);
        setPurchasedDialogOpen(true);
      } else {
        setSnackbarMessage('Failed to fetch purchased tickets.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error: any) {
      console.error('Error fetching purchased tickets:', error);
      setSnackbarMessage('Failed to fetch purchased tickets.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Close purchased tickets dialog
  const handleClosePurchasedDialog = () => {
    setPurchasedDialogOpen(false);
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

          {/* Layout: Card on left, Buttons on right */}
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 4 }}>
            {/* Dates and Events Card (Left Side) */}
            <Card
              sx={{
                width: '100%',
                maxWidth: '900px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: 3,
                borderRadius: 2,
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

            {/* Buttons (Right Side), stacked vertically */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop:15 }}>
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
                Buy Tickets
              </Button>

              {/* View Purchased Tickets Button */}
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<TicketIcon />}
                onClick={handleViewPurchasedTickets}
                sx={{
                  transition: 'background-color 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                Purchased Tickets
              </Button>

              {/* Cancel Tickets Button */}
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<CancelPresentationTwoTone />}
                sx={{
                  transition: 'background-color 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                  },
                }}
                onClick={handleCancelTickets}
              >
                Cancel Tickets
              </Button>

              {/* Logout Button */}
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<ArrowBackIcon />}
                onClick={handleLogout}
                sx={{
                  transition: 'background-color 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                Logout
              </Button>
            </Box>
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
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Ticket Details
              </Typography>

              <Divider sx={{ marginBottom: 2 }} />

              {/* Available Tickets fetched from backend */}
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Available Tickets: {availableTickets}
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

              {/* Action Buttons in Drawer */}
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

          {/* Purchased Tickets Dialog */}
          <Dialog open={purchasedDialogOpen} onClose={handleClosePurchasedDialog}>
            <DialogTitle>Hii! Here the tickets you purchased</DialogTitle>
            <DialogContent>
              {purchasedTickets.length > 0 ? (
                <List>
                  {purchasedTickets.map((ticket) => (
                    <ListItem key={ticket.ticketId}>
                      <ListItemText
                        primary={`Ticket ID: ${ticket.ticketId}`}
                        secondary={`Vendor: ${ticket.vendorId || 'N/A'} | Sold At: ${ticket.soldAt || 'N/A'}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1">No purchased tickets found.</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePurchasedDialog} variant="contained" color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Cancel Ticket Dialog */}
          <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
            <DialogTitle>Cancel a Ticket</DialogTitle>
            <DialogContent>
              <Typography variant="body1">Enter the Ticket ID you want to cancel:</Typography>
              <TextField
                fullWidth
                margin="dense"
                variant="standard"
                value={cancelTicketId}
                onChange={(e) => setCancelTicketId(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={() => setCancelDialogOpen(false)}>Close</Button>
              <Button variant="contained" color="primary" onClick={handleCancelTicketConfirm}>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

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
