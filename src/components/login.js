import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Container,
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState({});
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    let tempError = {};
    tempError.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Email is not valid.";
    tempError.password = password ? "" : "Password is required.";
    tempError.role = role ? "" : "Please select a role.";
    setError(tempError);
    return Object.values(tempError).every(x => x === "");
  };

  const handleLogin = async () => {
    setLoginError('');
    setLoading(true);
    console.log(email, password, role);
    try {
      const response = await axios.post('https://bored-constantine-demo1234r5t.koyeb.app/login', {
        email,
        password,
        role
      });


      const { token } = response.data;
      localStorage.setItem('token', token);

      navigate(role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      setLoginError(message);
    }
    finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      handleLogin();
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, bgcolor: 'background.paper', p: 3, borderRadius: 2 }}>
      <Typography component="h1" variant="h4" color="text.primary" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        EduConnect - Secure Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        {loginError && <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>}
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
          onChange={e => setEmail(e.target.value)}
          error={!!error.email}
          helperText={error.email}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={!!error.password}
          helperText={error.password}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="role-select-label">Role</InputLabel>
          <Select
            labelId="role-select-label"
            id="role-select"
            value={role}
            label="Role"
            onChange={e => setRole(e.target.value)}
            error={!!error.role}
          >
            <MenuItem value={'admin'}>Admin</MenuItem>
            <MenuItem value={'student'}>Student</MenuItem>
          </Select>
          {!!error.role && <Typography color="error" variant="caption">{error.role}</Typography>}
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, position: 'relative' }}
          disabled={loading}
        >
          Sign In
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Button>
        <Button
          color="primary"
          fullWidth
          onClick={() => navigate('/forgot-password')}
        >
          Forgot Password ?
        </Button>
        <Button
          color="primary"
          fullWidth
          onClick={() => navigate('/register')}
        >
          No account? Register
        </Button>
      </Box>
    </Container>
  );
}

export default Login;
