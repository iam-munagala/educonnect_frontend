import React, { useState } from 'react';
import axios from 'axios';
import {
    TextField, Button, Typography, Box, Container, FormControl, InputLabel, Select, MenuItem, Stack, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        semester: '',
        profilePic: null,
        otp: '',
    });
    const [error, setError] = useState({});
    const [otpSent, setOtpSent] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [receivedOtp, setReceivedOtp] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            profilePic: e.target.files[0]
        }));
    };

    const sendOTP = async () => {
        try {
            const response = await axios.post('https://bored-constantine-demo1234r5t.koyeb.app/send-otp', { email: formData.email });
            setReceivedOtp(response.data.otp);
            setOtpSent(true);
            alert('OTP sent. Please check your email.');
        } catch (error) {
            console.error("Failed to send OTP:", error.response?.data?.message || "An error occurred");
            alert('Failed to send OTP. Please try again.');
        }
    };

    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/\d/.test(password)) strength += 1;

        return strength;
    };


    const validate = () => {
        let tempError = {};
        tempError.name = formData.name ? "" : "Name is required.";
        tempError.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? "" : "Email is not valid.";
        const passwordStrength = checkPasswordStrength(formData.password);
        tempError.password = formData.password ? (passwordStrength < 3 ? "Password is too weak." : "") : "Password is required.";
        tempError.semester = formData.semester ? "" : "Please select a semester.";
        if (otpSent && (!formData.otp || formData.otp.length !== 4)) {
            tempError.otp = "OTP must be 4 digits";
        }
        setError(tempError);
        return Object.values(tempError).every(x => x === "");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.profilePic) {
            setError(prevError => ({ ...prevError, profilePic: "Please upload a profile picture." }));
            return;
        }

        if (formData.otp !== receivedOtp) {
            setError(prevError => ({ ...prevError, otp: "Incorrect OTP. Please try again." }));
            return;
        }


        if (validate()) {
            setIsLoading(true);
            try {



                const userData = new FormData();
                userData.append('name', formData.name);
                userData.append('email', formData.email);
                userData.append('password', formData.password);
                userData.append('semester', formData.semester);
                userData.append('profilePic', formData.profilePic);


                await axios.post('https://bored-constantine-demo1234r5t.koyeb.app/register', userData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });




                alert('Registration successful. Redirecting to login.');
                navigate('/');
            } catch (error) {
                console.error("Registration failed:", error.response?.data?.message || "An error occurred");
                if (error.response?.data?.message === 'Email already exists.') {
                    alert('Registration failed: Email already exists. Please use a different email.');
                } else {
                    alert('Registration failed. Please try again.');
                }
            }
            finally {
                setIsLoading(false); // Stop loading regardless of the outcome
            }
        }
    };


    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8, bgcolor: 'background.paper', p: 3, borderRadius: 2 }}>
            <Typography component="h1" variant="h4" color="text.primary" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
                Register for EduConnect
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={formData.name}
                    onChange={handleChange}
                    error={!!error.name}
                    helperText={error.name}
                />
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!error.email}
                        helperText={error.email}
                    />
                    <Button variant="contained" onClick={sendOTP} disabled={otpSent}>Send OTP</Button>
                </Stack>
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
                            value={formData.otp}
                            onChange={handleChange}
                            error={!!error.otp}
                            helperText={error.otp}
                        />
                    </>
                )}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!error.password}
                    helperText={error.password || "Min 8 characters, including a number and an uppercase letter"}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel id="semester-select-label">Semester</InputLabel>
                    <Select
                        labelId="semester-select-label"
                        id="semester-select"
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        error={!!error.semester}
                    >
                        <MenuItem value={1}>Semester 1</MenuItem>
                        <MenuItem value={2}>Semester 2</MenuItem>
                        <MenuItem value={3}>Semester 3</MenuItem>
                        <MenuItem value={4}>Semester 4</MenuItem>
                    </Select>
                    {!!error.semester && <Typography color="error" variant="caption">{error.semester}</Typography>}
                </FormControl>

                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{ mt: 3 }}
                >
                    Upload Profile Picture
                    <input
                        type="file"
                        hidden
                        onChange={handleFileChange}
                    />
                </Button>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={!otpSent} // Disable registration until OTP is verified
                    >
                        Register
                    </Button>
                )}
                {!!error.profilePic && <Typography color="error">{error.profilePic}</Typography>}
            </Box>
        </Container>
    );
}

export default Register;
