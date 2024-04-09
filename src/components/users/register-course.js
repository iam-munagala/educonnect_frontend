import React, { useState, useEffect } from 'react';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Box, TextField, InputAdornment, Typography, TablePagination } from '@mui/material';
import UserAppBar from './user-appbar'; // Ensure this is the correct path to your UserAppBar component
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthCheck from '../useAuthCheck'; // Ensure useAuthCheck is implemented for auth

const NewCourseEnrollment = () => {
    useAuthCheck();
    const [availableCourses, setAvailableCourses] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [userLevel, setUserLevel] = useState(null); // Assume we fetch this elsewhere
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAvailableCourses();
    }, []);


    useEffect(() => {
        if (userLevel !== null) fetchAvailableCourses();
    }, [userLevel]);


    const fetchAvailableCourses = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://bored-constantine-demo1234r5t.koyeb.app/user/get-unenrolled-courses', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            console.log(response.data);
            setAvailableCourses(response.data.courses);
            setFilteredCourses(response.data.courses);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch available courses:', error);
            setIsLoading(false);
        }
    };


    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchInput(value);
        const filtered = availableCourses.filter(course =>
            course.coursename.toLowerCase().includes(value) ||
            course.category.toLowerCase().includes(value)
        );
        setFilteredCourses(filtered);
    };

    const handleEnroll = async (courseId, coursename) => {
        const isConfirmed = window.confirm(`Are you sure you want to enroll in ${coursename}?`);
        if (isConfirmed) {
            try {
                const response = await axios.post('https://bored-constantine-demo1234r5t.koyeb.app/user/enroll-course', { courseId,coursename }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                alert(`${response.data.message}`);
                fetchAvailableCourses();
            } catch (error) {
                console.error('Failed to enroll in course:', error);
                alert('Failed to enroll in the course. Please try again.');
            }
        }
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div>
            <UserAppBar/>
            <Container maxWidth="lg" sx={{ mt: 12 }}>
                <Box sx={{ maxWidth: 300, mb: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        placeholder="Search courses..."
                        value={searchInput}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Course Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Popularity</TableCell>
                            <TableCell>Enroll</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">Loading available courses...</TableCell>
                            </TableRow>
                        ) : filteredCourses.length > 0 ? (
                            filteredCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((course) => (
                                <TableRow key={course.courseid}>
                                    <TableCell>{course.coursename}</TableCell>
                                    <TableCell>{course.category}</TableCell>
                                    <TableCell>{course.popularity}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEnroll(course.courseid, course.coursename)} color="primary">
                                            <AddCircleOutlineIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No available courses found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>
                <TablePagination
                    component="div"
                    count={filteredCourses.length}
                    rowsPerPageOptions={[5, 10, 25]}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Container>
        </div>
    );
};

export default NewCourseEnrollment;
