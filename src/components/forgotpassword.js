import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [serverOtp, setServerOtp] = useState('');
    const navigate = useNavigate();

  const validateEmail = () => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    return strength;
  };

  const handleSendOTP = async () => {
    if (!validateEmail()) {
      setError("Email is not valid.");
      return;
    }
    setLoading(true);
    try {
        const { data } = await axios.post('/new-password-send-otp', { email });
        setLoading(false);
        setServerOtp(data.otp); 
        setOtpSent(true);
        setError('');
        alert('OTP has been sent to your email.');
      } catch (err) {
        setLoading(false);
        setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
      }
    };

  const handleResetPassword = async () => {
    if (!otp || otp !== serverOtp) {
      setError("Invalid OTP. Please try again.");
      return;
    }
    if (checkPasswordStrength(newPassword) < 3) {
      setError("Password is too weak.");
      return;
    }
    setLoading(true);
    try {
        await axios.post('/reset-password', { email,newPassword });
        alert('Password has been reset successfully. You can now log in with your new password.');
        navigate('/');
      } catch (err) {
        setLoading(false);
        setError("Failed to reset password. Please try again.");
      }
    };
  

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8, p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography component="h1" variant="h5" sx={{ mb: 4, textAlign: 'center' }}>
            Forgot Password
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={otpSent}
            />
            {otpSent && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="otp"
                  label="OTP"
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="newPassword"
                  label="New Password"
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </>
            )}
            <Button
              type="button"
              fullWidth
              variant="contained"
              onClick={otpSent ? handleResetPassword : handleSendOTP}
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {otpSent ? "Reset Password" : "Send OTP"}
              {loading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }} />}
            </Button>
          </Box>
        </Container>
      );
    }
    

export default ForgotPassword;
