import React, { useState } from 'react';
import { Container, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthCheck from '../useAuthCheck';
import CustomAppBar from './admin-appbar'; 

const categories = ['History', 'Economics', 'Mathematics', 'Science', 'Literature'];
const levels = [1, 2, 3, 4];

const AddCourse = () => {
  useAuthCheck(); 
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState({
    coursename: '',
    category: '',
    level: '',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false,type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseDetails(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    return courseDetails.coursename && courseDetails.category && courseDetails.level;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
        setAlert({ show: true, type: 'error', message: 'Please fill in all fields.' });
        return;
      }
    setLoading(true);
    try {
      
      const response = await axios.post('/admin/add-courses', {
        ...courseDetails,
        popularity: 0, 
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setLoading(false);
      setAlert({ show: true, message: 'Course successfully added!' });
      setTimeout(() => navigate('/admin-dashboard'), 2000); // Redirect after showing success message
    } catch (error) {
      setLoading(false);
      setAlert({ show: true, type: 'error', message: 'Failed to add course. Please try again.' });
      console.error('Failed to add course:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <CustomAppBar username='Guest'/>
      <Container component="main" maxWidth="xs" sx={{ mt: 12, mb: 2 }}>
        <Typography component="h1" variant="h5" align="center" sx={{ mb: 4 }}>
          Add New Course
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="coursename"
            label="Course Name"
            name="coursename"
            value={courseDetails.coursename}
            onChange={handleChange}
            autoFocus
          />
          <FormControl fullWidth margin="normal" required variant="outlined">
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              name="category"
              value={courseDetails.category}
              onChange={handleChange}
              label="Level"
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required variant="outlined">
            <InputLabel id="level-select-label">Level</InputLabel>
            <Select
              labelId="level-select-label"
              id="level-select"
              name="level"
              value={courseDetails.level}
              onChange={handleChange}
              label="Level" 
            >
              {levels.map(level => (
                <MenuItem key={level} value={level}>{`Semester ${level}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            Add Course
            {loading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }} />}
          </Button>
          {alert.show && <Alert severity={alert.type}>{alert.message}</Alert>}
        </Box>
      </Container>
    </div>
  );
};

export default AddCourse;
