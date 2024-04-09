import React, { useState, useEffect } from 'react';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, IconButton, TextField, Button, Box, TablePagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CustomAppBar from './admin-appbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthCheck from '../useAuthCheck';

const AdminDashboard = () => {
  useAuthCheck();
  const [courses, setCourses] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userDetails, setUserDetails] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const response = await axios.get('https://bored-constantine-demo1234r5t.koyeb.app/admin/courses', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const { courses, userDetails } = response.data;
    setCourses(courses);
    setFilteredCourses(courses);
    setUserDetails(userDetails);
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchInput(value);
    setPage(0);
    const filtered = courses.filter(course =>
      Object.values(course).some(val =>
        String(val).toLowerCase().includes(value)
      )
    );
    setFilteredCourses(filtered);
  };

  const handleDelete = async (courseId, courseName) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete the course: ${courseName}?`);

    if (isConfirmed) {
      try {
        await axios.delete(`https://bored-constantine-demo1234r5t.koyeb.app/admin/delete-courses/${courseId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        fetchCourses();
        alert('Course successfully deleted.');
      } catch (error) {
        console.error('Failed to delete course:', error.response?.data?.message || error.message);
        alert('Failed to delete course. Please try again.');
      }
    }
  };

  const handleEdit = (course) => {
    navigate('/edit-course', { state: { course } });
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
      <CustomAppBar username={userDetails ? userDetails.name : 'Guest'} />
      <Container maxWidth="lg" sx={{ mt: 12 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <TextField
            placeholder="Search courses..."
            value={searchInput}
            onChange={handleSearch}
            sx={{ minWidth: '300px' }}
          />
          <Button variant="contained" onClick={() => navigate('/add-course')}>Add Course</Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>CID</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(course => (
              <TableRow key={course.courseid}>
                <TableCell>{course.courseid}</TableCell>
                <TableCell>{course.coursename}</TableCell>
                <TableCell>{course.category}</TableCell>
                <TableCell>{course.level}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(course)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(course.courseid, course.coursename)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredCourses.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Container>
    </div>
  );
};

export default AdminDashboard;
