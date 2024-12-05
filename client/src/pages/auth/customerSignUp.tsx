// src/components/SignUp.tsx
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

interface SignUpProps {
  handleClose: () => void;
  switchToSignIn: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ handleClose, switchToSignIn }) => {
  const { signUp } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSignUp = async () => {
    setError('');

    // Simple validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const result = await signUp(email, password);
    setIsSubmitting(false);
    if (result.success) {
      handleClose();
      navigate('/buy-tickets'); // Redirect to BuyTickets after successful sign-up
    } else {
      setError(result.message || 'Sign up failed');
    }
  };

  const handleCancel = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    handleClose();
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Sign Up
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
      <TextField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
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
          onClick={handleSignUp}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={isSubmitting && <CircularProgress size={20} />}
        >
          {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </Box>
      <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
        Already have an account?{' '}
        <Button onClick={switchToSignIn} sx={{ textTransform: 'none' }}>
          Sign In
        </Button>
      </Typography>
    </Box>
  );
};

export default SignUp;
