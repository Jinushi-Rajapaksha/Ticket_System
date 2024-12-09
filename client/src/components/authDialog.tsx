import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import SignUp from '../pages/auth/customerSignUp';
import SignIn from '../pages/auth/customerLogin';

interface AuthDialogProps {
  open: boolean;
  handleClose: () => void;
  userType?: 'customer' | 'vendor'; // New prop to indicate user type
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, handleClose, userType = 'customer' }) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false); // Track if the dialog should show SignUp or SignIn
  const [isSignIn, setIsSignIn] = useState<boolean>(true);

  const switchToSignIn = () => setIsSignUp(false);
  const switchToSignUp = () => setIsSignUp(true);

  const redirectPath = userType === 'vendor' ? '/configurations' : '/buy-tickets';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          borderRadius: '10px',
          padding: '10px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Centers the content
          gap: 0, // Reduced gap between logo and title
        }}>
        {/* Logo above title */}
        <img 
          src="/src/assets/images/logo.png" 
          alt="GalaxyGate Logo" 
          style={{ width: '100px' }} // Adjusted logo size
        />
        {/* Conditional Title based on isSignUp */}
        {isSignUp ? 'Sign Up to GalaxyGate' : 'Sign In to GalaxyGate'}
      </DialogTitle>
      <DialogContent>
        {isSignIn ? (
          <SignIn
            handleClose={handleClose}
            switchToSignUp={switchToSignUp}
            redirectPath={redirectPath} // Pass redirectPath here
          />
        ) : (
          <SignUp handleClose={handleClose} switchToSignIn={switchToSignIn} />
        )}
      </DialogContent>  
    </Dialog>
  );
};

export default AuthDialog;
