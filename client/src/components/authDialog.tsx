import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import SignIn from '../pages/auth/login';
import SignUp from '../pages/auth/signUp';

interface AuthDialogProps {
  open: boolean;
  handleClose: () => void;
  userType?: 'customer' | 'vendor'; // prop to indicate user type
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, handleClose, userType = 'customer' }) => {
  const [authState, setAuthState] = useState<'signIn' | 'signUp'>('signIn'); 
  const switchToSignIn = () => setAuthState('signIn');
  const switchToSignUp = () => setAuthState('signUp');

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
          alignItems: 'center',
          gap: 0,
        }}>
        <img 
          src="/src/assets/images/logo.png" 
          alt="GalaxyGate Logo" 
          style={{ width: '100px' }} 
        />
        {authState === 'signUp' ? 'Sign Up to GalaxyGate' : 'Sign In to GalaxyGate'}
      </DialogTitle>
      <DialogContent>
        {authState === 'signIn' ? (
          <SignIn
            handleClose={handleClose}
            switchToSignUp={switchToSignUp}
            redirectPath={redirectPath}
          />
        ) : (
          <SignUp
            handleClose={handleClose}
            switchToSignIn={switchToSignIn}
            userType={userType}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
