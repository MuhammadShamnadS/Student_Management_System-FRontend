// src/pages/dashboards/Teachers/AllTeachers.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Box,
  Pagination,
  Chip,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "../../api/axios";

const AllTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchTeachers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/api/teachers?page=${page}`);
      setTeachers(res.data.results || []);
      setCount(Math.ceil(res.data.count / 10));
    } catch (err) {
      setError("Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`/api/teachers/${id}`);
      fetchTeachers();
    } catch (err) {
      alert("Failed to delete teacher");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [page]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" sx={{ mt: 4, mx: "auto", maxWidth: 600 }}>
        {error}
      </Alert>
    );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      {/* Header */}
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isMobile ? "stretch" : "center"}
        gap={2}
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
          All Teachers
        </Typography>
        <Button variant="contained" component={Link} to="/dashboard/register/teacher">
          Register Teacher
        </Button>
      </Box>

      {/* Table */}
      <Paper elevation={3} sx={{ p: 2, borderRadius: 3, overflowX: "auto" }}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              {!isMobile && <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>}
              <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Subject</TableCell>
              {!isMobile && <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>}
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No teachers found.
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher) => (
                <TableRow key={teacher.id} hover>
                  <TableCell>
                    {teacher.user.first_name} {teacher.user.last_name}
                  </TableCell>
                  {!isMobile && <TableCell>{teacher.user.email}</TableCell>}
                  <TableCell>{teacher.phone}</TableCell>
                  <TableCell>{teacher.subject_specialization}</TableCell>
                  {!isMobile && (
                    <TableCell>
                      <Chip
                        label={teacher.status}
                        size="small"
                        color={teacher.status === "active" ? "success" : "default"}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        component={Link}
                        to={`/dashboard/teacher/${teacher.id}/students`}
                      >
                        View Students
                      </Button>
                      <IconButton
                        size="small"
                        color="primary"
                        component={Link}
                        to={`/dashboard/teachers/${teacher.id}/edit`}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(teacher.id)}
                        disabled={deletingId === teacher.id}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Pagination */}
      {count > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={count}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
            shape="rounded"
            siblingCount={isMobile ? 0 : 1}
            size={isMobile ? "small" : "medium"}
          />
        </Box>
      )}
    </Container>
  );
};

export default AllTeachers;
