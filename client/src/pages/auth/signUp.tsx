// src/components/SignUp.tsx
import React, { useState, useContext, useEffect, useRef } from 'react';
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
  userType: 'vendor' | 'customer'; // Add userType to determine sign-up method
}

const SignUp: React.FC<SignUpProps> = ({ handleClose, switchToSignIn, userType }) => {
  const { VendorsignUp, CustomersignUp } = useContext(AuthContext);
  const navigate = useNavigate();

  const nameInputRef = useRef<HTMLInputElement | null>(null);

  // Input States
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Error States
  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string>('');

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();  // Focus on name input when component is mounted
    }
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSignUp = async () => {
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');

    let isValid = true;

    if (name.trim() === '') {
      setNameError('Name is required.');
      isValid = false;
    }

    if (email.trim() === '') {
      setEmailError('Email is required.');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (password.trim() === '') {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      isValid = false;
    }

    if (confirmPassword.trim() === '') {
      setConfirmPasswordError('Please confirm your password.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    // Use the appropriate sign-up function based on userType
    const result = userType === 'vendor' ? await VendorsignUp(name, email, password) : await CustomersignUp(name, email, password);

    setIsSubmitting(false);

    if (result.success) {
      handleClose();
      navigate('/buy-tickets');
    } else {
      setGeneralError(result.message || 'Sign up failed. Please try again.');
    }
  };

  const handleCancel = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');
    handleClose();
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Sign Up
      </Typography>
      <TextField
        id="name"
        label="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
        margin="normal"
        error={Boolean(nameError)}
        helperText={nameError}
        inputRef={nameInputRef} 
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
        margin="normal"
        error={Boolean(emailError)}
        helperText={emailError}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
        margin="normal"
        error={Boolean(passwordError)}
        helperText={passwordError}
      />
      <TextField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        required
        margin="normal"
        error={Boolean(confirmPasswordError)}
        helperText={confirmPasswordError}
      />
      {generalError && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {generalError}
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
