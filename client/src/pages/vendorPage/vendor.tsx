import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import AuthDialog from '../../components/authDialog';

const Vendor = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false); 

  const handleDialogOpen = () => {
    setOpenDialog(true); 
  };

  const handleDialogClose = () => {
    setOpenDialog(false); 
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        height: '100vh', 
      }}
    >
      {/* Welcome Section */}
      <Box
        sx={{
          width: '100%',
          height: '5%',
          backgroundColor: '#2C2F3E',
          paddingTop: 4,
          paddingBottom: 4,
          display: 'flex',
          alignItems: 'center',
          position: 'absolute', 
          top: 0,
          left: 0,
          paddingLeft: 8, 
          paddingRight: 8, 
        }}
      >
        <img
          src="/src/assets/images/logo.png" 
          alt="Galaxy Gate Logo"
          style={{ width: '100px', marginRight: 8 }} 
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            textAlign: 'left',
            color: '#fff', 
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          GALAXY GATE
        </Typography>
      </Box>

      {/* Image below GALAXY GATE */}
      <Box
        sx={{
          position: 'absolute',
          left: 0, 
          bottom: 50, 
          width: '600px', 
          height: '600px', 
        }}
      >
        <img
          src="/src/assets/images/Welcome-bro.png"
          alt="Galaxy Gate Welcome Image"
          style={{ width: '100%', height: 'auto' }} 
        />
      </Box>

      {/* Content on the right side of the image */}
      <Box
        sx={{
          position: 'absolute',
          right: 300, 
          bottom: '20%', 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          maxWidth: '400px',
          textAlign: 'center',
        }} >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#2C2F3E',
            marginBottom: 2,
          }}
        >
          Seamless Ticket Management at Your Fingertips
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#555', 
            marginBottom: 3,
            lineHeight: 1.6,
          }}
        >
          Welcome to the planetarium ticket management system. As a vendor, you can easily add, update, and manage ticket entries for upcoming shows. This system streamlines the ticketing process, ensuring smooth operations and up-to-date records. Start adding your tickets today to keep the planetarium experience accessible to all!
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'primary', 
            color: '#fff', 
            padding: '10px 20px',
            '&:hover': {
              backgroundColor: '#444', 
            },
          }}
          onClick={handleDialogOpen} 
        >
          Get Started
        </Button>
      </Box>

      {/* Auth Dialog Component */}
      <AuthDialog open={openDialog} handleClose={handleDialogClose} userType="vendor" />
    </Box>
  );
};

export default Vendor;
