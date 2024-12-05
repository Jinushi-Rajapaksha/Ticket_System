// src/components/AuthDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Tabs, Tab, Box } from '@mui/material';
import SignUp from '../pages/auth/customerSignUp';
import SignIn from '../pages/auth/customerLogin';

interface AuthDialogProps {
  open: boolean;
  handleClose: () => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, handleClose }) => {
  const [tabIndex, setTabIndex] = useState<number>(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const switchToSignIn = () => {
    setTabIndex(0);
  };

  const switchToSignUp = () => {
    setTabIndex(1);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{tabIndex === 0 ? 'Sign In' : 'Sign Up'}</DialogTitle>
      <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
        <Tab label="Sign In" />
        <Tab label="Sign Up" />
      </Tabs>
      <DialogContent>
        {tabIndex === 0 ? (
          <SignIn handleClose={handleClose} switchToSignUp={switchToSignUp} />
        ) : (
          <SignUp handleClose={handleClose} switchToSignIn={switchToSignIn} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
