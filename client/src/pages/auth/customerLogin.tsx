// src/components/SignIn.tsx
import React, { useState, useContext } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

interface SignInProps {
  handleClose: () => void;
  switchToSignUp: () => void;
  redirectPath?: string; // New optional prop
}

const SignIn: React.FC<SignInProps> = ({ handleClose, switchToSignUp, redirectPath = '/buy-tickets' }) => {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSignIn = async () => {
    setError('');
    setIsSubmitting(true);
    const result = await signIn(email, password);
    setIsSubmitting(false);
    if (result.success) {
      handleClose();
      navigate(redirectPath); // Navigate based on redirectPath prop
    } else {
      setError(result.message || 'Sign in failed');
    }
  };
  
  const handleCancel = () => {
    setEmail('');
    setPassword('');
    setError('');
    handleClose();
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Sign In 
      </Typography>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
        margin="normal"
      />
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={handleCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSignIn}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={isSubmitting && <CircularProgress size={20} />}
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>
      </Box>
      <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
        Don't have an account?{' '}
        <Button onClick={switchToSignUp} sx={{ textTransform: 'none' }}>
          Sign Up
        </Button>
      </Typography>
    </Box>
  );
};

export default SignIn;
