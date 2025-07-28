// AllStudents.jsx

import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
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
  IconButton,
  Tooltip,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Edit,
  Delete,
  School,
  PersonAddAlt,
  Visibility,
  Email,
  Phone,
  Class,
  Badge,
  Cake,
  CalendarMonth,
  AccountCircle,
} from "@mui/icons-material";
import EditStudentForm from "../../StudentEditForm";
import { useNavigate } from "react-router-dom";

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const handlePageChange = (_, value) => setPage(value);

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
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      {/* Header */}
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        gap={2}
        p={2}
        borderRadius={3}
        boxShadow={3}
        bgcolor="#f0f4ff"
      >
        <Typography variant="h4" fontWeight="bold" display="flex" alignItems="center" gap={1}>
          <School color="primary" />
          All Students
        </Typography>

        <Button
          variant="contained"
          startIcon={<PersonAddAlt />}
          onClick={() => navigate("/dashboard/register/student")}
          sx={{ borderRadius: 2 }}
        >
          Register Student
        </Button>
      </Box>

      {/* Table */}
      <Paper elevation={4} sx={{ borderRadius: 3, p: 2, overflowX: "auto" }}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Class</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Roll No.</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No students found.</TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>{student.user.first_name} {student.user.last_name}</TableCell>
                  <TableCell>{student.user.email}</TableCell>
                  <TableCell>{student.student_class}</TableCell>
                  <TableCell>{student.roll_number}</TableCell>
                  <TableCell>
                    <Chip
                      label={student.status}
                      color={student.status === "active" ? "success" : "default"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="View Details">
                        <IconButton onClick={() => setSelectedStudent(student)}>
                          <Visibility color="action" fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => {
                          setSelectedStudent(student);
                          setShowEditForm(true);
                        }}>
                          <Edit color="primary" fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(student.id)}>
                          <Delete color="error" fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={count}
          page={page}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          siblingCount={isMobile ? 0 : 1}
          size={isMobile ? "small" : "medium"}
          showFirstButton={!isMobile}
          showLastButton={!isMobile}
        />
      </Box>

      {/* View Student Dialog */}
      {selectedStudent && !showEditForm && (
        <Dialog
          open
          onClose={() => setSelectedStudent(null)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle fontWeight="bold">Student Profile</DialogTitle>
          <DialogContent dividers>
            <Box display="grid" gridTemplateColumns="1fr" gap={1.5}>
              <Divider />
              <Box display="flex" alignItems="center" gap={1}>
                <AccountCircle color="primary" />
                <Typography variant="body1" fontWeight="medium">
                  {selectedStudent.user.first_name} {selectedStudent.user.last_name}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Email color="action" />
                <Typography variant="body2">{selectedStudent.user.email}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Phone color="action" />
                <Typography variant="body2">{selectedStudent.phone}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Class color="action" />
                <Typography variant="body2">Class: {selectedStudent.student_class}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Badge color="action" />
                <Typography variant="body2">Roll No: {selectedStudent.roll_number}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  label={selectedStudent.status}
                  color={selectedStudent.status === "active" ? "success" : "default"}
                  size="small"
                />
              </Box>
              <Divider />
              <Box display="flex" alignItems="center" gap={1}>
                <Cake fontSize="small" />
                <Typography variant="body2">DOB: {selectedStudent.date_of_birth}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarMonth fontSize="small" />
                <Typography variant="body2">Admission Date: {selectedStudent.admission_date}</Typography>
              </Box>
            </Box>
          </DialogContent>
          <Box display="flex" justifyContent="flex-end" p={2}>
            <Button variant="outlined" onClick={() => setSelectedStudent(null)}>Close</Button>
          </Box>
        </Dialog>
      )}

      {/* Edit Form */}
      {showEditForm && selectedStudent && (
        <EditStudentForm
          studentId={selectedStudent.id}
          onClose={() => {
            setShowEditForm(false);
            setSelectedStudent(null);
            fetchStudents(page);
          }}
          onUpdate={() => fetchStudents(page)}
        />
      )}
    </Container>
  );
};

export default AllStudents;
