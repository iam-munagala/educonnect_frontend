import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar, Box, styled } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const UserInfo = styled('div')(({ theme }) => ({
  marginLeft: '10px',
  color: theme.palette.text.secondary,
}));

const UserAppBar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userDetails, setUserDetails] = useState({ username: 'User', avatarUrl: '/default-avatar.jpg' });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('/appbar-userdetails', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        });
        if (response.data) {
          setUserDetails({
            username: response.data.data.name, 
            avatarUrl: response.data.data.profile_picture_url || '/default-avatar.jpg',
          });
        }
        console.log(response.data.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
  
    fetchUserDetails();
  }, []);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  const handleProfile = () => {
    navigate('/user-profile');
    handleClose();
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" noWrap component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
            EduConnect
          </Typography>
        </Box>
        <IconButton onClick={handleMenu} size="large" edge="end" color="inherit">
          <Avatar alt={userDetails.username} src={userDetails.avatarUrl} />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} 
              PaperProps={{ elevation: 0, sx: { overflow: 'visible', filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))', mt: 1.5, '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1, }, '&:before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0, }, } }} 
              transformOrigin={{ horizontal: 'right', vertical: 'top' }} 
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
          <UserHeader>
            <Avatar alt={userDetails.username} src={userDetails.avatarUrl} />
            <UserInfo>
              <Typography variant="subtitle1">{userDetails.username}</Typography>
            </UserInfo>
          </UserHeader>
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default UserAppBar;
