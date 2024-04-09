import React, { useState, useEffect } from 'react';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Button, Box, TablePagination, Typography,IconButton, CircularProgress } from '@mui/material';
import UserAppBar from './user-appbar'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthCheck from '../useAuthCheck'; 
import CancelIcon from '@mui/icons-material/Cancel';


const UserDashboard = () => {
  useAuthCheck(); 
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/user/enrolled-courses', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEnrolledCourses(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error);
      setIsLoading(false);
    }
  };

  const handleUnenroll = async (enrollId) => {
    const isConfirmed = window.confirm('Are you sure you want to unenroll from this course?');
    if (isConfirmed) {
      try {
        await axios.delete(`/user/unenroll-course/${enrollId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        alert('Successfully unenrolled from the course.');
        fetchEnrolledCourses(); 
      } catch (error) {
        console.error('Failed to unenroll from course:', error);
        alert('Failed to unenroll from the course. Please try again.');
      }
    }
  };

  const handleRegisterNewCourse = () => {
    navigate('/register-course'); 
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <UserAppBar/>
      <Container maxWidth="lg" sx={{ mt: 12 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" onClick={handleRegisterNewCourse}>Register for New Course</Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Unenroll</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">Loading available courses...</TableCell>
              </TableRow>
            ) : enrolledCourses.length > 0 ? (
              enrolledCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((course) => (
                <TableRow key={course.enrollid}> {/* Use enrollid as key */}
                  <TableCell>{course.coursename}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>{course.level}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleUnenroll(course.enrollid)}>
                      <CancelIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">No courses registered.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {!isLoading && enrolledCourses.length > 0 && (
          <TablePagination
            component="div"
            count={enrolledCourses.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Container>
    </div>
  );
}  


export default UserDashboard;
