import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, CircularProgress, Avatar, styled, Box, FormControl, InputLabel, Select, MenuItem, Snackbar } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(12),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

const LargeAvatar = styled(Avatar)({
  width: 100,
  height: 100,
  marginBottom: 20,
});

const LoadingContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Adjust this value as needed
  }));

const AvatarLabel = styled('label')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
  }));

function UserProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    semester: '',
    profilePicUrl: '/default-avatar.jpg',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://bored-constantine-demo1234r5t.koyeb.app/appbar-userdetails', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUserData({
          name: response.data.data.name,
          email: response.data.data.email,
          semester: response.data.data.semester,
          profilePicUrl: response.data.data.profile_picture_url || '/default-avatar.jpg',
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        setLoading(false);
      }
    };
  

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setUserData({ ...userData, profilePicUrl: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('semester', userData.semester);
    if (image) formData.append('image', image);

    try {
      setLoading(true);
      await axios.post('https://bored-constantine-demo1234r5t.koyeb.app/user/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setLoading(false);
      alert('Profile updated successfully');
      fetchUserData();
    } catch (error) {
      console.error('Failed to update profile:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  return (
    <ProfileContainer component="main" maxWidth="xs">
      <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
        User Profile
      </Typography>
      <input accept="image/*" type="file" onChange={handleImageChange} style={{ display: 'none' }} id="raised-button-file" />
      <AvatarLabel htmlFor="raised-button-file"> {/* Use the styled label component here */}
        <LargeAvatar src={userData.profilePicUrl} alt="User" />
        <Button variant="contained" component="span" sx={{ marginTop: 2 }}>
          Upload Image
        </Button>
      </AvatarLabel>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          autoComplete="name"
          autoFocus
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={userData.email}
          disabled={true}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
       <FormControl fullWidth margin="normal">
          <InputLabel id="semester-select-label">Semester</InputLabel>
          <Select
              labelId="semester-select-label"
              id="semester-select"
              name="semester"
              value={userData.semester}
              onChange={(e) => setUserData({ ...userData, semester: e.target.value })}
          >
              <MenuItem value={1}>Semester 1</MenuItem>
              <MenuItem value={2}>Semester 2</MenuItem>
              <MenuItem value={3}>Semester 3</MenuItem>
              <MenuItem value={4}>Semester 4</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="button"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </Box>
    </ProfileContainer>
  );
}

export default UserProfile;
