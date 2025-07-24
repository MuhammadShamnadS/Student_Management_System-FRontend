// src/pages/dashboards/Students/AllStudents.jsx
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Box,
  Paper,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";
import EditStudentForm from "../StudentEditForm";

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const navigate = useNavigate();

  const fetchStudents = async (pageNum = 1) => {
    try {
      const res = await axios.get(`/api/students?page=${pageNum}`);
      setStudents(res.data.results || []);
      setCount(Math.ceil(res.data.count / 5));
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

  useEffect(() => {
    fetchStudents(page);
  }, [page]);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`/api/students/${id}`);
        fetchStudents(page);
        setSelectedStudent(null);
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        px={2}
        py={2}
        borderRadius={2}
        boxShadow={2}
        bgcolor="#f0f4f8"
      >
        <Typography variant="h5" fontWeight="bold">
          All Students
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/dashboard/register/student")}
        >
          Register Student
        </Button>
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 3, p: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Class</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Roll No.</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow
                  key={student.id}
                  hover
                  onClick={() => handleStudentClick(student)}
                  sx={{
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: "#f9f9f9",
                    },
                  }}
                >
                  <TableCell>
                    {student.user.first_name} {student.user.last_name}
                  </TableCell>
                  <TableCell>{student.user.email}</TableCell>
                  <TableCell>{student.student_class}</TableCell>
                  <TableCell>{student.roll_number}</TableCell>
                  <TableCell>
                    <Chip
                      label={student.status}
                      color={student.status === "active" ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={count}
          page={page}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
        />
      </Box>

      {selectedStudent && (
        <Dialog
          open={Boolean(selectedStudent)}
          onClose={() => setSelectedStudent(null)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Student Details</DialogTitle>
          <DialogContent>
            <Box my={1}><strong>Name:</strong> {selectedStudent.user.first_name} {selectedStudent.user.last_name}</Box>
            <Box my={1}><strong>Email:</strong> {selectedStudent.user.email}</Box>
            <Box my={1}><strong>Username:</strong> {selectedStudent.user.username}</Box>
            <Box my={1}><strong>Phone:</strong> {selectedStudent.phone}</Box>
            <Box my={1}><strong>Class:</strong> {selectedStudent.student_class}</Box>
            <Box my={1}><strong>Roll Number:</strong> {selectedStudent.roll_number}</Box>
            <Box my={1}><strong>Status:</strong> {selectedStudent.status}</Box>
            <Box my={1}><strong>Date of Birth:</strong> {selectedStudent.date_of_birth}</Box>
            <Box my={1}><strong>Admission Date:</strong> {selectedStudent.admission_date}</Box>
          </DialogContent>
          <DialogActions>
            <Button
              startIcon={<Delete />}
              color="error"
              onClick={() => handleDelete(selectedStudent.id)}
            >
              Delete
            </Button>
            <Button
              startIcon={<Edit />}
              onClick={() => {
                setShowEditForm(true);
              }}
              variant="contained"
            >
              Edit
            </Button>
            <Button onClick={() => setSelectedStudent(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {showEditForm && selectedStudent && (
        <EditStudentForm
          studentId={selectedStudent.id}
          onClose={() => {
            setShowEditForm(false);
            fetchStudents(page);
          }}
          onUpdate={() => fetchStudents(page)}
        />
      )}
    </Container>
  );
};

export default AllStudents;
