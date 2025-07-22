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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchStudents = async (pageNum = 1) => {
    try {
      const res = await axios.get(`/api/students?page=${pageNum}`);
      setStudents(res.data.results || []);
      setCount(Math.ceil(res.data.count / 10));
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
          All Students
        </Typography>
        <Button variant="contained" onClick={() => navigate("/register")}>
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
                  sx={{
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
    </Container>
  );
};

export default AllStudents;
