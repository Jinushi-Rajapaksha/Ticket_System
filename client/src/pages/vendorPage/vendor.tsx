import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import AuthDialog from '../../components/authDialog';

const Vendor = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false); // Manage dialog state

  const handleDialogOpen = () => {
    setOpenDialog(true); // Open the dialog when button is clicked
  };

  const handleDialogClose = () => {
    setOpenDialog(false); // Close the dialog when the close action is triggered
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        height: '100vh', // Full screen height
      }}
    >
      {/* Welcome Section with Background Color */}
      <Box
        sx={{
          width: '100%',
          height: '5%',
          backgroundColor: '#2C2F3E', // Set background color of the box
          paddingTop: 4,
          paddingBottom: 4,
          display: 'flex',
          alignItems: 'center',
          position: 'absolute', // Keep it inside the parent container
          top: 0,
          left: 0,
          paddingLeft: 8, // Optional: Space from the left edge
          paddingRight: 8, // Optional: Space from the right edge
        }}
      >
        <img
          src="/src/assets/images/logo.png" // Replace with your logo path
          alt="Galaxy Gate Logo"
          style={{ width: '100px', marginRight: 8 }} // Adjust logo size and spacing
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            textAlign: 'left',
            color: '#fff', // White text color for contrast
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          GALAXY GATE
        </Typography>
      </Box>

      {/* Image below GALAXY GATE aligned to left corner */}
      <Box
        sx={{
          position: 'absolute',
          left: 0, // Position image to the left
          bottom: 50, // Adjust vertical positioning of the image
          width: '600px', // Adjust size as needed
          height: '600px', // Adjust size as needed
        }}
      >
        <img
          src="/src/assets/images/Welcome-bro.png" // Replace with your image path
          alt="Galaxy Gate Welcome Image"
          style={{ width: '100%', height: 'auto' }} // Make image responsive
        />
      </Box>

      {/* Content on the right side of the image */}
      <Box
        sx={{
          position: 'absolute',
          right: 300, // Center the content horizontally with respect to the image
          bottom: '20%', // Adjust vertical positioning of the content
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // Center the content vertically within the Box
          alignItems: 'center', // Align items horizontally in the center
          maxWidth: '400px',
          textAlign: 'center', // Ensures text is centered within the Box
        }} >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#2C2F3E', // Dark color for the heading
            marginBottom: 2,
          }}
        >
          Seamless Ticket Management at Your Fingertips
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#555', // Slightly lighter color for the description
            marginBottom: 3,
            lineHeight: 1.6,
          }}
        >
          Welcome to the planetarium ticket management system. As a vendor, you can easily add, update, and manage ticket entries for upcoming shows. This system streamlines the ticketing process, ensuring smooth operations and up-to-date records. Start adding your tickets today to keep the planetarium experience accessible to all!
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'primary', // Button color
            color: '#fff', // Button text color
            padding: '10px 20px',
            '&:hover': {
              backgroundColor: '#444', // Darken button color on hover
            },
          }}
          onClick={handleDialogOpen} // Open dialog on button click
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
